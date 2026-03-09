import { useState } from "react";

const t = {
  bg: "#0a0a0f", bgCard: "#12121a", accent: "#e8c46a",
  accentLight: "#f5d98b", text: "#f0ede8", textMuted: "#8b8a96",
  green: "#4caf7d", border: "rgba(255,255,255,0.07)",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700;800&display=swap');

  @keyframes fadeUp   { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes shimmer  { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(0.97)} }

  .contact-fu  { animation: fadeUp 0.7s ease both; }
  .contact-fu1 { animation: fadeUp 0.7s 0.1s ease both; }
  .contact-fu2 { animation: fadeUp 0.7s 0.2s ease both; }
  .contact-fu3 { animation: fadeUp 0.7s 0.3s ease both; }
  .contact-fu4 { animation: fadeUp 0.7s 0.4s ease both; }
  .contact-float { animation: float 3s ease-in-out infinite; }

  .c-nav-link { color:rgba(240,237,232,0.75); text-decoration:none; font-size:14px; font-weight:500; transition:color 0.2s; cursor:pointer; }
  .c-nav-link:hover { color:${t.accent}; }

  .c-input {
    background: rgba(255,255,255,0.04);
    border: 1.5px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    color: ${t.text};
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    padding: 14px 18px;
    width: 100%;
    outline: none;
    transition: all 0.25s;
    resize: none;
  }
  .c-input:focus {
    border-color: ${t.accent};
    background: rgba(232,196,106,0.04);
    box-shadow: 0 0 0 3px rgba(232,196,106,0.08);
  }
  .c-input::placeholder { color: rgba(240,237,232,0.25); }

  .c-btn-primary {
    background: ${t.accent}; color: #0a0a0f; border: none;
    padding: 15px 36px; border-radius: 50px;
    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700;
    cursor: pointer; transition: all 0.25s; width: 100%; letter-spacing: 0.3px;
  }
  .c-btn-primary:hover { background: ${t.accentLight}; transform: translateY(-2px); box-shadow: 0 12px 35px rgba(232,196,106,0.35); }
  .c-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .c-info-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; padding: 24px;
    transition: all 0.3s; cursor: default;
  }
  .c-info-card:hover {
    border-color: rgba(232,196,106,0.25);
    background: rgba(232,196,106,0.03);
    transform: translateY(-4px);
  }

  .c-social-btn {
    width: 44px; height: 44px; border-radius: 12px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; cursor: pointer; transition: all 0.2s;
    text-decoration: none;
  }
  .c-social-btn:hover {
    border-color: ${t.accent};
    background: rgba(232,196,106,0.1);
    transform: translateY(-3px);
  }

  .c-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(232,196,106,0.12); border: 1px solid rgba(232,196,106,0.3);
    color: ${t.accent}; font-size: 12px; font-weight: 600;
    padding: 6px 14px; border-radius: 50px; letter-spacing: 1px; text-transform: uppercase;
  }

  .c-gradient-text {
    background: linear-gradient(135deg, ${t.accent}, #f0c080, #e8c46a);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .c-divider { height:1px; background:linear-gradient(to right,transparent,rgba(255,255,255,0.08),transparent); }

  .c-success-box {
    background: rgba(76,175,125,0.08);
    border: 1px solid rgba(76,175,125,0.25);
    border-radius: 16px; padding: 24px;
    text-align: center; animation: fadeUp 0.5s ease both;
  }

  .c-label {
    display: block; font-size: 12px; font-weight: 600;
    color: rgba(240,237,232,0.5); margin-bottom: 8px;
    text-transform: uppercase; letter-spacing: 0.8px;
  }

  .c-map-embed {
    width: 100%; height: 280px; border-radius: 18px;
    overflow: hidden; border: 1px solid rgba(255,255,255,0.07);
    filter: grayscale(0.3) invert(0.9) hue-rotate(180deg);
    opacity: 0.75;
  }

  @media(max-width:768px) {
    .c-hide-mobile { display:none !important; }
    .c-grid-2 { grid-template-columns: 1fr !important; }
    .c-grid-3 { grid-template-columns: 1fr !important; }
  }
`;

const contactInfo = [
  {
    icon: "📍",
    title: "Our Office",
    lines: ["123 Travel Street", "Lahore, Pakistan"],
    color: "rgba(232,196,106,0.12)",
    borderColor: "rgba(232,196,106,0.2)",
  },
  {
    icon: "📞",
    title: "Call Us",
    lines: ["+92 300 1234567", "+92 42 1234567"],
    color: "rgba(76,175,125,0.1)",
    borderColor: "rgba(76,175,125,0.2)",
  },
  {
    icon: "✉️",
    title: "Email Us",
    lines: ["hello@edafay.com", "support@edafay.com"],
    color: "rgba(99,102,241,0.1)",
    borderColor: "rgba(99,102,241,0.2)",
  },
  {
    icon: "🕐",
    title: "Working Hours",
    lines: ["Mon – Sat: 9AM – 7PM", "Sunday: 10AM – 4PM"],
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
          <label className="c-label">Aapka Naam *</label>
          <input className="c-input" placeholder="Bilal Mughal" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label className="c-label">Email Address *</label>
          <input className="c-input" type="email" placeholder="bilal@gmail.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="c-grid-2">
        <div>
          <label className="c-label">Phone Number</label>
          <input className="c-input" placeholder="+92 300 0000000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label className="c-label">Subject</label>
          <select className="c-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={{ appearance: "none", colorScheme: "dark" }}>
            <option value="">Select topic...</option>
            <option>Tour Booking</option>
            <option>Custom Package</option>
            <option>Visa Assistance</option>
            <option>Hotel Booking</option>
            <option>General Inquiry</option>
          </select>
        </div>
      </div>
      <div>
        <label className="c-label">Message *</label>
        <textarea className="c-input" rows={5} placeholder="Apna sawaal ya request yahan likhein..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
      </div>
      <button className="c-btn-primary" type="submit" disabled={loading}>
        {loading ? "⏳ Bhej rahe hain..." : "✉️ Message Bhejo"}
      </button>
      <p style={{ fontSize: 12, color: t.textMuted, textAlign: "center" }}>
        🔒 Aapki info bilkul safe hai — kisi ke saath share nahi hogi.
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
  return (
    <>
      <style>{css}</style>
      <div style={{ background: t.bg, minHeight: "100vh", color: t.text, fontFamily: "'DM Sans',sans-serif" }}>
        <Navbar />

        {/* ── Hero ── */}
        <section style={{
          paddingTop: 140, paddingBottom: 80, paddingLeft: "5%", paddingRight: "5%",
          background: `radial-gradient(ellipse at 60% 0%, rgba(232,196,106,0.08) 0%, transparent 55%),
                       radial-gradient(ellipse at 10% 80%, rgba(76,175,125,0.05) 0%, transparent 50%), ${t.bg}`,
          textAlign: "center",
        }}>
          <div className="c-badge contact-fu" style={{ marginBottom: 20 }}>📬 Get In Touch</div>
          <h1 className="contact-fu1" style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(38px,5vw,72px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-1px", marginBottom: 20 }}>
            We'd Love To <span className="c-gradient-text">Hear</span><br />
            <em>From You</em>
          </h1>
          <p className="contact-fu2" style={{ color: t.textMuted, fontSize: 17, lineHeight: 1.75, maxWidth: 520, margin: "0 auto 48px" }}>
            Apna dream trip plan karne ke liye humse rabta karein. Hamare experts 24 ghante mein jawab denge.
          </p>

          {/* Quick stats */}
          <div className="contact-fu3" style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
            {[["⚡", "24hr", "Response Time"], ["🌍", "200+", "Destinations"], ["⭐", "4.9", "Rating"]].map(([icon, num, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: t.accent, fontFamily: "'Syne',sans-serif" }}>{num}</div>
                <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="c-divider" />

        {/* ── Contact Info Cards ── */}
        <section style={{ padding: "80px 5%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 80 }} className="c-grid-3" id="contact-cards">
            <style>{`#contact-cards { grid-template-columns: repeat(4,1fr); } @media(max-width:900px){#contact-cards{grid-template-columns:1fr 1fr;}} @media(max-width:520px){#contact-cards{grid-template-columns:1fr;}}`}</style>
            {contactInfo.map((c, i) => (
              <div key={c.title} className="c-info-card" style={{ animation: `fadeUp 0.6s ${i * 0.1}s both` }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: c.color, border: `1px solid ${c.borderColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>
                  {c.icon}
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10, fontFamily: "'Syne',sans-serif" }}>{c.title}</div>
                {c.lines.map(l => <div key={l} style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.8 }}>{l}</div>)}
              </div>
            ))}
          </div>

          {/* ── Main Grid: Form + Side info ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40, alignItems: "start" }} className="c-grid-2">

            {/* Form */}
            <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 24, padding: 40 }} className="contact-fu2">
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
                  Send Us a <span className="c-gradient-text">Message</span>
                </h2>
                <p style={{ color: t.textMuted, fontSize: 14, lineHeight: 1.6 }}>Apna sawaal bhejein — hum jald jawab denge.</p>
              </div>
              <ContactForm />
            </div>

            {/* Side */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }} className="contact-fu3">

              {/* Map placeholder */}
              <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 20, overflow: "hidden" }}>
                <div style={{ height: 220, background: `linear-gradient(135deg, rgba(232,196,106,0.08), rgba(76,175,125,0.05))`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <div className="contact-float" style={{ fontSize: 48, marginBottom: 12 }}>📍</div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Lahore, Pakistan</div>
                  <div style={{ fontSize: 13, color: t.textMuted }}>123 Travel Street, Gulberg III</div>
                  <a href="https://maps.google.com" target="_blank" rel="noreferrer" style={{ marginTop: 16, background: t.accent, color: "#0a0a0f", padding: "8px 20px", borderRadius: 50, fontSize: 12, fontWeight: 700, textDecoration: "none", cursor: "pointer" }}>
                    Google Maps par Dekho →
                  </a>
                </div>
              </div>

              {/* Social */}
              <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 20, padding: 28 }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, fontFamily: "'Syne',sans-serif" }}>Hamare Saath Jud'ein</div>
                <p style={{ fontSize: 13, color: t.textMuted, marginBottom: 20, lineHeight: 1.6 }}>Social media par follow karein — latest deals & destinations ke liye.</p>
                <div style={{ display: "flex", gap: 10 }}>
                  {[["𝕏","Twitter"],["f","Facebook"],["in","LinkedIn"],["📸","Instagram"],["▶","YouTube"]].map(([icon, label]) => (
                    <div key={label} className="c-social-btn" title={label}>{icon}</div>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div style={{ background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.2)", borderRadius: 20, padding: 24, display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ fontSize: 36, flexShrink: 0 }}>💬</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>WhatsApp par Chat Karein</div>
                  <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 12, lineHeight: 1.5 }}>Fori jawab ke liye WhatsApp par message karein!</div>
                  <a href="https://wa.me/923001234567" target="_blank" rel="noreferrer" style={{ background: "#25d366", color: "#fff", padding: "9px 22px", borderRadius: 50, fontSize: 13, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>
                    WhatsApp Kholo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="c-divider" />

        {/* ── FAQ ── */}
        <section style={{ padding: "80px 5%", background: `radial-gradient(ellipse at 50% 50%, rgba(232,196,106,0.04) 0%, transparent 60%), ${t.bg}` }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div className="c-badge" style={{ marginBottom: 16 }}>❓ FAQ</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px,3.5vw,46px)", fontWeight: 700, marginBottom: 14 }}>
              Aksar Pooche Jaane Wale <span className="c-gradient-text">Sawalat</span>
            </h2>
            <p style={{ color: t.textMuted, maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>Aapke zahen mein jo sawaal hain — shayad jawab yahan ho!</p>
          </div>
          <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
            {faqs.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ padding: "40px 5%", background: "#07070d", borderTop: `1px solid ${t.border}` }}>
          <div className="c-divider" style={{ marginBottom: 28 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg,${t.accent},#c8943a)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✈</div>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700 }}>Edafay<span style={{ color: t.accent }}>.</span></span>
            </div>
            <span style={{ color: t.textMuted, fontSize: 13 }}>© 2025 Edafay Travels. All rights reserved.</span>
            <a href="#" onClick={() => window.location.hash = ''} style={{ color: t.accent, fontSize: 13, textDecoration: "none", fontWeight: 600 }}>← Home par Wapas</a>
          </div>
        </footer>
      </div>
    </>
  );
}