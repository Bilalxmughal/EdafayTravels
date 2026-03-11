import { useState } from "react";
import theme from './theme.js'
import './Contact.css'

// ─── Data ────────────────────────────────────────────────────────────────────
const contactInfo = [
  { icon: "📍", title: "Our Office", lines: ["Colabs 50N, Gurumangat Road Gulberg II", "Lahore, Pakistan"], color: "rgba(232,196,106,0.12)", borderColor: "rgba(232,196,106,0.2)" },
  { icon: "📞", title: "Call Us", lines: ["+92 305 2222 744"], color: "rgba(76,175,125,0.1)", borderColor: "rgba(76,175,125,0.2)" },
  { icon: "✉️", title: "Email Us", lines: ["contact@edafay.com", "edafaytravels@gmail.com"], color: "rgba(99,102,241,0.1)", borderColor: "rgba(99,102,241,0.2)" },
  { icon: "🕐", title: "Working Hours", lines: ["Mon – Sat: 10AM – 7PM", "Sunday: 2PM – 7PM"], color: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.15)" },
];

const faqs = [
  { q: "How do I book a tour?", a: "Simply fill out the contact form or call us directly. Our team will get back to you within 24 hours with a personalized itinerary." },
  { q: "Can I customize my travel package?", a: "Absolutely! All our packages are fully customizable. We tailor every trip to your preferences, budget, and travel dates." },
  { q: "What is the cancellation policy?", a: "We offer free cancellation up to 14 days before departure. Partial refunds are available for cancellations within 7–14 days." },
  { q: "Do you arrange visa assistance?", a: "Yes! We provide complete visa assistance for all destinations we cover, including document preparation and submission guidance." },
];

// ─── Component: Navbar ────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 5%",
      background: theme.navBg,
      backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${theme.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: "72px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${theme.accent},#c8943a)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✈</div>
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", color: theme.text }}>
          Edafay<span style={{ color: theme.accent }}>.</span>
        </span>
      </div>
      <div className="c-hide-mobile" style={{ display: "flex", gap: 36 }}>
        {[["Home", ""], ["Destinations", ""], ["Tours", ""], ["About", ""], ["Contact", "#/contact"]].map(([l, h]) => (
          <a key={l} href={"#" + h} className="c-nav-link" style={{ color: l === "Contact" ? theme.accent : theme.navText }}>{l}</a>
        ))}
      </div>
      <div className="c-hide-mobile" style={{ display: "flex", gap: 10 }}>
        <button onClick={() => window.location.hash = '#/admin'} style={{ background: "rgba(232,196,106,0.1)", border: "1px solid rgba(232,196,106,0.25)", color: theme.accent, padding: "8px 16px", borderRadius: 50, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>⚙ Admin</button>
        <button style={{ background: "transparent", color: theme.text, border: `1.5px solid ${theme.border}`, padding: "9px 22px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Sign In</button>
        <button style={{ background: theme.accent, color: "#0a0a0f", border: "none", padding: "10px 22px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Book Now</button>
      </div>
    </nav>
  );
}

// ─── Component: ContactForm ───────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1500);
  };

  if (submitted) return (
    <div className="c-success-box">
      <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, marginBottom: 10, color: theme.text }}>Shukriya!</h3>
      <p style={{ color: theme.textMuted, fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>Aapka message mil gaya. Hamari team 24 ghante mein aapse rabta karegi.</p>
      <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
        className="c-btn-primary" style={{ width: "auto", padding: "12px 32px" }}>Dobara Bhejo</button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="c-grid-2">
        <div>
          <label className="c-label">Your name *</label>
          <input className="c-input" placeholder="Bilal Mughal" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label className="c-label">Email Address *</label>
          <input className="c-input" type="email" placeholder="abcd@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="c-grid-2">
        <div>
          <label className="c-label">Mobile Number</label>
          <input className="c-input" placeholder="+92 300 0000000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label className="c-label">Subject</label>
          <select className="c-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={{ appearance: "none" }}>
            <option value="">Select topic...</option>
            <option>Umrah Booking</option><option>Custom Package</option>
            <option>Visa Assistance</option><option>Hotel Booking</option><option>General Inquiry</option>
          </select>
        </div>
      </div>
      <div>
        <label className="c-label">Message *</label>
        <textarea className="c-input" rows={5} placeholder="Please type your question and inquiry..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
      </div>
      <button className="c-btn-primary" type="submit" disabled={loading}>
        {loading ? "⏳ Sending..." : "✉️ Send Message"}
      </button>
      <p style={{ fontSize: 12, color: theme.textMuted, textAlign: "center" }}>🔒 Your information is safe — Edafay will never share your information.</p>
    </form>
  );
}

// ─── Component: FaqItem ───────────────────────────────────────────────────────
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="c-faq-item" style={{
      background: open ? "rgba(232,196,106,0.04)" : theme.bgCard,
      border: `1px solid ${open ? "rgba(232,196,106,0.3)" : theme.border}`,
    }} onClick={() => setOpen(!open)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px" }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: open ? theme.accent : theme.text }}>{q}</span>
        <span style={{ fontSize: 20, color: theme.accent, transition: "transform 0.3s", transform: open ? "rotate(45deg)" : "rotate(0)", display: "inline-block" }}>+</span>
      </div>
      {open && (
        <div style={{ padding: "0 22px 20px", color: theme.textMuted, fontSize: 14, lineHeight: 1.75, animation: "fadeIn 0.3s ease" }}>{a}</div>
      )}
    </div>
  );
}

// ─── Contact Page ─────────────────────────────────────────────────────────────
export default function Contact() {
  return (
    <div style={{ background: theme.bg, minHeight: "100vh", color: theme.text, fontFamily: "'DM Sans',sans-serif" }}>
      <Navbar />

      {/* ── Hero ── */}
      <section style={{
        paddingTop: 140, paddingBottom: 80, paddingLeft: "5%", paddingRight: "5%",
        background: `radial-gradient(ellipse at 60% 0%, rgba(232,196,106,0.08) 0%, transparent 55%), radial-gradient(ellipse at 10% 80%, rgba(76,175,125,0.05) 0%, transparent 50%), ${theme.bg}`,
        textAlign: "center",
      }}>
        <div className="c-badge c-fu" style={{ marginBottom: 20 }}>📬 Get In Touch</div>
        <h1 className="c-fu1" style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(38px,5vw,72px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-1px", marginBottom: 20 }}>
          We'd Love To <span className="c-gradient-text">Hear</span><br /><em>From You</em>
        </h1>
        <p className="c-fu2" style={{ color: theme.textMuted, fontSize: 17, lineHeight: 1.75, maxWidth: 520, margin: "0 auto 48px" }}>
          Contact us to plan your dream trip. Our experts will respond within 24 hours.
        </p>
        <div className="c-fu3" style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
          {[["⚡", "24hr", "Response Time"], ["🌍", "100+", "Destinations"], ["⭐", "4.9", "Rating"]].map(([icon, num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: theme.accent, fontFamily: "'Syne',sans-serif" }}>{num}</div>
              <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="c-divider" />

      {/* ── Contact Info Cards ── */}
      <section style={{ padding: "80px 5%" }}>
        <div style={{ display: "grid", gap: 20, marginBottom: 80 }} id="contact-cards">
          <style>{`#contact-cards { grid-template-columns: repeat(4,1fr); } @media(max-width:900px){#contact-cards{grid-template-columns:1fr 1fr;}} @media(max-width:520px){#contact-cards{grid-template-columns:1fr;}}`}</style>
          {contactInfo.map((c, i) => (
            <div key={c.title} className="c-info-card" style={{ animation: `fadeUp 0.6s ${i * 0.1}s both` }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: c.color, border: `1px solid ${c.borderColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>{c.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10, fontFamily: "'Syne',sans-serif", color: theme.text }}>{c.title}</div>
              {c.lines.map(l => <div key={l} style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.8 }}>{l}</div>)}
            </div>
          ))}
        </div>

        {/* ── Form + Side ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40, alignItems: "start" }} className="c-grid-2">

          {/* Form */}
          <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 24, padding: 40 }} className="c-fu2">
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, marginBottom: 8, color: theme.text }}>
                Send Us a <span className="c-gradient-text">Message</span>
              </h2>
              <p style={{ color: theme.textMuted, fontSize: 14, lineHeight: 1.6 }}>Send your inquiry — we'll answer as soon as possible.</p>
            </div>
            <ContactForm />
          </div>

          {/* Side */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }} className="c-fu3">
            {/* Map */}
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 20, overflow: "hidden" }}>
              <div style={{ height: 220, background: "linear-gradient(135deg, rgba(232,196,106,0.08), rgba(76,175,125,0.05))", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div className="c-float" style={{ fontSize: 48, marginBottom: 12 }}>📍</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, color: theme.text }}>Lahore, Pakistan</div>
                <div style={{ fontSize: 13, color: theme.textMuted }}>Colabs 50N, Gurumangat Road Gulberg II</div>
                <a href="https://maps.app.goo.gl/t5ZCqBsSKtFX6XUs7" target="_blank" rel="noreferrer" style={{ marginTop: 16, background: theme.accent, color: "#0a0a0f", padding: "8px 20px", borderRadius: 50, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                  Find us on Google Maps →
                </a>
              </div>
            </div>

            {/* Social */}
            <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 28 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, fontFamily: "'Syne',sans-serif", color: theme.text }}>Keep in touch</div>
              <p style={{ fontSize: 13, color: theme.textMuted, marginBottom: 20, lineHeight: 1.6 }}>Follow us on social media — for latest deals & destinations.</p>
              <div style={{ display: "flex", gap: 10 }}>
                {[["𝕏","Twitter"],["f","Facebook"],["in","LinkedIn"],["📸","Instagram"],["▶","YouTube"]].map(([icon, label]) => (
                  <div key={label} className="c-social-btn" title={label}>{icon}</div>
                ))}
              </div>
            </div>

            {/* WhatsApp */}
            <div style={{ background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.2)", borderRadius: 20, padding: 24, display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ fontSize: 36, flexShrink: 0 }}>💬</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: theme.text }}>Contact us on WhatsApp</div>
                <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 12, lineHeight: 1.5 }}>For an immediate response, please send a message on WhatsApp.</div>
                <a href="https://wa.me/923454449433" target="_blank" rel="noreferrer" style={{ background: "#25d366", color: "#fff", padding: "9px 22px", borderRadius: 50, fontSize: 13, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="c-divider" />

      {/* ── FAQ ── */}
      <section style={{ padding: "80px 5%", background: `radial-gradient(ellipse at 50% 50%, rgba(232,196,106,0.04) 0%, transparent 60%), ${theme.bg}` }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div className="c-badge" style={{ marginBottom: 16 }}>❓ FAQ</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3.5vw,46px)", fontWeight: 700, marginBottom: 14, color: theme.text }}>
            Frequently Asked <span className="c-gradient-text">Questions</span>
          </h2>
          <p style={{ color: theme.textMuted, maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>The questions on your mind — you might find the answers here!</p>
        </div>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: "40px 5%", background: theme.bgFooter, borderTop: `1px solid ${theme.border}` }}>
        <div className="c-divider" style={{ marginBottom: 28 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg,${theme.accent},#c8943a)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✈</div>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: theme.text }}>Edafay<span style={{ color: theme.accent }}>.</span></span>
          </div>
          <span style={{ color: theme.textMuted, fontSize: 13 }}>© 2026 Edafay Travels. All rights reserved.</span>
          <a href="#" onClick={() => window.location.hash = ''} style={{ color: theme.accent, fontSize: 13, textDecoration: "none", fontWeight: 600 }}>← Home</a>
        </div>
      </footer>
    </div>
  );
}