// ─── About.jsx — Edafay Travel & Tours ──────────────────────────────────────
import { useState } from "react";
import theme from './theme.js';
import './About.css';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

// ─── Data ────────────────────────────────────────────────────────────────────
const stats = [
  { num: "10K+", label: "Happy Travelers", icon: "😊" },
  { num: "50+",  label: "Destinations",    icon: "🌍" },
  { num: "7 Yrs", label: "Experience",     icon: "🏆" },
  { num: "4.9★", label: "Average Rating",  icon: "⭐" },
];

const team = [
  { name: "Ahmed Raza",     role: "Founder & CEO",        img: "https://i.pravatar.cc/200?img=11", desc: "10+ saal ka travel industry experience." },
  { name: "Sara Fatima",    role: "Head of Operations",   img: "https://i.pravatar.cc/200?img=47", desc: "Har trip ko flawless banane ka junoon." },
  { name: "Usman Tariq",    role: "Lead Tour Manager",    img: "https://i.pravatar.cc/200?img=33", desc: "40+ countries explore kar chuke hain." },
  { name: "Hina Malik",     role: "Customer Relations",   img: "https://i.pravatar.cc/200?img=44", desc: "Aapki khushi hamari pehli priority." },
];

const values = [
  { icon: "🤝", title: "Trust & Transparency",  desc: "Koi hidden charges nahi. Jo bata diya, wohi milega. Hum apne har client ke saath 100% honest hain." },
  { icon: "🌟", title: "Excellence in Service",  desc: "Sirf 5-star experience. Hotels se le ke guides tak — sab kuch premium quality ka." },
  { icon: "🕌", title: "Halal & Comfortable",    desc: "Halal food, comfortable accommodations aur family-friendly environment — yeh hamari guarantee hai." },
  { icon: "💡", title: "Custom Experiences",      desc: "Har safar alag hota hai. Aapki zaroorat ke mutabiq personalized itinerary tayyar karte hain." },
  { icon: "🛡️", title: "Safe Journeys",          desc: "Har trip fully insured. 24/7 support aur emergency helpline hamesh available." },
  { icon: "💳", title: "Flexible Payments",       desc: "Easy installments, zero-interest EMI, aur multiple payment options — aapki suvidha ke liye." },
];

const milestones = [
  { year: "2018", title: "Edafay ki shuruaat",         desc: "Lahore mein chhote se office se safar shuru kiya." },
  { year: "2019", title: "Pehla Umrah Group",           desc: "50 afraad ka pehla successful Umrah package." },
  { year: "2021", title: "International Expansion",     desc: "Dubai, Turkey aur Baku tours launch hue." },
  { year: "2023", title: "10,000+ Happy Travelers",     desc: "Ek yadgar milestone — 10 hazar khush musafir." },
  { year: "2025", title: "Award Winning Agency",        desc: "Pakistan's Top Travel Agency award mila." },
];

// ─── About Page ──────────────────────────────────────────────────────────────
export default function About() {
  const [activeVal, setActiveVal] = useState(0);

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", color: theme.text, fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="ab-hero">
        <div className="ab-hero-bg" />
        <div className="ab-hero-content">
          <div className="ab-badge ab-fu">🏢 Hamara Parichay</div>
          <h1 className="ab-fu1 serif" style={{ color: theme.text }}>
            Pakistan Ka <span className="ab-gradient-text">Bharosa</span><br />
            <em>Travel Partner</em>
          </h1>
          <p className="ab-fu2" style={{ color: theme.textMuted }}>
            2018 se, Edafay Travel & Tours Pakistani families ke liye unforgettable journeys bana raha hai —
            Umrah se le ke world tours tak, har safar mein aapka saath.
          </p>
          <div className="ab-hero-stats ab-fu3">
            {stats.map(s => (
              <div key={s.label} className="ab-stat-card">
                <div className="ab-stat-icon">{s.icon}</div>
                <div className="ab-stat-num" style={{ color: theme.accent }}>{s.num}</div>
                <div className="ab-stat-label" style={{ color: theme.textMuted }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="ab-divider" />

      {/* ── Story Section ── */}
      <section className="ab-section">
        <div className="ab-story-grid">
          <div className="ab-story-images">
            <div className="ab-img-main ab-float">
              <img src="https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=500&q=80" alt="Travel" />
            </div>
            <div className="ab-img-side">
              <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&q=80" alt="Hotel" />
            </div>
            <div className="ab-img-badge">
              <span style={{ fontSize: 32 }}>✈️</span>
              <div style={{ fontWeight: 700, color: theme.text, fontSize: 15 }}>7+ Saal</div>
              <div style={{ color: theme.textMuted, fontSize: 12 }}>Trusted Service</div>
            </div>
          </div>
          <div className="ab-story-text">
            <div className="ab-badge" style={{ marginBottom: 20 }}>📖 Hamari Kahani</div>
            <h2 className="serif" style={{ fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 700, lineHeight: 1.2, marginBottom: 20, color: theme.text }}>
              Ek Chhote Se Sapne Se <span className="ab-gradient-text">Badi Manzil</span> Tak
            </h2>
            <p style={{ color: theme.textMuted, lineHeight: 1.85, marginBottom: 18, fontSize: 15 }}>
              2018 mein, jab Edafay Travel & Tours ki bunyaad rakhi gayi, to sirf ek hi maqsad tha —
              Pakistani families ko safe, affordable aur yaadgar safar karana. Lahore ke ek chhote office
              se shuru hua yeh safar aaj hazaron khush musafiron ki zindagi ka hissa ban chuka hai.
            </p>
            <p style={{ color: theme.textMuted, lineHeight: 1.85, marginBottom: 32, fontSize: 15 }}>
              Hamari team har trip ko ek mission ki tarah leta hai. Umrah packages ho ya international
              tours — hum sirf packages nahi, yadein banate hain jo zindagi bhar yaad rahein.
            </p>
            <a href="#contact" style={{
              display: "inline-block", background: theme.accent, color: "#0a0a0f",
              padding: "13px 32px", borderRadius: 50, fontWeight: 700, fontSize: 14,
              textDecoration: "none", transition: "all 0.25s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 35px rgba(232,196,106,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >Hamse Baat Karein →</a>
          </div>
        </div>
      </section>

      <div className="ab-divider" />

      {/* ── Values ── */}
      <section className="ab-section" style={{ background: `radial-gradient(ellipse at 30% 50%, rgba(232,196,106,0.05) 0%, transparent 60%), ${theme.bgCard}` }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div className="ab-badge" style={{ marginBottom: 16 }}>💎 Hamari Aadat</div>
          <h2 className="serif" style={{ fontSize: "clamp(28px,3.5vw,46px)", fontWeight: 700, marginBottom: 14, color: theme.text }}>
            Woh Values Jo Hamein <span className="ab-gradient-text">Alag</span> Banati Hain
          </h2>
          <p style={{ color: theme.textMuted, maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            Yeh sirf business nahi — yeh ek zimmedari hai jo hum dil se nibhate hain.
          </p>
        </div>
        <div className="ab-values-grid">
          {values.map((v, i) => (
            <div key={v.title} className="ab-value-card"
              style={{
                background: activeVal === i ? `rgba(232,196,106,0.08)` : theme.bg,
                border: `1px solid ${activeVal === i ? "rgba(232,196,106,0.4)" : theme.border}`,
                animation: `fadeUp 0.6s ${i * 0.1}s both`,
              }}
              onMouseEnter={() => setActiveVal(i)}
            >
              <div className="ab-value-icon" style={{ background: activeVal === i ? "rgba(232,196,106,0.15)" : "rgba(0,0,0,0.04)" }}>
                {v.icon}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 10, color: activeVal === i ? theme.accent : theme.text }}>
                {v.title}
              </h3>
              <p style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.7 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="ab-divider" />

      {/* ── Milestones / Timeline ── */}
      <section className="ab-section">
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div className="ab-badge" style={{ marginBottom: 16 }}>📅 Hamara Safar</div>
          <h2 className="serif" style={{ fontSize: "clamp(28px,3.5vw,46px)", fontWeight: 700, color: theme.text }}>
            2018 se Aaj Tak ka <span className="ab-gradient-text">Safar</span>
          </h2>
        </div>
        <div className="ab-timeline">
          {milestones.map((m, i) => (
            <div key={m.year} className="ab-timeline-item" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="ab-timeline-dot">
                <div className="ab-timeline-dot-inner" style={{ background: theme.accent }} />
              </div>
              <div className="ab-timeline-card" style={{ background: theme.bgCard, border: `1px solid ${theme.border}` }}>
                <div className="ab-timeline-year" style={{ color: theme.accent }}>{m.year}</div>
                <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, color: theme.text }}>{m.title}</h3>
                <p style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.6 }}>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="ab-divider" />

      {/* ── Team ── */}
      <section className="ab-section" style={{ background: theme.bgCard }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div className="ab-badge" style={{ marginBottom: 16 }}>👥 Hamari Team</div>
          <h2 className="serif" style={{ fontSize: "clamp(28px,3.5vw,46px)", fontWeight: 700, marginBottom: 14, color: theme.text }}>
            Log Jo Aapka <span className="ab-gradient-text">Safar</span> Banate Hain
          </h2>
          <p style={{ color: theme.textMuted, maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>
            Dedicated, experienced aur passionate — yeh log aapki har zaroorat ka khayal rakhte hain.
          </p>
        </div>
        <div className="ab-team-grid">
          {team.map((member, i) => (
            <div key={member.name} className="ab-team-card"
              style={{ background: theme.bg, border: `1px solid ${theme.border}`, animation: `fadeUp 0.6s ${i * 0.12}s both` }}>
              <div className="ab-team-img-wrap">
                <img src={member.img} alt={member.name} className="ab-team-img" />
                <div className="ab-team-overlay" />
              </div>
              <div style={{ padding: "20px" }}>
                <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 4, color: theme.text }}>{member.name}</h3>
                <div style={{ fontSize: 12, color: theme.accent, fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.8px" }}>{member.role}</div>
                <p style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.6 }}>{member.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="ab-divider" />

      {/* ── CTA ── */}
      <section style={{ padding: "80px 5%", textAlign: "center", background: `linear-gradient(135deg, rgba(232,196,106,0.07), rgba(76,175,125,0.04)), ${theme.bg}` }}>
        <div className="ab-badge" style={{ marginBottom: 20, display: "inline-flex" }}>🚀 Shuru Karein</div>
        <h2 className="serif" style={{ fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 700, marginBottom: 16, color: theme.text }}>
          Aapka Agla Safar <span className="ab-gradient-text">Hamara Intezaar</span> Kar Raha Hai
        </h2>
        <p style={{ color: theme.textMuted, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.75 }}>
          Abhi contact karein aur apna personalized travel package tayaar karwaein.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => window.location.hash = '#/contact'}
            style={{
              background: theme.accent, color: "#0a0a0f", border: "none",
              padding: "14px 36px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif",
              fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.25s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 35px rgba(232,196,106,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
          >📞 Abhi Contact Karein</button>
          <button
            onClick={() => window.location.hash = '#/destinations'}
            style={{
              background: "transparent", color: theme.text,
              border: `1.5px solid ${theme.border}`,
              padding: "13px 34px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif",
              fontSize: 15, fontWeight: 500, cursor: "pointer", transition: "all 0.25s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.text; }}
          >🌍 Destinations Dekhein</button>
        </div>
      </section>

      <Footer />
    </div>
  );
}