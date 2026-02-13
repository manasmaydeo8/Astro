import React, { useState } from 'react';
import { User, Calendar, Clock, MapPin, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const MatchmakingForm = ({ onSubmit }) => {
    const [boyData, setBoyData] = useState({ name: '', date: '', time: '', place: '' });
    const [girlData, setGirlData] = useState({ name: '', date: '', time: '', place: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ boy: boyData, girl: girlData });
    };

    const handleBoyChange = (e) => setBoyData({ ...boyData, [e.target.name]: e.target.value });
    const handleGirlChange = (e) => setGirlData({ ...girlData, [e.target.name]: e.target.value });

    const InputSection = ({ title, data, handleChange, color }) => (
        <div className="glass-card" style={{ padding: '1.5rem', flex: 1, borderTop: `4px solid ${color}` }}>
            <h3 style={{ marginBottom: '1rem', color: color }}>{title}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                    <label>Name</label>
                    <input type="text" name="name" value={data.name} onChange={handleChange} required placeholder="Full Name" />
                </div>
                <div className="form-group">
                    <label>Date of Birth</label>
                    <input type="date" name="date" value={data.date} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Time of Birth</label>
                    <input type="time" name="time" value={data.time} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Place of Birth</label>
                    <input type="text" name="place" value={data.place} onChange={handleChange} required placeholder="City, Country" />
                </div>
            </div>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Heart size={32} color="var(--color-secondary)" style={{ marginBottom: '1rem', display: 'inline-block' }} />
                <h2>Matchmaking (Guna Milan)</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>Check compatibility between partners.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                    <InputSection title="Boy's Details" data={boyData} handleChange={handleBoyChange} color="var(--color-primary)" />
                    <InputSection title="Girl's Details" data={girlData} handleChange={handleGirlChange} color="var(--color-secondary)" />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
                        Calculate Compatibility <ArrowRight size={20} style={{ marginLeft: '1rem' }} />
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default MatchmakingForm;
