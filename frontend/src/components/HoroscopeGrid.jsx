import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const signs = [
    { name: 'Aries', date: 'Mar 21 - Apr 19', icon: '♈' },
    { name: 'Taurus', date: 'Apr 20 - May 20', icon: '♉' },
    { name: 'Gemini', date: 'May 21 - Jun 20', icon: '♊' },
    { name: 'Cancer', date: 'Jun 21 - Jul 22', icon: '♋' },
    { name: 'Leo', date: 'Jul 23 - Aug 22', icon: '♌' },
    { name: 'Virgo', date: 'Aug 23 - Sep 22', icon: '♍' },
    { name: 'Libra', date: 'Sep 23 - Oct 22', icon: '♎' },
    { name: 'Scorpio', date: 'Oct 23 - Nov 21', icon: '♏' },
    { name: 'Sagittarius', date: 'Nov 22 - Dec 21', icon: '♐' },
    { name: 'Capricorn', date: 'Dec 22 - Jan 19', icon: '♑' },
    { name: 'Aquarius', date: 'Jan 20 - Feb 18', icon: '♒' },
    { name: 'Pisces', date: 'Feb 19 - Mar 20', icon: '♓' }
];

const HoroscopeGrid = () => {
    const [selectedSign, setSelectedSign] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchHoroscope = async (sign) => {
        setLoading(true);
        setSelectedSign(sign);
        try {
            const res = await fetch(`http://localhost:8000/api/v1/horoscope/daily?sign=${sign.name}`);
            const data = await res.json();
            setPrediction(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Daily Horoscope</h2>
            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
                Select your zodiac sign to reveal what the stars have in store for you today.
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1.5rem'
            }}>
                {signs.map((sign) => (
                    <motion.button
                        key={sign.name}
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => fetchHoroscope(sign)}
                        className="glass-card"
                        style={{
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(30, 41, 59, 0.4)'
                        }}
                    >
                        <span style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{sign.icon}</span>
                        <span style={{ fontWeight: 'bold' }}>{sign.name}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{sign.date}</span>
                    </motion.button>
                ))}
            </div>

            <AnimatePresence>
                {selectedSign && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.8)',
                            zIndex: 100,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1rem'
                        }}
                        onClick={() => setSelectedSign(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="glass-card"
                            style={{
                                width: '100%',
                                maxWidth: '500px',
                                padding: '2rem',
                                position: 'relative',
                                background: 'var(--color-bg-dark)',
                                border: '1px solid var(--color-primary)'
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedSign(null)}
                                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                            >
                                <X />
                            </button>

                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>{selectedSign.icon}</span>
                                <h3 style={{ fontSize: '2rem', color: 'var(--color-primary-glow)' }}>{selectedSign.name}</h3>
                                <p>{new Date().toLocaleDateString()}</p>
                            </div>

                            {loading ? (
                                <p style={{ textAlign: 'center' }}>Consulting the cosmos...</p>
                            ) : prediction ? (
                                <div>
                                    <p style={{ lineHeight: 1.6, fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                                        {prediction.prediction}
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                                        <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                                            <strong>Lucky Color:</strong> {prediction.lucky_color}
                                        </div>
                                        <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                                            <strong>Lucky Number:</strong> {prediction.lucky_number}
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HoroscopeGrid;
