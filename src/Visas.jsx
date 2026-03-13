// ─── Visas.jsx — Edafay Travel & Tours ──────────────────────────────────────
import { useState, useMemo } from "react";
import theme from './theme.js';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

// ─── Embedded CSS ─────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

@keyframes vsFadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
@keyframes vsFadeIn { from{opacity:0} to{opacity:1} }

.vs-fu  { animation: vsFadeUp 0.7s ease both; }
.vs-fu1 { animation: vsFadeUp 0.7s 0.1s ease both; }
.vs-fu2 { animation: vsFadeUp 0.7s 0.2s ease both; }
.vs-fu3 { animation: vsFadeUp 0.7s 0.3s ease both; }

.vs-page { min-height:100vh; font-family:'DM Sans',sans-serif; overflow-x:hidden; width:100%; }

.vs-hero { position:relative; padding:140px 5% 80px; text-align:center; overflow:hidden; }
.vs-hero-bg {
  position:absolute; inset:0;
  background: radial-gradient(ellipse at 60% 0%, rgba(26,60,110,0.10) 0%, transparent 55%),
              radial-gradient(ellipse at 10% 90%, rgba(76,175,125,0.06) 0%, transparent 50%);
  pointer-events:none;
}
.vs-hero-inner { position:relative; max-width:720px; margin:0 auto; }
.vs-hero-inner h1 { font-family:'Playfair Display',serif; font-size:clamp(38px,5vw,66px); font-weight:700; line-height:1.12; letter-spacing:-1px; margin-bottom:18px; }
.vs-hero-inner p { font-size:16px; line-height:1.8; max-width:520px; margin:0 auto 40px; }
.vs-hero-stats { display:flex; justify-content:center; gap:32px; flex-wrap:wrap; }
.vs-stat { text-align:center; background:rgba(255,255,255,0.7); border:1px solid rgba(0,0,0,0.07); border-radius:16px; padding:16px 24px; backdrop-filter:blur(10px); min-width:90px; transition:all 0.3s; }
.vs-stat:hover { transform:translateY(-3px); border-color:rgba(26,60,110,0.4); }

.vs-divider { height:1px; background:linear-gradient(to right,transparent,rgba(0,0,0,0.08),transparent); }

.vs-search-wrap { position:relative; max-width:480px; margin:0 auto; }
.vs-search-icon { position:absolute; left:18px; top:50%; transform:translateY(-50%); font-size:16px; pointer-events:none; }
.vs-search-input { width:100%; padding:16px 48px; border-radius:50px; border:1.5px solid rgba(0,0,0,0.1); background:rgba(255,255,255,0.9); backdrop-filter:blur(16px); font-family:'DM Sans',sans-serif; font-size:15px; outline:none; box-shadow:0 8px 28px rgba(0,0,0,0.07); transition:all 0.25s; }
.vs-search-input:focus { border-color:#1a3c6e; box-shadow:0 0 0 3px rgba(26,60,110,0.15),0 8px 28px rgba(0,0,0,0.07); }

.vs-filter-bar { display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:28px; flex-wrap:wrap; }
.vs-cats { display:flex; gap:8px; flex-wrap:wrap; }
.vs-cat-btn { padding:8px 18px; border-radius:50px; font-size:13px; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; }
.vs-cat-btn:hover { transform:translateY(-1px); }
.vs-sort-wrap { display:flex; align-items:center; gap:10px; flex-shrink:0; }
.vs-sort-select { padding:9px 14px; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:13px; outline:none; cursor:pointer; }

.vs-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }

.vs-card { border-radius:20px; overflow:hidden; cursor:pointer; transition:transform 0.3s,box-shadow 0.3s; animation:vsFadeUp 0.6s ease both; }
.vs-card:hover { transform:translateY(-7px); box-shadow:0 28px 56px rgba(0,0,0,0.11); }
.vs-card-img-wrap { position:relative; height:180px; overflow:hidden; }
.vs-card-img { width:100%; height:100%; object-fit:cover; transition:transform 0.5s; }
.vs-card:hover .vs-card-img { transform:scale(1.07); }
.vs-card-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,0.6) 0%,transparent 55%); }
.vs-card-flag { position:absolute; top:14px; right:14px; font-size:32px; filter:drop-shadow(0 2px 6px rgba(0,0,0,0.3)); }
.vs-card-type { position:absolute; top:14px; left:14px; backdrop-filter:blur(8px); color:#fff; font-size:10px; font-weight:700; padding:3px 10px; border-radius:20px; text-transform:uppercase; letter-spacing:0.5px; }
.vs-card-country-name { position:absolute; bottom:14px; left:14px; }

.vs-card-body { padding:16px 18px 18px; }
.vs-card-meta { display:flex; gap:8px; align-items:center; margin-bottom:12px; flex-wrap:wrap; }
.vs-meta-pill { display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:600; padding:4px 10px; border-radius:20px; }
.vs-fee-table { width:100%; border-collapse:collapse; margin-bottom:14px; }
.vs-fee-table th { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; padding:6px 8px; text-align:left; }
.vs-fee-table td { font-size:12px; padding:6px 8px; border-top:1px solid rgba(0,0,0,0.05); }
.vs-fee-table tr:hover td { background:rgba(26,60,110,0.05); }
.vs-processing { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; }
.vs-card-btn { width:100%; padding:12px; border-radius:50px; border:none; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:all 0.25s; }
.vs-card-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(26,60,110,0.35); }

.vs-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.65); backdrop-filter:blur(8px); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; animation:vsFadeIn 0.3s ease; }
.vs-modal { border-radius:24px; overflow:hidden; width:100%; max-width:620px; max-height:92vh; overflow-y:auto; position:relative; animation:vsFadeUp 0.4s ease both; }
.vs-modal-close { position:absolute; top:14px; right:14px; background:rgba(255,255,255,0.92); border:none; width:36px; height:36px; border-radius:50%; font-size:15px; cursor:pointer; z-index:10; display:flex; align-items:center; justify-content:center; transition:all 0.2s; box-shadow:0 2px 8px rgba(0,0,0,0.12); }
.vs-modal-close:hover { transform:scale(1.08); background:#fff; }
.vs-modal-hero { position:relative; height:200px; }
.vs-modal-hero img { width:100%; height:100%; object-fit:cover; }
.vs-modal-hero-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,0.75) 0%,transparent 50%); }
.vs-modal-hero-text { position:absolute; bottom:20px; left:22px; }
.vs-modal-body { padding:24px; }
.vs-section { margin-bottom:22px; }
.vs-section-title { font-size:15px; font-weight:700; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid rgba(0,0,0,0.07); }

.vs-req-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
.vs-req-item { display:flex; align-items:flex-start; gap:10px; padding:12px 14px; border-radius:12px; }

.vs-fee-modal-table { width:100%; border-collapse:collapse; border-radius:12px; overflow:hidden; }
.vs-fee-modal-table th { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; padding:10px 14px; text-align:left; }
.vs-fee-modal-table td { font-size:13px; padding:12px 14px; }
.vs-fee-modal-table tr:not(:last-child) td { border-bottom:1px solid rgba(0,0,0,0.06); }

.vs-upload-area { border:2px dashed rgba(26,60,110,0.4); border-radius:14px; padding:20px; text-align:center; cursor:pointer; transition:all 0.25s; background:rgba(26,60,110,0.03); }
.vs-upload-area:hover { border-color:#1a3c6e; background:rgba(26,60,110,0.07); }
.vs-upload-list { display:flex; flex-direction:column; gap:8px; margin-top:12px; }
.vs-upload-item { display:flex; align-items:center; justify-content:space-between; padding:8px 12px; border-radius:10px; font-size:12px; }

.vs-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(26,60,110,0.12); border:1px solid rgba(26,60,110,0.3); color:#1a3c6e; font-size:12px; font-weight:600; padding:6px 14px; border-radius:50px; letter-spacing:1px; text-transform:uppercase; margin-bottom:20px; }
.vs-gold { background:linear-gradient(135deg,#1a3c6e,#2a5298,#1a3c6e); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

@media (max-width:1024px) { .vs-grid { grid-template-columns:repeat(2,1fr); } }
@media (max-width:768px) {
  .vs-hero { padding:110px 5% 60px; }
  .vs-grid { grid-template-columns:1fr 1fr; gap:16px; }
  .vs-filter-bar { flex-direction:column; align-items:flex-start; }
  .vs-hero-stats { gap:12px; }
  .vs-stat { padding:12px 16px; min-width:75px; }
  .vs-sort-wrap { width:100%; }
  .vs-sort-select { flex:1; }
  .vs-req-grid { grid-template-columns:1fr; }
}
@media (max-width:560px) {
  .vs-grid { grid-template-columns:1fr; }
  .vs-cats { gap:6px; }
  .vs-cat-btn { padding:7px 13px; font-size:12px; }
}
`;

// ─── Visa Data ─────────────────────────────────────────────────────────────────
const visas = [
  {
    id: 1,
    country: "Malaysia",
    flag: "🇲🇾",
    type: "Tourist",
    img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&q=80",
    processing: "3-5 Working Days",
    validity: "30 Days",
    approvalRate: "99%",
    urgent: true,
    fees: [
      { category: "Single Entry", fee: "PKR 8,500" },
      { category: "Multiple Entry", fee: "PKR 14,000" },
    ],
    requirements: [
      { icon: "", label: "Passport (6 months valid)" },
      { icon: "", label: "Passport Size Photo (2x)" },
      { icon: "", label: "Bank Statement (6 months)" },
      { icon: "", label: "Employment Letter / NOC" },
    ],
    notes: "Malaysia visa is easy to obtain. Students require university enrollment letter. Self-employed need business registration.",
  },
  {
    id: 2,
    country: "UAE (Dubai)",
    flag: "🇦🇪",
    type: "Tourist",
    img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
    processing: "2-4 Working Days",
    validity: "30 / 60 Days",
    approvalRate: "98%",
    urgent: true,
    fees: [
      { category: "30 Days Single", fee: "PKR 22,000" },
      { category: "60 Days Single", fee: "PKR 35,000" },
      { category: "90 Days Multiple", fee: "PKR 55,000" },
    ],
    requirements: [
      { icon: "📘", label: "Passport (6 months valid)" },
      { icon: "🖼️", label: "Passport Size Photo (White BG)" },
      { icon: "🎫", label: "Confirmed Return Ticket" },
      { icon: "🏨", label: "Hotel Booking Confirmation" },
      { icon: "💳", label: "Bank Statement (Min 50K PKR)" },
      { icon: "💼", label: "Salary Slip / Business Proof" },
    ],
    notes: "UAE visa rejection rate is low for Pakistani applicants. Sufficient funds (minimum PKR 50,000) must be shown in bank account.",
  },
  {
    id: 3,
    country: "Turkey",
    flag: "🇹🇷",
    type: "Tourist / e-Visa",
    img: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600&q=80",
    processing: "1-3 Working Days",
    validity: "30 Days",
    approvalRate: "97%",
    urgent: false,
    fees: [
      { category: "Single Entry e-Visa", fee: "PKR 12,000" },
      { category: "Multiple Entry", fee: "PKR 20,000" },
    ],
    requirements: [
      { icon: "📘", label: "Valid Passport" },
      { icon: "🖼️", label: "Digital Passport Photo" },
      { icon: "📧", label: "Valid Email Address" },
      { icon: "💳", label: "Credit/Debit Card (for e-Visa fee)" },
      { icon: "🎫", label: "Return Air Ticket" },
      { icon: "🏨", label: "Accommodation Proof" },
    ],
    notes: "Turkey e-Visa is fully online. No embassy visit required. Processing is usually within 24 hours. Highly recommended destination.",
  },
  {
    id: 4,
    country: "Azerbaijan",
    flag: "🇦🇿",
    type: "Tourist / e-Visa",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    processing: "3 Working Days",
    validity: "30 Days",
    approvalRate: "98%",
    urgent: false,
    fees: [
      { category: "Single Entry e-Visa", fee: "PKR 9,500" },
    ],
    requirements: [
      { icon: "📘", label: "Passport (6 months valid)" },
      { icon: "🖼️", label: "Digital Photo" },
      { icon: "📧", label: "Email Address" },
      { icon: "💳", label: "Online Payment Card" },
      { icon: "🎫", label: "Return Ticket" },
      { icon: "🏨", label: "Hotel Reservation" },
    ],
    notes: "Azerbaijan ASAN Visa is one of the easiest e-visas. Pakistani passport holders enjoy high approval rates. Baku is a budget-friendly destination.",
  },
  {
    id: 5,
    country: "Thailand",
    flag: "🇹🇭",
    type: "Tourist",
    img: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&q=80",
    processing: "5-7 Working Days",
    validity: "60 Days",
    approvalRate: "95%",
    urgent: true,
    fees: [
      { category: "Single Entry", fee: "PKR 15,000" },
      { category: "Double Entry", fee: "PKR 24,000" },
    ],
    requirements: [
      { icon: "📘", label: "Passport (6 months valid)" },
      { icon: "🖼️", label: "Passport Photo (3.5x4.5 cm)" },
      { icon: "📝", label: "Visa Application Form" },
      { icon: "💳", label: "Bank Statement (3 months)" },
      { icon: "🎫", label: "Confirmed Return Ticket" },
      { icon: "🏨", label: "Hotel Booking Proof" },
    ],
    notes: "Thailand requires in-person or courier submission at Thai Embassy Islamabad. Financial proof of PKR 25,000 minimum per person required.",
  },
  {
    id: 6,
    country: "Kazakhstan",
    flag: "🇰🇿",
    type: "Tourist / e-Visa",
    img: "https://images.unsplash.com/photo-1605217613423-0aea4fb32906?w=600&q=80",
    processing: "5 Working Days",
    validity: "30 Days",
    approvalRate: "97%",
    urgent: false,
    fees: [
      { category: "Single Entry e-Visa", fee: "PKR 7,500" },
    ],
    requirements: [
      { icon: "📘", label: "Passport (6 months valid)" },
      { icon: "🖼️", label: "Digital Photo" },
      { icon: "📧", label: "Email Address" },
      { icon: "💳", label: "Online Payment" },
      { icon: "🎫", label: "Return Ticket" },
      { icon: "🏨", label: "Hotel Booking" },
    ],
    notes: "Kazakhstan e-visa is budget-friendly. Almaty and Nur-Sultan are growing tourist destinations. Pakistani nationals enjoy visa-on-arrival friendly policies.",
  },
  {
    id: 7,
    country: "Maldives",
    flag: "🇲🇻",
    type: "Visa On Arrival",
    img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80",
    processing: "On Arrival",
    validity: "30 Days",
    approvalRate: "100%",
    urgent: false,
    fees: [
      { category: "Visa on Arrival (Free)", fee: "PKR 0" },
      { category: "Service / Handling Fee", fee: "PKR 3,500" },
    ],
    requirements: [
      { icon: "📘", label: "Passport (6 months valid)" },
      { icon: "🖼️", label: "Passport Size Photo" },
      { icon: "💳", label: "Bank Statement / Credit Card" },
      { icon: "🎫", label: "Return Ticket" },
      { icon: "🏨", label: "Hotel / Resort Booking" },
    ],
    notes: "Maldives gives FREE visa on arrival to all Pakistani nationals. No prior application needed. Just carry hotel booking and return ticket.",
  },
  {
    id: 8,
    country: "Saudi Arabia",
    flag: "🇸🇦",
    type: "Tourist / Umrah",
    img: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80",
    processing: "7-10 Working Days",
    validity: "90 Days",
    approvalRate: "96%",
    urgent: true,
    fees: [
      { category: "Tourist Visa", fee: "PKR 28,000" },
      { category: "Umrah Visa (included)", fee: "Package Price" },
      { category: "Business Visa", fee: "PKR 40,000" },
    ],
    requirements: [
      { icon: "📘", label: "Passport (6 months valid)" },
      { icon: "🖼️", label: "Passport Photo (White BG)" },
      { icon: "📝", label: "Visa Application Form" },
      { icon: "💳", label: "Bank Statement (6 months)" },
      { icon: "🎫", label: "Confirmed Return Ticket" },
      { icon: "🏨", label: "Hotel Booking in KSA" },
      { icon: "💼", label: "Employment Certificate / NOC" },
      { icon: "💍", label: "For Women: Mahram Documents" },
    ],
    notes: "Saudi tourist visa allows multiple entries. Women under 45 can now travel without mahram for tourist visa. Umrah visa is included in our packages.",
  },
];

const categories = ["All", "Tourist", "e-Visa", "Visa On Arrival", "Umrah"];

// ─── Booking Form with File Upload ────────────────────────────────────────────
function VisaBookingForm({ visa, onClose }) {
  const [form, setForm]         = useState({ name: "", phone: "", email: "", city: "", message: "", urgent: false });
  const [files, setFiles]       = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (newFiles) => {
    const validFiles = Array.from(newFiles).filter(f => f.size < 5 * 1024 * 1024);
    setFiles(prev => [...prev, ...validFiles].slice(0, 6));
  };

  const removeFile = (idx) => setFiles(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.city) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1500);
  };

  if (submitted) return (
    <div style={{ textAlign: "center", padding: "24px 0" }}>
      <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: theme.text, marginBottom: 10 }}>
        Your Application Has Been Submitted!
      </h3>
      <p style={{ color: theme.textMuted, lineHeight: 1.7, marginBottom: 8 }}>
        We're Received your<strong style={{ color: theme.accent }}>{visa.country} Visa</strong> application.
      </p>
      <p style={{ color: theme.textMuted, lineHeight: 1.7, marginBottom: 24, fontSize: 13 }}>
        Our team will review your documents and get in touch with you within <strong>24 hours</strong>.
      </p>
      <button onClick={onClose} style={{ background: theme.accent, color: "#ffffff", border: "none", padding: "12px 32px", borderRadius: 50, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
        Back
      </button>
    </div>
  );

  const inputStyle = { width: "100%", padding: "12px 16px", borderRadius: 12, fontSize: 14, border: "1.5px solid rgba(0,0,0,0.1)", outline: "none", fontFamily: "'DM Sans',sans-serif", background: "rgba(255,255,255,0.9)", boxSizing: "border-box", transition: "border-color 0.2s" };
  const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "rgba(26,26,46,0.45)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.8px" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Selected visa info */}
      <div style={{ background: "rgba(26,60,110,0.08)", border: "1px solid rgba(26,60,110,0.25)", borderRadius: 12, padding: "12px 16px" }}>
        <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 2 }}>Visa Application For</div>
        <div style={{ fontWeight: 700, color: theme.accent, fontSize: 16 }}>{visa.flag} {visa.country} — {visa.type} Visa</div>
        <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>Processing: {visa.processing} • Validity: {visa.validity}</div>
      </div>

      {/* Urgent option */}
      {visa.urgent && (
        <div
          onClick={() => setForm({ ...form, urgent: !form.urgent })}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, cursor: "pointer", border: form.urgent ? "1.5px solid #ef4444" : "1.5px solid rgba(0,0,0,0.08)", background: form.urgent ? "rgba(239,68,68,0.05)" : "transparent", transition: "all 0.2s" }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, border: form.urgent ? "none" : "2px solid rgba(0,0,0,0.2)", background: form.urgent ? "#ef4444" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
            {form.urgent && <span style={{ color: "#fff", fontSize: 12 }}>✓</span>}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: form.urgent ? "#ef4444" : theme.text }}>⚡ Urgent Processing</div>
            <div style={{ fontSize: 11, color: theme.textMuted }}>Priority handling — Extra charges may apply</div>
          </div>
        </div>
      )}

      {/* Name + Phone */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div><label style={labelStyle}>Full Name *</label>
          <input placeholder="Ahmed Khan" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle}
            onFocus={e => e.target.style.borderColor = theme.accent} onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.1)"} />
        </div>
        <div><label style={labelStyle}>Phone *</label>
          <input placeholder="+92 300 0000000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle}
            onFocus={e => e.target.style.borderColor = theme.accent} onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.1)"} />
        </div>
      </div>

      {/* Email + City */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div><label style={labelStyle}>Email <span style={{ textTransform: "none", fontWeight: 400 }}>(Optional)</span></label>
          <input type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle}
            onFocus={e => e.target.style.borderColor = theme.accent} onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.1)"} />
        </div>
        <div><label style={labelStyle}>City *</label>
          <input placeholder="Lahore / Karachi" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={inputStyle}
            onFocus={e => e.target.style.borderColor = theme.accent} onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.1)"} />
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label style={{ ...labelStyle, marginBottom: 8 }}>
          📁 Documents Upload <span style={{ textTransform: "none", fontWeight: 400 }}>(Passport, Photo, Bank Statement — max 5MB each)</span>
        </label>
        <div
          className="vs-upload-area"
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => document.getElementById('vs-file-input').click()}
          style={{ borderColor: dragOver ? "#1a3c6e" : "rgba(26,60,110,0.4)", background: dragOver ? "rgba(26,60,110,0.1)" : "rgba(26,60,110,0.03)" }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, marginBottom: 4 }}>
            Drag and drop files here, or click to upload
          </div>
          <div style={{ fontSize: 12, color: theme.textMuted }}>
            PDF, JPG, PNG support • Max 6 files • 5MB each
          </div>
          <input
            id="vs-file-input" type="file" multiple accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: "none" }}
            onChange={e => handleFiles(e.target.files)}
          />
        </div>

        {/* Uploaded files list */}
        {files.length > 0 && (
          <div className="vs-upload-list">
            {files.map((file, i) => (
              <div key={i} className="vs-upload-item"
                style={{ background: theme.bgCard, border: `1px solid ${theme.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>{file.name.endsWith('.pdf') ? '📄' : '🖼️'}</span>
                  <div>
                    <div style={{ fontWeight: 600, color: theme.text, fontSize: 12 }}>{file.name.length > 30 ? file.name.substring(0, 30) + '...' : file.name}</div>
                    <div style={{ color: theme.textMuted, fontSize: 11 }}>{(file.size / 1024).toFixed(0)} KB</div>
                  </div>
                </div>
                <button onClick={() => removeFile(i)}
                  style={{ background: "rgba(239,68,68,0.1)", border: "none", color: "#ef4444", borderRadius: 8, padding: "4px 10px", fontSize: 12, cursor: "pointer", fontWeight: 700 }}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message */}
      <div><label style={labelStyle}>Message <span style={{ textTransform: "none", fontWeight: 400 }}>(Optional)</span></label>
        <textarea rows={2} placeholder="Have Any Questions or Requests..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
          style={{ ...inputStyle, resize: "none" }}
          onFocus={e => e.target.style.borderColor = theme.accent} onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.1)"} />
      </div>

      {/* Submit */}
      <button onClick={handleSubmit} disabled={loading || !form.name || !form.phone || !form.city}
        style={{ background: (!form.name || !form.phone || !form.city) ? "rgba(26,60,110,0.35)" : theme.accent, color: "#ffffff", border: "none", padding: "15px", borderRadius: 50, fontSize: 15, fontWeight: 700, width: "100%", cursor: (!form.name || !form.phone || !form.city) ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.25s" }}>
        {loading ? "⏳ Application jama ho rahi hai..." : "Submit Visa Application"}
      </button>
      <p style={{ fontSize: 11, color: theme.textMuted, textAlign: "center", margin: 0 }}>
        🔒 Your information is safe — Edafay never share your Information with third party.
      </p>
    </div>
  );
}

// ─── Visa Detail Modal ─────────────────────────────────────────────────────────
function VisaModal({ visa, onClose }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="vs-modal-overlay" onClick={onClose}>
      <div className="vs-modal" onClick={e => e.stopPropagation()}
        style={{ background: theme.bg, border: `1px solid ${theme.border}` }}>
        <button className="vs-modal-close" onClick={onClose} style={{ color: theme.text }}>✕</button>

        {/* Hero */}
        <div className="vs-modal-hero">
          <img src={visa.img} alt={visa.country} />
          <div className="vs-modal-hero-overlay" />
          <div className="vs-modal-hero-text">
            <div style={{ fontSize: 40, marginBottom: 6 }}>{visa.flag}</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
              {visa.country}
            </h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ background: theme.accent, color: "#ffffff", fontSize: 11, fontWeight: 800, padding: "3px 12px", borderRadius: 20 }}>{visa.type}</span>
              <span style={{ background: "rgba(34,197,94,0.85)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20 }}>✅ {visa.approvalRate} Approval</span>
            </div>
          </div>
        </div>

        <div className="vs-modal-body">
          {!showForm ? (
            <>
              {/* Quick Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24 }}>
                {[["⏱", "Processing", visa.processing], ["📅", "Validity", visa.validity], ["✅", "Approval Rate", visa.approvalRate]].map(([icon, lbl, val]) => (
                  <div key={lbl} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "12px", textAlign: "center" }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
                    <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 3 }}>{lbl}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: theme.accent }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Fee Table */}
              <div className="vs-section">
                <h3 className="vs-section-title" style={{ color: theme.text }}>Visa Fee</h3>
                <table className="vs-fee-modal-table" style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden", width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(26,60,110,0.1)" }}>
                      <th style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", padding: "10px 16px", textAlign: "left", color: theme.textMuted }}>Category</th>
                      <th style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", padding: "10px 16px", textAlign: "right", color: theme.textMuted }}>Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visa.fees.map((f, i) => (
                      <tr key={i}>
                        <td style={{ fontSize: 13, padding: "12px 16px", color: theme.text, borderTop: "1px solid rgba(0,0,0,0.05)" }}>{f.category}</td>
                        <td style={{ fontSize: 14, padding: "12px 16px", fontWeight: 800, color: theme.accent, textAlign: "right", borderTop: "1px solid rgba(0,0,0,0.05)" }}>{f.fee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Requirements */}
              <div className="vs-section">
                <h3 className="vs-section-title" style={{ color: theme.text }}>Requirements</h3>
                <div className="vs-req-grid">
                  {visa.requirements.map((req, i) => (
                    <div key={i} className="vs-req-item"
                      style={{ background: theme.bgCard, border: `1px solid ${theme.border}` }}>
                      <span style={{ fontSize: 20, flexShrink: 0 }}>{req.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: theme.text, lineHeight: 1.4 }}>{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Note */}
              <div style={{ background: "rgba(26,60,110,0.06)", border: "1px dashed rgba(26,60,110,0.4)", borderRadius: 12, padding: "14px 18px", marginBottom: 24 }}>
                <p style={{ fontSize: 13, color: theme.textMuted, margin: 0, lineHeight: 1.7 }}>
                  <strong style={{ color: theme.accent }}>💡 Important Note:</strong> {visa.notes}
                </p>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button onClick={onClose} style={{ flex: 1, background: "transparent", color: theme.text, border: `1.5px solid ${theme.border}`, padding: "13px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, cursor: "pointer" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.accent; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.text; }}>
                  ← Back
                </button>
                <button onClick={() => setShowForm(true)} style={{ flex: 2, background: theme.accent, color: "#ffffff", border: "none", padding: "13px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(26,60,110,0.4)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                  Apply
                </button>
              </div>
            </>
          ) : (
            <>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: theme.accent, fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 20, padding: 0, fontFamily: "'DM Sans',sans-serif" }}>
                ← Back to Details
              </button>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: theme.text, marginBottom: 20 }}>
                {visa.flag} <span style={{ color: theme.accent }}>{visa.country}</span> Visa Application
              </h3>
              <VisaBookingForm visa={visa} onClose={onClose} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Visa Card ─────────────────────────────────────────────────────────────────
function VisaCard({ visa, onClick }) {
  return (
    <div className="vs-card" onClick={onClick} style={{ background: theme.bgCard, border: `1px solid ${theme.border}` }}>
      <div className="vs-card-img-wrap">
        <img src={visa.img} alt={visa.country} className="vs-card-img" />
        <div className="vs-card-overlay" />
        <span className="vs-card-flag">{visa.flag}</span>
        <span className="vs-card-type" style={{ background: visa.type.includes("Arrival") ? "rgba(34,197,94,0.75)" : visa.type.includes("e-Visa") ? "rgba(59,130,246,0.75)" : "rgba(0,0,0,0.55)" }}>{visa.type}</span>
        <div className="vs-card-country-name">
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>{visa.country}</h3>
        </div>
      </div>

      <div className="vs-card-body">
        {/* Meta Pills */}
        <div className="vs-card-meta">
          <span className="vs-meta-pill" style={{ background: "rgba(26,60,110,0.1)", color: theme.accent, border: "1px solid rgba(26,60,110,0.25)" }}>
            ⏱ {visa.processing}
          </span>
          <span className="vs-meta-pill" style={{ background: "rgba(34,197,94,0.08)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.2)" }}>
            ✅ {visa.approvalRate}
          </span>
          {visa.urgent && (
            <span className="vs-meta-pill" style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
              ⚡ Urgent
            </span>
          )}
        </div>

        {/* Fee Table */}
        <table className="vs-fee-table" style={{ color: theme.text }}>
          <thead>
            <tr style={{ background: "rgba(26,60,110,0.06)" }}>
              <th style={{ color: theme.textMuted }}>Category</th>
              <th style={{ color: theme.textMuted, textAlign: "right" }}>Fee</th>
            </tr>
          </thead>
          <tbody>
            {visa.fees.slice(0, 2).map((f, i) => (
              <tr key={i}>
                <td style={{ color: theme.text }}>{f.category}</td>
                <td style={{ color: theme.accent, fontWeight: 700, textAlign: "right" }}>{f.fee}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Processing + Validity */}
        <div className="vs-processing">
          <span style={{ fontSize: 12, color: theme.textMuted }}>📅 Validity: <strong style={{ color: theme.text }}>{visa.validity}</strong></span>
          <span style={{ fontSize: 12, color: theme.textMuted }}>{visa.requirements.length} docs</span>
        </div>

        <button className="vs-card-btn" style={{ background: theme.accent, color: "#ffffff" }}
          onClick={e => { e.stopPropagation(); onClick(); }}>
          Details & Apply →
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Visas() {
  const [filter,   setFilter]   = useState("All");
  const [search,   setSearch]   = useState("");
  const [sortBy,   setSortBy]   = useState("default");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let list = visas;
    if (search) list = list.filter(v => v.country.toLowerCase().includes(search.toLowerCase()));
    if (filter !== "All") list = list.filter(v => v.type.includes(filter));
    if (sortBy === "price-low")  list = [...list].sort((a, b) => parseInt(a.fees[0].fee.replace(/\D/g, "") || 0) - parseInt(b.fees[0].fee.replace(/\D/g, "") || 0));
    if (sortBy === "price-high") list = [...list].sort((a, b) => parseInt(b.fees[0].fee.replace(/\D/g, "") || 0) - parseInt(a.fees[0].fee.replace(/\D/g, "") || 0));
    if (sortBy === "processing")  list = [...list].sort((a, b) => (a.type.includes("Arrival") ? 0 : 1) - (b.type.includes("Arrival") ? 0 : 1));
    if (sortBy === "approval")   list = [...list].sort((a, b) => parseInt(b.approvalRate) - parseInt(a.approvalRate));
    return list;
  }, [filter, search, sortBy]);

  return (
    <>
      <style>{CSS}</style>
      <div className="vs-page" style={{ background: theme.bg, color: theme.text }}>
        <Navbar />

        {/* Hero */}
        <section className="vs-hero">
          <div className="vs-hero-bg" />
          <div className="vs-hero-inner">

            <h1 className="vs-fu1" style={{ color: theme.text }}>
              Get your <span className="vs-gold">Visa</span> Hassle-free
            </h1>
            <p className="vs-fu2" style={{ color: theme.textMuted }}>
              Tourist visa services from Pakistan for 8+ countries with fast processing and a high approval rate. From documentation to application submission, Edafay handles the entire process for you.
            </p>

            {/* Search Bar */}
            <div className="vs-search-wrap vs-fu3">
              <span className="vs-search-icon">🔍</span>
              <input
                className="vs-search-input"
                placeholder="Search Country — Malaysia, Dubai, Turkey..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="vs-search-clear" onClick={() => setSearch("")}
                  style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", fontSize: 14, cursor: "pointer", color: "#999" }}>✕</button>
              )}
            </div>


          </div>
        </section>

        <div className="vs-divider" />

        {/* Filter + Grid */}
        <section style={{ padding: "60px 5%" }}>
          <div className="vs-filter-bar">
            <div className="vs-cats">
              {categories.map(c => (
                <button key={c} onClick={() => setFilter(c)} className="vs-cat-btn"
                  style={{ background: filter === c ? theme.accent : "rgba(0,0,0,0.04)", color: filter === c ? "#ffffff" : theme.textMuted, border: filter === c ? "none" : `1px solid ${theme.border}` }}>
                  {c}
                </button>
              ))}
            </div>
            <div className="vs-sort-wrap">
              <span style={{ fontSize: 13, color: theme.textMuted, whiteSpace: "nowrap" }}>Sort:</span>
              <select className="vs-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ color: theme.text, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
                <option value="default">Default</option>
                <option value="price-low">Fee: Low → High</option>
                <option value="price-high">Fee: High → Low</option>
                <option value="processing">Fastest Processing</option>
                <option value="approval">Highest Approval</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 28, fontSize: 14, color: theme.textMuted }}>
            <span style={{ color: theme.accent, fontWeight: 700 }}>{filtered.length}</span> visas available
            {search && <span> for "<strong>{search}</strong>"</span>}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: theme.text, marginBottom: 8 }}>Koi nateeja nahi mila</h3>
              <p style={{ color: theme.textMuted }}>Try another country or filter</p>
              <button onClick={() => { setSearch(""); setFilter("All"); }} style={{ marginTop: 16, background: theme.accent, color: "#ffffff", border: "none", padding: "10px 24px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, cursor: "pointer" }}>
                Reset Karein
              </button>
            </div>
          ) : (
            <div className="vs-grid">
              {filtered.map(visa => (
                <VisaCard key={visa.id} visa={visa} onClick={() => setSelected(visa)} />
              ))}
            </div>
          )}

          {/* Bottom note */}
          <div style={{ marginTop: 48, background: "rgba(26,60,110,0.06)", border: "1px dashed rgba(26,60,110,0.35)", borderRadius: 14, padding: "18px 24px", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: theme.textMuted, margin: 0, lineHeight: 1.7 }}>
              <strong style={{ color: theme.accent }}>📌 Note:</strong> All visa fees and requirements may change, contact our team for final confirmation. Fees are subject to embassy regulations.
            </p>
          </div>
        </section>

        {selected && <VisaModal visa={selected} onClose={() => setSelected(null)} />}

        <Footer />
      </div>
    </>
  );
}