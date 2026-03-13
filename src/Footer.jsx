// ─── Footer.jsx — Shared Footer for all pages ────────────────────────────────
import theme from './theme.js';
import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const cols = [
  { title: "Company",  links: ["About Us", "Our Team", "Careers", "Blog"] },
  { title: "Services", links: ["Umrah Packages", "Travel Insurance", "Visa Assistance", "Car Rent",] },
  { title: "Support",  links: ["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"] },
];

const socials = [
  { icon: <FaFacebookF />, label: "Facebook", url: "https://facebook.com/edafaytravels" },
  { icon: <FaLinkedinIn />, label: "LinkedIn", url: "https://linkedin.com/company/edafaytravels" },
  { icon: <FaInstagram />, label: "Instagram", url: "https://instagram.com/edafaytravels" },
];

{socials.map((s, i) => (
  <a
    key={i}
    href={s.url}
    target="_blank"
    rel="noopener noreferrer"
    style={{ fontSize: 20, marginRight: 10, cursor: "pointer" }}
  >
    {s.icon}
  </a>
))}

export default function Footer() {
  return (
    <footer style={{
      padding: "80px 5% 40px",
      background: theme.bgFooter,
      borderTop: `1px solid ${theme.border}`,
    }}>

      {/* ── Main Grid ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr",
        gap: 48,
        marginBottom: 60,
      }}>

        {/* Brand Column */}
        <div>
          {/* Logo */}
          <div
            onClick={() => window.location.hash = ''}
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, cursor: "pointer" }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${theme.accent}, #c8943a)`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>✈</div>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: theme.text }}>
              Edafay<span style={{ color: theme.accent }}>.</span>
            </span>
          </div>

          {/* Tagline */}
          <p style={{ color: theme.textMuted, lineHeight: 1.75, fontSize: 14, maxWidth: 280, marginBottom: 24 }}>
            Your trusted travel partner since 2019. Making dreams come true, one journey at a time.
          </p>

          {/* Social Icons */}
          <div style={{ display: "flex", gap: 10 }}>
            {socials.map(({ icon, label }) => (
              <div
                key={label}
                title={label}
                style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: "rgba(0,0,0,0.04)",
                  border: `1px solid ${theme.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, cursor: "pointer", transition: "all 0.2s",
                  color: theme.textMuted,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.accent; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.textMuted; }}
              >{icon}</div>
            ))}
          </div>
        </div>

        {/* Link Columns */}
        {cols.map(col => (
          <div key={col.title}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 20, letterSpacing: "0.5px", color: theme.text }}>
              {col.title}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {col.links.map(l => (
                <a
                  key={l}
                  style={{ fontSize: 13, color: theme.textMuted, textDecoration: "none", cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = theme.accent}
                  onMouseLeave={e => e.currentTarget.style.color = theme.textMuted}
                >{l}</a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${theme.border}, transparent)`, marginBottom: 28 }} />

      {/* ── Bottom Bar ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ color: theme.textMuted, fontSize: 13 }}>
          © 2026 Edafay Travels. All rights reserved. Made with ❤️ for explorers.
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          {["🇵🇰 PK", "PKR"].map(label => (
            <div key={label} style={{
              background: "rgba(0,0,0,0.04)", border: `1px solid ${theme.border}`,
              borderRadius: 8, padding: "5px 12px", fontSize: 12, color: theme.textMuted, cursor: "pointer",
            }}>{label}</div>
          ))}
        </div>
      </div>
    </footer>
  );
}