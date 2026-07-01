// src/Components/Dashboard.js
import React, { useEffect, useState } from "react";
import API from "../api";
import "./Dashboard.css";

export default function Dashboard() {
  const [sign, setSign] = useState("aries");
  const [period, setPeriod] = useState("today");
  const [horoscope, setHoroscope] = useState({});
  const [moonPhase, setMoonPhase] = useState("");
  const [gemstone, setGemstone] = useState("");
  const [mantra, setMantra] = useState("");
  const [loading, setLoading] = useState(false);

  const zodiacSigns = [
    "aries", "taurus", "gemini", "cancer", "leo", "virgo",
    "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
  ];

  // Load user's zodiac from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.zodiacSign) setSign(user.zodiacSign.toLowerCase());
  }, []);

  // Fetch Horoscope Data
  useEffect(() => {
    const fetchHoroscope = async () => {
      setLoading(true);
      try {
        const res = await API.post("/api/horoscope", { sign, day: period });
        const data = res.data;
        setHoroscope(data.horoscope || {});
        setMoonPhase(data.moon_phase || "Unknown");
        setGemstone(data.gemstone || "");
        setMantra(data.mantra || "");
      } catch (error) {
        console.error("Horoscope fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHoroscope();
  }, [sign, period]);

  return (
    <div className="dashboard-container">
      <h2>🌌 Welcome to Your Cosmic Dashboard</h2>

      {/* Zodiac & Period Selectors */}
      <div className="selectors">
        <div>
          <label htmlFor="sign">Select Zodiac Sign:</label>
          <select id="sign" value={sign} onChange={(e) => setSign(e.target.value)}>
            {zodiacSigns.map((z) => (
              <option key={z} value={z}>
                {z.charAt(0).toUpperCase() + z.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="period-tabs">
          <button onClick={() => setPeriod("today")} className={period === "today" ? "active" : ""}>Daily</button>
          <button onClick={() => setPeriod("week")} className={period === "week" ? "active" : ""}>Weekly</button>
          <button onClick={() => setPeriod("month")} className={period === "month" ? "active" : ""}>Monthly</button>
        </div>
      </div>

      {loading ? (
        <p className="loading">Fetching your horoscope...</p>
      ) : (
        <div className="dashboard-grid">
          {/* Horoscope Card */}
          <div className="card horoscope-card">
            <h3>🔮 {sign.toUpperCase()} ({period.toUpperCase()})</h3>
            <p>{horoscope.description || "No description available."}</p>
            <ul>
              <li>💫 Mood: {horoscope.mood}</li>
              <li>🎨 Color: {horoscope.color}</li>
              <li>🍀 Lucky Number: {horoscope.lucky_number}</li>
              <li>💞 Compatibility: {horoscope.compatibility}</li>
            </ul>
          </div>

          {/* Moon Phase */}
          <div className="card moon-card">
            <h3>🌕 Moon Phase</h3>
            <p>{moonPhase}</p>
            <div className="moon-icon">
              {moonPhase.includes("Full") ? "🌕" :
               moonPhase.includes("New") ? "🌑" :
               moonPhase.includes("Waxing") ? "🌓" :
               "🌘"}
            </div>
          </div>

          {/* Gemstone */}
          <div className="card gem-card">
            <h3>💎 Gemstone Recommendation</h3>
            <p>{gemstone}</p>
          </div>

          {/* Mantra */}
          <div className="card mantra-card">
            <h3>🕉️ Daily Mantra</h3>
            <p>{mantra}</p>
          </div>
        </div>
      )}
    </div>
  );
}
