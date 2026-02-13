import React, { useState } from 'react';
import { Sparkles, MapPin, Sun, Heart, ArrowRight, User as UserIcon, LogOut, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import KundaliForm from './components/KundaliForm';
import ChartDisplay from './components/ChartDisplay';
import MatchmakingForm from './components/MatchmakingForm';
import MatchDisplay from './components/MatchDisplay';
import HoroscopeGrid from './components/HoroscopeGrid';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

// Wrapper component to use auth hook
const AppContent = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('home');
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    // Feature States
    const [kundaliData, setKundaliData] = useState(null);
    const [matchData, setMatchData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
            const response = await fetch('http://localhost:8000/api/v1/kundali', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.status === 'success') {
                setKundaliData(result.data);
            } else {
                setError(result.detail || "Failed to generate kundali.");
            }
        } catch (error) {
            setError("Network error. Please ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleMatchSubmit = async (formData) => {
        setLoading(true);
        setMatchData(null);
        setError(null);
        try {
            const response = await fetch('http://localhost:8000/api/v1/matchmaking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.status === 'success') {
                setMatchData(result.data);
            } else {
                setError(result.detail || "Failed to calculate compatibility.");
            }
        } catch (error) {
            setError("Network error. Please ensure backend is running.");
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
                            <div className="container fade-in">
                                <h1 style={{ fontSize: '4.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, #fff, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    Discover Your Cosmic Destiny
                                </h1>
                                <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
                                    Unlock the secrets of the stars with ancient Vedic wisdom.
                                    {user ? ` Welcome back, ${user.username}.` : " Join us today to reveal your path."}
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                    {!user ? (
                                        <>
                                            <button className="btn btn-primary" onClick={() => setShowRegister(true)}>
                                                Get Started <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                                            </button>
                                            <button className="btn btn-outline" onClick={() => setShowLogin(true)}>Login</button>
                                        </>
                                    ) : (
                                        <button className="btn btn-primary" onClick={() => setActiveTab('kundali')}>
                                            Explore Your Kundali <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="container" style={{ paddingBottom: '5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                <FeatureCard icon={<MapPin size={32} color="var(--color-secondary)" />} title="Janma Kundali" desc="Precise birth chart generation." />
                                <FeatureCard icon={<Sun size={32} color="var(--color-accent)" />} title="Daily Horoscope" desc="Personalized predictions." />
                                <FeatureCard icon={<Heart size={32} color="var(--color-primary)" />} title="Matchmaking" desc="Detailed Guna Milan analysis." />
                            </div>
                        </section>
                    </>
                );
            case 'kundali':
                return (
                    <ProtectedRoute>
                        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '5rem' }}>
                            <KundaliForm onSubmit={handleKundaliSubmit} />
                            {loading && <div style={{ textAlign: 'center', marginTop: '2rem' }}>Consulting the stars...</div>}
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
                            {loading && <div style={{ textAlign: 'center', marginTop: '2rem' }}>Consulting the stars...</div>}
                            {error && <div style={{ textAlign: 'center', marginTop: '2rem', color: '#ef4444' }}>{error}</div>}
                            {matchData && <MatchDisplay result={matchData} />}
                        </div>
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
            <nav className="glass-card" style={{
                position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)',
                width: '90%', maxWidth: '1200px', zIndex: 40, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
                    <Sparkles className="text-primary-glow" style={{ color: 'var(--color-primary)' }} />
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>AstroLence</span>
                </div>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <button onClick={() => setActiveTab('home')} className={`btn-nav ${activeTab === 'home' ? 'active' : ''}`} style={{ background: 'none', border: 'none', color: activeTab === 'home' ? 'var(--color-primary)' : 'white', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: activeTab === 'home' ? 600 : 400 }}>Home</button>

                    {user && (
                        <>
                            <button onClick={() => setActiveTab('kundali')} className={`btn-nav ${activeTab === 'kundali' ? 'active' : ''}`} style={{ background: 'none', border: 'none', color: activeTab === 'kundali' ? 'var(--color-primary)' : 'white', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: activeTab === 'kundali' ? 600 : 400 }}>Kundali</button>
                            <button onClick={() => setActiveTab('matching')} className={`btn-nav ${activeTab === 'matching' ? 'active' : ''}`} style={{ background: 'none', border: 'none', color: activeTab === 'matching' ? 'var(--color-primary)' : 'white', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: activeTab === 'matching' ? 600 : 400 }}>Matchmaking</button>
                            <button onClick={() => setActiveTab('horoscope')} className={`btn-nav ${activeTab === 'horoscope' ? 'active' : ''}`} style={{ background: 'none', border: 'none', color: activeTab === 'horoscope' ? 'var(--color-primary)' : 'white', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: activeTab === 'horoscope' ? 600 : 400 }}>Horoscope</button>

                            {user.role === 'admin' && (
                                <button onClick={() => setActiveTab('admin')} className={`btn-nav ${activeTab === 'admin' ? 'active' : ''}`} style={{ background: 'none', border: 'none', color: activeTab === 'admin' ? 'var(--color-secondary)' : 'var(--color-text-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: activeTab === 'admin' ? 600 : 400, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Shield size={16} /> Admin
                                </button>
                            )}
                        </>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                                <UserIcon size={18} />
                                <span>{user.username} <small style={{ opacity: 0.6 }}>({user.role})</small></span>
                            </div>
                            <button onClick={logout} className="btn-icon" title="Logout" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', color: 'white' }}>
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <button className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }} onClick={() => setShowLogin(true)}>
                            Login
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

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="glass-card" style={{ padding: '2rem', transition: 'transform 0.3s' }}>
            <div style={{ marginBottom: '1.5rem' }}>{icon}</div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>{title}</h3>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{desc}</p>
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
