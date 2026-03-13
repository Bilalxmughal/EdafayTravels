// ─── CarRental.jsx — Edafay Travel & Tours ──────────────────────────────────
import { useState, useMemo } from "react";
import theme from './theme.js';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

@keyframes crFadeUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
@keyframes crFadeIn  { from{opacity:0} to{opacity:1} }
@keyframes crSpin    { to{transform:rotate(360deg)} }
@keyframes shimmer   { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

.cr-page { min-height:100vh; font-family:'DM Sans',sans-serif; overflow-x:hidden; }

/* ── Hero ── */
.cr-hero {
  position:relative; padding:130px 5% 70px; text-align:center; overflow:hidden;
  background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(26,60,110,0.12), transparent);
}
.cr-hero h1 {
  font-family:'Playfair Display',serif;
  font-size:clamp(36px,5.5vw,68px);
  font-weight:700; line-height:1.1; letter-spacing:-1.5px; margin-bottom:16px;
  animation: crFadeUp 0.7s ease both;
}
.cr-hero p {
  font-size:16px; line-height:1.8; max-width:520px;
  margin:0 auto 0; animation: crFadeUp 0.7s 0.1s ease both;
}
.cr-gold {
  background:linear-gradient(135deg,#1a3c6e 0%,#4a7fd4 50%,#1a3c6e 100%);
  background-size:200% auto;
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  animation: shimmer 4s linear infinite;
}
.cr-divider { height:1px; background:linear-gradient(to right,transparent,rgba(0,0,0,0.07),transparent); }

/* ── Filter Bar ── */
.cr-filter-bar {
  background:#fff;
  border:1px solid rgba(0,0,0,0.07);
  border-radius:20px;
  padding:20px 24px;
  margin-bottom:28px;
  box-shadow:0 2px 20px rgba(0,0,0,0.04);
  display:flex; flex-direction:column; gap:16px;
}
.cr-filter-row {
  display:flex; align-items:center; gap:12px; flex-wrap:wrap;
}
.cr-filter-label-inline {
  font-size:11px; font-weight:700; color:rgba(26,26,46,0.4);
  text-transform:uppercase; letter-spacing:0.8px;
  white-space:nowrap; min-width:70px;
}
.cr-chips { display:flex; gap:6px; flex-wrap:wrap; }
.cr-chip {
  padding:6px 15px; border-radius:8px;
  font-size:12px; font-weight:600;
  cursor:pointer; font-family:'DM Sans',sans-serif;
  transition:all 0.18s;
  border:1.5px solid rgba(0,0,0,0.08);
  background:#fafafa; color:rgba(26,26,46,0.55);
  letter-spacing:0.2px;
}
.cr-chip:hover { border-color:rgba(26,60,110,0.35); color:#1a3c6e; background:#f0f4fa; }
.cr-chip-active {
  background:#1a3c6e !important; color:#fff !important;
  border-color:#1a3c6e !important;
  box-shadow:0 4px 14px rgba(26,60,110,0.28);
}
.cr-filter-divider { height:1px; background:rgba(0,0,0,0.05); margin:0 -4px; }

/* Sort row */
.cr-sort-row {
  display:flex; justify-content:space-between; align-items:center;
  margin-bottom:24px; flex-wrap:wrap; gap:12px;
}
.cr-count-badge {
  display:inline-flex; align-items:center; gap:8px;
  font-size:13px; color:rgba(26,26,46,0.5);
}
.cr-count-num {
  font-size:15px; font-weight:800; color:#1a3c6e;
  font-family:'Playfair Display',serif;
}
.cr-sort-group { display:flex; align-items:center; gap:8px; }
.cr-sort-label { font-size:12px; color:rgba(26,26,46,0.4); font-weight:600; }
.cr-sort-select {
  padding:8px 14px; border-radius:10px;
  font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600;
  outline:none; cursor:pointer;
  border:1.5px solid rgba(0,0,0,0.08);
  background:#fafafa; color:#1a1a2e;
  transition:border 0.2s;
}
.cr-sort-select:focus { border-color:#1a3c6e; }
.cr-reset-btn {
  display:inline-flex; align-items:center; gap:5px;
  background:rgba(239,68,68,0.07); border:1px solid rgba(239,68,68,0.2);
  color:#dc2626; padding:6px 12px; border-radius:8px;
  font-size:11px; font-weight:700; cursor:pointer;
  font-family:'DM Sans',sans-serif; transition:all 0.18s;
}
.cr-reset-btn:hover { background:rgba(239,68,68,0.12); }

/* ── Cards ── */
.cr-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
.cr-card {
  border-radius:18px; overflow:hidden; cursor:pointer;
  transition:transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s;
  animation:crFadeUp 0.55s ease both;
  border:1px solid rgba(0,0,0,0.07);
}
.cr-card:hover { transform:translateY(-6px); box-shadow:0 24px 48px rgba(0,0,0,0.10); }
.cr-card-img-wrap { position:relative; height:195px; overflow:hidden; }
.cr-card-img { width:100%; height:100%; object-fit:cover; transition:transform 0.5s; }
.cr-card:hover .cr-card-img { transform:scale(1.06); }
.cr-card-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,0.45) 0%,transparent 55%); }

/* Top badges */
.cr-badge-top-left {
  position:absolute; top:10px; left:10px;
  backdrop-filter:blur(8px); color:#fff;
  font-size:10px; font-weight:700; padding:4px 10px;
  border-radius:6px; text-transform:uppercase; letter-spacing:0.4px;
}
.cr-badge-top-right {
  position:absolute; top:10px; right:10px;
  background:rgba(255,255,255,0.15); backdrop-filter:blur(8px);
  border:1px solid rgba(255,255,255,0.25); color:#fff;
  font-size:10px; font-weight:700; padding:4px 10px; border-radius:6px;
}
.cr-avail {
  position:absolute; bottom:10px; left:10px;
  font-size:10px; font-weight:800; padding:4px 10px; border-radius:6px;
}
.cr-card-name-overlay {
  position:absolute; bottom:10px; right:12px;
  font-family:'Playfair Display',serif; font-size:13px; font-weight:700; color:#fff;
  text-shadow:0 1px 4px rgba(0,0,0,0.4);
}
.cr-card-body { padding:14px 16px 16px; }
.cr-company { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:3px; }
.cr-card-name { font-size:15px; font-weight:700; margin-bottom:10px; }

/* Spec pills */
.cr-specs { display:flex; gap:5px; flex-wrap:wrap; margin-bottom:12px; padding-bottom:12px; }
.cr-spec-pill {
  display:inline-flex; align-items:center; gap:3px;
  font-size:10px; font-weight:600; padding:3px 9px; border-radius:6px;
}
.cr-card-footer {
  display:flex; justify-content:space-between; align-items:center;
  padding-top:12px; border-top:1px solid rgba(0,0,0,0.06);
}
.cr-card-btn {
  padding:9px 18px; border-radius:8px; border:none;
  font-family:'DM Sans',sans-serif; font-size:12px; font-weight:700;
  cursor:pointer; transition:all 0.22s; letter-spacing:0.2px;
}
.cr-card-btn:hover { transform:translateY(-1px); }

/* ── Modal ── */
.cr-modal-overlay {
  position:fixed; inset:0; background:rgba(0,0,0,0.6);
  backdrop-filter:blur(10px); z-index:200;
  display:flex; align-items:center; justify-content:center;
  padding:20px; animation:crFadeIn 0.25s ease;
}
.cr-modal {
  border-radius:22px; overflow:hidden; width:100%;
  max-width:620px; max-height:92vh; overflow-y:auto;
  position:relative; animation:crFadeUp 0.35s ease both;
}
.cr-modal-close {
  position:absolute; top:12px; right:12px;
  background:rgba(255,255,255,0.9); backdrop-filter:blur(8px);
  border:none; width:34px; height:34px; border-radius:50%;
  font-size:15px; cursor:pointer; z-index:10;
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 2px 10px rgba(0,0,0,0.15); transition:all 0.2s;
}
.cr-modal-close:hover { transform:scale(1.1); }
.cr-modal-hero { position:relative; height:215px; }
.cr-modal-hero img { width:100%; height:100%; object-fit:cover; }
.cr-modal-hero-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,0.72) 0%,transparent 55%); }
.cr-modal-hero-text { position:absolute; bottom:18px; left:20px; }
.cr-modal-body { padding:22px 24px; }
.cr-section { margin-bottom:20px; }
.cr-section-title { font-size:14px; font-weight:700; margin-bottom:11px; padding-bottom:7px; border-bottom:1px solid rgba(0,0,0,0.06); }

/* Form inputs */
.cr-input {
  width:100%; padding:12px 14px; border-radius:10px; font-size:13px;
  border:1.5px solid rgba(0,0,0,0.09); outline:none;
  font-family:'DM Sans',sans-serif; background:#fff;
  box-sizing:border-box; transition:border-color 0.2s,box-shadow 0.2s; color:#1a1a2e;
}
.cr-input:focus { border-color:#1a3c6e; box-shadow:0 0 0 3px rgba(26,60,110,0.09); }
.cr-input::placeholder { color:rgba(26,26,46,0.28); }
.cr-label { display:block; font-size:10px; font-weight:700; color:rgba(26,26,46,0.4); margin-bottom:5px; text-transform:uppercase; letter-spacing:0.8px; }
.cr-fetch-wrap { display:flex; }
.cr-fetch-wrap .cr-input { border-radius:10px 0 0 10px; border-right:none; }
.cr-fetch-btn {
  padding:0 14px; border-radius:0 10px 10px 0;
  border:1.5px solid rgba(26,60,110,0.35); border-left:none;
  background:rgba(26,60,110,0.07); color:#1a3c6e;
  font-size:11px; font-weight:700; cursor:pointer;
  font-family:'DM Sans',sans-serif; white-space:nowrap;
  display:flex; align-items:center; gap:4px; flex-shrink:0;
  transition:background 0.2s;
}
.cr-fetch-btn:hover { background:rgba(26,60,110,0.14); }
.cr-fetch-btn:disabled { opacity:0.5; cursor:not-allowed; }
.cr-spin { animation:crSpin 1s linear infinite; display:inline-block; }
.cr-submit-btn {
  background:#1a3c6e; color:#fff; border:none; padding:14px;
  border-radius:12px; font-size:14px; font-weight:700; width:100%;
  cursor:pointer; font-family:'DM Sans',sans-serif;
  transition:all 0.25s; letter-spacing:0.3px;
}
.cr-submit-btn:hover { background:#2a5298; transform:translateY(-2px); box-shadow:0 10px 30px rgba(26,60,110,0.3); }
.cr-submit-btn:disabled { opacity:0.4; cursor:not-allowed; transform:none; box-shadow:none; }

/* ── Responsive ── */
@media (max-width:1024px) { .cr-grid { grid-template-columns:repeat(2,1fr); } }
@media (max-width:768px) {
  .cr-hero { padding:100px 5% 50px; }
  .cr-grid { grid-template-columns:1fr 1fr; gap:14px; }
  .cr-filter-row { gap:8px; }
  .cr-filter-label-inline { min-width:55px; font-size:10px; }
  .cr-filter-bar { padding:16px; }
}
@media (max-width:540px) {
  .cr-grid { grid-template-columns:1fr; }
  .cr-filter-row { flex-wrap:wrap; }
}
`;

const cars = [
  { id:1,  name:"Suzuki Alto VXR",         company:"Suzuki",  type:"Hatchback",   seaters:4,  img:"https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&q=80", pricePerDay:"PKR 3,500",  transmission:"Manual",    fuel:"Petrol",     ac:true,  tag:"Budget Pick",   available:true  },
  { id:2,  name:"KIA Picanto MT",           company:"KIA",     type:"Hatchback",   seaters:4,  img:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80", pricePerDay:"PKR 4,000",  transmission:"Automatic", fuel:"Petrol",     ac:true,  tag:"Popular",       available:true  },
  { id:3,  name:"Suzuki Wagon R VXL",       company:"Suzuki",  type:"Hatchback",   seaters:4,  img:"https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=600&q=80", pricePerDay:"PKR 3,800",  transmission:"Manual",    fuel:"CNG/Petrol", ac:true,  tag:"Best Value",    available:true  },
  { id:4,  name:"Toyota Corolla GLI",       company:"Toyota",  type:"Sedan",       seaters:6,  img:"https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&q=80", pricePerDay:"PKR 6,500",  transmission:"Manual",    fuel:"Petrol",     ac:true,  tag:"Most Booked",   available:true  },
  { id:5,  name:"Honda City Aspire",        company:"Honda",   type:"Sedan",       seaters:6,  img:"https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=80", pricePerDay:"PKR 7,000",  transmission:"Automatic", fuel:"Petrol",     ac:true,  tag:"Comfortable",   available:true  },
  { id:6,  name:"Honda Civic RS Turbo",     company:"Honda",   type:"Sedan",       seaters:6,  img:"https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=600&q=80", pricePerDay:"PKR 10,000", transmission:"Automatic", fuel:"Petrol",     ac:true,  tag:"Luxury Sedan",  available:true  },
  { id:7,  name:"Hyundai Elantra 2024",     company:"Hyundai", type:"Sedan",       seaters:6,  img:"https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80", pricePerDay:"PKR 8,500",  transmission:"Automatic", fuel:"Petrol",     ac:true,  tag:"Premium",       available:false },
  { id:8,  name:"Changan Alsvin DCT",       company:"Changan", type:"Sedan",       seaters:6,  img:"https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=600&q=80", pricePerDay:"PKR 5,500",  transmission:"Automatic", fuel:"Petrol",     ac:true,  tag:"New Model",     available:true  },
  { id:9,  name:"Toyota Fortuner Sigma 4",  company:"Toyota",  type:"SUV",         seaters:6,  img:"https://images.unsplash.com/photo-1519641471654-76ce0107ad5b?w=600&q=80", pricePerDay:"PKR 18,000", transmission:"Automatic", fuel:"Diesel",     ac:true,  tag:"Top Seller",    available:true  },
  { id:10, name:"KIA Sportage AWD",         company:"KIA",     type:"SUV",         seaters:6,  img:"https://images.unsplash.com/photo-1605559424843-9073730702a9?w=600&q=80", pricePerDay:"PKR 14,000", transmission:"Automatic", fuel:"Petrol",     ac:true,  tag:"Trending",      available:true  },
  { id:11, name:"MG HS Turbo 1.5T",         company:"MG",      type:"SUV",         seaters:6,  img:"https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&q=80", pricePerDay:"PKR 12,000", transmission:"Automatic", fuel:"Petrol",      ac:true,  tag:"Modern",        available:true  },
  { id:12, name:"Hyundai Tucson AWD",       company:"Hyundai", type:"SUV",         seaters:6,  img:"https://images.unsplash.com/photo-1575650772417-e71382e40895?w=600&q=80", pricePerDay:"PKR 13,000", transmission:"Automatic", fuel:"Petrol",     ac:true,  tag:"Reliable",      available:false },
  { id:13, name:"Proton X70 Premium",       company:"Proton",  type:"SUV",         seaters:6,  img:"https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=600&q=80", pricePerDay:"PKR 11,000", transmission:"Automatic", fuel:"Petrol",     ac:true,  tag:"Value SUV",     available:true  },
  { id:14, name:"Changan CS35 Plus",        company:"Changan", type:"SUV",         seaters:6,  img:"https://images.unsplash.com/photo-1551830820-330a71b99659?w=600&q=80", pricePerDay:"PKR 9,500",  transmission:"Automatic", fuel:"Petrol",      ac:true,  tag:"Budget SUV",    available:true  },
  { id:15, name:"Toyota HiAce Standard",    company:"Toyota",  type:"Grand Cabin", seaters:10, img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", pricePerDay:"PKR 14,000", transmission:"Manual",    fuel:"Diesel",     ac:true,  tag:"Group Travel",  available:true  },
  { id:16, name:"DFSK C35 Van",             company:"DFSK",    type:"Grand Cabin", seaters:10, img:"https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?w=600&q=80", pricePerDay:"PKR 11,000", transmission:"Manual",   fuel:"Petrol",     ac:true,  tag:"Affordable",    available:true  },
  { id:17, name:"Toyota HiAce Grand Cabin", company:"Toyota",  type:"Grand Cabin", seaters:13, img:"https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80", pricePerDay:"PKR 16,000", transmission:"Manual",    fuel:"Diesel",     ac:true,  tag:"Family Choice", available:true  },
  { id:18, name:"Toyota Coaster Standard",  company:"Toyota",  type:"Coaster",     seaters:22, img:"https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&q=80", pricePerDay:"PKR 28,000", transmission:"Manual",   fuel:"Diesel",     ac:true,  tag:"Group Deal",    available:true  },
  { id:19, name:"Toyota Coaster XL",        company:"Toyota",  type:"Coaster",     seaters:28, img:"https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80", pricePerDay:"PKR 35,000", transmission:"Manual",    fuel:"Diesel",     ac:true,  tag:"Large Group",   available:true  },
];

const carTypes    = ["All","Hatchback","Sedan","SUV","Grand Cabin","Coaster"];
const seatOptions = ["All","4","6","10","13","22","28"];
const companies   = ["All","Toyota","Honda","Suzuki","Hyundai","KIA","MG","Changan","Proton","DFSK"];
const typeColors  = {
  "Hatchback":   "#3b82f6",
  "Sedan":       "#6366f1",
  "SUV":         "#16a34a",
  "Grand Cabin": "#ea580c",
  "Coaster":     "#8b5cf6",
};

// ─── Booking Form ─────────────────────────────────────────────────────────────
function BookingForm({ car, onClose }) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ name:"", phone:"", email:"", city:"", pickLocation:"", dropArea:"", pickDate:"", returnDate:"", message:"" });
  const [locLoading, setLocLoading] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [loading,    setLoading]    = useState(false);

  const days = useMemo(() => {
    if (!form.pickDate || !form.returnDate) return 0;
    const d = (new Date(form.returnDate) - new Date(form.pickDate)) / 86400000;
    return d > 0 ? d : 0;
  }, [form.pickDate, form.returnDate]);

  const totalCost = useMemo(() => {
    if (!days) return null;
    return "PKR " + (parseInt(car.pricePerDay.replace(/\D/g,"")) * days).toLocaleString();
  }, [days, car]);

  const fetchLocation = () => {
    if (!navigator.geolocation) { alert("Your browser does not support geolocation."); return; }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res  = await fetch("https://nominatim.openstreetmap.org/reverse?lat=" + latitude + "&lon=" + longitude + "&format=json&addressdetails=1", { headers: { "Accept-Language":"en" } });
          const data = await res.json();
          const a    = data.address || {};
          const area = a.suburb || a.neighbourhood || a.city_district || a.quarter || a.road || "";
          const city = a.city || a.town || a.county || a.state || "";
          setForm(f => ({ ...f, pickLocation: area && city ? area+", "+city : city || area || "Location fetched" }));
        } catch { setForm(f => ({ ...f, pickLocation: "Location fetched (please verify)" })); }
        finally  { setLocLoading(false); }
      },
      () => { setLocLoading(false); alert("Location denied. Please enter manually."); },
      { timeout: 10000 }
    );
  };

  const ok = form.name && form.phone && form.city && form.pickLocation && form.dropArea && form.pickDate && form.returnDate && days > 0;

  if (submitted) return (
    <div style={{ textAlign:"center", padding:"24px 0" }}>
      <div style={{ fontSize:56, marginBottom:14 }}>🚗</div>
      <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:theme.text, marginBottom:10 }}>Booking Received!</h3>
      <p style={{ color:theme.textMuted, lineHeight:1.7, marginBottom:8 }}>
        <strong style={{ color:theme.accent }}>{car.name}</strong> — your booking request has been received.
      </p>
      {totalCost && <div style={{ background:"rgba(26,60,110,0.07)", border:"1px solid rgba(26,60,110,0.18)", borderRadius:12, padding:"12px 20px", marginBottom:18, display:"inline-block" }}>
        <div style={{ fontSize:11, color:theme.textMuted }}>Estimated Total ({days} days)</div>
        <div style={{ fontSize:22, fontWeight:800, color:theme.accent, fontFamily:"'Playfair Display',serif" }}>{totalCost}</div>
      </div>}
      <p style={{ color:theme.textMuted, fontSize:13, marginBottom:22 }}>Our team will contact you within <strong>24 hours.</strong></p>
      <button onClick={onClose} style={{ background:theme.accent, color:"#fff", border:"none", padding:"11px 30px", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Close</button>
    </div>
  );

  const inp = { onFocus:e=>e.target.style.borderColor=theme.accent, onBlur:e=>e.target.style.borderColor="rgba(0,0,0,0.09)" };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
      <div style={{ background:"rgba(26,60,110,0.05)", border:"1px solid rgba(26,60,110,0.18)", borderRadius:10, padding:"11px 14px" }}>
        <div style={{ fontSize:10, color:theme.textMuted, marginBottom:2 }}>Selected Car</div>
        <div style={{ fontWeight:700, color:theme.accent, fontSize:14 }}>{car.name} — {car.company}</div>
        <div style={{ fontSize:11, color:theme.textMuted, marginTop:1 }}>{car.type} · {car.seaters} Seater · {car.pricePerDay}/day</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11 }}>
        <div><label className="cr-label">Full Name *</label><input className="cr-input" placeholder="Ahmed Khan" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} {...inp} /></div>
        <div><label className="cr-label">Phone Number *</label><input className="cr-input" placeholder="+92 300 0000000" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} {...inp} /></div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11 }}>
        <div><label className="cr-label">Email (Optional)</label><input className="cr-input" type="email" placeholder="email@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} {...inp} /></div>
        <div><label className="cr-label">City *</label><input className="cr-input" placeholder="Lahore / Karachi" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} {...inp} /></div>
      </div>
      <div>
        <label className="cr-label">Pick-Up Location *</label>
        <div className="cr-fetch-wrap">
          <input className="cr-input" placeholder="e.g. DHA Phase 5, Lahore" value={form.pickLocation} onChange={e=>setForm({...form,pickLocation:e.target.value})} {...inp} />
          <button className="cr-fetch-btn" onClick={fetchLocation} disabled={locLoading}>
            {locLoading ? <span className="cr-spin">⌛</span> : "📍"} {locLoading ? "..." : "Fetch"}
          </button>
        </div>
      </div>
      <div><label className="cr-label">Drop-Off City / Area *</label><input className="cr-input" placeholder="e.g. Gulberg III, Lahore" value={form.dropArea} onChange={e=>setForm({...form,dropArea:e.target.value})} {...inp} /></div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11 }}>
        <div><label className="cr-label">Pick-Up Date *</label><input className="cr-input" type="date" min={today} value={form.pickDate} onChange={e=>setForm({...form,pickDate:e.target.value})} style={{ colorScheme:"light" }} {...inp} /></div>
        <div><label className="cr-label">Return Date *</label><input className="cr-input" type="date" min={form.pickDate||today} value={form.returnDate} onChange={e=>setForm({...form,returnDate:e.target.value})} style={{ colorScheme:"light" }} {...inp} /></div>
      </div>
      {days > 0 && (
        <div style={{ background:"rgba(26,60,110,0.05)", border:"1px solid rgba(26,60,110,0.18)", borderRadius:10, padding:"11px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div><div style={{ fontSize:10, color:theme.textMuted }}>Duration</div><div style={{ fontWeight:700, color:theme.text, fontSize:14 }}>{days} Day{days>1?"s":""}</div></div>
          <div style={{ textAlign:"right" }}><div style={{ fontSize:10, color:theme.textMuted }}>Estimated Total</div><div style={{ fontWeight:800, color:theme.accent, fontSize:17, fontFamily:"'Playfair Display',serif" }}>{totalCost}</div></div>
        </div>
      )}
      <div><label className="cr-label">Special Requirements (Optional)</label><textarea className="cr-input" rows={2} placeholder="Child seat, specific route, etc." value={form.message} onChange={e=>setForm({...form,message:e.target.value})} style={{ resize:"none" }} {...inp} /></div>
      <button className="cr-submit-btn" onClick={()=>{if(!ok)return;setLoading(true);setTimeout(()=>{setLoading(false);setSubmitted(true)},1500)}} disabled={loading||!ok}>
        {loading ? "⏳ Submitting..." : "Confirm Booking"}
      </button>
      <p style={{ fontSize:11, color:theme.textMuted, textAlign:"center", margin:0 }}>🔒 Your information is secure — Edafay never shares your data</p>
    </div>
  );
}

// ─── Car Detail Modal ─────────────────────────────────────────────────────────
function CarModal({ car, onClose }) {
  const [showForm, setShowForm] = useState(false);
  const tc = typeColors[car.type] || "#1a3c6e";
  return (
    <div className="cr-modal-overlay" onClick={onClose}>
      <div className="cr-modal" onClick={e=>e.stopPropagation()} style={{ background:theme.bg, border:`1px solid ${theme.border}` }}>
        <button className="cr-modal-close" onClick={onClose} style={{ color:theme.text }}>✕</button>
        <div className="cr-modal-hero">
          <img src={car.img} alt={car.name} />
          <div className="cr-modal-hero-overlay" />
          <div className="cr-modal-hero-text">
            <span style={{ background:tc+"cc", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:6, marginBottom:7, display:"inline-block", textTransform:"uppercase" }}>{car.type}</span>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:21, fontWeight:700, color:"#fff", margin:"5px 0 3px" }}>{car.name}</h2>
            <p style={{ color:"rgba(255,255,255,0.72)", fontSize:12 }}>{car.company} · {car.seaters} Seater · {car.transmission}</p>
          </div>
        </div>
        <div className="cr-modal-body">
          {!showForm ? (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:9, marginBottom:20 }}>
                {[["🪑","Seaters",car.seaters+""],["⚙️","Transmission",car.transmission],["⛽","Fuel",car.fuel],["❄️","AC",car.ac?"Yes":"No"]].map(([icon,lbl,val])=>(
                  <div key={lbl} style={{ background:theme.bgCard, border:`1px solid ${theme.border}`, borderRadius:10, padding:"11px", textAlign:"center" }}>
                    <div style={{ fontSize:18, marginBottom:3 }}>{icon}</div>
                    <div style={{ fontSize:10, color:theme.textMuted, marginBottom:2 }}>{lbl}</div>
                    <div style={{ fontSize:11, fontWeight:700, color:theme.accent }}>{val}</div>
                  </div>
                ))}
              </div>
              <div className="cr-section">
                <div style={{ display:"flex", alignItems:"center", gap:10, background:car.available?"rgba(34,197,94,0.06)":"rgba(239,68,68,0.06)", border:"1px solid "+(car.available?"rgba(34,197,94,0.25)":"rgba(239,68,68,0.25)"), borderRadius:10, padding:"11px 14px" }}>
                  <span style={{ fontSize:20 }}>{car.available?"✅":"❌"}</span>
                  <div>
                    <div style={{ fontWeight:700, color:car.available?"#16a34a":"#ef4444", fontSize:13 }}>{car.available?"Available for Booking":"Currently Unavailable"}</div>
                    <div style={{ fontSize:11, color:theme.textMuted }}>{car.available?"Book Now — Our Agent Will Confirm":"Contact us for next availability"}</div>
                  </div>
                </div>
              </div>
              <div className="cr-section">
                <h3 className="cr-section-title" style={{ color:theme.text }}>Rental Includes</h3>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7 }}>
                  {["AC","24/7 Support","City Coverage","Driver (Mandatory)","Fuel (Separate)","Toll (Separate)"].map(item=>(
                    <div key={item} style={{ display:"flex", alignItems:"center", gap:7, background:theme.bgCard, border:`1px solid ${theme.border}`, borderRadius:8, padding:"8px 11px" }}>
                      <span style={{ fontSize:13, color:theme.accent }}>✓</span>
                      <span style={{ fontSize:11, fontWeight:600, color:theme.text }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background:"rgba(26,60,110,0.04)", border:"1px dashed rgba(26,60,110,0.25)", borderRadius:10, padding:"12px 16px", marginBottom:20 }}>
                <p style={{ fontSize:12, color:theme.textMuted, margin:0, lineHeight:1.7 }}>
                  <strong style={{ color:theme.accent }}>📌 Note:</strong> Price is per day for 10 hours. Fuel and toll charges are separate. Special discounts for 7+ day bookings.
                </p>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:14, borderTop:`1px solid ${theme.border}`, gap:10, flexWrap:"wrap" }}>
                <div>
                  <div style={{ fontSize:10, color:theme.textMuted, marginBottom:2 }}>Rate per day</div>
                  <div style={{ fontSize:24, fontWeight:800, color:theme.accent, fontFamily:"'Playfair Display',serif" }}>{car.pricePerDay}</div>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={onClose} style={{ background:"transparent", color:theme.text, border:`1.5px solid ${theme.border}`, padding:"10px 20px", borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=theme.accent;e.currentTarget.style.color=theme.accent;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=theme.border;e.currentTarget.style.color=theme.text;}}>← Back</button>
                  <button onClick={()=>setShowForm(true)} disabled={!car.available}
                    style={{ background:car.available?theme.accent:"rgba(0,0,0,0.08)", color:car.available?"#fff":theme.textMuted, border:"none", padding:"10px 24px", borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:700, cursor:car.available?"pointer":"not-allowed", transition:"all 0.2s" }}
                    onMouseEnter={e=>{if(car.available){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(26,60,110,0.35)";}}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
                    {car.available?"Book Now →":"Unavailable"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <button onClick={()=>setShowForm(false)} style={{ background:"none", border:"none", color:theme.accent, fontSize:12, fontWeight:700, cursor:"pointer", marginBottom:16, padding:0, fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:5 }}>
                ← Back to Details
              </button>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:19, fontWeight:700, color:theme.text, marginBottom:18 }}>
                Book <span style={{ color:theme.accent }}>{car.name}</span>
              </h3>
              <BookingForm car={car} onClose={onClose} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Car Card ─────────────────────────────────────────────────────────────────
function CarCard({ car, onClick }) {
  const tc = typeColors[car.type] || "#1a3c6e";
  return (
    <div className="cr-card" onClick={onClick} style={{ background:theme.bgCard }}>
      <div className="cr-card-img-wrap">
        <img src={car.img} alt={car.name} className="cr-card-img" />
        <div className="cr-card-overlay" />
        <span className="cr-badge-top-left" style={{ background:tc+"cc" }}>{car.type}</span>
        <span className="cr-badge-top-right">{car.tag}</span>
        <span className="cr-avail" style={{ background:car.available?"rgba(34,197,94,0.9)":"rgba(239,68,68,0.85)", color:"#fff" }}>
          {car.available ? "✓ Available" : "✗ Booked"}
        </span>
        <span className="cr-card-name-overlay">{car.name}</span>
      </div>
      <div className="cr-card-body">
        <div className="cr-company" style={{ color:tc }}>{car.company}</div>
        <div className="cr-specs">
          <span className="cr-spec-pill" style={{ background:"rgba(26,60,110,0.08)", color:theme.accent }}>🪑 {car.seaters}</span>
          <span className="cr-spec-pill" style={{ background:"rgba(0,0,0,0.04)", color:theme.textMuted }}>⚙ {car.transmission}</span>
          <span className="cr-spec-pill" style={{ background:"rgba(0,0,0,0.04)", color:theme.textMuted }}>⛽ {car.fuel}</span>
          {car.ac && <span className="cr-spec-pill" style={{ background:"rgba(59,130,246,0.08)", color:"#3b82f6" }}>❄️ AC</span>}
        </div>
        <div className="cr-card-footer">
          <div>
            <div style={{ fontSize:17, fontWeight:800, color:theme.accent, fontFamily:"'Playfair Display',serif" }}>{car.pricePerDay}</div>
            <div style={{ fontSize:10, color:theme.textMuted }}>per day</div>
          </div>
          <button className="cr-card-btn"
            style={{ background:car.available?theme.accent:"rgba(0,0,0,0.07)", color:car.available?"#fff":theme.textMuted }}
            onClick={e=>{e.stopPropagation();onClick();}}>
            {car.available ? "Book →" : "Details →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Filter Bar Component ─────────────────────────────────────────────────────
function FilterBar({ typeFilter, setTypeFilter, seaterFilter, setSeaterFilter, companyFilter, setCompanyFilter }) {
  return (
    <div className="cr-filter-bar">
      {/* Car Type */}
      <div className="cr-filter-row">
        <span className="cr-filter-label-inline">🚗 Type</span>
        <div className="cr-chips">
          {carTypes.map(t => (
            <button key={t} className={"cr-chip"+(typeFilter===t?" cr-chip-active":"")} onClick={()=>setTypeFilter(t)}>{t}</button>
          ))}
        </div>
      </div>

      <div className="cr-filter-divider" />

      {/* Seaters */}
      <div className="cr-filter-row">
        <span className="cr-filter-label-inline">🪑 Seats</span>
        <div className="cr-chips">
          {seatOptions.map(s => (
            <button key={s} className={"cr-chip"+(seaterFilter===s?" cr-chip-active":"")} onClick={()=>setSeaterFilter(s)}>
              {s==="All" ? "All" : s+" Seat"}
            </button>
          ))}
        </div>
      </div>

      <div className="cr-filter-divider" />

      {/* Company */}
      <div className="cr-filter-row">
        <span className="cr-filter-label-inline">🏢 Brand</span>
        <div className="cr-chips">
          {companies.map(c => (
            <button key={c} className={"cr-chip"+(companyFilter===c?" cr-chip-active":"")} onClick={()=>setCompanyFilter(c)}>{c}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function CarRental() {
  const [typeFilter,    setTypeFilter]    = useState("All");
  const [seaterFilter,  setSeaterFilter]  = useState("All");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [sortBy,        setSortBy]        = useState("default");
  const [selected,      setSelected]      = useState(null);

  const filtered = useMemo(() => {
    let list = cars;
    if (typeFilter    !== "All") list = list.filter(c => c.type    === typeFilter);
    if (seaterFilter  !== "All") list = list.filter(c => c.seaters === parseInt(seaterFilter));
    if (companyFilter !== "All") list = list.filter(c => c.company === companyFilter);
    if (sortBy === "price-low")  list = [...list].sort((a,b)=>parseInt(a.pricePerDay.replace(/\D/g,""))-parseInt(b.pricePerDay.replace(/\D/g,"")));
    if (sortBy === "price-high") list = [...list].sort((a,b)=>parseInt(b.pricePerDay.replace(/\D/g,""))-parseInt(a.pricePerDay.replace(/\D/g,"")));
    if (sortBy === "seats-asc")  list = [...list].sort((a,b)=>a.seaters-b.seaters);
    if (sortBy === "available")  list = [...list].sort((a,b)=>(b.available?1:0)-(a.available?1:0));
    return list;
  }, [typeFilter, seaterFilter, companyFilter, sortBy]);

  const resetFilters = () => { setTypeFilter("All"); setSeaterFilter("All"); setCompanyFilter("All"); setSortBy("default"); };
  const hasFilter = typeFilter !== "All" || seaterFilter !== "All" || companyFilter !== "All";

  return (
    <>
      <style>{CSS}</style>
      <div className="cr-page" style={{ background:theme.bg, color:theme.text }}>
        <Navbar />

        {/* Hero */}
        <section className="cr-hero">
          <h1 style={{ color:theme.text }}>
            Rent the <span className="cr-gold">Car</span> of Your Choice
          </h1>
          <p style={{ color:theme.textMuted }}>
            From hatchbacks to coaches — 4 to 28 seats. Toyota, Honda, Suzuki and more. With driver included.
          </p>
        </section>

        <div className="cr-divider" />

        <section style={{ padding:"48px 5% 80px" }}>

          {/* Filter Bar */}
          <FilterBar
            typeFilter={typeFilter}    setTypeFilter={setTypeFilter}
            seaterFilter={seaterFilter} setSeaterFilter={setSeaterFilter}
            companyFilter={companyFilter} setCompanyFilter={setCompanyFilter}
          />

          {/* Sort + Count Row */}
          <div className="cr-sort-row">
            <div className="cr-count-badge">
              <span className="cr-count-num">{filtered.length}</span>
              <span>cars found</span>
              {hasFilter && (
                <button className="cr-reset-btn" onClick={resetFilters}>✕ Clear filters</button>
              )}
            </div>
            <div className="cr-sort-group">
              <span className="cr-sort-label">Sort by</span>
              <select className="cr-sort-select" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                <option value="default">Default</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="seats-asc">Seats: Small First</option>
                <option value="available">Available First</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"70px 20px" }}>
              <div style={{ fontSize:52, marginBottom:14 }}>🔍</div>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:theme.text, marginBottom:8 }}>No cars found</h3>
              <p style={{ color:theme.textMuted, marginBottom:16, fontSize:14 }}>Try adjusting your filters</p>
              <button onClick={resetFilters} style={{ background:theme.accent, color:"#fff", border:"none", padding:"10px 24px", borderRadius:10, fontFamily:"'DM Sans',sans-serif", fontWeight:700, cursor:"pointer" }}>Clear Filters</button>
            </div>
          ) : (
            <div className="cr-grid">
              {filtered.map((car,i) => (
                <div key={car.id} style={{ animationDelay: i*0.05+"s" }}>
                  <CarCard car={car} onClick={()=>setSelected(car)} />
                </div>
              ))}
            </div>
          )}

          {/* Note */}
          <div style={{ marginTop:44, background:"rgba(26,60,110,0.04)", border:"1px dashed rgba(26,60,110,0.2)", borderRadius:12, padding:"16px 22px", textAlign:"center" }}>
            <p style={{ fontSize:13, color:theme.textMuted, margin:0, lineHeight:1.7 }}>
              <strong style={{ color:theme.accent }}>📌 Note:</strong> Prices are per day (10 hours). Fuel, toll, and driver charges are extra. Special discounts for bookings of 7+ days — contact us for details.
            </p>
          </div>
        </section>

        {selected && <CarModal car={selected} onClose={()=>setSelected(null)} />}
        <Footer />
      </div>
    </>
  );
}