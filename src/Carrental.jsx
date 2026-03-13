// ─── CarRental.jsx — Edafay Travel & Tours ──────────────────────────────────
import { useState, useMemo } from "react";
import theme from './theme.js';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
@keyframes crFadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
@keyframes crFadeIn { from{opacity:0} to{opacity:1} }
@keyframes crSpin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
.cr-fu1 { animation: crFadeUp 0.7s 0.1s ease both; }
.cr-fu2 { animation: crFadeUp 0.7s 0.2s ease both; }
.cr-fu3 { animation: crFadeUp 0.7s 0.3s ease both; }
.cr-page { min-height:100vh; font-family:'DM Sans',sans-serif; overflow-x:hidden; width:100%; }
.cr-hero { position:relative; padding:140px 5% 80px; text-align:center; overflow:hidden; }
.cr-hero-bg { position:absolute; inset:0; background:radial-gradient(ellipse at 60% 0%,rgba(26,60,110,0.10) 0%,transparent 55%),radial-gradient(ellipse at 10% 90%,rgba(76,175,125,0.06) 0%,transparent 50%); pointer-events:none; }
.cr-hero-inner { position:relative; max-width:740px; margin:0 auto; }
.cr-hero-inner h1 { font-family:'Playfair Display',serif; font-size:clamp(38px,5vw,66px); font-weight:700; line-height:1.12; letter-spacing:-1px; margin-bottom:18px; }
.cr-hero-inner p { font-size:16px; line-height:1.8; max-width:540px; margin:0 auto 40px; }
.cr-divider { height:1px; background:linear-gradient(to right,transparent,rgba(0,0,0,0.08),transparent); }
.cr-gold { background:linear-gradient(135deg,#1a3c6e,#2a5298,#1a3c6e); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.cr-filters { background:#fff; border:1px solid rgba(0,0,0,0.08); border-radius:20px; padding:24px 28px; margin-bottom:32px; box-shadow:0 4px 24px rgba(0,0,0,0.05); }
.cr-filter-row { display:flex; align-items:flex-start; gap:24px; flex-wrap:wrap; margin-bottom:20px; }
.cr-filter-row:last-child { margin-bottom:0; }
.cr-filter-label { font-size:11px; font-weight:700; color:rgba(26,26,46,0.45); text-transform:uppercase; letter-spacing:0.8px; margin-bottom:8px; }
.cr-filter-group { flex:1; min-width:180px; }
.cr-chips { display:flex; gap:6px; flex-wrap:wrap; }
.cr-chip { padding:7px 16px; border-radius:50px; font-size:12px; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; border:1.5px solid rgba(0,0,0,0.08); background:transparent; }
.cr-chip:hover { border-color:rgba(26,60,110,0.4); color:#1a3c6e; }
.cr-chip-active { background:#1a3c6e !important; color:#fff !important; border-color:#1a3c6e !important; }
.cr-sort-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
.cr-sort-select { padding:9px 14px; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:13px; outline:none; cursor:pointer; border:1.5px solid rgba(0,0,0,0.08); }
.cr-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
.cr-card { border-radius:20px; overflow:hidden; cursor:pointer; transition:transform 0.3s,box-shadow 0.3s; animation:crFadeUp 0.6s ease both; }
.cr-card:hover { transform:translateY(-7px); box-shadow:0 28px 56px rgba(0,0,0,0.11); }
.cr-card-img-wrap { position:relative; height:200px; overflow:hidden; }
.cr-card-img { width:100%; height:100%; object-fit:cover; transition:transform 0.5s; }
.cr-card:hover .cr-card-img { transform:scale(1.07); }
.cr-card-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,0.5) 0%,transparent 55%); }
.cr-card-tag { position:absolute; top:12px; right:12px; background:rgba(0,0,0,0.55); backdrop-filter:blur(8px); color:#1a3c6e; font-size:10px; font-weight:700; padding:3px 10px; border-radius:20px; border:1px solid rgba(26,60,110,0.3); }
.cr-card-type-badge { position:absolute; top:12px; left:12px; backdrop-filter:blur(6px); color:#fff; font-size:10px; font-weight:700; padding:3px 10px; border-radius:20px; text-transform:uppercase; letter-spacing:0.5px; }
.cr-avail { position:absolute; bottom:12px; left:12px; font-size:10px; font-weight:800; padding:3px 10px; border-radius:20px; }
.cr-card-body { padding:16px 18px 18px; }
.cr-card-name { font-size:16px; font-weight:700; margin-bottom:4px; }
.cr-specs { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px; padding-bottom:12px; }
.cr-spec-pill { display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:600; padding:4px 10px; border-radius:20px; }
.cr-card-footer { display:flex; justify-content:space-between; align-items:center; padding-top:12px; border-top:1px solid rgba(0,0,0,0.07); }
.cr-card-btn { padding:10px 20px; border-radius:50px; border:none; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:all 0.25s; }
.cr-card-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(26,60,110,0.3); }
.cr-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.65); backdrop-filter:blur(8px); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; animation:crFadeIn 0.3s ease; }
.cr-modal { border-radius:24px; overflow:hidden; width:100%; max-width:620px; max-height:92vh; overflow-y:auto; position:relative; animation:crFadeUp 0.4s ease both; }
.cr-modal-close { position:absolute; top:14px; right:14px; background:rgba(255,255,255,0.92); border:none; width:36px; height:36px; border-radius:50%; font-size:15px; cursor:pointer; z-index:10; display:flex; align-items:center; justify-content:center; transition:all 0.2s; box-shadow:0 2px 8px rgba(0,0,0,0.12); }
.cr-modal-close:hover { transform:scale(1.08); }
.cr-modal-hero { position:relative; height:220px; }
.cr-modal-hero img { width:100%; height:100%; object-fit:cover; }
.cr-modal-hero-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,0.75) 0%,transparent 50%); }
.cr-modal-hero-text { position:absolute; bottom:20px; left:22px; }
.cr-modal-body { padding:24px; }
.cr-section { margin-bottom:22px; }
.cr-section-title { font-size:15px; font-weight:700; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid rgba(0,0,0,0.07); }
.cr-input { width:100%; padding:13px 16px; border-radius:12px; font-size:14px; border:1.5px solid rgba(0,0,0,0.10); outline:none; font-family:'DM Sans',sans-serif; background:rgba(255,255,255,0.9); box-sizing:border-box; transition:border-color 0.2s; color:#1a1a2e; }
.cr-input:focus { border-color:#1a3c6e; box-shadow:0 0 0 3px rgba(26,60,110,0.10); }
.cr-input::placeholder { color:rgba(26,26,46,0.3); }
.cr-label { display:block; font-size:11px; font-weight:700; color:rgba(26,26,46,0.45); margin-bottom:6px; text-transform:uppercase; letter-spacing:0.8px; }
.cr-fetch-wrap { display:flex; }
.cr-fetch-wrap .cr-input { border-radius:12px 0 0 12px; border-right:none; }
.cr-fetch-btn { padding:0 16px; border-radius:0 12px 12px 0; border:1.5px solid rgba(26,60,110,0.4); border-left:none; background:rgba(26,60,110,0.08); color:#1a3c6e; font-size:12px; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; white-space:nowrap; transition:all 0.2s; display:flex; align-items:center; gap:5px; flex-shrink:0; }
.cr-fetch-btn:hover { background:rgba(26,60,110,0.16); }
.cr-fetch-btn:disabled { opacity:0.6; cursor:not-allowed; }
.cr-spin { animation:crSpin 1s linear infinite; display:inline-block; }
.cr-toggle-row { display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:12px; cursor:pointer; border:1.5px solid rgba(0,0,0,0.08); transition:all 0.2s; }
.cr-toggle-row:hover { border-color:rgba(26,60,110,0.3); }
.cr-toggle-box { width:20px; height:20px; border-radius:6px; display:flex; align-items:center; justify-content:center; transition:all 0.2s; flex-shrink:0; }
.cr-submit-btn { background:#1a3c6e; color:#fff; border:none; padding:15px; border-radius:50px; font-size:15px; font-weight:700; width:100%; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.25s; }
.cr-submit-btn:hover { background:#2a5298; transform:translateY(-2px); box-shadow:0 12px 35px rgba(26,60,110,0.35); }
.cr-submit-btn:disabled { opacity:0.45; cursor:not-allowed; transform:none; box-shadow:none; }
@media (max-width:1024px) { .cr-grid { grid-template-columns:repeat(2,1fr); } }
@media (max-width:768px) {
  .cr-hero { padding:110px 5% 60px; }
  .cr-grid { grid-template-columns:1fr 1fr; gap:16px; }
  .cr-filter-row { flex-direction:column; gap:16px; }
  .cr-filter-group { min-width:100%; }
  .cr-sort-row { flex-direction:column; align-items:flex-start; }
  .cr-filters { padding:20px; }
}
@media (max-width:560px) {
  .cr-grid { grid-template-columns:1fr; }
  .cr-modal { border-radius:16px; }
  .cr-chips { gap:5px; }
  .cr-chip { padding:6px 12px; font-size:11px; }
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
const typeColors  = { "Hatchback":"rgba(59,130,246,0.75)", "Sedan":"rgba(99,102,241,0.75)", "SUV":"rgba(22,163,74,0.75)", "Grand Cabin":"rgba(234,88,12,0.75)", "Coaster":"rgba(139,92,246,0.75)" };

// ─── Booking Form ─────────────────────────────────────────────────────────────
function BookingForm({ car, onClose }) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ name:"", phone:"", email:"", city:"", pickLocation:"", dropArea:"", pickDate:"", returnDate:"", withDriver:true, message:"" });
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
    if (!navigator.geolocation) { alert("Geolocation support nahi hai."); return; }
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
      () => { setLocLoading(false); alert("Location denied. Manually darj karein."); },
      { timeout: 10000 }
    );
  };

  const ok = form.name && form.phone && form.city && form.pickLocation && form.dropArea && form.pickDate && form.returnDate && days > 0;

  if (submitted) return (
    <div style={{ textAlign:"center", padding:"24px 0" }}>
      <div style={{ fontSize:60, marginBottom:16 }}>🚗</div>
      <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:theme.text, marginBottom:10 }}>Booking Request Mila!</h3>
      <p style={{ color:theme.textMuted, lineHeight:1.7, marginBottom:8 }}>
        <strong style={{ color:theme.accent }}>{car.name}</strong> ka booking request receive ho gaya.
      </p>
      {totalCost && <div style={{ background:"rgba(26,60,110,0.07)", border:"1px solid rgba(26,60,110,0.2)", borderRadius:12, padding:"12px 20px", marginBottom:20, display:"inline-block" }}>
        <div style={{ fontSize:12, color:theme.textMuted }}>Estimated Total ({days} days)</div>
        <div style={{ fontSize:22, fontWeight:800, color:theme.accent, fontFamily:"'Playfair Display',serif" }}>{totalCost}</div>
      </div>}
      <p style={{ color:theme.textMuted, fontSize:13, marginBottom:24 }}>Hamari team <strong>24 ghante</strong> mein aapse rabta karegi.</p>
      <button onClick={onClose} style={{ background:theme.accent, color:"#fff", border:"none", padding:"12px 32px", borderRadius:50, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Theek Hai</button>
    </div>
  );

  const inp = { onFocus:e=>e.target.style.borderColor=theme.accent, onBlur:e=>e.target.style.borderColor="rgba(0,0,0,0.1)" };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ background:"rgba(26,60,110,0.06)", border:"1px solid rgba(26,60,110,0.2)", borderRadius:12, padding:"12px 16px" }}>
        <div style={{ fontSize:11, color:theme.textMuted, marginBottom:2 }}>Selected Car</div>
        <div style={{ fontWeight:700, color:theme.accent, fontSize:15 }}>{car.name} — {car.company}</div>
        <div style={{ fontSize:12, color:theme.textMuted, marginTop:2 }}>{car.type} · {car.seaters} Seater · {car.pricePerDay}/day</div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <div>
          <label className="cr-label">Full Name *</label>
          <input className="cr-input" placeholder="Ahmed Khan" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} {...inp} />
        </div>
        <div>
          <label className="cr-label">Phone Number *</label>
          <input className="cr-input" placeholder="+92 300 0000000" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} {...inp} />
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <div>
          <label className="cr-label">Email <span style={{ textTransform:"none", fontWeight:400, fontSize:10 }}>(Optional)</span></label>
          <input className="cr-input" type="email" placeholder="email@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} {...inp} />
        </div>
        <div>
          <label className="cr-label">City *</label>
          <input className="cr-input" placeholder="Lahore / Karachi / Islamabad" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} {...inp} />
        </div>
      </div>

      <div>
        <label className="cr-label">Pick-Up Location * <span style={{ textTransform:"none", fontWeight:400, fontSize:10 }}>(area / street name)</span></label>
        <div className="cr-fetch-wrap">
          <input className="cr-input" placeholder="e.g. DHA Phase 5, Lahore" value={form.pickLocation} onChange={e=>setForm({...form,pickLocation:e.target.value})} {...inp} />
          <button className="cr-fetch-btn" onClick={fetchLocation} disabled={locLoading} title="Current location use karein">
            {locLoading ? <span className="cr-spin">⌛</span> : "📍"} {locLoading ? "..." : "Fetch"}
          </button>
        </div>
        <div style={{ fontSize:11, color:theme.textMuted, marginTop:4 }}>Ya "Fetch" se current location auto-fill karein</div>
      </div>

      <div>
        <label className="cr-label">Drop-Off Area / City *</label>
        <input className="cr-input" placeholder="e.g. Gulberg III, Lahore  ·  Saddar, Karachi" value={form.dropArea} onChange={e=>setForm({...form,dropArea:e.target.value})} {...inp} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <div>
          <label className="cr-label">Pick-Up Date *</label>
          <input className="cr-input" type="date" min={today} value={form.pickDate} onChange={e=>setForm({...form,pickDate:e.target.value})} style={{ colorScheme:"light" }} {...inp} />
        </div>
        <div>
          <label className="cr-label">Return Date *</label>
          <input className="cr-input" type="date" min={form.pickDate||today} value={form.returnDate} onChange={e=>setForm({...form,returnDate:e.target.value})} style={{ colorScheme:"light" }} {...inp} />
        </div>
      </div>

      {days > 0 && (
        <div style={{ background:"rgba(26,60,110,0.06)", border:"1px solid rgba(26,60,110,0.2)", borderRadius:12, padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:11, color:theme.textMuted }}>Rental Duration</div>
            <div style={{ fontWeight:700, color:theme.text, fontSize:15 }}>{days} Din</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:11, color:theme.textMuted }}>Estimated Total</div>
            <div style={{ fontWeight:800, color:theme.accent, fontSize:18, fontFamily:"'Playfair Display',serif" }}>{totalCost}</div>
          </div>
        </div>
      )}

      <div className="cr-toggle-row"
        onClick={()=>setForm({...form,withDriver:!form.withDriver})}
        style={{ borderColor:form.withDriver?"rgba(26,60,110,0.4)":"rgba(0,0,0,0.08)", background:form.withDriver?"rgba(26,60,110,0.04)":"transparent" }}>
        <div className="cr-toggle-box" style={{ background:form.withDriver?theme.accent:"transparent", border:"2px solid "+(form.withDriver?theme.accent:"rgba(0,0,0,0.2)") }}>
          {form.withDriver && <span style={{ color:"#fff", fontSize:12 }}>✓</span>}
        </div>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:form.withDriver?theme.accent:theme.text }}>🧑‍✈️ Driver Chahiye</div>
          <div style={{ fontSize:11, color:theme.textMuted }}>Professional driver included (extra charges may apply)</div>
        </div>
      </div>

      <div>
        <label className="cr-label">Special Requirements <span style={{ textTransform:"none", fontWeight:400 }}>(Optional)</span></label>
        <textarea className="cr-input" rows={2} placeholder="Child seat, extra luggage, specific route, etc." value={form.message} onChange={e=>setForm({...form,message:e.target.value})} style={{ resize:"none" }} {...inp} />
      </div>

      <button className="cr-submit-btn" onClick={()=>{if(!ok)return;setLoading(true);setTimeout(()=>{setLoading(false);setSubmitted(true)},1600)}} disabled={loading||!ok}>
        {loading ? "⏳ Booking Submit Ho Rahi Hai..." : "🚗 Rental Booking Confirm Karein"}
      </button>
      <p style={{ fontSize:11, color:theme.textMuted, textAlign:"center", margin:0 }}>🔒 Aapki info safe hai — Edafay kabhi share nahi karta</p>
    </div>
  );
}

// ─── Car Detail Modal ─────────────────────────────────────────────────────────
function CarModal({ car, onClose }) {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="cr-modal-overlay" onClick={onClose}>
      <div className="cr-modal" onClick={e=>e.stopPropagation()} style={{ background:theme.bg, border:`1px solid ${theme.border}` }}>
        <button className="cr-modal-close" onClick={onClose} style={{ color:theme.text }}>✕</button>
        <div className="cr-modal-hero">
          <img src={car.img} alt={car.name} />
          <div className="cr-modal-hero-overlay" />
          <div className="cr-modal-hero-text">
            <span style={{ background:typeColors[car.type]||"rgba(0,0,0,0.6)", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, marginBottom:8, display:"inline-block", textTransform:"uppercase" }}>{car.type}</span>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:"#fff", margin:"6px 0 4px" }}>{car.name}</h2>
            <p style={{ color:"rgba(255,255,255,0.75)", fontSize:13 }}>{car.company} · {car.seaters} Seater · {car.transmission}</p>
          </div>
        </div>
        <div className="cr-modal-body">
          {!showForm ? (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:24 }}>
                {[["🪑","Seaters",car.seaters+""],["⚙️","Transmission",car.transmission],["⛽","Fuel",car.fuel],["❄️","AC",car.ac?"Yes":"No"]].map(([icon,lbl,val])=>(
                  <div key={lbl} style={{ background:theme.bgCard, border:`1px solid ${theme.border}`, borderRadius:12, padding:"12px", textAlign:"center" }}>
                    <div style={{ fontSize:20, marginBottom:4 }}>{icon}</div>
                    <div style={{ fontSize:10, color:theme.textMuted, marginBottom:2 }}>{lbl}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:theme.accent }}>{val}</div>
                  </div>
                ))}
              </div>
              <div className="cr-section">
                <div style={{ display:"flex", alignItems:"center", gap:10, background:car.available?"rgba(34,197,94,0.07)":"rgba(239,68,68,0.07)", border:"1px solid "+(car.available?"rgba(34,197,94,0.3)":"rgba(239,68,68,0.3)"), borderRadius:12, padding:"12px 16px" }}>
                  <span style={{ fontSize:22 }}>{car.available?"✅":"❌"}</span>
                  <div>
                    <div style={{ fontWeight:700, color:car.available?"#16a34a":"#ef4444", fontSize:14 }}>{car.available?"Available for Booking":"Currently Unavailable"}</div>
                    <div style={{ fontSize:12, color:theme.textMuted }}>{car.available?"Abhi book karein — confirm ho jayega":"Contact karein next availability ke liye"}</div>
                  </div>
                </div>
              </div>
              <div className="cr-section">
                <h3 className="cr-section-title" style={{ color:theme.text }}>✅ Rental Includes</h3>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {["AC","Insurance","24/7 Support","City Coverage","Driver (Optional)","Fuel (Separate)"].map(item=>(
                    <div key={item} style={{ display:"flex", alignItems:"center", gap:8, background:theme.bgCard, border:`1px solid ${theme.border}`, borderRadius:10, padding:"10px 12px" }}>
                      <span style={{ fontSize:16, color:theme.accent }}>✓</span>
                      <span style={{ fontSize:12, fontWeight:600, color:theme.text }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background:"rgba(26,60,110,0.05)", border:"1px dashed rgba(26,60,110,0.3)", borderRadius:12, padding:"14px 18px", marginBottom:24 }}>
                <p style={{ fontSize:13, color:theme.textMuted, margin:0, lineHeight:1.7 }}>
                  <strong style={{ color:theme.accent }}>📌 Note:</strong> Price per day hai. Fuel charges alag honge. Driver ke saath additional charges apply honge. 7+ days booking pe special discount milta hai.
                </p>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:16, borderTop:`1px solid ${theme.border}`, gap:12, flexWrap:"wrap" }}>
                <div>
                  <div style={{ fontSize:11, color:theme.textMuted, marginBottom:2 }}>Rate</div>
                  <div style={{ fontSize:26, fontWeight:800, color:theme.accent, fontFamily:"'Playfair Display',serif" }}>{car.pricePerDay}</div>
                  <div style={{ fontSize:11, color:theme.textMuted }}>per day</div>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={onClose} style={{ background:"transparent", color:theme.text, border:`1.5px solid ${theme.border}`, padding:"12px 22px", borderRadius:50, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:500, cursor:"pointer" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=theme.accent;e.currentTarget.style.color=theme.accent;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=theme.border;e.currentTarget.style.color=theme.text;}}>← Back</button>
                  <button onClick={()=>setShowForm(true)} disabled={!car.available}
                    style={{ background:car.available?theme.accent:"rgba(0,0,0,0.1)", color:car.available?"#fff":theme.textMuted, border:"none", padding:"12px 26px", borderRadius:50, fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700, cursor:car.available?"pointer":"not-allowed" }}
                    onMouseEnter={e=>{if(car.available){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 10px 28px rgba(26,60,110,0.4)";}}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
                    {car.available?"🚗 Book Now":"Unavailable"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <button onClick={()=>setShowForm(false)} style={{ background:"none", border:"none", color:theme.accent, fontSize:13, fontWeight:600, cursor:"pointer", marginBottom:20, padding:0, fontFamily:"'DM Sans',sans-serif" }}>
                ← Car Details Pe Wapas Jao
              </button>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:theme.text, marginBottom:20 }}>
                🚗 Book <span style={{ color:theme.accent }}>{car.name}</span>
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
  return (
    <div className="cr-card" onClick={onClick} style={{ background:theme.bgCard, border:`1px solid ${theme.border}` }}>
      <div className="cr-card-img-wrap">
        <img src={car.img} alt={car.name} className="cr-card-img" />
        <div className="cr-card-overlay" />
        <span className="cr-card-type-badge" style={{ background:typeColors[car.type]||"rgba(0,0,0,0.6)" }}>{car.type}</span>
        <span className="cr-card-tag">{car.tag}</span>
        <span className="cr-avail" style={{ background:car.available?"rgba(34,197,94,0.85)":"rgba(239,68,68,0.85)", color:"#fff" }}>
          {car.available?"✓ Available":"✗ Booked"}
        </span>
      </div>
      <div className="cr-card-body">
        <div style={{ color:theme.accent, fontSize:11, fontWeight:700, marginBottom:3 }}>{car.company}</div>
        <div className="cr-card-name" style={{ color:theme.text }}>{car.name}</div>
        <div className="cr-specs" style={{ borderBottom:`1px solid ${theme.border}` }}>
          <span className="cr-spec-pill" style={{ background:"rgba(26,60,110,0.08)", color:theme.accent }}>🪑 {car.seaters} Seats</span>
          <span className="cr-spec-pill" style={{ background:"rgba(0,0,0,0.04)", color:theme.textMuted }}>⚙ {car.transmission}</span>
          <span className="cr-spec-pill" style={{ background:"rgba(0,0,0,0.04)", color:theme.textMuted }}>⛽ {car.fuel}</span>
          {car.ac && <span className="cr-spec-pill" style={{ background:"rgba(59,130,246,0.08)", color:"#3b82f6" }}>❄️ AC</span>}
        </div>
        <div className="cr-card-footer">
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:theme.accent, fontFamily:"'Playfair Display',serif" }}>{car.pricePerDay}</div>
            <div style={{ fontSize:10, color:theme.textMuted }}>per day</div>
          </div>
          <button className="cr-card-btn" style={{ background:car.available?theme.accent:"rgba(0,0,0,0.08)", color:car.available?"#fff":theme.textMuted }}
            onClick={e=>{e.stopPropagation();onClick();}}>
            {car.available?"View & Book →":"Details →"}
          </button>
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

        <section className="cr-hero">
          <div className="cr-hero-bg" />
          <div className="cr-hero-inner">
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(26,60,110,0.10)", border:"1px solid rgba(26,60,110,0.25)", color:theme.accent, fontSize:11, fontWeight:700, padding:"6px 14px", borderRadius:50, letterSpacing:"1px", textTransform:"uppercase", marginBottom:20 }}>
              🚗 Car Rental Service
            </div>
            <h1 className="cr-fu1" style={{ color:theme.text }}>
              Apni Marzi Ki <span className="cr-gold">Car Rent</span> Karein
            </h1>
            <p className="cr-fu2" style={{ color:theme.textMuted }}>
              Hatchback se Coaster tak — Pakistan ki top cars available hain. Aapka budget, aapki pasand. Driver ke saath ya khud drive karein.
            </p>
            <div className="cr-fu3" style={{ display:"flex", justifyContent:"center", gap:16, flexWrap:"wrap" }}>
              {[["🚗","19+","Cars Available"],["🏢","10","Brands"],["📍","All Cities","Pakistan Wide"],["⭐","4.9","Rating"]].map(([icon,val,lbl])=>(
                <div key={lbl} style={{ background:"rgba(255,255,255,0.75)", border:"1px solid rgba(0,0,0,0.07)", borderRadius:14, padding:"14px 18px", backdropFilter:"blur(10px)", textAlign:"center", minWidth:90, transition:"all 0.3s" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(26,60,110,0.35)";e.currentTarget.style.transform="translateY(-3px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(0,0,0,0.07)";e.currentTarget.style.transform="";}}>
                  <div style={{ fontSize:20, marginBottom:4 }}>{icon}</div>
                  <div style={{ fontWeight:800, fontSize:16, color:theme.accent, fontFamily:"'Playfair Display',serif" }}>{val}</div>
                  <div style={{ fontSize:11, color:theme.textMuted, marginTop:2 }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="cr-divider" />

        <section style={{ padding:"60px 5%" }}>
          <div className="cr-filters">
            <div className="cr-filter-row">
              <div className="cr-filter-group">
                <div className="cr-filter-label">🚗 Car Type</div>
                <div className="cr-chips">
                  {carTypes.map(t=>(
                    <button key={t} className={"cr-chip"+(typeFilter===t?" cr-chip-active":"")} style={{ color:typeFilter===t?"#fff":theme.textMuted }} onClick={()=>setTypeFilter(t)}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="cr-filter-row">
              <div className="cr-filter-group">
                <div className="cr-filter-label">🪑 Seaters</div>
                <div className="cr-chips">
                  {seatOptions.map(s=>(
                    <button key={s} className={"cr-chip"+(seaterFilter===s?" cr-chip-active":"")} style={{ color:seaterFilter===s?"#fff":theme.textMuted }} onClick={()=>setSeaterFilter(s)}>
                      {s==="All"?"All":s+" Seater"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="cr-filter-row" style={{ marginBottom:0 }}>
              <div className="cr-filter-group">
                <div className="cr-filter-label">🏢 Company / Brand</div>
                <div className="cr-chips">
                  {companies.map(c=>(
                    <button key={c} className={"cr-chip"+(companyFilter===c?" cr-chip-active":"")} style={{ color:companyFilter===c?"#fff":theme.textMuted }} onClick={()=>setCompanyFilter(c)}>{c}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="cr-sort-row">
            <div style={{ fontSize:14, color:theme.textMuted }}>
              <span style={{ color:theme.accent, fontWeight:700 }}>{filtered.length}</span> cars available
              {hasFilter && (
                <button onClick={resetFilters} style={{ marginLeft:12, background:"rgba(26,60,110,0.08)", border:"1px solid rgba(26,60,110,0.2)", color:theme.accent, borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                  ✕ Reset
                </button>
              )}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:13, color:theme.textMuted, whiteSpace:"nowrap" }}>Sort:</span>
              <select className="cr-sort-select" value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ color:theme.text, background:theme.bgCard }}>
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="seats-asc">Seaters: Small First</option>
                <option value="available">Available First</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"80px 20px" }}>
              <div style={{ fontSize:56, marginBottom:16 }}>🚗</div>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:theme.text, marginBottom:8 }}>Koi car nahi mili</h3>
              <p style={{ color:theme.textMuted, marginBottom:16 }}>Alag filter try karein</p>
              <button onClick={resetFilters} style={{ background:theme.accent, color:"#fff", border:"none", padding:"10px 24px", borderRadius:50, fontFamily:"'DM Sans',sans-serif", fontWeight:700, cursor:"pointer" }}>Reset Karein</button>
            </div>
          ) : (
            <div className="cr-grid">
              {filtered.map(car=><CarCard key={car.id} car={car} onClick={()=>setSelected(car)} />)}
            </div>
          )}

          <div style={{ marginTop:48, background:"rgba(26,60,110,0.05)", border:"1px dashed rgba(26,60,110,0.3)", borderRadius:14, padding:"18px 24px", textAlign:"center" }}>
            <p style={{ fontSize:14, color:theme.textMuted, margin:0, lineHeight:1.7 }}>
              <strong style={{ color:theme.accent }}>📌 Note:</strong> Prices per day hain. Fuel, toll, aur driver charges alag honge. 7+ days pe special discount milta hai — humse rabta karein.
            </p>
          </div>
        </section>

        {selected && <CarModal car={selected} onClose={()=>setSelected(null)} />}
        <Footer />
      </div>
    </>
  );
}