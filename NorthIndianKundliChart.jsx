import React from "react";
import "./kundli-chart.css";

const BOX_MAP = [
  7, 8, 9,
  6, 1, 10,
  5, 2, 11,
  4, 3, 12
]; // North Indian layout grid mapping (3x4)

function KundliChart({ houses }) {

  const hindiNumbers = ["", "१","२","३","४","५","६","७","८","९","१०","११","१२"];

  const planetShort = {
    Sun: "सू",
    Moon: "चं",
    Mars: "मं",
    Mercury: "बु",
    Jupiter: "गु",
    Venus: "शु",
    Saturn: "श",
    Rahu: "रा",
    Ketu: "के"
  };

  return (
    <div className="kundli-container">

      {BOX_MAP.map((houseNo, i) => {
        const box = houses[String(houseNo)];

        return (
          <div key={i} className="kundli-box">

            {/* HOUSE NUMBER */}
            <div className="house-number">{hindiNumbers[houseNo]}</div>

            {/* SIGN NUMBER */}
            <div className="sign-number">{hindiNumbers[box.sign_index + 1]}</div>

            {/* PLANETS */}
            <div className="planet-list">
              {box.planets.map((p, idx) => (
                <div key={idx} className="planet-item">
                  {planetShort[p.name]}<sup>{Math.round(p.degree_in_sign)}</sup>
                </div>
              ))}
            </div>
          </div>
        );
      })}

    </div>
  );
}

export default KundliChart;
