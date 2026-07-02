import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Login = ({ onClose, onSwitchToRegister }) => {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        // Entry animation
        anime({
            targets: containerRef.current.children,
            translateY: [20, 0],
            opacity: [0, 1],
            delay: anime.stagger(100),
            easing: 'easeOutExpo',
            duration: 800
        });
    }, []);

    useEffect(() => {
        if (error) {
            anime({
                targets: containerRef.current,
                translateX: [
                    { value: -10, duration: 100 },
                    { value: 10, duration: 100 },
                    { value: -10, duration: 100 },
                    { value: 10, duration: 100 },
                    { value: 0, duration: 100 }
                ],
                easing: 'easeInOutQuad'
            });
        }
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const response = await fetch(`${API_URL}/api/v1/token`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || t('common.error'));
            }

            const data = await response.json();
            login(data.access_token);
            if (onClose) onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div ref={containerRef} className="glass-card" style={{ padding: '2rem', maxWidth: '400px', width: '100%', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>{t('login.title')}</h2>
            {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '0.5rem' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>{t('login.username')}</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>{t('login.password')}</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    disabled={isLoading}
                >
                    {isLoading ? t('common.loading') : t('login.button')}
                </button>
            </form>
            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>{t('login.noAccount')} </span>
                <button
                    onClick={onSwitchToRegister}
                    style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', cursor: 'pointer', fontWeight: '600' }}
                >
                    {t('login.register')}
                </button>
            </div>
        </div>
    );
};

export default Login;
