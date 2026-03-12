// ─── UmrahPackages.jsx — Edafay Travel & Tours ──────────────────────────────
import { useState, useMemo } from "react";
import theme from './theme.js';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import './UmrahPackages.css'

// ─── Data ─────────────────────────────────────────────────────────────────────
const packages = [
  {
    id: 1,
    name: "Economy Umrah Package",
    category: "Economy",
    tag: "Best Value",
    img: "https://images.unsplash.com/photo-1564769610726-59cead6a6f8f?w=600&q=80",
    price: "PKR 195,000",
    days: "15 Days",
    rating: 4.8,
    reviews: "1.2k",
    desc: "Budget-friendly Umrah package with comfortable stay near Haram. Perfect for first-time pilgrims.",
    seatsLeft: 12,
    hotels: [
      { name: "Al Shohada Hotel", stars: 3, distance: 450, distanceCity: "Makkah" },
      { name: "Madinah Hilton Suites", stars: 3, distance: 320, distanceCity: "Madina" },
    ],
    flight: { airline: "PIA", logo: "🇵🇰", type: "Direct", code: "PK-740" },
    includes: ["Visa", "Travel Insurance", "Air Tickets", "Hotel Accommodation", "Transport"],
  },
  {
    id: 2,
    name: "Standard Umrah Package",
    category: "Standard",
    tag: "Popular",
    img: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80",
    price: "PKR 280,000",
    days: "21 Days",
    rating: 4.9,
    reviews: "2.4k",
    desc: "Comfortable 4-star accommodation with guided Ziyarat tours in both Makkah and Madina.",
    seatsLeft: 8,
    hotels: [
      { name: "Makkah Clock Royal Tower", stars: 4, distance: 180, distanceCity: "Makkah" },
      { name: "Anwar Al Madinah", stars: 4, distance: 250, distanceCity: "Madina" },
    ],
    flight: { airline: "Saudi Airlines", logo: "🇸🇦", type: "Direct", code: "SV-720" },
    includes: ["Visa", "Travel Insurance", "Air Tickets", "Hotel Accommodation", "Transport"],
  },
  {
    id: 3,
    name: "Premium Umrah Package",
    category: "Premium",
    tag: "Recommended",
    img: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=600&q=80",
    price: "PKR 420,000",
    days: "14 Days",
    rating: 5.0,
    reviews: "980",
    desc: "5-star luxury experience with Haram-view rooms. Dedicated guide and VIP transport included.",
    seatsLeft: 5,
    hotels: [
      { name: "Swissotel Makkah", stars: 5, distance: 90, distanceCity: "Makkah" },
      { name: "Oberoi Madina", stars: 5, distance: 150, distanceCity: "Madina" },
    ],
    flight: { airline: "Emirates", logo: "🇦🇪", type: "Direct", code: "EK-601" },
    includes: ["Visa", "Travel Insurance", "Air Tickets", "Hotel Accommodation", "Transport"],
  },
  {
    id: 4,
    name: "Luxury Umrah Package",
    category: "Luxury",
    tag: "Exclusive",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    price: "PKR 650,000",
    days: "18 Days",
    rating: 5.0,
    reviews: "540",
    desc: "Ultra-luxury Umrah experience with private suites overlooking Kaaba. Concierge service 24/7.",
    seatsLeft: 3,
    hotels: [
      { name: "Fairmont Makkah Clock Royal", stars: 5, distance: 50, distanceCity: "Makkah" },
      { name: "The Ritz-Carlton Madina", stars: 5, distance: 100, distanceCity: "Madina" },
    ],
    flight: { airline: "Qatar Airways", logo: "🇶🇦", type: "Direct", code: "QR-1072" },
    includes: ["Visa", "Travel Insurance", "Air Tickets", "Hotel Accommodation", "Transport"],
  },
  {
    id: 5,
    name: "Family Umrah Package",
    category: "Family",
    tag: "Family Special",
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
    price: "PKR 520,000",
    days: "20 Days",
    rating: 4.9,
    reviews: "760",
    desc: "Specially designed for families with kids. Spacious rooms, family-friendly transport and guided tours.",
    seatsLeft: 6,
    hotels: [
      { name: "Hilton Suites Makkah", stars: 4, distance: 200, distanceCity: "Makkah" },
      { name: "Movenpick Hotel Madina", stars: 4, distance: 280, distanceCity: "Madina" },
    ],
    flight: { airline: "Turkish Airlines", logo: "🇹🇷", type: "Direct", code: "TK-780" },
    includes: ["Visa", "Travel Insurance", "Air Tickets", "Hotel Accommodation", "Transport"],
  },
  {
    id: 6,
    name: "Group Umrah Package",
    category: "Economy",
    tag: "Group Deal",
    img: "https://images.unsplash.com/photo-1516571137133-b5d1a6f14e96?w=600&q=80",
    price: "PKR 175,000",
    days: "12 Days",
    rating: 4.7,
    reviews: "1.8k",
    desc: "Affordable group package for 10+ people. Same quality, shared savings. Ideal for communities & offices.",
    seatsLeft: 20,
    hotels: [
      { name: "Al Marwa Rayhaan", stars: 3, distance: 500, distanceCity: "Makkah" },
      { name: "Dallah Taibah Hotel", stars: 3, distance: 400, distanceCity: "Madina" },
    ],
    flight: { airline: "PIA", logo: "🇵🇰", type: "Direct", code: "PK-742" },
    includes: ["Visa", "Travel Insurance", "Air Tickets", "Hotel Accommodation", "Transport"],
  },
];

const categories = ["All", "Economy", "Standard", "Premium", "Luxury", "Family"];

// ─── Star Rating Component ─────────────────────────────────────────────────────
function Stars({ count }) {
  return (
    <span style={{ color: "#f5c518", fontSize: 13, letterSpacing: 1 }}>
      {"★".repeat(count)}{"☆".repeat(5 - count)}
    </span>
  );
}

// ─── Seats Badge ───────────────────────────────────────────────────────────────
function SeatsBadge({ seats }) {
  const color = seats <= 5 ? "#ef4444" : seats <= 10 ? "#f59e0b" : "#22c55e";
  return (
    <div style={{
      position: "absolute", top: 12, left: 12,
      background: color, color: "#fff",
      fontSize: 11, fontWeight: 800,
      padding: "4px 10px", borderRadius: 20,
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      zIndex: 2,
    }}>
      {seats} Seats Left
    </div>
  );
}

// ─── Booking Form Modal ────────────────────────────────────────────────────────
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
      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: theme.text, marginBottom: 10 }}>
        Booking Request Mila!
      </h3>
      <p style={{ color: theme.textMuted, lineHeight: 1.7, marginBottom: 24 }}>
        Aapka <strong style={{ color: theme.accent }}>{pkg.name}</strong> ka request mil gaya. Hamari team 24 ghante mein aapse rabta karegi.
      </p>
      <button onClick={onClose} style={{
        background: theme.accent, color: "#0a0a0f", border: "none",
        padding: "12px 32px", borderRadius: 50, fontSize: 14, fontWeight: 700, cursor: "pointer",
        fontFamily: "'DM Sans',sans-serif",
      }}>Theek Hai, Wapas Jao</button>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Package Title */}
      <div style={{
        background: "rgba(232,196,106,0.08)", border: "1px solid rgba(232,196,106,0.25)",
        borderRadius: 12, padding: "12px 16px", marginBottom: 4,
      }}>
        <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 2 }}>Selected Package</div>
        <div style={{ fontWeight: 700, color: theme.accent, fontSize: 15 }}>{pkg.name}</div>
        <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{pkg.days} • {pkg.price}</div>
      </div>

      {/* Name */}
      <div>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(26,26,46,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.8px" }}>
          Full Name *
        </label>
        <input
          placeholder="e.g. Ahmed Khan"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          style={{
            width: "100%", padding: "13px 16px", borderRadius: 12, fontSize: 14,
            border: "1.5px solid rgba(0,0,0,0.1)", outline: "none",
            fontFamily: "'DM Sans',sans-serif", background: "rgba(255,255,255,0.9)",
            boxSizing: "border-box", transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = theme.accent}
          onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.1)"}
        />
      </div>

      {/* Phone */}
      <div>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(26,26,46,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.8px" }}>
          Phone Number *
        </label>
        <input
          placeholder="+92 300 0000000"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          style={{
            width: "100%", padding: "13px 16px", borderRadius: 12, fontSize: 14,
            border: "1.5px solid rgba(0,0,0,0.1)", outline: "none",
            fontFamily: "'DM Sans',sans-serif", background: "rgba(255,255,255,0.9)",
            boxSizing: "border-box", transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = theme.accent}
          onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.1)"}
        />
      </div>

      {/* Email (Optional) */}
      <div>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(26,26,46,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.8px" }}>
          Email <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(Optional)</span>
        </label>
        <input
          type="email"
          placeholder="example@email.com"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          style={{
            width: "100%", padding: "13px 16px", borderRadius: 12, fontSize: 14,
            border: "1.5px solid rgba(0,0,0,0.1)", outline: "none",
            fontFamily: "'DM Sans',sans-serif", background: "rgba(255,255,255,0.9)",
            boxSizing: "border-box", transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = theme.accent}
          onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.1)"}
        />
      </div>

      {/* City */}
      <div>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(26,26,46,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.8px" }}>
          City *
        </label>
        <input
          placeholder="e.g. Lahore, Karachi, Islamabad"
          value={form.city}
          onChange={e => setForm({ ...form, city: e.target.value })}
          style={{
            width: "100%", padding: "13px 16px", borderRadius: 12, fontSize: 14,
            border: "1.5px solid rgba(0,0,0,0.1)", outline: "none",
            fontFamily: "'DM Sans',sans-serif", background: "rgba(255,255,255,0.9)",
            boxSizing: "border-box", transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = theme.accent}
          onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.1)"}
        />
      </div>

      {/* Message (Optional) */}
      <div>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(26,26,46,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.8px" }}>
          Message <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(Optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="Koi khaas zaroorat ya sawal..."
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
          style={{
            width: "100%", padding: "13px 16px", borderRadius: 12, fontSize: 14,
            border: "1.5px solid rgba(0,0,0,0.1)", outline: "none",
            fontFamily: "'DM Sans',sans-serif", background: "rgba(255,255,255,0.9)",
            boxSizing: "border-box", resize: "none", transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = theme.accent}
          onBlur={e => e.target.style.borderColor = "rgba(0,0,0,0.1)"}
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || !form.name || !form.phone || !form.city}
        style={{
          background: (!form.name || !form.phone || !form.city) ? "rgba(232,196,106,0.4)" : theme.accent,
          color: "#0a0a0f", border: "none",
          padding: "15px", borderRadius: 50, fontSize: 15, fontWeight: 700,
          cursor: (!form.name || !form.phone || !form.city) ? "not-allowed" : "pointer",
          fontFamily: "'DM Sans',sans-serif", transition: "all 0.25s",
          width: "100%",
        }}
      >
        {loading ? "⏳ Bhej rahe hain..." : "✅ Book Package Submit Karein"}
      </button>
      <p style={{ fontSize: 11, color: theme.textMuted, textAlign: "center", margin: 0 }}>
        🔒 Aapki maloomat safe hai — Edafay kabhi share nahi karega.
      </p>
    </div>
  );
}

// ─── Package Detail Modal ──────────────────────────────────────────────────────
function PackageModal({ pkg, onClose }) {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div className="um-modal-overlay" onClick={onClose}>
      <div className="um-modal" onClick={e => e.stopPropagation()}
        style={{ background: theme.bg, border: `1px solid ${theme.border}` }}>

        {/* Close Button */}
        <button className="um-modal-close" onClick={onClose}
          style={{ color: theme.text }}>✕</button>

        {/* Hero Image */}
        <div className="um-modal-hero">
          <img src={pkg.img} alt={pkg.name} />
          <div className="um-modal-hero-overlay" />
          <SeatsBadge seats={pkg.seatsLeft} />
          <div className="um-modal-hero-text">
            <span style={{
              background: theme.accent, color: "#0a0a0f",
              fontSize: 11, fontWeight: 800, padding: "3px 12px",
              borderRadius: 20, marginBottom: 8, display: "inline-block",
            }}>{pkg.tag}</span>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
              {pkg.name}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>{pkg.days} • ⭐ {pkg.rating} ({pkg.reviews} reviews)</p>
          </div>
        </div>

        {/* Body */}
        <div className="um-modal-body">
          {!showBooking ? (
            <>
              {/* Description */}
              <p style={{ color: theme.textMuted, lineHeight: 1.75, fontSize: 14, marginBottom: 24 }}>{pkg.desc}</p>

              {/* ── Hotel Details ── */}
              <div className="um-section">
                <h3 className="um-section-title" style={{ color: theme.text }}>
                  🏨 Hotel Details
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {pkg.hotels.map((hotel, i) => (
                    <div key={i} style={{
                      background: theme.bgCard, border: `1px solid ${theme.border}`,
                      borderRadius: 14, padding: "16px 18px",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      flexWrap: "wrap", gap: 10,
                    }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: theme.text, marginBottom: 4 }}>
                          {hotel.name}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                          <Stars count={hotel.stars} />
                          <span style={{ fontSize: 12, color: theme.textMuted }}>
                            📍 {hotel.distanceCity} — {hotel.distance}m from Haram
                          </span>
                        </div>
                      </div>
                      <div style={{
                        background: `rgba(232,196,106,0.1)`,
                        border: "1px solid rgba(232,196,106,0.25)",
                        borderRadius: 10, padding: "6px 14px", textAlign: "center",
                      }}>
                        <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 2 }}>Category</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: theme.accent }}>
                          {"⭐".repeat(hotel.stars)} ({hotel.stars}-Star)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Price Includes ── */}
              <div className="um-section">
                <h3 className="um-section-title" style={{ color: theme.text }}>
                  ✅ Price Includes
                </h3>
                <div className="um-includes-grid">
                  {pkg.includes.map((item, i) => {
                    const icons = { "Visa": "🪪", "Travel Insurance": "🛡️", "Air Tickets": "✈️", "Hotel Accommodation": "🏨", "Transport": "🚌" };
                    return (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        background: theme.bgCard, border: `1px solid ${theme.border}`,
                        borderRadius: 12, padding: "12px 14px",
                      }}>
                        <span style={{ fontSize: 20 }}>{icons[item]}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{item}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Flight Details ── */}
              <div className="um-section">
                <h3 className="um-section-title" style={{ color: theme.text }}>
                  ✈️ Flight Details
                </h3>
                <div style={{
                  background: theme.bgCard, border: `1px solid ${theme.border}`,
                  borderRadius: 14, padding: "18px 20px",
                  display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
                }}>
                  <div style={{ fontSize: 42 }}>{pkg.flight.logo}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 17, color: theme.text, marginBottom: 4 }}>
                      {pkg.flight.airline}
                    </div>
                    <div style={{ fontSize: 13, color: theme.textMuted }}>Flight: {pkg.flight.code}</div>
                  </div>
                  <div style={{
                    background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
                    color: "#16a34a", borderRadius: 20, padding: "6px 16px",
                    fontSize: 12, fontWeight: 800, letterSpacing: "0.5px",
                  }}>
                    ✈ {pkg.flight.type} Flight
                  </div>
                </div>
              </div>

              {/* ── Note ── */}
              <div style={{
                background: "rgba(232,196,106,0.06)", border: "1px dashed rgba(232,196,106,0.4)",
                borderRadius: 12, padding: "14px 18px", marginBottom: 24,
              }}>
                <p style={{ fontSize: 13, color: theme.textMuted, margin: 0, lineHeight: 1.7 }}>
                  <strong style={{ color: theme.accent }}>📌 Note:</strong> PKR Announced soon per person — All rates are subject to availability.
                </p>
              </div>

              {/* ── Price & Buttons ── */}
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", gap: 12, flexWrap: "wrap",
                paddingTop: 16, borderTop: `1px solid ${theme.border}`,
              }}>
                <div>
                  <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 2 }}>Starting from</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: theme.accent, fontFamily: "'Playfair Display',serif" }}>
                    {pkg.price}
                  </div>
                  <div style={{ fontSize: 11, color: theme.textMuted }}>per person</div>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button onClick={onClose} style={{
                    background: "transparent", color: theme.text,
                    border: `1.5px solid ${theme.border}`,
                    padding: "12px 24px", borderRadius: 50,
                    fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.color = theme.accent; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.color = theme.text; }}
                  >← Wapas Jao</button>
                  <button onClick={() => setShowBooking(true)} style={{
                    background: theme.accent, color: "#0a0a0f", border: "none",
                    padding: "12px 28px", borderRadius: 50,
                    fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer",
                    transition: "all 0.25s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(232,196,106,0.4)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                  >📋 Book Package</button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Back to details */}
              <button onClick={() => setShowBooking(false)} style={{
                background: "none", border: "none", color: theme.accent,
                fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 20,
                padding: 0, fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", gap: 6,
              }}>← Package Details Pe Wapas Jao</button>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: theme.text, marginBottom: 20 }}>
                📋 Book <span style={{ color: theme.accent }}>{pkg.name}</span>
              </h3>
              <BookingForm pkg={pkg} onClose={onClose} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Package Card ──────────────────────────────────────────────────────────────
function PackageCard({ pkg, onClick }) {
  return (
    <div className="um-card" onClick={onClick}
      style={{ background: theme.bgCard, border: `1px solid ${theme.border}` }}>

      {/* Image */}
      <div className="um-card-img-wrap">
        <img src={pkg.img} alt={pkg.name} className="um-card-img" />
        <div className="um-card-overlay" />
        <SeatsBadge seats={pkg.seatsLeft} />
        <span className="um-card-tag" style={{ color: theme.accent }}>{pkg.tag}</span>
        <span className="um-card-cat">{pkg.category}</span>
      </div>

      {/* Body */}
      <div className="um-card-body">
        {/* Title & Price */}
        <div className="um-card-top">
          <div style={{ flex: 1 }}>
            <h3 className="um-card-name" style={{ color: theme.text }}>{pkg.name}</h3>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div className="um-card-price" style={{ color: theme.accent }}>{pkg.price}</div>
            <div style={{ fontSize: 10, color: theme.textMuted }}>per person</div>
          </div>
        </div>

        {/* Meta row */}
        <div className="um-card-meta" style={{ borderBottom: `1px solid ${theme.border}` }}>
          <span style={{ fontSize: 12, color: theme.textMuted }}>⏱ {pkg.days}</span>
          <span style={{ fontSize: 12, color: theme.accent }}>★ {pkg.rating}</span>
          <span style={{ fontSize: 12, color: theme.textMuted }}>({pkg.reviews})</span>
        </div>

        {/* Hotels mini preview */}
        <div style={{ padding: "12px 0 10px" }}>
          <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 8 }}>
            🏨 Hotels
          </div>
          {pkg.hotels.map((hotel, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>{hotel.name}</span>
                <span style={{ fontSize: 11, color: theme.textMuted, marginLeft: 6 }}>({hotel.distanceCity})</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <Stars count={hotel.stars} />
                <span style={{ fontSize: 11, color: theme.textMuted }}>{hotel.distance}m</span>
              </div>
            </div>
          ))}
        </div>

        {/* Flight mini */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: theme.bg, border: `1px solid ${theme.border}`,
          borderRadius: 10, padding: "8px 12px", marginBottom: 14,
        }}>
          <span style={{ fontSize: 18 }}>{pkg.flight.logo}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{pkg.flight.airline}</span>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "#16a34a", fontWeight: 700, background: "rgba(34,197,94,0.1)", padding: "2px 8px", borderRadius: 12 }}>
            ✈ {pkg.flight.type}
          </span>
        </div>

        {/* CTA */}
        <button className="um-card-btn"
          style={{ background: theme.accent, color: "#0a0a0f" }}
          onClick={e => { e.stopPropagation(); onClick(); }}
        >
          View Details & Book →
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function UmrahPackages() {
  const [filter, setFilter]     = useState("All");
  const [sortBy, setSortBy]     = useState("default");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let list = packages;
    if (filter !== "All") list = list.filter(p => p.category === filter);
    if (sortBy === "price-low")  list = [...list].sort((a, b) => parseInt(a.price.replace(/\D/g, "")) - parseInt(b.price.replace(/\D/g, "")));
    if (sortBy === "price-high") list = [...list].sort((a, b) => parseInt(b.price.replace(/\D/g, "")) - parseInt(a.price.replace(/\D/g, "")));
    if (sortBy === "rating")     list = [...list].sort((a, b) => b.rating - a.rating);
    if (sortBy === "days")       list = [...list].sort((a, b) => parseInt(a.days) - parseInt(b.days));
    return list;
  }, [filter, sortBy]);

  return (
    <div className="um-page" style={{ background: theme.bg, color: theme.text }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="um-hero">
        <div className="um-hero-bg" />
        <div className="um-hero-inner">
          <div className="um-badge um-fu">🕌 Mubarak Safar</div>
          <h1 className="um-fu1" style={{ color: theme.text }}>
            Apna <span className="um-gold">Umrah Package</span><br />Chunein
          </h1>
          <p className="um-fu2" style={{ color: theme.textMuted }}>
            Economy se Luxury tak — har budget ke liye perfect Umrah package. Visa, flights, hotels aur transport — sab kuch included.
          </p>
          <div className="um-hero-stats um-fu3">
            {[["🕌", "6+", "Packages"], ["✈️", "Direct", "Flights"], ["🏨", "5★", "Hotels"], ["👥", "10K+", "Pilgrims"]].map(([icon, val, lbl]) => (
              <div key={lbl} className="um-stat">
                <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: theme.accent, fontFamily: "'Playfair Display',serif" }}>{val}</div>
                <div style={{ fontSize: 11, color: theme.textMuted }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="um-divider" />

      {/* ── Filters & Grid ── */}
      <section style={{ padding: "60px 5%" }}>

        {/* Filter + Sort */}
        <div className="um-filter-bar">
          <div className="um-cats">
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className="um-cat-btn"
                style={{
                  background: filter === c ? theme.accent : "rgba(0,0,0,0.04)",
                  color:      filter === c ? "#0a0a0f"   : theme.textMuted,
                  border:     filter === c ? "none"      : `1px solid ${theme.border}`,
                }}
              >{c}</button>
            ))}
          </div>
          <div className="um-sort-wrap">
            <span style={{ fontSize: 13, color: theme.textMuted, whiteSpace: "nowrap" }}>Sort:</span>
            <select className="um-sort-select"
              value={sortBy} onChange={e => setSortBy(e.target.value)}
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

        {/* Cards Grid */}
        <div className="um-grid">
          {filtered.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg}
              onClick={() => setSelected(pkg)} />
          ))}
        </div>

        {/* Bottom Note */}
        <div style={{
          marginTop: 48, background: "rgba(232,196,106,0.06)",
          border: "1px dashed rgba(232,196,106,0.35)",
          borderRadius: 14, padding: "18px 24px", textAlign: "center",
        }}>
          <p style={{ fontSize: 14, color: theme.textMuted, margin: 0, lineHeight: 1.7 }}>
            <strong style={{ color: theme.accent }}>📌 Note:</strong> PKR Announced soon per person — All rates are subject to availability. Contact us for latest pricing.
          </p>
        </div>
      </section>

      {/* ── Package Detail Modal ── */}
      {selected && (
        <PackageModal pkg={selected} onClose={() => setSelected(null)} />
      )}

      <Footer />
    </div>
  );
}