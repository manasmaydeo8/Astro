import React, { useState } from "react";
import axios from "axios";
import "./KundliGenerator.css";

function groupPlanetsByHouse(planets = {}) {
  const grouped = {};
  Object.entries(planets).forEach(([name, data]) => {
    const house =
      data && (data.house ?? data.house_no ?? data.houseNo)
        ? Number(data.house)
        : null;
    if (!house || house < 1 || house > 12) return;
    if (!grouped[house]) grouped[house] = [];
    grouped[house].push({ name, longitude: data.longitude });
  });
  return grouped;
}

function getPlanetShortLabel(englishName) {
  const map = {
    Sun: "सू",
    Moon: "चं",
    Mercury: "बु",
    Venus: "शु",
    Mars: "मं",
    Jupiter: "गु",
    Saturn: "श",
    Rahu: "रा",
    Ketu: "के",
  };
  return map[englishName] || englishName;
}

const DEV_HOUSE = {
  1: "१",
  2: "२",
  3: "३",
  4: "४",
  5: "५",
  6: "६",
  7: "७",
  8: "८",
  9: "९",
  10: "१०",
  11: "११",
  12: "१२",
};

const ZODIAC_SIGNS_DEV = [
  "मेष",
  "वृषभ",
  "मिथुन",
  "कर्क",
  "सिंह",
  "कन्या",
  "तूळ",
  "वृश्चिक",
  "धनु",
  "मकर",
  "कुंभ",
  "मीन",
];

function getHouseSignMap(ascendantDeg) {
  if (ascendantDeg == null || isNaN(Number(ascendantDeg))) {
    const fallback = {};
    for (let h = 1; h <= 12; h++) {
      fallback[h] = ZODIAC_SIGNS_DEV[(h - 1) % 12];
    }
    return fallback;
  }

  const ascDeg = Number(ascendantDeg);
  const ascSignIndex = Math.floor((ascDeg % 360) / 30);
  const houseSigns = {};
  for (let h = 1; h <= 12; h++) {
    const signIndex = (ascSignIndex + (h - 1)) % 12;
    houseSigns[h] = ZODIAC_SIGNS_DEV[signIndex];
  }
  return houseSigns;
}

function NorthKundliChart({ ascendantDeg, planets = {}, cusps = {} }) {
  const grouped = groupPlanetsByHouse(planets);
  const houseSigns = getHouseSignMap(ascendantDeg);

  const housePositions = {
    1: { x: 82, y: 50 },
    2: { x: 70, y: 77 },
    3: { x: 50, y: 88 },
    4: { x: 30, y: 77 },
    5: { x: 18, y: 50 },
    6: { x: 30, y: 23 },
    7: { x: 50, y: 12 },
    8: { x: 70, y: 23 },
    9: { x: 82, y: 18 },
    10: { x: 50, y: 5 },
    11: { x: 18, y: 18 },
    12: { x: 50, y: 95 },
  };

  return (
    <div className="north-kundli-wrapper">
      <svg viewBox="0 0 400 400" className="north-kundli-svg">
        <rect x="20" y="20" width="360" height="360" className="nk-outline" />
        <line x1="20" y1="20" x2="380" y2="380" className="nk-line" />
        <line x1="380" y1="20" x2="20" y2="380" className="nk-line" />
        <line x1="200" y1="20" x2="380" y2="200" className="nk-line" />
        <line x1="380" y1="200" x2="200" y2="380" className="nk-line" />
        <line x1="200" y1="380" x2="20" y2="200" className="nk-line" />
        <line x1="20" y1="200" x2="200" y2="20" className="nk-line" />
      </svg>

      <div className="north-kundli-overlay">
        {Array.from({ length: 12 }).map((_, idx) => {
          const h = idx + 1;
          const pos = housePositions[h];
          const pl = grouped[h] || [];
          const sign = houseSigns[h];

          return (
            <div
              key={h}
              className="nk-house-cell"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <div className="nk-house-header">
                <span className="nk-house-num">{DEV_HOUSE[h]}</span>
                <span className="nk-house-sign">{sign}</span>
                {cusps[h] !== undefined && (
                  <span className="nk-cusp">{Number(cusps[h]).toFixed(1)}°</span>
                )}
              </div>

              <div className="nk-planets">
                {pl.length === 0 ? (
                  <span className="nk-empty">—</span>
                ) : (
                  pl.map((p, i) => (
                    <span key={i} className="nk-planet">
                      {getPlanetShortLabel(p.name)}{" "}
                      {p.longitude != null
                        ? `${Number(p.longitude).toFixed(1)}°`
                        : ""}
                    </span>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function KundliGenerator() {
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [place, setPlace] = useState("");
  const [kundli, setKundli] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!dob || !tob || !place) {
      setError("⚠️ कृपया सर्व माहिती भरा!");
      return;
    }

    setLoading(true);
    setError("");
    setKundli(null);

    try {
      const res = await axios.post("http://127.0.0.1:3001/api/kundli", {
        dob,
        tob,
        place,
      });

      const data = res.data || {};
      const safeInput = data.input || {};

      setKundli({
        ascendant_deg: data.ascendant_deg ?? null,
        cusps: data.cusps || {},
        input: {
          timezone: safeInput.timezone || "N/A",
          place: safeInput.place || place,
        },
        planets: data.planets || {},
      });
    } catch (err) {
      console.error("Kundli Error:", err);
      setError("❌ कुंडली तयार करता आली नाही.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kundli-page">
      <div className="kundli-box">
        <h2>🔯 तुमची जन्मकुंडली (North Indian)</h2>

        <div className="form-fields">
          <div className="input-group">
            <label>जन्मतारीख</label>
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          </div>

          <div className="input-group">
            <label>जन्मवेळ</label>
            <input type="time" value={tob} onChange={(e) => setTob(e.target.value)} />
          </div>

          <div className="input-group">
            <label>जन्मस्थान</label>
            <input
              type="text"
              placeholder="Pune, India"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            />
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading}>
          {loading ? "कुंडली तयार होत आहे..." : "कुंडली तयार करा"}
        </button>

        {error && <p className="error">{error}</p>}

        {kundli && (
          <>
            <div className="kundli-summary">
              <h3>🌟 कुंडली सारांश</h3>
              <p><strong>लग्न:</strong> {Number(kundli.ascendant_deg).toFixed(2)}°</p>
              <p><strong>Time Zone:</strong> {kundli.input.timezone}</p>
              <p><strong>जन्मस्थान:</strong> {kundli.input.place}</p>
            </div>

            <NorthKundliChart
              ascendantDeg={kundli.ascendant_deg}
              planets={kundli.planets}
              cusps={kundli.cusps}
            />
          </>
        )}
      </div>
    </div>
  );
}
