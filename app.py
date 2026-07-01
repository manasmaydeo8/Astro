# app.py — AstroLens Backend (FINAL VERSION)

from flask import Flask
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
from flask_cors import CORS
from datetime import timedelta
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials
import os

# -----------------------------------------
# 🔹 Import Blueprints / Routes
# -----------------------------------------
from routes_user import register_routes
from routes_ai import ai_bp
from routes_horoscope import horoscope_bp as horoscope_ai_bp
from routes_kundli import kundli_bp   # <-- IMPORTANT

# 🔹 Local CSV / geocoder loader
from place_lookup import load_places

# -----------------------------------------
# 🧩 Load environment variables
# -----------------------------------------
load_dotenv()

# -----------------------------------------
# ✅ Initialize Flask app
# -----------------------------------------
app = Flask(__name__)

# -----------------------------------------
# 🌐 Enable CORS
# -----------------------------------------
CORS(
    app,
    resources={r"/api/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"]
    }},
    supports_credentials=True,
)

# -----------------------------------------
# 🔐 JWT Config
# -----------------------------------------
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=2)
jwt = JWTManager(app)

# -----------------------------------------
# 🧩 MongoDB
# -----------------------------------------
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/astroDB")
client = MongoClient(MONGO_URI)
db = client.get_database("astroDB")

# -----------------------------------------
# 🔥 Firebase Admin
# -----------------------------------------
FIREBASE_KEY_PATH = os.getenv("FIREBASE_KEY_PATH", "firebase-admin-key.json")

if not firebase_admin._apps:
    try:
        cred = credentials.Certificate(FIREBASE_KEY_PATH)
        firebase_admin.initialize_app(cred)
        print("Firebase Admin initialized.")
    except Exception as e:
        print("⚠️ Firebase initialization failed:", e)

# -----------------------------------------
# 📌 Load Indian Places CSV
# -----------------------------------------
CSV_PATH = "data/india_places.csv"

try:
    load_places(CSV_PATH)
    print(f"[INFO] Loaded place database: {CSV_PATH}")
except Exception as e:
    print("[ERROR] Could not load CSV:", e)

# -----------------------------------------
# 📦 Register Blueprints
# -----------------------------------------
register_routes(app, db)
app.register_blueprint(ai_bp, url_prefix="/api")
app.register_blueprint(kundli_bp, url_prefix="/api")
app.register_blueprint(horoscope_ai_bp, url_prefix="/api")

# -----------------------------------------
# 🌍 CORS fallback
# -----------------------------------------
@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,DELETE")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response

# -----------------------------------------
# 🚀 Run the App
# -----------------------------------------
if __name__ == "__main__":
    print("========================================")
    print(" AstroLens Backend Running at 3001 ")
    print("========================================")
    app.run(debug=True, port=3001)
