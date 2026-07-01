import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t } = useTranslation();
  const loc = useLocation();

  return (
    <header className="site-header">
      <div className="site-brand">
        <Link to="/" className="brand-link">
          <div className="logo">🔮</div>
          <div className="brand-text">
            <h1>{t("siteTitle")}</h1>
            <small>Cosmic insights, modern UX</small>
          </div>
        </Link>
      </div>

      <nav className="main-nav" aria-label="Main navigation">
        <Link className={loc.pathname === "/" ? "active" : ""} to="/">{t("nav.home")}</Link>
        <Link to="/kundli" className={loc.pathname === "/kundli" ? "active" : ""}>{t("nav.kundli")}</Link>
        <Link to="/ask" className={loc.pathname === "/ask" ? "active" : ""}>{t("nav.ask")}</Link>
        <Link to="/services" className={loc.pathname === "/services" ? "active" : ""}>{t("nav.services")}</Link>
      </nav>

      <div className="header-actions">
        <LanguageSwitcher />
        <Link to="/login" className="login-link">{t("nav.login")}</Link>
      </div>
    </header>
  );
}
