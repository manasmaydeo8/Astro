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
                "date": details.date,
                "time": details.time,
                "place": details.place if details.place else "Custom Coordinates",
                "coordinates": {"lat": lat, "lon": lon},
                "planetary_positions": positions
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from fastapi.responses import StreamingResponse
from pdf_generator import generate_kundali_pdf

@router.post("/kundali/export-pdf")
async def export_kundali_pdf(data: dict):
    try:
        pdf_buffer = generate_kundali_pdf(data)
        return StreamingResponse(
            pdf_buffer, 
            media_type="application/pdf", 
            headers={"Content-Disposition": f"attachment; filename=Kundali_{data.get('name', 'User')}.pdf"}
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
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

from fastapi import Header

@router.get("/horoscope/daily")
async def daily_horoscope(sign: str, accept_language: Optional[str] = Header(None)):
    import random
    
    # Determine language
    lang = "en"
    if accept_language:
        if "hi" in accept_language.lower():
            lang = "hi"
        elif "mr" in accept_language.lower():
            lang = "mr"

    predictions = {
        "en": [
            "A positive day for decision making.",
            "Your hard work will pay off today.",
            "Focus on your health and well-being.",
            "A good time for new beginnings.",
            "Financial gains are on the horizon.",
            "Stay calm and avoid unnecessary arguments.",
            "Love and romance are in the stars.",
            "You will receive good news from afar."
        ],
        "hi": [
            "निर्णय लेने के लिए एक सकारात्मक दिन।",
            "आपकी कड़ी मेहनत आज रंग लाएगी।",
            "अपने स्वास्थ्य और कल्याण पर ध्यान दें।",
            "नई शुरुआत के लिए अच्छा समय है।",
            "वित्तीय लाभ क्षितिज पर हैं।",
            "शांत रहें और अनावश्यक बहस से बचें।",
            "सितारों में प्यार और रोमांस है।",
            "आपको दूर से शुभ समाचार प्राप्त होगा।"
        ],
        "mr": [
            "निर्णय घेण्यासाठी सकारात्मक दिवस.",
            "तुमच्या कष्टाचे फळ आज मिळेल.",
            "तुमच्या आरोग्यावर आणि कल्याणावर लक्ष केंद्रित करा.",
            "नवीन सुरूवातीसाठी चांगली वेळ.",
            "आर्थिक लाभ होण्याची शक्यता आहे.",
            "शांत राहा आणि अनावश्यक वाद टाळा.",
            "प्रेमासाठी आजचा दिवस उत्तम आहे.",
            "तुम्हाला दुरून चांगली बातमी मिळेल."
        ]
    }
    
    colors = {
        "en": ["Red", "Blue", "Green", "Yellow", "White", "Pink", "Gold", "Silver"],
        "hi": ["लाल", "नीला", "हरा", "पीला", "सफेद", "गुलाबी", "सुनहरा", "चांदी"],
        "mr": ["लाल", "निळा", "हिरवा", "पिवळा", "पांढरा", "गुलाबी", "सोनेरी", "चांदी"]
    }
    
    selected_lang = lang if lang in predictions else "en"
    
    return {
        "sign": sign,
        "prediction": random.choice(predictions[selected_lang]),
        "lucky_color": random.choice(colors[selected_lang]),
        "lucky_number": random.randint(1, 9),
        "lang": selected_lang
    }
