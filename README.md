<<<<<<< HEAD
# AstroLence

AstroLence is a comprehensive astrology and matchmaking platform offering Kundali generation, birth chart analysis, and AI-powered astrological chat. It features a complete system for users to generate birth charts, match profiles, export Kundali to PDF, and chat with an AI astrologer. The platform is fully multilingual, supporting English, Hindi, and Marathi.

## Features Let's Explore!
- **User Authentication**: Secure registration and login functionality.
- **Multilingual Support**: Available in English, Hindi, and Marathi (i18n integrated).
- **Kundali Generation**: Calculate and display detailed astrological charts using astronomical algorithms (`skyfield`).
- **Matchmaking (Kundali Milan)**: Compare two profiles for astrological compatibility.
- **AI Astrologer**: Chat with an AI for personalized insights.
- **Export to PDF**: Download the generated birth chart and Kundali details as a well-formatted PDF file.

## Tech Stack
### Frontend
- **Framework**: React.js with Vite
- **Styling & Animation**: Framer Motion for smooth animations, TailwindCSS/Custom CSS
- **Routing**: React Router DOM
- **Internationalization**: i18next & react-i18next
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB (motor for async MongoDB operations)
- **Astrology Engine**: Skyfield for precise ephemeris data and astrology calculations
- **PDF Generation**: ReportLab
- **Authentication**: JWT, passlib, bcrypt

## Prerequisites
Before you begin, ensure you have met the following requirements:
- **Node.js**: v18 or newer
- **Python**: v3.9 or newer
- **MongoDB**: A running MongoDB instance (local or Atlas URI)

## Installation and Setup

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd AstroLence
```

### 2. Backend Setup
Navigate to the backend directory and set up the Python environment:
```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install the required dependencies
pip install -r requirements.txt
```

**Environment Variables (.env):**
Create a `.env` file in the `backend` directory and configure your environment variables:
```env
# Example .env configuration
MONGO_URI=mongodb://localhost:27017
JWT_SECRET=your_jwt_secret_key
# Also add any required AI API keys like OPENAI_API_KEY if applicable
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd ../frontend
npm install
```

## Running the Application

### Method 1: Quick Start (Windows Only)
A batch script is provided to easily launch both the backend backend environment and the frontend development server simultaneously. From the root `AstroLence` directory, run:
```bash
.\start_app.bat
```

### Method 2: Manual Start
To run the services separately:

**1. Run the backend:**
```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload --port 8000
```
The backend API will run at `http://localhost:8000`.

**2. Run the frontend:**
```bash
cd frontend
npm run dev
```
The frontend will start at `http://localhost:5173`.

## API Documentation
The FastAPI backend auto-generates interactive API documentation. After starting the backend, you can explore the endpoints at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Project Structure
```text
AstroLence/
├── backend/
│   ├── auth.py              # Authentication logic (JWT, hashing)
│   ├── database.py          # MongoDB connection
│   ├── engine.py            # Skyfield astrology calculations
│   ├── main.py              # FastAPI application entry point
│   ├── matching.py          # Matchmaking comparison logic
│   ├── pdf_generator.py     # PDF export generation
│   ├── routes.py            # Primary API routes
│   └── routes_ai.py         # AI Chat integrated routes
├── frontend/
│   ├── public/              # Public assets
│   ├── src/                 # React source code
│   │   ├── components/      # UI components (Chart, Matchmaking, PDF Export, etc.)
│   │   ├── locales/         # Multilingual translation JSON files (en, hi, mr)
│   │   └── i18n.js          # i18next configuration
│   └── package.json         # Node.js dependencies
└── start_app.bat            # Windows startup script
```

---
*Created by Omkar Mankar.*
=======
# AstroLens
An Astrology website for daily Horoscopes, Kundli.
>>>>>>> 295701227001984508b50fc9229082154d3b7af2
