import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const KundaliForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '',
        place: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}
        >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Sparkles size={32} color="var(--color-primary)" style={{ marginBottom: '1rem', display: 'inline-block' }} />
                <h2>Generate Janma Patrika</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>Enter birth details accurately.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="form-group">
                    <label><User size={16} style={{ marginRight: '8px' }} /> Full Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="e.g. Rahul Sharma"
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label><Calendar size={16} style={{ marginRight: '8px' }} /> Date of Birth</label>
                        <input
                            type="date"
                            name="date"
                            required
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label><Clock size={16} style={{ marginRight: '8px' }} /> Time of Birth</label>
                        <input
                            type="time"
                            name="time"
                            required
                            value={formData.time}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label><MapPin size={16} style={{ marginRight: '8px' }} /> Place of Birth</label>
                    <input
                        type="text"
                        name="place"
                        placeholder="e.g. Mumbai, India"
                        required
                        value={formData.place}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                    Visualize Charts
                </button>
            </form>
        </motion.div>
    );
};

export default KundaliForm;
