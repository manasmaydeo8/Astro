from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from firebase_admin import auth as firebase_auth
from bson import ObjectId  # ✅ Add this to handle ObjectId conversion

def register_routes(app, db):
    users = db.users

    # 🧩 REGISTER (manual)
    @app.route("/api/auth/register", methods=["POST"])
    def register():
        data = request.get_json()
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        birth_date = data.get("birthDate")
        zodiac_sign = data.get("zodiacSign")

        if not email or not password:
            return jsonify({"msg": "Email and password required"}), 400

        existing_user = users.find_one({"email": email})
        if existing_user:
            return jsonify({"msg": "User already exists"}), 400

        hashed_pw = generate_password_hash(password)
        user_data = {
            "name": name,
            "email": email,
            "password": hashed_pw,
            "birthDate": birth_date,
            "zodiacSign": zodiac_sign,
            "google_auth": False
        }
        users.insert_one(user_data)

        return jsonify({"msg": "Registration successful!"}), 201

    # 🧩 LOGIN (manual)
    @app.route("/api/auth/login", methods=["POST"])
    def login():
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        user = users.find_one({"email": email})
        if not user or not check_password_hash(user["password"], password):
            return jsonify({"msg": "Invalid email or password"}), 401

        token = create_access_token(identity=str(user["_id"]))
        user["_id"] = str(user["_id"])  # ✅ Convert ObjectId
        return jsonify({"token": token, "user": user}), 200

    # 🧩 GOOGLE LOGIN (Firebase)
    @app.route("/api/auth/google-login", methods=["POST"])
    def google_login():
        try:
            data = request.get_json()
            id_token = data.get("token")

            if not id_token:
                return jsonify({"msg": "Missing Google ID token"}), 400

            # 🔹 Verify token using Firebase Admin SDK
            decoded = firebase_auth.verify_id_token(id_token)
            email = decoded.get("email")
            name = decoded.get("name", "User")
            uid = decoded.get("uid")

            if not email:
                return jsonify({"msg": "Invalid Google account data"}), 400

            # 🔹 Check if user already exists
            user = users.find_one({"email": email})

            if not user:
                # Create a new user automatically
                user_data = {
                    "uid": uid,
                    "name": name,
                    "email": email,
                    "google_auth": True
                }
                users.insert_one(user_data)
                user = user_data
            else:
                # Convert from BSON (PyMongo object) to dict for response
                user["_id"] = str(user["_id"])

            # 🔹 Generate your Flask JWT
            token = create_access_token(identity=str(user.get("_id", uid)))

            return jsonify({"token": token, "user": user}), 200

        except Exception as e:
            print("🔥 Google Login Error:", e)
            return jsonify({"msg": "Google login failed", "error": str(e)}), 500
