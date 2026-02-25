from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import requests
import os

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str

@router.post("/ask")
async def ask_ai(request: QuestionRequest):
    question = request.question

    if not question:
        raise HTTPException(status_code=400, detail="Question required")

    # 🔮 AI Call
    try:
        # Get API Key from environment variable
        api_key = os.getenv('OPENROUTER_API_KEY')
        if not api_key:
             # For development/testing, you might want a fallback or just error out
             raise HTTPException(status_code=500, detail="OpenRouter API Key not configured")

        res = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                # "HTTP-Referer": "http://localhost:5173", # Optional: For OpenRouter rankings
                # "X-Title": "AstroLence", # Optional: For OpenRouter rankings
            },
            json={
                "model": "openai/gpt-4o-mini",
                "messages": [{"role": "user", "content": question}]
            },
            timeout=10 # Timeout in seconds
        )
        
        if res.status_code != 200:
            error_detail = f"AI Provider Error: {res.status_code} - {res.text}"
            print(error_detail) # Log for backend debugging
            raise HTTPException(status_code=502, detail="Failed to get response from AI provider")

        data = res.json()
        answer = data["choices"][0]["message"]["content"]
        
        return {
            "answer": answer
        }

    except requests.Timeout:
        raise HTTPException(status_code=504, detail="AI request timed out")
    except Exception as e:
        print(f"AI Service Exception: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")
