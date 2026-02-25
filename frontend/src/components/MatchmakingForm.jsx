import React, { useState } from 'react';
import { User, Calendar, Clock, MapPin, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const MatchmakingForm = ({ onSubmit }) => {
    const { t } = useTranslation();
    const [boyData, setBoyData] = useState({ name: '', date: '', time: '', place: '' });
    const [girlData, setGirlData] = useState({ name: '', date: '', time: '', place: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ boy: boyData, girl: girlData });
    };

    const handleBoyChange = (e) => setBoyData({ ...boyData, [e.target.name]: e.target.value });
    const handleGirlChange = (e) => setGirlData({ ...girlData, [e.target.name]: e.target.value });

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Heart size={32} color="var(--color-secondary)" style={{ marginBottom: '1rem', display: 'inline-block' }} />
                <h2>{t('matchingForm.title')}</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>{t('matchingForm.subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                    <InputSection title={t('matchingForm.partner1')} data={boyData} handleChange={handleBoyChange} color="var(--color-primary)" />
                    <InputSection title={t('matchingForm.partner2')} data={girlData} handleChange={handleGirlChange} color="var(--color-secondary)" />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
                        {t('matchingForm.submit')} <ArrowRight size={20} style={{ marginLeft: '1rem' }} />
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

const InputSection = ({ title, data, handleChange, color }) => {
    const { t } = useTranslation();
    return (
        <div className="glass-card" style={{ padding: '1.5rem', flex: 1, borderTop: `4px solid ${color}` }}>
            <h3 style={{ marginBottom: '1rem', color: color }}>{title}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                    <label>{t('kundaliForm.fullName')}</label>
                    <input type="text" name="name" value={data.name} onChange={handleChange} required placeholder={t('kundaliForm.placeholderName')} />
                </div>
                <div className="form-group">
                    <label>{t('kundaliForm.dob')}</label>
                    <input type="date" name="date" value={data.date} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>{t('kundaliForm.tob')}</label>
                    <input type="time" name="time" value={data.time} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>{t('kundaliForm.pob')}</label>
                    <input type="text" name="place" value={data.place} onChange={handleChange} required placeholder={t('kundaliForm.placeholderPlace')} />
                </div>
            </div>
        </div>
    );
};

export default MatchmakingForm;
