// ─── Navbar.jsx — Shared Responsive Navbar ────────────────────────────────────
import { useState, useEffect } from "react";
import theme from './theme.js';

const LINKS = [
  { label: "Home",         hash: ""             },
  { label: "Destinations", hash: ""             },
  { label: "Tours",        hash: ""             },
  { label: "About",        hash: "#/about"      },
  { label: "Contact",      hash: "#/contact"    },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const navigate = (hash) => { window.location.hash = hash; setMenuOpen(false); };

  return (
    <>
      {/* ── Styles injected once ── */}
      <style>{`
        .nb-desktop { display: flex !important; }
        .nb-mobile  { display: none  !important; }
        @media (max-width: 900px) {
          .nb-desktop { display: none  !important; }
          .nb-mobile  { display: flex  !important; }
        }
        .nb-link {
          color: ${theme.navText};
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.3px;
          cursor: pointer;
          transition: color 0.2s;
          background: none;
          border: none;
          font-family: 'DM Sans', sans-serif;
          padding: 0;
        }
        .nb-link:hover { color: ${theme.accent}; }
        .nb-mob-link {
          color: ${theme.text};
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          padding: 13px 0;
          border-bottom: 1px solid ${theme.border};
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-decoration: none;
          transition: color 0.2s;
        }
        .nb-mob-link:hover { color: ${theme.accent}; }
        .nb-mob-link:last-of-type { border-bottom: none; }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: 72,
        padding: "0 5%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? theme.navBg : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${theme.border}` : "none",
        transition: "background 0.3s, border 0.3s, backdrop-filter 0.3s",
      }}>

        {/* Logo */}
        <div onClick={() => navigate("")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${theme.accent}, #0f2a50)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✈</div>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: theme.text }}>
            Edafay<span style={{ color: theme.accent }}>.</span>
          </span>
        </div>

        {/* ── Desktop Links ── */}
        <div className="nb-desktop" style={{ gap: 32, alignItems: "center" }}>
          {LINKS.map(({ label, hash }) => (
            <button key={label} className="nb-link" onClick={() => navigate(hash)}>{label}</button>
          ))}
        </div>

        {/* ── Desktop Actions ── */}
        <div className="nb-desktop" style={{ gap: 10, alignItems: "center" }}>
          <button style={{ background: "transparent", color: theme.text, border: `1.5px solid ${theme.border}`, padding: "9px 20px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.text; }}
          >Sign In</button>

          <button style={{ background: theme.accent, color: "#fff", border: "none", padding: "10px 20px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "background .2s" }}
            onMouseEnter={e => e.currentTarget.style.background = theme.accentLight}
            onMouseLeave={e => e.currentTarget.style.background = theme.accent}
          >Book Now</button>

          <button onClick={() => navigate("#/admin")} style={{ background: "rgba(26,60,110,0.12)", border: "1px solid rgba(26,60,110,0.3)", color: theme.accent, padding: "9px 16px", borderRadius: 50, fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "background .2s", fontFamily: "'DM Sans',sans-serif" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(26,60,110,0.22)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(26,60,110,0.12)"}
          >⚙ Admin</button>
        </div>

        {/* ── Mobile Hamburger ── */}
        <button className="nb-mobile" onClick={() => setMenuOpen(o => !o)} style={{
          background: "none", border: `1.5px solid ${theme.border}`, color: theme.text,
          fontSize: 20, cursor: "pointer", padding: "6px 12px", borderRadius: 8,
          fontFamily: "inherit", alignItems: "center", justifyContent: "center",
          transition: "all .2s",
        }}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* ── Mobile Menu Dropdown ── */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: 72, left: 0, right: 0, zIndex: 99,
          background: theme.navBg,
          backdropFilter: "blur(24px)",
          borderBottom: `1px solid ${theme.border}`,
          padding: "8px 5% 24px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
          animation: "nbFadeDown .2s ease",
        }}>
          <style>{`@keyframes nbFadeDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }`}</style>

          {LINKS.map(({ label, hash }) => (
            <div key={label} className="nb-mob-link" onClick={() => navigate(hash)}>
              {label} <span style={{ color: theme.textMuted, fontSize: 13 }}>→</span>
            </div>
          ))}

          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button style={{ flex: 1, background: "transparent", color: theme.text, border: `1.5px solid ${theme.border}`, padding: "12px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif", fontSize: 14, cursor: "pointer" }}>Sign In</button>
            <button style={{ flex: 1, background: theme.accent, color: "#fff", border: "none", padding: "12px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Book Now</button>
          </div>

          <button onClick={() => navigate("#/admin")} style={{ marginTop: 10, width: "100%", background: "rgba(26,60,110,0.12)", border: "1px solid rgba(26,60,110,0.3)", color: theme.accent, padding: "12px", borderRadius: 50, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
            ⚙ Admin Dashboard
          </button>
        </div>
      )}
    </>
  );
}