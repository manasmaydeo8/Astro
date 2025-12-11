import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>© {new Date().getFullYear()} AstroLens — All rights reserved.</div>
        <div className="footer-right">Designed by Manas M. Maydeo</div>
      </div>
    </footer>
  );
}
