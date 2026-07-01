# models_user.py
from bson.objectid import ObjectId

def user_to_dict(user):
    if not user:
        return None
    user_copy = {
        "id": str(user.get("_id")),
        "name": user.get("name"),
        "email": user.get("email"),
        "birthDate": user.get("birthDate"),
        "zodiacSign": user.get("zodiacSign"),
        "isAdmin": user.get("isAdmin", False),
        "createdAt": user.get("createdAt")
    }
    return user_copy
