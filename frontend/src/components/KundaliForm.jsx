import React, { useState } from 'react';
import { Sparkles, User, Calendar, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const KundaliForm = ({ onSubmit }) => {
    const { t } = useTranslation();
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
                <h2>{t('kundaliForm.title')}</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>{t('kundaliForm.subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="form-group">
                    <label><User size={16} style={{ marginRight: '8px' }} /> {t('kundaliForm.fullName')}</label>
                    <input
                        type="text"
                        name="name"
                        placeholder={t('kundaliForm.placeholderName')}
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label><Calendar size={16} style={{ marginRight: '8px' }} /> {t('kundaliForm.dob')}</label>
                        <input
                            type="date"
                            name="date"
                            required
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label><Clock size={16} style={{ marginRight: '8px' }} /> {t('kundaliForm.tob')}</label>
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
                    <label><MapPin size={16} style={{ marginRight: '8px' }} /> {t('kundaliForm.pob')}</label>
                    <input
                        type="text"
                        name="place"
                        placeholder={t('kundaliForm.placeholderPlace')}
                        required
                        value={formData.place}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                    {t('kundaliForm.submit')}
                </button>
            </form>
        </motion.div>
    );
};

export default KundaliForm;
