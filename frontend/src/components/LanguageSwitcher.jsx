import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '1rem', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Languages size={18} style={{ color: 'var(--color-primary-glow)' }} />
            <select
                onChange={(e) => changeLanguage(e.target.value)}
                value={i18n.language}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    outline: 'none'
                }}
            >
                <option value="en" style={{ background: 'var(--color-bg-dark)' }}>English</option>
                <option value="hi" style={{ background: 'var(--color-bg-dark)' }}>हिंदी (Hindi)</option>
                <option value="mr" style={{ background: 'var(--color-bg-dark)' }}>मराठी (Marathi)</option>
            </select>
        </div>
    );
};

export default LanguageSwitcher;
