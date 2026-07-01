import React from "react";
import "./Home.css";
import { FaStar, FaSun, FaMoon } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const user = localStorage.getItem("user");

    if (user) {
      // ✅ User is logged in → go to Services
      navigate("/services");
    } else {
      // ❌ Not logged in → go to Register
      navigate("/register");
    }
  };

  return (
    <div className="home-container">
      <section className="hero" role="banner" aria-label="Hero">
        <div className="stars" />
        <div className="stars2" />
        <div className="stars3" />
        <div className="overlay">
          <h1>{t("home.welcome")}</h1>
          <p>{t("home.subtitle")}</p>

          {/* 🔄 Converted Link → Button with login-aware logic */}
          <button className="cta-btn" onClick={handleGetStarted}>
            {t("home.getStarted")}
          </button>
        </div>
      </section>

      <section className="about" id="about">
        <h2>Explore the Universe Within You</h2>
        <p>
          At <b>AstroLens</b> we blend ancient wisdom with modern tools to give
          you clear, practical celestial guidance.
        </p>
        <div className="astro-icons">
          <FaStar className="icon" />
          <FaSun className="icon" />
          <FaMoon className="icon" />
        </div>
      </section>
    </div>
  );
}
