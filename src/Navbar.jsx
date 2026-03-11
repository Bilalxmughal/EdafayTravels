// ─── Navbar.jsx — Shared Navbar for all pages ────────────────────────────────
import { useState, useEffect } from "react";
import theme from './theme.js';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const currentPage = window.location.hash;

  return (
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

      {/* ── Logo ── */}
      <div
        onClick={() => window.location.hash = ''}
        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `linear-gradient(135deg, ${theme.accent}, #c8943a)`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
        }}>✈</div>
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", color: theme.text }}>
          Edafay<span style={{ color: theme.accent }}>.</span>
        </span>
      </div>

      {/* ── Desktop Links ── */}
      <div style={{ display: "flex", gap: 36, alignItems: "center" }} className="hide-mobile">
        {[
          { label: "Home",         hash: ""          },
          { label: "Destinations", hash: ""          },
          { label: "Tours",        hash: ""          },
          { label: "About",        hash: ""          },
          { label: "Contact",      hash: "#/contact" },
        ].map(({ label, hash }) => {
          const isActive = hash ? currentPage === hash : currentPage === "";
          return (
            <a
              key={label}
              onClick={() => window.location.hash = hash}
              style={{
                color: isActive ? theme.accent : theme.navText,
                textDecoration: "none", fontSize: 14, fontWeight: 500,
                letterSpacing: "0.3px", cursor: "pointer",
                transition: "color 0.2s",
                borderBottom: isActive ? `2px solid ${theme.accent}` : "2px solid transparent",
                paddingBottom: 2,
              }}
              onMouseEnter={e => e.currentTarget.style.color = theme.accent}
              onMouseLeave={e => e.currentTarget.style.color = isActive ? theme.accent : theme.navText}
            >{label}</a>
          );
        })}
      </div>

      {/* ── Desktop Actions ── */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }} className="hide-mobile">
        <button
          style={{
            background: "transparent", color: theme.text,
            border: `1.5px solid ${theme.border}`,
            padding: "9px 22px", borderRadius: 50,
            fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500, cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.accent; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.text; }}
        >Sign In</button>

        <button style={{
          background: theme.accent, color: "#0a0a0f", border: "none",
          padding: "10px 22px", borderRadius: 50,
          fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = theme.accentLight}
          onMouseLeave={e => e.currentTarget.style.background = theme.accent}
        >Book Now</button>

        <button
          onClick={() => window.location.hash = '#/admin'}
          style={{
            background: "rgba(232,196,106,0.1)",
            border: "1px solid rgba(232,196,106,0.25)",
            color: theme.accent,
            padding: "9px 18px", borderRadius: 50,
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            transition: "all 0.2s",
            fontFamily: "'DM Sans',sans-serif",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(232,196,106,0.2)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(232,196,106,0.1)"}
        >⚙ Admin</button>
      </div>

      {/* ── Mobile Hamburger ── */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          background: "none", border: "none", color: theme.text,
          fontSize: 24, cursor: "pointer", padding: "4px 8px",
        }}
        className="show-mobile"
      >{menuOpen ? "✕" : "☰"}</button>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div style={{
          position: "absolute", top: "72px", left: 0, right: 0,
          background: theme.navBg, backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${theme.border}`,
          padding: "20px 5%", display: "flex", flexDirection: "column", gap: 16,
        }}>
          {[
            { label: "Home",         hash: ""          },
            { label: "Destinations", hash: ""          },
            { label: "Tours",        hash: ""          },
            { label: "About",        hash: ""          },
            { label: "Contact",      hash: "#/contact" },
          ].map(({ label, hash }) => (
            <a key={label} onClick={() => { window.location.hash = hash; setMenuOpen(false); }}
              style={{ color: theme.navText, fontSize: 15, fontWeight: 500, cursor: "pointer", padding: "4px 0" }}
            >{label}</a>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button style={{ flex: 1, background: "transparent", color: theme.text, border: `1.5px solid ${theme.border}`, padding: "10px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif", fontSize: 13, cursor: "pointer" }}>Sign In</button>
            <button style={{ flex: 1, background: theme.accent, color: "#0a0a0f", border: "none", padding: "10px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Book Now</button>
          </div>
          <button onClick={() => { window.location.hash = '#/admin'; setMenuOpen(false); }}
            style={{ background: "rgba(232,196,106,0.1)", border: "1px solid rgba(232,196,106,0.25)", color: theme.accent, padding: "10px", borderRadius: 50, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            ⚙ Admin Dashboard
          </button>
        </div>
      )}
    </nav>
  );
}