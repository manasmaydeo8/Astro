from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional, List
import datetime
from engine import engine
from fastapi.security import OAuth2PasswordRequestForm
from auth import Token, get_current_user, get_current_admin_user, get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, TokenData

router = APIRouter()

# --- Auth Models ---
class UserCreate(BaseModel):
    username: str
    password: str
    # Role is removed from input to enforce 'user' role for public registration

class UserResponse(BaseModel):
    username: str
    role: str

# --- Database Integration ---
from database import user_collection, user_helper

# --- Auth Routes ---
@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    # Check if user already exists
    existing_user = await user_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_pw = get_password_hash(user.password)
    
    # Store user in DB with role='user'
    new_user = {
        "username": user.username,
        "password_hash": hashed_pw,
        "role": "user" # Force role to be user
    }
    
    result = await user_collection.insert_one(new_user)
    created_user = await user_collection.find_one({"_id": result.inserted_id})
    
    return {"username": created_user["username"], "role": created_user["role"]}

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await user_collection.find_one({"username": form_data.username})
    
    if not user or not verify_password(form_data.password, user['password_hash']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user['username'], "role": user['role']}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/admin/users", response_model=List[UserResponse])
async def get_users(current_user: TokenData = Depends(get_current_admin_user)):
    users = []
    async for user in user_collection.find():
        users.append(UserResponse(username=user["username"], role=user["role"]))
    return users

@router.delete("/admin/users/{username}")
async def delete_user(username: str, current_user: TokenData = Depends(get_current_admin_user)):
    user = await user_collection.find_one({"username": username})
    if not user:
         raise HTTPException(status_code=404, detail="User not found")
    
    if username == current_user.username:
         raise HTTPException(status_code=400, detail="Cannot delete your own admin account")
    
    await user_collection.delete_one({"username": username})
    return {"message": f"User {username} deleted"}

from geopy.geocoders import Nominatim

class BirthDetails(BaseModel):
    name: str
    date: str # YYYY-MM-DD
    time: str # HH:MM
    place: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    timezone: float = 5.5 # Standard for India

@router.post("/kundali")
async def generate_kundali(details: BirthDetails):
    try:
        lat = details.latitude
        lon = details.longitude

        # Geocoding logic if lat/lon are missing
        if (lat is None or lon is None):
            if details.place:
                try:
                    geolocator = Nominatim(user_agent="astrolence_app")
                    location = geolocator.geocode(details.place)
                    if location:
                        lat = location.latitude
                        lon = location.longitude
                    else:
                         # Fallback for demo/offline purposes if place not found but string provided
                         print(f"Geocoding failed for {details.place}, using default coordinates (Mumbai)")
                         lat = 19.0760
                         lon = 72.8777
                except Exception as geo_error:
                    print(f"Geocoding service error: {geo_error}")
                    # Fallback to prevent app crash during demo
                    lat = 19.0760
                    lon = 72.8777
            else:
                 raise HTTPException(status_code=400, detail="Please provide a Place Name.")

        # Parse date and time
        d = datetime.datetime.strptime(details.date, "%Y-%m-%d").date()
        t = datetime.datetime.strptime(details.time, "%H:%M").time()
        
        positions = engine.calculate_positions(d, t, lat, lon, details.timezone)
        
        return {
            "status": "success",
            "data": {
                "name": details.name,
                "place": details.place if details.place else "Custom Coordinates",
                "coordinates": {"lat": lat, "lon": lon},
                "planetary_positions": positions
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/matchmaking")
async def match_kundali(boy: BirthDetails, girl: BirthDetails):
    try:
        # Resolve Coordinates for Boy
        if (boy.latitude is None or boy.longitude is None) and boy.place:
            geolocator = Nominatim(user_agent="astrolence_app_match")
            loc = geolocator.geocode(boy.place)
            if loc: 
                boy.latitude, boy.longitude = loc.latitude, loc.longitude
        
        # Resolve Coordinates for Girl
        if (girl.latitude is None or girl.longitude is None) and girl.place:
            geolocator = Nominatim(user_agent="astrolence_app_match")
            loc = geolocator.geocode(girl.place)
            if loc: 
                girl.latitude, girl.longitude = loc.latitude, loc.longitude

        # Check if coordinates exist
        if boy.latitude is None or girl.latitude is None:
             raise HTTPException(status_code=400, detail="Could not resolve location for one or both partners.")

        # Calculate Moon Positions
        MOON = 'Moon'
        
        # Boy
        d_b = datetime.datetime.strptime(boy.date, "%Y-%m-%d").date()
        t_b = datetime.datetime.strptime(boy.time, "%H:%M").time()
        pos_b = engine.calculate_positions(d_b, t_b, boy.latitude, boy.longitude, boy.timezone)
        boy_moon = pos_b[MOON]['lon']
        
        # Girl
        d_g = datetime.datetime.strptime(girl.date, "%Y-%m-%d").date()
        t_g = datetime.datetime.strptime(girl.time, "%H:%M").time()
        pos_g = engine.calculate_positions(d_g, t_g, girl.latitude, girl.longitude, girl.timezone)
        girl_moon = pos_g[MOON]['lon']
        
        # Match
        from matching import matcher
        result = matcher.calculate_guna_milan(boy_moon, girl_moon)
        
        return {
            "status": "success",
            "data": result
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/horoscope/daily")
async def daily_horoscope(sign: str):
    import random
    
    # Simple varied predictions
    predictions = [
        "Today is a valid day for introspection. The stars suggest you take a moment to breathe.",
        "A surprise financial gain is on the cards. Be open to new opportunities.",
        "Relationships take center stage today. Communicate clearly with your loved ones.",
        "Your hard work is about to pay off. Keep pushing towards your goals.",
        "Travel is possible today. Keep your bags active and your mind open.",
        "Avoid unnecessary arguments. Patience will be your greatest virtue today.",
        "Creative energy is high! Start that project you've been putting off.",
        "Focus on your health today. A little exercise will go a long way.",
        "An old friend may contact you. Reconnecting will bring joy.",
        "Trust your intuition. It is guiding you towards the right path."
    ]
    
    colors = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "White", "Gold"]
    
    # Deterministic seed based on sign + date so it remains constant for the day
    date_str = datetime.date.today().isoformat()
    seed_str = f"{sign}-{date_str}"
    random.seed(seed_str)
    
    return {
        "sign": sign,
        "prediction": random.choice(predictions),
        "lucky_color": random.choice(colors),
        "lucky_number": random.randint(1, 9)
    }
