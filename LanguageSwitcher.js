// src/components/LanguageSwitcher.js
import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const change = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button onClick={() => change("en")} aria-label="English">EN</button>
      <button onClick={() => change("hi")} aria-label="Hindi">हिं</button>
    </div>
  );
}
