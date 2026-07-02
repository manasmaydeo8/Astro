import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MapPin, Sun, Heart, ArrowRight, User as UserIcon, LogOut, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import anime from 'animejs';

import KundaliForm from './components/KundaliForm';
import ChartDisplay from './components/ChartDisplay';
import MatchmakingForm from './components/MatchmakingForm';
import MatchDisplay from './components/MatchDisplay';
import HoroscopeGrid from './components/HoroscopeGrid';
import AskAI from './components/AskAI';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import BackgroundCanvas from './components/BackgroundCanvas'; // Import BackgroundCanvas
import { CosmicSeparator, CornerBracket } from './components/CosmicUI';
import ScrollReveal from './components/ScrollReveal';
import { AuthProvider, useAuth } from './context/AuthContext';

import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';
import API_URL from "./config";

// Wrapper component to use auth hook
const AppContent = () => {
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('home');
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const heroRef = useRef(null);

    // Feature States
    const [kundaliData, setKundaliData] = useState(null);
    const [matchData, setMatchData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (activeTab === 'home') {
            // Hero Animation
            anime.timeline({
                easing: 'easeOutExpo',
                duration: 1000
            })
                .add({
                    targets: '.hero-text .letter',
                    opacity: [0, 1],
                    translateY: [20, 0],
                    translateZ: 0,
                    scale: [0.3, 1],
                    easing: "easeOutExpo",
                    duration: 800,
                    delay: (el, i) => 30 * i
                })
                .add({
                    targets: '.hero-desc',
                    opacity: [0, 1],
                    translateY: [20, 0],
                    offset: '-=600'
                })
                .add({
                    targets: '.hero-btn',
                    opacity: [0, 1],
                    translateY: [20, 0],
                    delay: anime.stagger(100),
                    offset: '-=400'
                });
        }
    }, [activeTab]);


    const handleLoginClose = () => {
        setShowLogin(false);
    };

    const handleRegisterClose = () => {
        setShowRegister(false);
    };

    const switchToRegister = () => {
        setShowLogin(false);
        setShowRegister(true);
    };

    const switchToLogin = () => {
        setShowRegister(false);
        setShowLogin(true);
    };

    // Feature Handlers
    const handleKundaliSubmit = async (formData) => {
        setLoading(true);
        setError(null);
        setKundaliData(null);
        try {
            const response = await fetch(`${API_URL}/api/v1/kundali`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': i18n.language
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.status === 'success') {
                setKundaliData(result.data);
            } else {
                setError(result.detail || t('common.error'));
            }
        } catch (error) {
            setError(t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    const handleMatchSubmit = async (formData) => {
        setLoading(true);
        setMatchData(null);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/v1/matchmaking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': i18n.language
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.status === 'success') {
                setMatchData(result.data);
            } else {
                setError(result.detail || t('common.error'));
            }
        } catch (error) {
            setError(t('common.error'));
            console.error("Error fetching match:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        // Protected Route Check Helper
        const ProtectedRoute = ({ children }) => {
            if (!user) {
                return (
                    <div className="container" style={{ paddingTop: '10rem', textAlign: 'center' }}>
                        <div className="glass-card" style={{ padding: '3rem', maxWidth: '500px', margin: '0 auto' }}>
                            <h2 style={{ marginBottom: '1rem' }}>Login Required</h2>
                            <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>Please login to access this premium cosmic feature.</p>
                            <button className="btn btn-primary" onClick={() => setShowLogin(true)}>Login Now</button>
                        </div>
                    </div>
                );
            }
            return children;
        };

        const AdminRoute = ({ children }) => {
            if (!user || user.role !== 'admin') {
                return (
                    <div className="container" style={{ paddingTop: '10rem', textAlign: 'center' }}>
                        <div className="glass-card" style={{ padding: '3rem', maxWidth: '500px', margin: '0 auto' }}>
                            <h2 style={{ marginBottom: '1rem', color: '#ef4444' }}>Access Denied</h2>
                            <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>You do not have permission to view this area.</p>
                            <button className="btn btn-primary" onClick={() => setActiveTab('home')}>Go Home</button>
                        </div>
                    </div>
                )
            }
            return children;
        }

        switch (activeTab) {
            case 'home':
                return (
                    <>
                        {/* Hero Section */}
                        <section style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: '6rem' }}>
                            <div className="container" ref={heroRef}>
                                <h1 className="hero-text" style={{ fontSize: '4.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, #fff, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', opacity: 0 }}>
                                    {t('hero.title')}
                                </h1>
                                <p className="hero-desc" style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto 3rem auto', lineHeight: 1.6, opacity: 0 }}>
                                    {t('hero.description')}
                                    {user ? ` ${t('hero.welcomeBack', { username: user.username })}` : ` ${t('hero.joinUs')}`}
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                    {!user ? (
                                        <>
                                            <button className="btn btn-primary hero-btn" style={{ opacity: 0 }} onClick={() => setShowRegister(true)}>
                                                {t('hero.getStarted')} <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                                            </button>
                                            <button className="btn btn-outline hero-btn" style={{ opacity: 0 }} onClick={() => setShowLogin(true)}>{t('nav.login')}</button>
                                        </>
                                    ) : (
                                        <button className="btn btn-primary hero-btn" style={{ opacity: 0 }} onClick={() => setActiveTab('kundali')}>
                                            {t('hero.exploreKundali')} <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </section>



                        <CosmicSeparator />

                        <ScrollReveal delay={200}>
                            <section className="container" style={{ paddingBottom: '5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                    <FeatureCard icon={<MapPin size={32} color="var(--color-secondary)" />} title={t('features.kundali.title')} desc={t('features.kundali.desc')} />
                                    <FeatureCard icon={<Sun size={32} color="var(--color-accent)" />} title={t('features.horoscope.title')} desc={t('features.horoscope.desc')} />
                                    <FeatureCard icon={<Heart size={32} color="var(--color-primary)" />} title={t('features.matching.title')} desc={t('features.matching.desc')} />
                                </div>
                            </section>
                        </ScrollReveal>
                    </>
                );
            case 'kundali':
                return (
                    <ProtectedRoute>
                        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '5rem' }}>
                            <KundaliForm onSubmit={handleKundaliSubmit} />
                            {loading && <div style={{ textAlign: 'center', marginTop: '2rem' }}>{t('common.loading')}</div>}
                            {error && <div style={{ textAlign: 'center', marginTop: '2rem', color: '#ef4444' }}>{error}</div>}
                            {kundaliData && <ChartDisplay data={kundaliData} />}
                        </div>
                    </ProtectedRoute>
                );
            case 'horoscope':
                return (
                    <ProtectedRoute>
                        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '3rem' }}>
                            <HoroscopeGrid />
                        </div>
                    </ProtectedRoute>
                );
            case 'matching':
                return (
                    <ProtectedRoute>
                        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '5rem' }}>
                            <MatchmakingForm onSubmit={handleMatchSubmit} />
                            {loading && <div style={{ textAlign: 'center', marginTop: '2rem' }}>{t('common.loading')}</div>}
                            {error && <div style={{ textAlign: 'center', marginTop: '2rem', color: '#ef4444' }}>{error}</div>}
                            {matchData && <MatchDisplay result={matchData} />}
                        </div>
                    </ProtectedRoute>
                );
            case 'ask-ai':
                return (
                    <ProtectedRoute>
                        <AskAI />
                    </ProtectedRoute>
                );
            case 'admin':
                return (
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                )
            default:
                return <div>Page not found</div>;
        }
    };

    return (
        <div className="min-h-screen">
            <BackgroundCanvas /> {/* Add BackgroundCanvas */}
            <nav className="glass-card" style={{
                position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)',
                width: '90%', maxWidth: '1200px', zIndex: 40, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
                    <Sparkles className="text-primary-glow" style={{ color: 'var(--color-primary)' }} />
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>AstroDev</span>
                </div>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')}>{t('nav.home')}</NavButton>

                    {user && (
                        <>
                            <NavButton active={activeTab === 'kundali'} onClick={() => setActiveTab('kundali')}>{t('nav.kundali')}</NavButton>
                            <NavButton active={activeTab === 'matching'} onClick={() => setActiveTab('matching')}>{t('nav.matching')}</NavButton>
                            <NavButton active={activeTab === 'horoscope'} onClick={() => setActiveTab('horoscope')}>{t('nav.horoscope')}</NavButton>
                            <NavButton active={activeTab === 'ask-ai'} onClick={() => setActiveTab('ask-ai')}>{t('nav.askAi')}</NavButton>

                            {user.role === 'admin' && (
                                <button onClick={() => setActiveTab('admin')} className={`btn-nav ${activeTab === 'admin' ? 'active' : ''}`} style={{ background: 'none', border: 'none', color: activeTab === 'admin' ? 'var(--color-secondary)' : 'var(--color-text-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: activeTab === 'admin' ? 600 : 400, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Shield size={16} /> {t('nav.admin')}
                                </button>
                            )}
                        </>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <LanguageSwitcher />
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                                <UserIcon size={18} />
                                <span>{user.username} <small style={{ opacity: 0.6 }}>({user.role})</small></span>
                            </div>
                            <button onClick={logout} className="btn-icon" title={t('nav.logout')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', color: 'white' }}>
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <button className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }} onClick={() => setShowLogin(true)}>
                            {t('nav.login')}
                        </button>
                    )}
                </div>
            </nav>

            {renderContent()}

            {/* Modals */}
            <AnimatePresence>
                {showLogin && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}
                    >
                        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                            <button onClick={() => setShowLogin(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.5rem', zIndex: 10 }}>&times;</button>
                            <Login onClose={handleLoginClose} onSwitchToRegister={switchToRegister} />
                        </div>
                    </motion.div>
                )}
                {showRegister && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}
                    >
                        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                            <button onClick={() => setShowRegister(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.5rem', zIndex: 10 }}>&times;</button>
                            <Register onClose={handleRegisterClose} onSwitchToLogin={switchToLogin} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}


function NavButton({ active, onClick, children }) {
    const btnRef = useRef(null);

    const handleMouseEnter = () => {
        anime({
            targets: btnRef.current,
            scale: 1.1,
            color: 'var(--color-primary-glow)',
            duration: 300,
            easing: 'easeOutQuad'
        });
    };

    const handleMouseLeave = () => {
        anime({
            targets: btnRef.current,
            scale: 1,
            color: active ? 'var(--color-primary)' : 'white',
            duration: 300,
            easing: 'easeOutQuad'
        });
    };

    return (
        <button
            ref={btnRef}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`btn-nav ${active ? 'active' : ''}`}
            style={{
                background: 'none',
                border: 'none',
                color: active ? 'var(--color-primary)' : 'white',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontWeight: active ? 600 : 400
            }}
        >
            {children}
        </button>
    );
}

function FeatureCard({ icon, title, desc }) {
    const cardRef = useRef(null);

    const handleMouseEnter = () => {
        anime({
            targets: cardRef.current,
            scale: 1.05,
            duration: 500,
            easing: 'easeOutElastic(1, .8)'
        });
    };

    const handleMouseLeave = () => {
        anime({
            targets: cardRef.current,
            scale: 1,
            duration: 500,
            easing: 'easeOutElastic(1, .8)'
        });
    };

    return (
        <div
            ref={cardRef}
            className="glass-card"
            style={{ padding: '2rem', cursor: 'pointer' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div style={{ marginBottom: '1.5rem' }}>{icon}</div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>{title}</h3>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{desc}</p>
            <CornerBracket position="top-left" color="var(--color-primary)" />
            <CornerBracket position="bottom-right" color="var(--color-secondary)" />
        </div>
    )
}



function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
