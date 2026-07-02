from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from contextlib import asynccontextmanager

# Load environment variables
load_dotenv()

# Import routers
from routes import router as astrology_router
from routes_ai import router as ai_router

# -------------------------------
# Lifespan (Runs on startup)
# -------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    from database import user_collection
    from auth import get_password_hash

    # Create default admin account if it doesn't exist
    admin = await user_collection.find_one({"username": "admin"})

    if not admin:
        print("Creating default admin account...")

        await user_collection.insert_one(
            {
                "username": "admin",
                "password_hash": get_password_hash("admin123"),
                "role": "admin",
            }
        )

        print("Default admin account created")
        print("Username: admin")
        print("Password: admin123")

    yield


# -------------------------------
# FastAPI App
# -------------------------------
app = FastAPI(
    title="AstroLence API",
    description="Backend for AstroLence Astrology Service",
    version="1.0.0",
    lifespan=lifespan,
)

# -------------------------------
# CORS
# -------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://192.168.1.52:5173",
        "https://manasmaydeo8.github.io",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Routers
# -------------------------------
app.include_router(astrology_router, prefix="/api/v1")
app.include_router(ai_router, prefix="/api/v1/ai")

# -------------------------------
# Root Endpoint
# -------------------------------
@app.get("/")
async def root():
    return {
        "status": "success",
        "message": "Welcome to AstroLence API 🚀",
        "docs": "/docs",
    }


# -------------------------------
# Health Check
# -------------------------------
@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }


# -------------------------------
# Run Locally
# -------------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )