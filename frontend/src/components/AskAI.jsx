import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import anime from 'animejs';
import { useTranslation } from 'react-i18next';

const AskAI = () => {
    const { t, i18n } = useTranslation();
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const answerRef = useRef(null);
    const loadingRef = useRef(null);

    useEffect(() => {
        if (loading && loadingRef.current) {
            anime({
                targets: loadingRef.current,
                opacity: [0.5, 1],
                scale: [0.98, 1.02],
                direction: 'alternate',
                loop: true,
                easing: 'easeInOutSine',
                duration: 800
            });
        }
    }, [loading]);

    useEffect(() => {
        if (answer && answerRef.current) {
            anime({
                targets: answerRef.current,
                translateY: [20, 0],
                opacity: [0, 1],
                scale: [0.95, 1],
                easing: 'easeOutExpo',
                duration: 800
            });
        }
    }, [answer]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;

        setLoading(true);
        setError(null);
        setAnswer(null);

        try {
            const response = await fetch('https://astro-ih72.onrender.com/api/v1/ai/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': i18n.language
                },
                body: JSON.stringify({ question }),
            });

            const data = await response.json();

            if (response.ok) {
                setAnswer(data.answer);
            } else {
                setError(data.detail || t('common.error'));
            }
        } catch (err) {
            setError(t('common.error'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '5rem', maxWidth: '800px', margin: '0 auto' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{ padding: '2rem' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Sparkles size={32} color="var(--color-accent)" style={{ marginBottom: '1rem', display: 'inline-block' }} />
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t('askAi.title')}</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>{t('askAi.subtitle')}</p>
                </div>

                <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                    <div style={{ position: 'relative' }}>
                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder={t('askAi.placeholder')}
                            style={{
                                width: '100%',
                                minHeight: '120px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '1rem',
                                padding: '1rem',
                                color: 'white',
                                fontSize: '1rem',
                                resize: 'vertical',
                                outline: 'none',
                                fontFamily: 'inherit'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={loading || !question.trim()}
                            className="btn btn-primary"
                            ref={loadingRef}
                            style={{
                                position: 'absolute',
                                bottom: '1rem',
                                right: '1rem',
                                padding: '0.5rem 1rem',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                opacity: loading || !question.trim() ? 0.7 : 1
                            }}
                        >
                            {loading ? t('askAi.loading') : <>{t('askAi.button')} <Send size={16} /></>}
                        </button>
                    </div>
                </form>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            padding: '1rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '0.5rem',
                            color: '#fca5a5',
                            textAlign: 'center'
                        }}
                    >
                        {error}
                    </motion.div>
                )}

                {answer && (
                    <div
                        ref={answerRef}
                        style={{
                            background: 'rgba(139, 92, 246, 0.1)',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                            borderRadius: '1rem',
                            padding: '1.5rem',
                            opacity: 0 // Initial state for anime
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-accent)' }}>
                            <MessageSquare size={20} />
                            <h4 style={{ margin: 0 }}>{t('askAi.cosmicInsight')}</h4>
                        </div>
                        <div style={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                            {answer}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AskAI;
