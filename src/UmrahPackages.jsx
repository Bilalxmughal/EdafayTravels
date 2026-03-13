// ─── UmrahPackages.jsx — Edafay Travel & Tours ──────────────────────────────
import { useState, useMemo } from "react";
import theme from './theme.js';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

@keyframes umFadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
@keyframes umFadeIn { from{opacity:0} to{opacity:1} }

.um-fu1 { animation: umFadeUp 0.7s 0.1s ease both; }
.um-fu2 { animation: umFadeUp 0.7s 0.2s ease both; }

.um-page { min-height:100vh; font-family:'DM Sans',sans-serif; overflow-x:hidden; width:100%; }
.um-hero { position:relative; padding:140px 5% 80px; text-align:center; overflow:hidden; }
.um-hero-bg { position:absolute; inset:0; background: radial-gradient(ellipse at 60% 0%, rgba(26,60,110,0.10) 0%, transparent 55%), radial-gradient(ellipse at 10% 90%, rgba(76,175,125,0.06) 0%, transparent 50%); pointer-events:none; }
.um-hero-inner { position:relative; max-width:720px; margin:0 auto; }
.um-hero-inner h1 { font-family:'Playfair Display',serif; font-size:clamp(38px,5vw,66px); font-weight:700; line-height:1.12; letter-spacing:-1px; margin-bottom:18px; }
.um-hero-inner p { font-size:16px; line-height:1.8; max-width:520px; margin:0 auto 40px; }

.um-divider { height:1px; background:linear-gradient(to right, transparent, rgba(0,0,0,0.08), transparent); }
.um-filter-bar { display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:28px; flex-wrap:wrap; }
.um-cats { display:flex; gap:8px; flex-wrap:wrap; }
.um-cat-btn { padding:8px 18px; border-radius:50px; font-size:13px; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; }
.um-cat-btn:hover { transform:translateY(-1px); }
.um-sort-wrap { display:flex; align-items:center; gap:10px; flex-shrink:0; }
.um-sort-select { padding:9px 14px; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:13px; outline:none; cursor:pointer; }

.um-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
.um-card { border-radius:20px; overflow:hidden; cursor:pointer; transition:transform 0.3s,box-shadow 0.3s; animation:umFadeUp 0.6s ease both; }
.um-card:hover { transform:translateY(-7px); box-shadow:0 28px 56px rgba(0,0,0,0.11); }
.um-card-img-wrap { position:relative; height:200px; overflow:hidden; }
.um-card-img { width:100%; height:100%; object-fit:cover; transition:transform 0.5s; }
.um-card:hover .um-card-img { transform:scale(1.07); }
.um-card-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,0.5) 0%,transparent 55%); }
.um-card-tag { position:absolute; top:12px; right:12px; background:rgba(0,0,0,0.55); backdrop-filter:blur(8px); font-size:10px; font-weight:700; padding:3px 10px; border-radius:20px; border:1px solid rgba(26,60,110,0.3); }
.um-card-cat { position:absolute; bottom:12px; left:12px; background:rgba(0,0,0,0.6); backdrop-filter:blur(6px); color:#fff; font-size:10px; font-weight:700; padding:3px 10px; border-radius:20px; text-transform:uppercase; letter-spacing:0.5px; }
.um-card-body { padding:16px 18px 18px; }
.um-card-top { display:flex; justify-content:space-between; align-items:flex-start; gap:8px; margin-bottom:10px; }
.um-card-name { font-size:16px; font-weight:700; margin-bottom:0; line-height:1.3; }
.um-card-price { font-size:16px; font-weight:800; font-family:'Playfair Display',serif; }
.um-card-meta { display:flex; gap:10px; align-items:center; padding-bottom:12px; }
.um-card-btn { width:100%; padding:12px; border-radius:50px; border:none; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:all 0.25s; }
.um-card-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(26,60,110,0.35); }

.um-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.65); backdrop-filter:blur(8px); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; animation:umFadeIn 0.3s ease; }
.um-modal { border-radius:24px; overflow:hidden; width:100%; max-width:600px; max-height:90vh; overflow-y:auto; position:relative; animation:umFadeUp 0.4s ease both; }
.um-modal-close { position:absolute; top:14px; right:14px; background:rgba(255,255,255,0.92); border:none; width:36px; height:36px; border-radius:50%; font-size:15px; cursor:pointer; z-index:10; display:flex; align-items:center; justify-content:center; transition:all 0.2s; box-shadow:0 2px 8px rgba(0,0,0,0.12); }
.um-modal-close:hover { transform:scale(1.08); background:#fff; }
.um-modal-hero { position:relative; height:220px; }
.um-modal-hero img { width:100%; height:100%; object-fit:cover; }
.um-modal-hero-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,0.75) 0%,transparent 50%); }
.um-modal-hero-text { position:absolute; bottom:20px; left:22px; }
.um-modal-body { padding:24px; }
.um-section { margin-bottom:22px; }
.um-section-title { font-size:15px; font-weight:700; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid rgba(0,0,0,0.07); }
.um-includes-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }

/* Hotel thumbnails */
.um-hotel-thumbs { display:flex; gap:7px; margin-top:10px; flex-wrap:wrap; }
.um-hotel-thumb { width:62px; height:46px; border-radius:8px; overflow:hidden; cursor:pointer; border:2px solid transparent; transition:all 0.2s; flex-shrink:0; }
.um-hotel-thumb:hover { border-color:#1a3c6e; transform:scale(1.06); }
.um-hotel-thumb img { width:100%; height:100%; object-fit:cover; }

/* Map button */
.um-map-btn { display:inline-flex; align-items:center; gap:4px; background:rgba(66,133,244,0.10); border:1px solid rgba(66,133,244,0.28); color:#4285f4; font-size:11px; font-weight:700; padding:3px 9px; border-radius:20px; text-decoration:none; cursor:pointer; transition:all 0.2s; flex-shrink:0; }
.um-map-btn:hover { background:rgba(66,133,244,0.20); transform:translateY(-1px); }

/* Lightbox */
.um-lightbox { position:fixed; inset:0; background:rgba(0,0,0,0.93); z-index:999; display:flex; align-items:center; justify-content:center; animation:umFadeIn 0.2s ease; }
.um-lightbox-img { max-width:90vw; max-height:85vh; border-radius:12px; object-fit:contain; }
.um-lightbox-close { position:absolute; top:20px; right:24px; background:rgba(255,255,255,0.15); border:none; color:#fff; width:40px; height:40px; border-radius:50%; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.2s; }
.um-lightbox-close:hover { background:rgba(255,255,255,0.28); }
.um-lightbox-arrow { position:absolute; top:50%; transform:translateY(-50%); background:rgba(255,255,255,0.15); border:none; color:#fff; width:44px; height:44px; border-radius:50%; font-size:22px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.2s; }
.um-lightbox-arrow:hover { background:rgba(255,255,255,0.28); }

.um-gold { background:linear-gradient(135deg,#1a3c6e,#2a5298,#1a3c6e); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

@media (max-width:1024px) { .um-grid { grid-template-columns:repeat(2,1fr); } }
@media (max-width:768px) {
  .um-hero { padding:110px 5% 60px; }
  .um-grid { grid-template-columns:1fr 1fr; gap:16px; }
  .um-filter-bar { flex-direction:column; align-items:flex-start; }
  .um-sort-wrap { width:100%; }
  .um-sort-select { flex:1; }
  .um-includes-grid { grid-template-columns:1fr; }
}
@media (max-width:560px) {
  .um-grid { grid-template-columns:1fr; }
  .um-cats { gap:6px; }
  .um-cat-btn { padding:7px 13px; font-size:12px; }
  .um-modal { border-radius:16px; }
}
`;

// ─── Google Maps pin icon ─────────────────────────────────────────────────────
function MapPinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const packages = [
  {
    id: 1, name: "Economy Umrah Package", category: "Economy", tag: "Best Value",
    img: "https://images.unsplash.com/photo-1564769610726-59cead6a6f8f?w=600&q=80",
    price: "PKR 195,000", days: "15 Days", rating: 4.8, reviews: "1.2k",
    desc: "Budget-friendly Umrah package with comfortable stay near Haram. Perfect for first-time pilgrims.",
    seatsLeft: 12,
    hotels: [
      { name: "Al Shohada Hotel", stars: 3, distance: 450, distanceCity: "Makkah", mapUrl: "https://maps.google.com/?q=Al+Shohada+Hotel+Makkah", images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80","https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80","https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80"] },
      { name: "Madinah Hilton Suites", stars: 3, distance: 320, distanceCity: "Madina", mapUrl: "https://maps.google.com/?q=Hilton+Suites+Madinah", images: ["https://images.unsplash.com/photo-1455587734955-081b22074882?w=600&q=80","https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=600&q=80","https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80"] },
    ],
    flight: { airline: "PIA", logo: "🇵🇰", type: "Direct", code: "PK-740", departure: "Every Monday & Friday" },
    includes: ["Visa", "Travel Insurance", "Air Tickets", "Hotel Accommodation", "Transport"],
  },
  {
    id: 2, name: "Standard Umrah Package", category: "Standard", tag: "Popular",
    img: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80",
    price: "PKR 280,000", days: "21 Days", rating: 4.9, reviews: "2.4k",
    desc: "Comfortable 4-star accommodation with guided Ziyarat tours in both Makkah and Madina.",
    seatsLeft: 8,
    hotels: [
      { name: "Makkah Clock Royal Tower", stars: 4, distance: 180, distanceCity: "Makkah", mapUrl: "https://maps.google.com/?q=Makkah+Clock+Royal+Tower", images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80","https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80","https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80"] },
      { name: "Anwar Al Madinah", stars: 4, distance: 250, distanceCity: "Madina", mapUrl: "https://maps.google.com/?q=Anwar+Al+Madinah+Hotel", images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80","https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=600&q=80","https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80"] },
    ],
    flight: { airline: "Saudi Airlines", logo: "🇸🇦", type: "Direct", code: "SV-720", departure: "Every Tuesday & Saturday" },
    includes: ["Visa", "Travel Insurance", "Air Tickets", "Hotel Accommodation", "Transport"],
  },
  {
    id: 3, name: "Premium Umrah Package", category: "Premium", tag: "Recommended",
    img: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=600&q=80",
    price: "PKR 420,000", days: "14 Days", rating: 5.0, reviews: "980",
    desc: "5-star luxury experience with Haram-view rooms. Dedicated guide and VIP transport included.",
    seatsLeft: 5,
    hotels: [
      { name: "Swissotel Makkah", stars: 5, distance: 90, distanceCity: "Makkah", mapUrl: "https://maps.google.com/?q=Swissotel+Makkah", images: ["https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80","https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80","https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80"] },
      { name: "Oberoi Madina", stars: 5, distance: 150, distanceCity: "Madina", mapUrl: "https://maps.google.com/?q=Oberoi+Hotel+Madinah", images: ["https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?w=600&q=80","https://images.unsplash.com/photo-1587213811864-c4742e30c0f5?w=600&q=80","https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&q=80"] },
    ],
    flight: { airline: "Emirates", logo: "🇦🇪", type: "Direct", code: "EK-601", departure: "Every Wednesday & Sunday" },
    includes: ["Visa", "Travel Insurance", "Air Tickets", "Hotel Accommodation", "Transport"],
  },
  {
    id: 4, name: "Luxury Umrah Package", category: "Luxury", tag: "Exclusive",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    price: "PKR 650,000", days: "18 Days", rating: 5.0, reviews: "540",
    desc: "Ultra-luxury Umrah experience with private suites overlooking Kaaba. Concierge service 24/7.",
    seatsLeft: 3,
    hotels: [
      { name: "Fairmont Makkah Clock Royal", stars: 5, distance: 50, distanceCity: "Makkah", mapUrl: "https://maps.google.com/?q=Fairmont+Makkah+Clock+Royal+Tower", images: ["https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=600&q=80","https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80","https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=600&q=80"] },
      { name: "The Ritz-Carlton Madina", stars: 5, distance: 100, distanceCity: "Madina", mapUrl: "https://maps.google.com/?q=Ritz+Carlton+Madinah", images: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80","https://images.unsplash.com/photo-1591088398332-8596b069bd74?w=600&q=80","https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=600&q=80"] },
    ],
    flight: { airline: "Qatar Airways", logo: "🇶🇦", type: "Direct", code: "QR-1072", departure: "Every Thursday & Sunday" },
    includes: ["Visa", "Travel Insurance", "Air Tickets", "Hotel Accommodation", "Transport"],
  },
  {
    id: 5, name: "Family Umrah Package", category: "Family", tag: "Family Special",
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
    price: "PKR 520,000", days: "20 Days", rating: 4.9, reviews: "760",
    desc: "Specially designed for families with kids. Spacious rooms, family-friendly transport and guided tours.",
    seatsLeft: 6,
    hotels: [
      { name: "Hilton Suites Makkah", stars: 4, distance: 200, distanceCity: "Makkah", mapUrl: "https://maps.google.com/?q=Hilton+Suites+Makkah", images: ["https://images.unsplash.com/photo-1584132905271-512c958d674a?w=600&q=80","https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&q=80","https://images.unsplash.com/photo-1594563703937-fdc640497dcd?w=600&q=80"] },
      { name: "Movenpick Hotel Madina", stars: 4, distance: 280, distanceCity: "Madina", mapUrl: "https://maps.google.com/?q=Movenpick+Hotel+Madinah", images: ["https://images.unsplash.com/photo-1603595022356-7e8c4e8a6c26?w=600&q=80","https://images.unsplash.com/photo-1578898886225-cb3a0f467f3c?w=600&q=80","https://images.unsplash.com/photo-1605346434674-a440ca4dc4c0?w=600&q=80"] },
    ],
    flight: { airline: "Turkish Airlines", logo: "🇹🇷", type: "Direct", code: "TK-780", departure: "Every Monday & Thursday" },
    includes: ["Visa", "Travel Insurance", "Air Tickets", "Hotel Accommodation", "Transport"],
  },
  {
    id: 6, name: "Group Umrah Package", category: "Economy", tag: "Group Deal",
    img: "https://images.unsplash.com/photo-1516571137133-b5d1a6f14e96?w=600&q=80",
    price: "PKR 175,000", days: "12 Days", rating: 4.7, reviews: "1.8k",
    desc: "Affordable group package for 10+ people. Same quality, shared savings. Ideal for communities & offices.",
    seatsLeft: 20,
    hotels: [
      { name: "Al Marwa Rayhaan", stars: 3, distance: 500, distanceCity: "Makkah", mapUrl: "https://maps.google.com/?q=Al+Marwa+Rayhaan+Makkah", images: ["https://images.unsplash.com/photo-1586611292717-f828b167408c?w=600&q=80","https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=600&q=80","https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80"] },
      { name: "Dallah Taibah Hotel", stars: 3, distance: 400, distanceCity: "Madina", mapUrl: "https://maps.google.com/?q=Dallah+Taibah+Hotel+Madinah", images: ["https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&q=80","https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80","https://images.unsplash.com/photo-1576354302919-96748cb8299e?w=600&q=80"] },
    ],
    flight: { airline: "PIA", logo: "🇵🇰", type: "Direct", code: "PK-742", departure: "Every Wednesday & Saturday" },
    includes: ["Visa", "Travel Insurance", "Air Tickets", "Hotel Accommodation", "Transport"],
  },
];

const categories = ["All", "Economy", "Standard", "Premium", "Luxury", "Family"];

// ─── Lightbox with prev/next ──────────────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const prev = e => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); };
  const next = e => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); };
  return (
    <div className="um-lightbox" onClick={onClose}>
      <button className="um-lightbox-close" onClick={onClose}>✕</button>
      <button className="um-lightbox-arrow" style={{ left: 16 }} onClick={prev}>‹</button>
      <img className="um-lightbox-img" src={images[idx]} alt={`Hotel ${idx + 1}`} onClick={e => e.stopPropagation()} />
      <button className="um-lightbox-arrow" style={{ right: 16 }} onClick={next}>›</button>
      <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
        {images.map((_, i) => (
          <div key={i} onClick={e => { e.stopPropagation(); setIdx(i); }}
            style={{ width: 8, height: 8, borderRadius: "50%", background: i === idx ? "#1a3c6e" : "rgba(255,255,255,0.4)", cursor: "pointer", transition: "background 0.2s" }} />
        ))}
      </div>
    </div>
  );
}

// ─── Hotel row inside modal ───────────────────────────────────────────────────
function HotelRow({ hotel }) {
  const [lightbox, setLightbox] = useState(null);
  return (
    <>
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, padding: "14px 16px" }}>
        {/* Name + Map link + Star category (no star symbols) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", flex: 1 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: theme.text }}>{hotel.name}</span>
            <a href={hotel.mapUrl} target="_blank" rel="noopener noreferrer" className="um-map-btn" onClick={e => e.stopPropagation()}>
              <MapPinIcon /> Map
            </a>
          </div>
          {/* Category badge — plain text "X-Star", no ★ symbols */}
          <div style={{ background: "rgba(26,60,110,0.10)", border: "1px solid rgba(26,60,110,0.25)", borderRadius: 10, padding: "5px 12px", textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 10, color: theme.textMuted, marginBottom: 1 }}>Category</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: theme.accent }}>{hotel.stars}-Star</div>
          </div>
        </div>
        {/* Distance */}
        <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 10 }}>
          📍 {hotel.distanceCity} — {hotel.distance}m from Haram
        </div>
        {/* Thumbnails */}
        <div className="um-hotel-thumbs">
          {hotel.images.map((img, i) => (
            <div key={i} className="um-hotel-thumb" title="Click to view" onClick={e => { e.stopPropagation(); setLightbox(i); }}>
              <img src={img} alt={`${hotel.name} ${i + 1}`} />
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 62, height: 46, borderRadius: 8, background: "rgba(26,60,110,0.07)", border: "1px dashed rgba(26,60,110,0.35)", fontSize: 10, color: theme.textMuted, fontWeight: 600, flexShrink: 0 }}>
            🖼 View
          </div>
        </div>
      </div>
      {lightbox !== null && <Lightbox images={hotel.images} startIndex={lightbox} onClose={() => setLightbox(null)} />}
    </>
  );
}

function SeatsBadge({ seats }) {
  const color = seats <= 5 ? "#ef4444" : seats <= 10 ? "#f59e0b" : "#22c55e";
  return (
    <div style={{ position: "absolute", top: 12, left: 12, background: color, color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.2)", zIndex: 2 }}>
      {seats} Seats Left
    </div>
  );
}

function BookingForm({ pkg, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.city) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1500);
  };

  if (submitted) return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: theme.text, marginBottom: 10 }}>Booking Request Received!</h3>
      <p style={{ color: theme.textMuted, lineHeight: 1.7, marginBottom: 24 }}>We've received your <strong style={{ color: theme.accent }}>{pkg.name}</strong> request. Our team will contact you within 24 hours.</p>
      <button onClick={onClose} style={{ background: theme.accent, color: "#ffffff", border: "none", padding: "12px 32px", borderRadius: 50, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Back</button>
    </div>
  );

  const inp = { width: "100%", padding: "13px 16px", borderRadius: 12, fontSize: 14, border: "1.5px solid rgba(0,0,0,0.1)", outline: "none", fontFamily: "'DM Sans',sans-serif", background: "rgba(255,255,255,0.9)", boxSizing: "border-box", transition: "border-color 0.2s" };
  const lbl = { display: "block", fontSize: 12, fontWeight: 600, color: "rgba(26,26,46,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.8px" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "rgba(26,60,110,0.08)", border: "1px solid rgba(26,60,110,0.25)", borderRadius: 12, padding: "12px 16px", marginBottom: 4 }}>
        <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 2 }}>Selected Package</div>
        <div style={{ fontWeight: 700, color: theme.accent, fontSize: 15 }}>{pkg.name}</div>
        <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{pkg.days} • {pkg.price}</div>
      </div>
      {[["Full Name *","text","e.g. Ahmed Khan","name"],["Phone Number *","text","+92 300 0000000","phone"],["Email","email","example@email.com","email"],["City *","text","e.g. Lahore, Karachi","city"]].map(([label, type, ph, key]) => (
        <div key={key}>
          <label style={lbl}>{label}</label>
          <input type={type} placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={inp}
            onFocus={e => e.target.style.borderColor = theme.accent} onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.1)"} />
        </div>
      ))}
      <div>
        <label style={lbl}>Message (Optional)</label>
        <textarea rows={3} placeholder="Koi khaas zaroorat ya sawal..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ ...inp, resize: "none" }}
          onFocus={e => e.target.style.borderColor = theme.accent} onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.1)"} />
      </div>
      <button onClick={handleSubmit} disabled={loading || !form.name || !form.phone || !form.city}
        style={{ background: (!form.name || !form.phone || !form.city) ? "rgba(26,60,110,0.4)" : theme.accent, color: "#ffffff", border: "none", padding: "15px", borderRadius: 50, fontSize: 15, fontWeight: 700, width: "100%", cursor: (!form.name || !form.phone || !form.city) ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.25s" }}>
        {loading ? "Submitting..." : "Package Submit"}
      </button>
      <p style={{ fontSize: 11, color: theme.textMuted, textAlign: "center", margin: 0 }}>Your information is safe — Edafay never share your information.</p>
    </div>
  );
}

function PackageModal({ pkg, onClose }) {
  const [showBooking, setShowBooking] = useState(false);
  const icons = { "Visa": "", "Travel Insurance": "", "Air Tickets": "", "Hotel Accommodation": "", "Transport": "" };

  return (
    <div className="um-modal-overlay" onClick={onClose}>
      <div className="um-modal" onClick={e => e.stopPropagation()} style={{ background: theme.bg, border: `1px solid ${theme.border}` }}>
        <button className="um-modal-close" onClick={onClose} style={{ color: theme.text }}>✕</button>
        <div className="um-modal-hero">
          <img src={pkg.img} alt={pkg.name} />
          <div className="um-modal-hero-overlay" />
          <SeatsBadge seats={pkg.seatsLeft} />
          <div className="um-modal-hero-text">
            <span style={{ background: theme.accent, color: "#ffffff", fontSize: 11, fontWeight: 800, padding: "3px 12px", borderRadius: 20, marginBottom: 8, display: "inline-block" }}>{pkg.tag}</span>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{pkg.name}</h2>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>{pkg.days} • ⭐ {pkg.rating} ({pkg.reviews} reviews)</p>
          </div>
        </div>

        <div className="um-modal-body">
          {!showBooking ? (
            <>
              <p style={{ color: theme.textMuted, lineHeight: 1.75, fontSize: 14, marginBottom: 24 }}>{pkg.desc}</p>

              {/* 🏨 Hotel Details */}
              <div className="um-section">
                <h3 className="um-section-title" style={{ color: theme.text }}>Hotel Details</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {pkg.hotels.map((hotel, i) => <HotelRow key={i} hotel={hotel} />)}
                </div>
              </div>

              {/* ✅ Price Includes */}
              <div className="um-section">
                <h3 className="um-section-title" style={{ color: theme.text }}>Price Includes</h3>
                <div className="um-includes-grid">
                  {pkg.includes.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "12px 14px" }}>
                      <span style={{ fontSize: 20 }}>{icons[item]}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Flight Details — with departure schedule */}
              <div className="um-section">
                <h3 className="um-section-title" style={{ color: theme.text }}> Flight Details</h3>
                <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
                    <div style={{ fontSize: 42 }}>{pkg.flight.logo}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 17, color: theme.text, marginBottom: 3 }}>{pkg.flight.airline}</div>
                      <div style={{ fontSize: 13, color: theme.textMuted }}>Flight: {pkg.flight.code}</div>
                    </div>
                    <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#16a34a", borderRadius: 20, padding: "6px 16px", fontSize: 12, fontWeight: 800 }}>
                      ✈ {pkg.flight.type} Flight
                    </div>
                  </div>
                  {/* Departure row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 12, borderTop: `1px solid ${theme.border}` }}>
                    <span style={{ fontSize: 20 }}>📅</span>
                    <div>
                      <div style={{ fontSize: 10, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>Departure Schedule</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: theme.accent }}>{pkg.flight.departure}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div style={{ background: "rgba(26,60,110,0.06)", border: "1px dashed rgba(26,60,110,0.4)", borderRadius: 12, padding: "14px 18px", marginBottom: 24 }}>
                <p style={{ fontSize: 13, color: theme.textMuted, margin: 0, lineHeight: 1.7 }}>
                  <strong style={{ color: theme.accent }}>📌 Note:</strong> PKR Announced soon per person — All rates are subject to availability.
                </p>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", paddingTop: 16, borderTop: `1px solid ${theme.border}` }}>
                <div>
                  <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 2 }}>Starting from</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: theme.accent, fontFamily: "'Playfair Display',serif" }}>{pkg.price}</div>
                  <div style={{ fontSize: 11, color: theme.textMuted }}>per person</div>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button onClick={onClose} style={{ background: "transparent", color: theme.text, border: `1.5px solid ${theme.border}`, padding: "12px 24px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, cursor: "pointer" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.accent; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.text; }}>
                    ← Back
                  </button>
                  <button onClick={() => setShowBooking(true)} style={{ background: theme.accent, color: "#ffffff", border: "none", padding: "12px 28px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(26,60,110,0.4)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                    Book Package
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <button onClick={() => setShowBooking(false)} style={{ background: "none", border: "none", color: theme.accent, fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 20, padding: 0, fontFamily: "'DM Sans',sans-serif" }}>
                ← Back to Package Details
              </button>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: theme.text, marginBottom: 20 }}>
                Book <span style={{ color: theme.accent }}>{pkg.name}</span>
              </h3>
              <BookingForm pkg={pkg} onClose={onClose} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PackageCard({ pkg, onClick }) {
  return (
    <div className="um-card" onClick={onClick} style={{ background: theme.bgCard, border: `1px solid ${theme.border}` }}>
      <div className="um-card-img-wrap">
        <img src={pkg.img} alt={pkg.name} className="um-card-img" />
        <div className="um-card-overlay" />
        <SeatsBadge seats={pkg.seatsLeft} />
        <span className="um-card-tag" style={{ color: theme.accent }}>{pkg.tag}</span>
        <span className="um-card-cat">{pkg.category}</span>
      </div>
      <div className="um-card-body">
        <div className="um-card-top">
          <div style={{ flex: 1 }}><h3 className="um-card-name" style={{ color: theme.text }}>{pkg.name}</h3></div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div className="um-card-price" style={{ color: theme.accent }}>{pkg.price}</div>
            <div style={{ fontSize: 10, color: theme.textMuted }}>per person</div>
          </div>
        </div>
        <div className="um-card-meta" style={{ borderBottom: `1px solid ${theme.border}` }}>
          <span style={{ fontSize: 12, color: theme.textMuted }}>⏱ {pkg.days}</span>
          <span style={{ fontSize: 12, color: theme.accent }}>★ {pkg.rating}</span>
          <span style={{ fontSize: 12, color: theme.textMuted }}>({pkg.reviews})</span>
        </div>
        <div style={{ padding: "12px 0 10px" }}>
          <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8 }}>🏨 Hotels</div>
          {pkg.hotels.map((hotel, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>{hotel.name}</span>
                <span style={{ fontSize: 11, color: theme.textMuted, marginLeft: 6 }}>({hotel.distanceCity})</span>
              </div>
              {/* Simple X-Star text — no star symbols */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: theme.accent, fontWeight: 700 }}>{hotel.stars}-Star</span>
                <span style={{ fontSize: 11, color: theme.textMuted }}>{hotel.distance}m</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "8px 12px", marginBottom: 14 }}>
          <span style={{ fontSize: 18 }}>{pkg.flight.logo}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{pkg.flight.airline}</span>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "#16a34a", fontWeight: 700, background: "rgba(34,197,94,0.1)", padding: "2px 8px", borderRadius: 12 }}>✈ {pkg.flight.type}</span>
        </div>
        <button className="um-card-btn" style={{ background: theme.accent, color: "#ffffff" }} onClick={e => { e.stopPropagation(); onClick(); }}>
          View Details & Book →
        </button>
      </div>
    </div>
  );
}

export default function UmrahPackages() {
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let list = packages;
    if (filter !== "All") list = list.filter(p => p.category === filter);
    if (sortBy === "price-low")  list = [...list].sort((a, b) => parseInt(a.price.replace(/\D/g,"")) - parseInt(b.price.replace(/\D/g,"")));
    if (sortBy === "price-high") list = [...list].sort((a, b) => parseInt(b.price.replace(/\D/g,"")) - parseInt(a.price.replace(/\D/g,"")));
    if (sortBy === "rating")     list = [...list].sort((a, b) => b.rating - a.rating);
    if (sortBy === "days")       list = [...list].sort((a, b) => parseInt(a.days) - parseInt(b.days));
    return list;
  }, [filter, sortBy]);

  return (
    <>
      <style>{CSS}</style>
      <div className="um-page" style={{ background: theme.bg, color: theme.text }}>
        <Navbar />
        <section className="um-hero">
          <div className="um-hero-bg" />
          <div className="um-hero-inner">
            <h1 className="um-fu1" style={{ color: theme.text }}>Choose best <span className="um-gold">Umrah Package</span></h1>
            <p className="um-fu2" style={{ color: theme.textMuted }}>From economy to luxury, we offer the perfect Umrah package for every budget — including visa, flights, hotels, and transportation.</p>
          </div>
        </section>
        <div className="um-divider" />
        <section style={{ padding: "60px 5%" }}>
          <div className="um-filter-bar">
            <div className="um-cats">
              {categories.map(c => (
                <button key={c} onClick={() => setFilter(c)} className="um-cat-btn"
                  style={{ background: filter === c ? theme.accent : "rgba(0,0,0,0.04)", color: filter === c ? "#ffffff" : theme.textMuted, border: filter === c ? "none" : `1px solid ${theme.border}` }}>
                  {c}
                </button>
              ))}
            </div>
            <div className="um-sort-wrap">
              <span style={{ fontSize: 13, color: theme.textMuted, whiteSpace: "nowrap" }}>Sort:</span>
              <select className="um-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ color: theme.text, background: theme.bgCard, border: `1px solid ${theme.border}` }}>
                <option value="default">Default</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="rating">Highest Rated</option>
                <option value="days">Shortest Duration</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 28, fontSize: 14, color: theme.textMuted }}>
            <span style={{ color: theme.accent, fontWeight: 700 }}>{filtered.length}</span> packages available
          </div>
          <div className="um-grid">
            {filtered.map(pkg => <PackageCard key={pkg.id} pkg={pkg} onClick={() => setSelected(pkg)} />)}
          </div>
          <div style={{ marginTop: 48, background: "rgba(26,60,110,0.06)", border: "1px dashed rgba(26,60,110,0.35)", borderRadius: 14, padding: "18px 24px", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: theme.textMuted, margin: 0, lineHeight: 1.7 }}>
              <strong style={{ color: theme.accent }}>📌 Note:</strong> PKR Announced soon per person — All rates are subject to availability. Contact us for latest pricing.
            </p>
          </div>
        </section>
        {selected && <PackageModal pkg={selected} onClose={() => setSelected(null)} />}
        <Footer />
      </div>
    </>
  );
}