// ─── Navbar.jsx — Shared Navbar (Responsive Fixed) ───────────────────────────
import { useState, useEffect } from "react";
import theme from './theme.js';

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const links = [
    { label: "Home",          hash: ""          },
    { label: "About",         hash: "#/about"   },
    { label: "Umrah Package", hash: "#/umrah"   },
    { label: "Insurance",     hash: "#/insurance"},
    { label: "Visas",         hash: "#/visas"   },
    { label: "Car Rental",    hash: "#/cars"    },
    { label: "Contact",       hash: "#/contact" },
  ];

  return (
    <>
      <style>{`
        .nb-desktop { display: flex; }
        .nb-mobile-btn { display: none; }
        @media (max-width: 768px) {
          .nb-desktop { display: none !important; }
          .nb-mobile-btn { display: flex !important; }
        }
        .nb-link {
          color: ${theme.navText};
          text-decoration: none;
          font-size: 14px; font-weight: 500;
          letter-spacing: 0.3px; cursor: pointer;
          transition: color 0.2s; padding-bottom: 2px;
        }
        .nb-link:hover { color: ${theme.accent}; }
        .nb-btn-outline {
          background: transparent; color: ${theme.text};
          border: 1.5px solid ${theme.border};
          padding: 9px 22px; border-radius: 50px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
        }
        .nb-btn-outline:hover { border-color: ${theme.accent}; color: ${theme.accent}; }
        .nb-btn-primary {
          background: ${theme.accent}; color: #ffffff; border: none;
          padding: 10px 22px; border-radius: 50px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .nb-btn-primary:hover { background: ${theme.accentLight}; transform: translateY(-1px); }
        .nb-btn-admin {
          background: rgba(26,60,110,0.1);
          border: 1px solid rgba(26,60,110,0.25);
          color: ${theme.accent};
          padding: 9px 18px; border-radius: 50px;
          font-size: 12px; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .nb-btn-admin:hover { background: rgba(26,60,110,0.2); }
        .nb-hamburger {
          background: none; border: none; color: ${theme.text};
          font-size: 26px; cursor: pointer; padding: 4px 8px;
          width: 44px; height: 44px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px; transition: background 0.2s;
        }
        .nb-hamburger:hover { background: rgba(0,0,0,0.05); }
        .nb-mobile-menu {
          position: fixed; top: 72px; left: 0; right: 0; bottom: 0;
          background: ${theme.navBg}; backdrop-filter: blur(24px);
          border-top: 1px solid ${theme.border};
          padding: 24px 5% 40px;
          display: flex; flex-direction: column; gap: 0;
          overflow-y: auto;
          animation: nbSlideDown 0.25s ease; z-index: 99;
        }
        @keyframes nbSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nb-mobile-link {
          display: block; padding: 15px 0;
          border-bottom: 1px solid ${theme.border};
          color: ${theme.text}; font-size: 16px; font-weight: 500;
          text-decoration: none; cursor: pointer; transition: color 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .nb-mobile-link:hover { color: ${theme.accent}; }
        .nb-mobile-actions { display: flex; gap: 10px; margin-top: 24px; flex-wrap: wrap; }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 5%",
        background: scrolled ? theme.navBg : theme.navBgTransp,
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${theme.border}` : "none",
        transition: "all 0.3s",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "72px",
      }}>
        <div onClick={() => { window.location.hash = ''; setMenuOpen(false); }}
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✈</div>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", color: theme.text }}>
            Edafay - Travel & Tours<span style={{ color: theme.accent }}>.</span>
          </span>
        </div>

        <div className="nb-desktop" style={{ gap: 28, alignItems: "center" }}>
          {links.map(({ label, hash }) => (
            <a key={label} className="nb-link" onClick={() => window.location.hash = hash}>{label}</a>
          ))}
        </div>

        <div className="nb-desktop" style={{ gap: 10, alignItems: "center" }}>
          <p style={{ fontSize: "12px", margin: 0 }}> 📞 0305-2222-744</p>
          <button className="nb-btn-primary" onClick={() => window.location.hash = '#/booknow'}>Book Now</button>
          <button className="nb-btn-admin" onClick={() => window.location.hash = '#/admin'}>Admin Access</button>
        </div>

        <button className="nb-mobile-btn nb-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {menuOpen && (
        <div className="nb-mobile-menu">
          {links.map(({ label, hash }) => (
            <a key={label} className="nb-mobile-link"
              onClick={() => { window.location.hash = hash; setMenuOpen(false); }}>
              {label}
            </a>
          ))}
          <div className="nb-mobile-actions">
            <button className="nb-btn-primary" style={{ flex: 1 }} onClick={() => { window.location.hash = '#/booknow'; setMenuOpen(false); }}>Book Now</button>
          </div>
          <button className="nb-btn-admin"
            style={{ marginTop: 10, width: "100%", textAlign: "center" }}
            onClick={() => { window.location.hash = '#/admin'; setMenuOpen(false); }}>
            Admin Access
          </button>
        </div>
      )}
    </>
  );
}