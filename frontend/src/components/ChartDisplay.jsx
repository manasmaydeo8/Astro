import React from 'react';
import { motion } from 'framer-motion';

const ChartDisplay = ({ data }) => {
    if (!data) return null;

    const { planetary_positions, name, place, coordinates } = data;

    // Chart Logic (North Indian Style)
    // Houses are fixed sections in the diamond chart.
    // 1st House: Top Diamond
    // 2nd House: Left Top
    // ... counter-clockwise approx pattern but let's use standard coordinates.

    // We need to map Planets to Houses relative to Ascendant.
    // House 1 = Ascendant Sign
    const ascendantSign = planetary_positions['Ascendant'].sign;
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const ascIndex = signs.indexOf(ascendantSign);

    // Helper to determine House Number (1-12) for a given planet's sign
    const getHouse = (planetSign) => {
        if (!planetSign) return -1;
        const pIndex = signs.indexOf(planetSign);
        // House = (PlanetSignIndex - AscSignIndex + 12) % 12 + 1
        let h = (pIndex - ascIndex + 12) % 12 + 1;
        return h;
    };

    // Group planets by House
    const housePlanets = {};
    for (let i = 1; i <= 12; i++) housePlanets[i] = [];

    Object.entries(planetary_positions).forEach(([planet, details]) => {
        if (planet === 'Ascendant') return;
        const house = getHouse(details.sign);
        housePlanets[house].push({ name: planet, sign: details.sign, deg: details.deg });
    });

    // SVG Coordinates for House Numbers and Contents (North Indian Diamond Style)
    // Fixed positions for the 12 houses in the diamond layout
    // 1: Top Center, 2: Top Left, 3: Left Top, 4: Center Box, etc?
    // Actually North Indian:
    // 1: Top Middle Diamond
    // 2: Top Left Triangle
    // 3: Left Top Triangle
    // 4: Left Middle Diamond
    // ... this is hard to map blindly.
    // Simplified Diamond Coordinates:
    // 1 (Lagna): 50, 25 (Top diamond)
    // 2: 25, 12 (Top Left)
    // 3: 12, 25 (Left Top)
    // 4: 25, 50 (Left diamond)
    // 7: 50, 75 (Bottom diamond)
    // 10: 75, 50 (Right diamond)

    // Let's use a simpler standard mapping for text placement in a 0-100 viewBox
    const houseConfig = {
        1: { x: 50, y: 20, label: "1 (Lagna)" },
        2: { x: 25, y: 10, label: "2" },
        3: { x: 10, y: 20, label: "3" },
        4: { x: 25, y: 50, label: "4" },
        5: { x: 10, y: 80, label: "5" },
        6: { x: 25, y: 90, label: "6" },
        7: { x: 50, y: 80, label: "7" },
        8: { x: 75, y: 90, label: "8" },
        9: { x: 90, y: 80, label: "9" },
        10: { x: 75, y: 50, label: "10" },
        11: { x: 90, y: 20, label: "11" },
        12: { x: 75, y: 10, label: "12" }
    };

    // Short Planet Names
    const shortNames = {
        "Sun": "Su", "Moon": "Mo", "Mars": "Ma", "Mercury": "Me",
        "Jupiter": "Ju", "Venus": "Ve", "Saturn": "Sa", "Rahu": "Ra", "Ketu": "Ke"
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card"
            style={{ padding: '2rem', marginTop: '2rem', maxWidth: '800px', marginInline: 'auto' }}
        >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h3>Janma Kundali for {name}</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>{place} • {data.coordinates.lat.toFixed(2)}°N, {data.coordinates.lon.toFixed(2)}°E</p>
                <p style={{ color: 'var(--color-primary-glow)', fontSize: '0.9rem' }}>Ascendant: {ascendantSign}</p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>

                {/* SVG Chart */}
                <div style={{ width: '350px', height: '350px', position: 'relative', border: '1px solid var(--color-text-muted)' }}>
                    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', stroke: 'var(--color-primary)', strokeWidth: '0.5', fill: 'none' }}>
                        {/* Outer Border */}
                        <rect x="0" y="0" width="100" height="100" />

                        {/* Diagonals */}
                        <line x1="0" y1="0" x2="100" y2="100" />
                        <line x1="100" y1="0" x2="0" y2="100" />

                        {/* Diamond (Midpoints) */}
                        <line x1="50" y1="0" x2="0" y2="50" />
                        <line x1="0" y1="50" x2="50" y2="100" />
                        <line x1="50" y1="100" x2="100" y2="50" />
                        <line x1="100" y1="50" x2="50" y2="0" />

                        {/* House Contents */}
                        {Object.keys(houseConfig).map(h => {
                            const planets = housePlanets[h];
                            const cfg = houseConfig[h];
                            // Sign Number in House (Ascendant based)
                            const signNum = ((ascIndex + parseInt(h) - 1) % 12) + 1;

                            return (
                                <g key={h}>
                                    {/* Sign Number Corner */}
                                    {/* <text x={cfg.x} y={cfg.y} fontSize="3" fill="var(--color-text-muted)" textAnchor="middle">{signNum}</text> */}

                                    {/* Planets List */}
                                    <text x={cfg.x} y={cfg.y} fontSize="3.5" fill="white" textAnchor="middle" style={{ fontWeight: 'bold' }}>
                                        {planets.map(p => shortNames[p.name]).join(' ') || ''}
                                    </text>

                                    {/* Sign Number (Small, logic needed for exact placement in corner of house) */}
                                </g>
                            )
                        })}
                    </svg>
                    {/* Static Labels overlay for readability if SVG text is tricky */}
                    {/* House Signs Numbers Overlay - simplified */}
                    {Object.keys(houseConfig).map(h => {
                        const cfg = houseConfig[h];
                        const signNum = ((ascIndex + parseInt(h) - 1) % 12) + 1;
                        return (
                            <div key={h} style={{
                                position: 'absolute',
                                left: `${cfg.x}%`,
                                top: `${cfg.y + 5}%`,
                                transform: 'translate(-50%, -50%)',
                                fontSize: '0.7rem',
                                color: 'var(--color-text-muted)',
                                pointerEvents: 'none'
                            }}>
                                {signNum}
                            </div>
                        )
                    })}
                </div>

                {/* Planet Table */}
                <div style={{ flex: 1, minWidth: '250px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border-glass)' }}>
                                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Planet</th>
                                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Sign</th>
                                <th style={{ textAlign: 'right', padding: '0.5rem' }}>Degree</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(planetary_positions).map(([planet, details]) => (
                                <tr key={planet} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '0.5rem', color: planet === 'Ascendant' ? 'var(--color-accent)' : 'inherit' }}>{planet}</td>
                                    <td style={{ padding: '0.5rem' }}>{details.sign}</td>
                                    <td style={{ padding: '0.5rem', textAlign: 'right', fontFamily: 'monospace' }}>{details.deg.toFixed(2)}°</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </motion.div>
    );
};

export default ChartDisplay;
