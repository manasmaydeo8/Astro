@echo off
echo Starting AstroLence System...

start "AstroLence Backend" /D "backend" cmd /k "venv\Scripts\activate && uvicorn main:app --reload --port 8000"
timeout /t 5
start "AstroLence Frontend" /D "frontend" cmd /k "npm run dev"

echo System Launched!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
pause
