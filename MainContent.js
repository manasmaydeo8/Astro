import React from "react";
import "./MainContent.css";
import { FaRegSun, FaMoon, FaStar, FaGlobeAsia } from "react-icons/fa";

export default function MainContent() {
  return (
    <main className="main-content" role="main">
      <section className="intro">
        <h2>Discover the Mysteries of the Cosmos</h2>
        <p>Explore your zodiac and birth chart for deeper, personal insights and daily guidance.</p>
      </section>

      <section className="services" aria-label="Services">
        <h2>Our Services</h2>
        <div className="service-list">
          <article className="service-card" aria-labelledby="daily-title">
            <FaRegSun size={40} />
            <h3 id="daily-title">Daily Horoscope</h3>
            <p>Daily updates personalised for your sign and planetary transits.</p>
          </article>

          <article className="service-card" aria-labelledby="birth-title">
            <FaMoon size={40} />
            <h3 id="birth-title">Birth Chart Analysis</h3>
            <p>In-depth natal chart reading highlighting talents and challenges.</p>
          </article>

          <article className="service-card" aria-labelledby="compat-title">
            <FaStar size={40} />
            <h3 id="compat-title">Zodiac Compatibility</h3>
            <p>Compatibility insights to help relationships thrive.</p>
          </article>

          <article className="service-card" aria-labelledby="personal-title">
            <FaGlobeAsia size={40} />
            <h3 id="personal-title">Personalized Predictions</h3>
            <p>Full readings crafted by our astrology engine and knowledge base.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
