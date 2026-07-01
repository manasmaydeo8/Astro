# routes_horoscope.py
from flask import Blueprint, request, jsonify
import requests, os

horoscope_bp = Blueprint("horoscope_bp_ai", __name__)

@horoscope_bp.route("/horoscope", methods=["POST", "OPTIONS"])
def get_horoscope():
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight success"}), 200

    try:
        data = request.get_json(force=True)
        sign = data.get("sign", "Aries").capitalize()
        day = data.get("day", "today").lower()
        lang = data.get("lang", "English")

        OPENROUTER_KEY = os.getenv("OPENROUTER_API_KEY")

        prompt = f"""
        Act as a Vedic astrologer and write a {day} horoscope for {sign} zodiac.
        Include sections:
        🌟 Overview
        💞 Love & Relationships
        💼 Career & Finances
        🧘 Health
        💎 Gemstone
        🕉️ Mantra
        Write in {lang} language.
        Be accurate, empathetic, and under 200 words.
        """

        headers = {
            "Authorization": f"Bearer {OPENROUTER_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": os.getenv("SITE_URL", "http://localhost:3000"),
            "X-Title": os.getenv("SITE_TITLE", "AstroLens")
        }

        payload = {
            "model": "openai/gpt-4o",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 600
        }

        ai_res = requests.post("https://openrouter.ai/api/v1/chat/completions",
                               headers=headers, json=payload, timeout=30)

        if ai_res.status_code != 200:
            print(f"⚠️ AI API failed ({ai_res.status_code}), fallback to static text.")
            return jsonify({
                "horoscope": {
                    "sign": sign,
                    "day": day,
                    "description": "आजचा दिवस तुमच्यासाठी नवी संधी घेऊन येतो. आत्मविश्वास ठेवा आणि निर्णय ठामपणे घ्या.",
                    "gemstone": "माणिक (Ruby)",
                    "mantra": "ॐ नमः शिवाय",
                    "moon_phase": "Waxing Crescent"
                }
            }), 200

        result = ai_res.json()
        horoscope_text = result["choices"][0]["message"]["content"]

        return jsonify({
            "horoscope": {
                "sign": sign,
                "day": day,
                "description": horoscope_text,
                "gemstone": "माणिक (Ruby)",
                "mantra": "ॐ नमः शिवाय",
                "moon_phase": "Waxing Crescent"
            }
        }), 200

    except Exception as e:
        print("🔥 Horoscope route error:", e)
        return jsonify({"error": str(e)}), 500
