import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import anime from 'animejs';
import { useTranslation } from 'react-i18next';

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

const ZodiacCard = ({ sign, onClick }) => {
    const cardRef = useRef(null);

    const handleMouseEnter = () => {
        anime({
            targets: cardRef.current,
            scale: 1.05,
            backgroundColor: 'rgba(139, 92, 246, 0.25)',
            boxShadow: [
                '0 0 0px rgba(139, 92, 246, 0)',
                '0 0 20px rgba(139, 92, 246, 0.4)'
            ],
            borderColor: 'rgba(139, 92, 246, 0.8)',
            duration: 400,
            easing: 'easeOutCubic'
        });
        anime({
            targets: cardRef.current.querySelector('.icon'),
            rotate: '15deg',
            duration: 400,
            easing: 'easeOutCubic'
        });
    };

    const handleMouseLeave = () => {
        anime({
            targets: cardRef.current,
            scale: 1,
            backgroundColor: 'rgba(30, 41, 59, 0.4)',
            boxShadow: '0 0 0px rgba(139, 92, 246, 0)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            duration: 400,
            easing: 'easeOutCubic'
        });
        anime({
            targets: cardRef.current.querySelector('.icon'),
            rotate: '0deg',
            duration: 400,
            easing: 'easeOutCubic'
        });
    };

    return (
        <div
            ref={cardRef}
            onClick={() => onClick(sign)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="glass-card"
            style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(30, 41, 59, 0.4)',
                opacity: 0 // Initial opacity for anime.js stagger
            }}
        >
            <span className="icon" style={{ fontSize: '3rem', marginBottom: '0.5rem', display: 'inline-block' }}>{sign.icon}</span>
            <span style={{ fontWeight: 'bold' }}>{sign.name}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{sign.date}</span>
        </div>
    );
};


const HoroscopeGrid = () => {
    const { t, i18n } = useTranslation();
    const [selectedSign, setSelectedSign] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const gridRef = useRef(null);

    useEffect(() => {
        anime({
            targets: gridRef.current.children,
            scale: [0.8, 1],
            opacity: [0, 1],
            translateZ: 0,
            easing: "easeOutExpo",
            duration: 600,
            delay: anime.stagger(100, { grid: [3, 4], from: 'center' })
        });
    }, []);

    const fetchHoroscope = async (sign) => {
        setLoading(true);
        setSelectedSign(sign);
        try {
            const res = await fetch(`https://astro-ih72.onrender.com/api/v1/horoscope/daily`, {
                headers: {
                    'Accept-Language': i18n.language
                }
            });
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
            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>{t('horoscope.title')}</h2>
            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
                {t('horoscope.subtitle')}
            </p>

            <div ref={gridRef} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1.5rem'
            }}>
                {signs.map((sign) => (
                    <ZodiacCard key={sign.name} sign={sign} onClick={fetchHoroscope} />
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
                                <p style={{ textAlign: 'center' }}>{t('common.loading')}</p>
                            ) : prediction ? (
                                <div>
                                    <div style={{ marginBottom: '2rem' }}>
                                        <p style={{ lineHeight: 1.6, fontSize: '1.2rem', color: 'var(--color-primary-glow)', marginBottom: '1.5rem' }}>
                                            {prediction.prediction}
                                        </p>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                                        <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <strong>{t('horoscope.luckyColor')}:</strong> {prediction.lucky_color}
                                        </div>
                                        <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <strong>{t('horoscope.luckyNumber')}:</strong> {prediction.lucky_number}
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
