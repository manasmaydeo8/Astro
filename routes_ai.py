# routes_ai.py
from flask import Blueprint, request, jsonify
import os
import json
import requests

ai_bp = Blueprint("ai_bp", __name__)

@ai_bp.route("/api/ask", methods=["POST"])
def ask_ai():
    try:
        # Read question from frontend
        data = request.get_json(force=True)
        question = data.get("question", "").strip()
        print("🧠 Received question:", question)

        if not question:
            return jsonify({"error": "Please provide a valid question."}), 400

        # API key from env
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            return jsonify({"error": "Missing OpenRouter API key"}), 500

        # OpenRouter API endpoint
        url = "https://openrouter.ai/api/v1/chat/completions"

        headers = {
            "Authorization": f"Bearer {api_key}",
            "HTTP-Referer": os.getenv("SITE_URL", "http://localhost:3001"),
            "X-Title": os.getenv("SITE_TITLE", "AstroLens"),
            "Content-Type": "application/json"
        }

        # AI Personality
        system_prompt = (
            "You are AstroLens AI — an expert in astrology, Kundli, Vedic planets, "
            "and spiritual guidance. Provide accurate predictions, remedies, "
            "and practical insights."
        )

        payload = {
            "model": "openai/gpt-4o",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": question}
            ],
            "max_tokens": 800,
            "temperature": 0.8
        }

        print("📡 Sending request to OpenRouter...")
        response = requests.post(url, headers=headers, data=json.dumps(payload), timeout=30)

        # API error handling
        if response.status_code != 200:
            print(f"🔥 OpenRouter Error {response.status_code}:", response.text)
            return jsonify({
                "error": "AI request failed",
                "details": response.text
            }), response.status_code

        data = response.json()

        if "choices" not in data:
            return jsonify({"error": "Invalid AI response"}), 502

        ai_answer = data["choices"][0]["message"]["content"]

        print("✅ AI response generated successfully!")
        return jsonify({"answer": ai_answer}), 200

    except requests.exceptions.Timeout:
        return jsonify({"error": "The AI took too long to respond."}), 504

    except requests.exceptions.RequestException:
        return jsonify({"error": "Failed to connect to OpenRouter API."}), 502

    except Exception as e:
        return jsonify({"error": str(e)}), 500
