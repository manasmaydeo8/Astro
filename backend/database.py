import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB Configuration
MONGO_DETAILS = os.getenv("MONGO_URI")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.astrolence
user_collection = database.get_collection("users")

# Helpers
def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "password_hash": user["password_hash"],
        "role": user["role"],
    }