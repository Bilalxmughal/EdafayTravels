// ─── About.jsx — Edafay Travel & Tours (Simple & Clean) ─────────────────────
import theme from './theme.js';
import './About.css';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

// ─── Data ────────────────────────────────────────────────────────────────────
const team = [
  {
    name: "Ahmed Raza",
    role: "Founder & CEO",
    img: "https://i.pravatar.cc/300?img=11",
    desc: "10+ saal ke travel industry experience ke saath, Ahmed ne 2026 mein Edafay ki bunyaad rakhi.",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
  },
  {
    name: "Sara Fatima",
    role: "Head of Operations",
    img: "https://i.pravatar.cc/300?img=47",
    desc: "Har trip ko flawless banana Sara ki zimmedari hai. Operations se le ke customer satisfaction tak.",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
  },
  {
    name: "Usman Tariq",
    role: "Lead Tour Manager",
    img: "https://i.pravatar.cc/300?img=33",
    desc: "40+ countries explore kar chuke Usman har destination ke baare mein gehri jaankari rakhte hain.",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
  },
];

const aboutInfo = [
  { icon: "📅", label: "Founded",      value: "2026"             },
  { icon: "📍", label: "Headquarter",  value: "Lahore, Pakistan" },
  { icon: "🌍", label: "Destinations", value: "50+ Countries"    },
  { icon: "👥", label: "Travelers",    value: "10,000+"          },
  { icon: "⭐", label: "Rating",       value: "4.9 / 5.0"       },
  { icon: "🏆", label: "Awards",       value: "Top Agency 2025"  },
];

function LinkedinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

// ─── About Page ───────────────────────────────────────────────────────────────
export default function About() {
  return (
    <div className="ab-page" style={{ background: theme.bg, color: theme.text }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="ab-hero">
        <div className="ab-hero-glow" />
        <div className="ab-hero-inner">
          <span className="ab-badge ab-fu">🏢 Hamara Parichay</span>
          <h1 className="ab-fu1" style={{ color: theme.text }}>
            Pakistan Ka Bharosa<br />
            <span className="ab-gold">Travel Partner</span>
          </h1>
          <p className="ab-fu2" style={{ color: theme.textMuted }}>
            2026 mein Lahore se shuru hua ek chhota sa sapna — aaj hazaron Pakistani families
            ka bharosa manda safar saathi ban chuka hai.
          </p>
        </div>
      </section>

      {/* ── About Info ── */}
      <section className="ab-section">
        <div className="ab-about-wrap">

          {/* Left — Story Text */}
          <div className="ab-about-text">
            <span className="ab-badge" style={{ marginBottom: 20 }}>📖 Hamari Kahani</span>
            <h2 style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(26px,3vw,40px)",
              fontWeight: 700, lineHeight: 1.25,
              marginBottom: 18, color: theme.text,
            }}>
              Ek Chhote Sapne Se<br />
              <span className="ab-gold">Badi Manzil Tak</span>
            </h2>
            <p style={{ color: theme.textMuted, lineHeight: 1.85, fontSize: 15, marginBottom: 16 }}>
              Edafay Travel & Tours ki bunyaad 2026 mein Lahore mein rakhi gayi — maqsad tha
              Pakistani families ko safe, affordable aur yaadgar safar karana. Umrah packages ho
              ya international tours, hum sirf tickets nahi, yadein banate hain.
            </p>
            <p style={{ color: theme.textMuted, lineHeight: 1.85, fontSize: 15 }}>
              Hamari team ka har member travel ka shauqeen hai. Isliye aapka har safar personally
              plan kiya jaata hai — aapki pasand, budget aur zaroorat ke mutabiq.
            </p>
          </div>

          {/* Right — Info Cards */}
          <div className="ab-info-grid">
            {aboutInfo.map((item) => (
              <div key={item.label} className="ab-info-card"
                style={{ background: theme.bgCard, border: `1px solid ${theme.border}` }}>
                <div className="ab-info-icon">{item.icon}</div>
                <div className="ab-info-val" style={{ color: theme.accent }}>{item.value}</div>
                <div className="ab-info-lbl" style={{ color: theme.textMuted }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="ab-divider" />

      {/* ── Team ── */}
      <section className="ab-section" style={{ background: theme.bgCard }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="ab-badge" style={{ marginBottom: 16 }}>👥 Hamari Team</span>
          <h2 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "clamp(26px,3.5vw,44px)",
            fontWeight: 700, color: theme.text,
          }}>
            Log Jo Aapka <span className="ab-gold">Safar Banate Hain</span>
          </h2>
        </div>

        <div className="ab-team-grid">
          {team.map((member, i) => (
            <div key={member.name} className="ab-team-card"
              style={{
                background: theme.bg,
                border: `1px solid ${theme.border}`,
                animationDelay: `${i * 0.12}s`,
              }}>

              {/* Photo */}
              <div className="ab-photo-wrap">
                <img src={member.img} alt={member.name} className="ab-photo" />
              </div>

              {/* Info */}
              <div className="ab-team-body">
                <h3 style={{ fontWeight: 700, fontSize: 18, color: theme.text, marginBottom: 4 }}>
                  {member.name}
                </h3>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: theme.accent,
                  textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12,
                }}>
                  {member.role}
                </div>
                <p style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.7, marginBottom: 20 }}>
                  {member.desc}
                </p>

                {/* Social Links */}
                <div className="ab-socials">
                  <a href={member.linkedin} target="_blank" rel="noreferrer"
                    className="ab-social-btn"
                    style={{ color: theme.textMuted, border: `1px solid ${theme.border}`, background: "transparent" }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = "#0077b5";
                      e.currentTarget.style.borderColor = "#0077b5";
                      e.currentTarget.style.background = "rgba(0,119,181,0.08)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = theme.textMuted;
                      e.currentTarget.style.borderColor = theme.border;
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <LinkedinIcon />
                    <span>LinkedIn</span>
                  </a>
                  <a href={member.instagram} target="_blank" rel="noreferrer"
                    className="ab-social-btn"
                    style={{ color: theme.textMuted, border: `1px solid ${theme.border}`, background: "transparent" }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = "#e1306c";
                      e.currentTarget.style.borderColor = "#e1306c";
                      e.currentTarget.style.background = "rgba(225,48,108,0.08)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = theme.textMuted;
                      e.currentTarget.style.borderColor = theme.border;
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <InstagramIcon />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="ab-divider" />

      {/* ── CTA — Shuru Karein ── */}
      <section className="ab-cta">
        <div className="ab-cta-glow" />
        <div className="ab-cta-inner">
          <span className="ab-badge" style={{ marginBottom: 20, display: "inline-flex" }}>
            🚀 Shuru Karein
          </span>
          <h2 style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "clamp(28px,3.5vw,48px)",
            fontWeight: 700, marginBottom: 16, color: theme.text,
          }}>
            Aapka Agla Safar{" "}
            <span className="ab-gold">Hamara Intezaar</span>{" "}
            Kar Raha Hai
          </h2>
          <p style={{
            color: theme.textMuted, maxWidth: 460,
            margin: "0 auto 36px", lineHeight: 1.75, fontSize: 15,
          }}>
            Abhi contact karein aur apna personalized travel package tayaar karwaein.
          </p>
          <div className="ab-cta-btns">
            <button
              onClick={() => window.location.hash = '#/contact'}
              style={{
                background: theme.accent, color: "#0a0a0f", border: "none",
                padding: "14px 32px", borderRadius: 50, cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700,
                transition: "all 0.25s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 35px rgba(232,196,106,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >📞 Abhi Contact Karein</button>

            <button
              onClick={() => window.location.hash = '#/destinations'}
              style={{
                background: "transparent", color: theme.text,
                border: `1.5px solid ${theme.border}`,
                padding: "13px 30px", borderRadius: 50, cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 500,
                transition: "all 0.25s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.accent; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.text; }}
            >🌍 Destinations Dekhein</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}