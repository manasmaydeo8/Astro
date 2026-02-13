import React from 'react';
import { motion } from 'framer-motion';


const MatchDisplay = ({ result }) => {
    if (!result) return null;

    const { score, total, verdict, boy_info, girl_info } = result;

    // Color code based on score
    let scoreColor = 'var(--color-accent)';
    if (score > 28) scoreColor = '#10b981'; // Green
    else if (score < 18) scoreColor = '#ef4444'; // Red

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card"
            style={{ padding: '3rem', marginTop: '2rem', textAlign: 'center', maxWidth: '800px', marginInline: 'auto' }}
        >
            <h3 style={{ marginBottom: '2rem' }}>Compatibility Report</h3>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>Boy's Nakshatra</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{boy_info.nakshatra}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Pada {boy_info.pada}</div>
                </div>

                <div style={{
                    background: `conic-gradient(${scoreColor} ${(score / total) * 360}deg, rgba(255,255,255,0.1) 0deg)`,
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}>
                    <div style={{
                        background: 'var(--color-bg-deep)',
                        width: '130px',
                        height: '130px',
                        borderRadius: '50%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: scoreColor }}>{score}</span>
                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>out of {total}</span>
                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', color: 'var(--color-secondary)' }}>Girl's Nakshatra</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{girl_info.nakshatra}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Pada {girl_info.pada}</div>
                </div>
            </div>

            <div style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '1.5rem',
                borderRadius: '12px',
                display: 'inline-block'
            }}>
                <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Verdict</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: scoreColor }}>{verdict}</div>
            </div>

        </motion.div>
    );
};

export default MatchDisplay;
