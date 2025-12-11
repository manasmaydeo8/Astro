# config.py
from dotenv import load_dotenv
import os
from pymongo import MongoClient
from flask_jwt_extended import JWTManager
from flask import Flask

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

def create_app():
    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY or "dev-secret"
    app.config["PROPAGATE_EXCEPTIONS"] = True
    jwt = JWTManager(app)

    # ✅ Connect to MongoDB Atlas
    client = MongoClient(MONGO_URI)
    db = client.get_database()  # Uses the database name from URI (AstroLens)

    print("✅ Connected to MongoDB Atlas successfully!")
    return app, db, jwt
