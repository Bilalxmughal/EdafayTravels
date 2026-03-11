import { useState } from "react";
import theme from './theme.js'
import './Contact.css'


const contactInfo = [
  {
    icon: "📍",
    title: "Our Office",
    lines: ["Colabs 50N, Gurumangat Road Gulberg II", "Lahore, Pakistan"],
    color: "rgba(232,196,106,0.12)",
    borderColor: "rgba(232,196,106,0.2)",
  },
  {
    icon: "📞",
    title: "Call Us",
    lines: ["+92 305 2222 744"],
    color: "rgba(76,175,125,0.1)",
    borderColor: "rgba(76,175,125,0.2)",
  },
  {
    icon: "✉️",
    title: "Email Us",
    lines: ["contact@edafay.com", "edafaytravels@gmail.com"],
    color: "rgba(99,102,241,0.1)",
    borderColor: "rgba(99,102,241,0.2)",
  },
  {
    icon: "🕐",
    title: "Working Hours",
    lines: ["Mon – Sat: 10AM – 7PM", "Sunday: 2PM – 7PM"],
    color: "rgba(239,68,68,0.08)",
    borderColor: "rgba(239,68,68,0.15)",
  },
];

const faqs = [
  { q: "How do I book a tour?", a: "Simply fill out the contact form or call us directly. Our team will get back to you within 24 hours with a personalized itinerary." },
  { q: "Can I customize my travel package?", a: "Absolutely! All our packages are fully customizable. We tailor every trip to your preferences, budget, and travel dates." },
  { q: "What is the cancellation policy?", a: "We offer free cancellation up to 14 days before departure. Partial refunds are available for cancellations within 7–14 days." },
  { q: "Do you arrange visa assistance?", a: "Yes! We provide complete visa assistance for all destinations we cover, including document preparation and submission guidance." },
];

function Navbar() {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 5%",
      background: "rgba(10,10,15,0.92)",
      backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${t.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: "72px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${t.accent},#c8943a)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✈</div>
        <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", color: t.text }}>
          Edafay<span style={{ color: t.accent }}>.</span>
        </span>
      </div>
      <div className="c-hide-mobile" style={{ display: "flex", gap: 36 }}>
        {[["Home", "#"], ["Destinations", "#"], ["Tours", "#"], ["About", "#"], ["Contact", "#/contact"]].map(([l, h]) => (
          <a key={l} href={h} className="c-nav-link" style={{ color: l === "Contact" ? t.accent : undefined }}>{l}</a>
        ))}
      </div>
      <div className="c-hide-mobile" style={{ display: "flex", gap: 10 }}>
        <button onClick={() => window.location.hash = '#/admin'} style={{ background: "rgba(232,196,106,0.1)", border: "1px solid rgba(232,196,106,0.25)", color: t.accent, padding: "8px 16px", borderRadius: 50, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>⚙ Admin</button>
        <button style={{ background: "transparent", color: t.text, border: "1.5px solid rgba(240,237,232,0.25)", padding: "9px 22px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Sign In</button>
        <button style={{ background: t.accent, color: "#0a0a0f", border: "none", padding: "10px 22px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Book Now</button>
      </div>
    </nav>
  );
}

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
      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, marginBottom: 10 }}>Shukriya!</h3>
      <p style={{ color: t.textMuted, fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
        Aapka message mil gaya. Hamari team 24 ghante mein aapse rabta karegi.
      </p>
      <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
        className="c-btn-primary" style={{ width: "auto", padding: "12px 32px" }}>
        Dobara Bhejo
      </button>
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
          <select className="c-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={{ appearance: "none", colorScheme: "dark" }}>
            <option value="">Select topic...</option>
            <option>Umrah Booking</option>
            <option>Custom Package</option>
            <option>Visa Assistance</option>
            <option>Hotel Booking</option>
            <option>General Inquiry</option>
          </select>
        </div>
      </div>
      <div>
        <label className="c-label">Message *</label>
        <textarea className="c-input" rows={5} placeholder="Please type your question and quiry..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
      </div>
      <button className="c-btn-primary" type="submit" disabled={loading}>
        {loading ? "⏳ Sending..." : "✉️ Send Message"}
      </button>
      <p style={{ fontSize: 12, color: t.textMuted, textAlign: "center" }}>
        🔒 Your information is safe — Edafay will never share your information.
      </p>
    </form>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: open ? "rgba(232,196,106,0.04)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${open ? "rgba(232,196,106,0.2)" : "rgba(255,255,255,0.06)"}`,
      borderRadius: 14, overflow: "hidden", transition: "all 0.3s", cursor: "pointer",
    }} onClick={() => setOpen(!open)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px" }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: open ? t.accent : t.text }}>{q}</span>
        <span style={{ fontSize: 20, color: t.accent, transition: "transform 0.3s", transform: open ? "rotate(45deg)" : "rotate(0)" }}>+</span>
      </div>
      {open && (
        <div style={{ padding: "0 22px 20px", color: t.textMuted, fontSize: 14, lineHeight: 1.75, animation: "fadeIn 0.3s ease" }}>
          {a}
        </div>
      )}
    </div>
  );
}

export default function Contact() {
}