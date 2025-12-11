// src/Components/Horoscope.js
import React, { useEffect, useState } from "react";
import API from "../api";
import "./Horoscope.css";

export default function Horoscope() {
  const [horoscope, setHoroscope] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("today");
  const [sign, setSign] = useState("aries");
  const [gemstone, setGemstone] = useState("");
  const [mantra, setMantra] = useState("");
  const [moonPhase, setMoonPhase] = useState("");

  const zodiacSigns = [
    "aries", "taurus", "gemini", "cancer", "leo", "virgo",
    "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
  ];

  // 🧭 Load zodiac sign from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.zodiacSign) setSign(user.zodiacSign.toLowerCase());
    }
  }, []);

  // 🔮 Fetch Horoscope from Flask backend (CORS-free)
  useEffect(() => {
    const fetchHoroscope = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.post("/api/horoscope", { sign, day: period });
        setHoroscope(res.data.horoscope || {});
        setGemstone(res.data.gemstone || "");
        setMantra(res.data.mantra || "");
        setMoonPhase(res.data.moon_phase || "Unknown");
      } catch (err) {
        console.error("Failed to fetch horoscope:", err);
        setError("Unable to fetch horoscope. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchHoroscope();
  }, [sign, period]);

  // 🪶 Share / Copy Function
  const shareHoroscope = (platform) => {
    const message = `🌟 ${sign.toUpperCase()} Horoscope (${period.toUpperCase()}): ${horoscope.description || ""} 💎 Gemstone: ${gemstone} 🕉️ Mantra: ${mantra} — via AstroLens 🔮`;
    const encodedMsg = encodeURIComponent(message);
    let url = "";

    if (platform === "twitter")
      url = `https://twitter.com/intent/tweet?text=${encodedMsg}`;
    else if (platform === "whatsapp")
      url = `https://wa.me/?text=${encodedMsg}`;

    window.open(url, "_blank");
  };

  const copyToClipboard = () => {
    const text = `🌟 ${sign.toUpperCase()} Horoscope (${period.toUpperCase()})\n\n${horoscope.description}\n💎 Gemstone: ${gemstone}\n🕉️ Mantra: ${mantra}`;
    navigator.clipboard.writeText(text);
    alert("✅ Horoscope copied to clipboard!");
  };

  const moonEmoji = () => {
    if (moonPhase.toLowerCase().includes("full")) return "🌕";
    if (moonPhase.toLowerCase().includes("new")) return "🌑";
    if (moonPhase.toLowerCase().includes("waxing")) return "🌓";
    if (moonPhase.toLowerCase().includes("waning")) return "🌘";
    return "🌔";
  };

  return (
    <div className="horoscope-container">
      <h2>🔮 Your Horoscope</h2>

      {/* Dropdown for Zodiac Selection */}
      <div className="zodiac-selector">
        <label htmlFor="zodiac">Select your Zodiac Sign:</label>
        <select
          id="zodiac"
          value={sign}
          onChange={(e) => setSign(e.target.value)}
        >
          {zodiacSigns.map((z) => (
            <option key={z} value={z}>
              {z.charAt(0).toUpperCase() + z.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs for Daily / Weekly / Monthly */}
      <div className="horoscope-tabs">
        {["today", "week", "month"].map((p) => (
          <button
            key={p}
            className={period === p ? "active" : ""}
            onClick={() => setPeriod(p)}
          >
            {p === "today" ? "Daily" : p === "week" ? "Weekly" : "Monthly"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="loading">✨ Fetching your horoscope...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="horoscope-card fade-in">
          <h3>
            {sign.toUpperCase()} ({period.toUpperCase()})
          </h3>
          <p className="description">{horoscope.description}</p>

          <div className="details">
            <p>💫 <b>Mood:</b> {horoscope.mood}</p>
            <p>🎨 <b>Color:</b> {horoscope.color}</p>
            <p>🍀 <b>Lucky Number:</b> {horoscope.lucky_number}</p>
            <p>💞 <b>Compatibility:</b> {horoscope.compatibility}</p>
          </div>

          {/* 🌕 Moon Phase + Gemstone + Mantra */}
          <div className="astro-insights">
            <p>🌕 <b>Moon Phase:</b> {moonPhase} {moonEmoji()}</p>
            <p>💎 <b>Gemstone:</b> {gemstone}</p>
            <p>🕉️ <b>Mantra:</b> {mantra}</p>
          </div>

          {/* Social + Copy Buttons */}
          <div className="share-buttons">
            <p>Share or Copy:</p>
            <button
              className="share-btn twitter"
              onClick={() => shareHoroscope("twitter")}
            >
              🐦 Twitter
            </button>
            <button
              className="share-btn whatsapp"
              onClick={() => shareHoroscope("whatsapp")}
            >
              💬 WhatsApp
            </button>
            <button className="share-btn copy" onClick={copyToClipboard}>
              📋 Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
