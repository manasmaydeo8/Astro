from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router as astrology_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="AstroLence API",
    description="Backend for AstroLence Astrology Service",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(astrology_router, prefix="/api/v1")
from routes_ai import router as ai_router
app.include_router(ai_router, prefix="/api/v1/ai")

@app.on_event("startup")
async def startup_db_client():
    # Create initial admin user if not exists
    from database import user_collection
    from auth import get_password_hash
    
    admin = await user_collection.find_one({"username": "admin"})
    if not admin:
        print("Creating default admin account...")
        admin_user = {
            "username": "admin",
            "password_hash": get_password_hash("admin123"),
            "role": "admin"
        }
        await user_collection.insert_one(admin_user)
        print("Default admin account created: admin/admin123")

@app.get("/")
async def root():
    return {"message": "Welcome to AstroLence API. The stars are aligning..."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
