// ─── Destinations.jsx — Edafay Travel & Tours ───────────────────────────────
import { useState, useMemo } from "react";
import theme from './theme.js';
import './Destinations.css';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

// ─── Full Destinations Data ───────────────────────────────────────────────────
const allDestinations = [
  // Middle East
  { id: 1,  name: "Dubai",          country: "UAE",          category: "Luxury",    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",  price: "Rs. 350,000", rating: 4.9, reviews: "2.4k", tag: "Hot Deal",   days: "7 days",  desc: "Experience the Burj Khalifa, thrilling desert safaris, and world-class shopping." },
  { id: 2,  name: "Riyadh",         country: "Saudia",       category: "Cultural",  img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80",  price: "Rs. 290,000", rating: 4.8, reviews: "1.8k", tag: "Popular",    days: "10 days", desc: "Explore Saudi Arabia’s historic capital and its vibrant modern culture." },
  { id: 3,  name: "Doha",           country: "Qatar",        category: "Luxury",    img: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&q=80",  price: "Rs. 320,000", rating: 4.9, reviews: "1.5k", tag: "Adventure",  days: "9 days",  desc: "FIFA’s host city — marvel at modern architecture and experience true Arabian hospitality." },
  { id: 4,  name: "Mecca & Madina", country: "Saudia",       category: "Umrah",     img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",  price: "Rs. 195,000", rating: 5.0, reviews: "5.2k", tag: "Blessed",    days: "15 days", desc: "Embark on the blessed journey of Umrah — a haven of spiritual serenity." },
  // Europe / Turkey
  { id: 5,  name: "Istanbul",       country: "Turkey",       category: "Cultural",  img: "https://images.unsplash.com/photo-1533606688076-b6683a5f59f1?w=600&q=80",  price: "Rs. 420,000", rating: 5.0, reviews: "980",  tag: "Luxury",     days: "6 days",  desc: "Discover the wonders of Hagia Sophia, the beauty of the Bosphorus, and the flavors of Turkish cuisine." },
  { id: 6,  name: "Antalya",        country: "Turkey",       category: "Beach",     img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",  price: "Rs. 380,000", rating: 4.8, reviews: "1.1k", tag: "Beach",      days: "8 days",  desc: "Experience Turkey’s paradise — with crystal-clear waters and sun-kissed golden beaches." },
  // Central Asia
  { id: 7,  name: "Baku",           country: "Azerbaijan",   category: "Adventure", img: "https://images.unsplash.com/photo-1519677584237-752f8853252e?w=600&q=80",  price: "Rs. 260,000", rating: 4.7, reviews: "3.1k", tag: "Best Value", days: "8 days",  desc: "Fire Land — where ancient history meets modern wonders." },
  { id: 8,  name: "Almaty",         country: "Kazakhstan",   category: "Adventure", img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80",  price: "Rs. 310,000", rating: 4.6, reviews: "640",  tag: "Hidden Gem", days: "9 days",  desc: "A city embraced by nature — lush, green, and breathtakingly beautiful." },
  // Southeast Asia
  { id: 9,  name: "Maldives",       country: "Maldives",     category: "Beach",     img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80",  price: "Rs. 650,000", rating: 5.0, reviews: "750",  tag: "Luxury",     days: "5 days",  desc: "Experience the world’s most stunning overwater bungalows." },
  { id: 10, name: "Kuala Lumpur",   country: "Malaysia",     category: "Cultural",  img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&q=80",  price: "Rs. 280,000", rating: 4.7, reviews: "1.9k", tag: "Popular",    days: "7 days",  desc: "Marvel at the Petronas Towers, savor delicious halal cuisine, and enjoy a vibrant nightlife." },
  { id: 11, name: "Bali",           country: "Indonesia",    category: "Beach",     img: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&q=80",  price: "Rs. 340,000", rating: 4.8, reviews: "2.2k", tag: "Romantic",   days: "10 days", desc: "Discover a one-of-a-kind blend of temples, scenic rice terraces, and vibrant surf culture." },
  { id: 12, name: "Bangkok",        country: "Thailand",     category: "Cultural",  img: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80",  price: "Rs. 240,000", rating: 4.6, reviews: "2.8k", tag: "Budget",     days: "8 days",  desc: "Experience the charm of street food, explore historic temples, and ride the iconic tuk-tuks for an unforgettable adventure." },
];

const categories = ["All", "Umrah", "Luxury", "Beach", "Cultural", "Adventure"];

// ─── Destinations Page ────────────────────────────────────────────────────────
export default function Destinations() {
  const [filter, setFilter]   = useState("All");
  const [search, setSearch]   = useState("");
  const [sortBy, setSortBy]   = useState("default");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let list = allDestinations;
    if (filter !== "All") list = list.filter(d => d.category === filter);
    if (search.trim())    list = list.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.country.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy === "price-low")  list = [...list].sort((a,b) => parseInt(a.price.replace(/\D/g,"")) - parseInt(b.price.replace(/\D/g,"")));
    if (sortBy === "price-high") list = [...list].sort((a,b) => parseInt(b.price.replace(/\D/g,"")) - parseInt(a.price.replace(/\D/g,"")));
    if (sortBy === "rating")     list = [...list].sort((a,b) => b.rating - a.rating);
    return list;
  }, [filter, search, sortBy]);

  return (
    <div className="dt-page" style={{ background: theme.bg, minHeight: "100vh", color: theme.text, fontFamily: "'DM Sans',sans-serif" }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="dt-hero">
        <div className="dt-hero-bg" />
        <div className="dt-hero-inner">
          <div className="dt-badge dt-fu">All Destinations</div>
          <h1 className="dt-fu1 serif" style={{ color: theme.text }}>
            Pick Your <span className="dt-gradient-text">Dream</span> Destination
          </h1>
          <p className="dt-fu2" style={{ color: theme.textMuted }}>
            From Dubai to the Maldives, from Istanbul to Bali — we offer the perfect destination for every budget and every travel dream.
          </p>

          {/* Search Bar */}
          <div className="dt-search-wrap dt-fu3">
            <span className="dt-search-icon">🔍</span>
            <input
              className="dt-search-input"
              placeholder="Search Destination or Country..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ color: theme.text }}
            />
            {search && (
              <button className="dt-search-clear" onClick={() => setSearch("")}>✕</button>
            )}
          </div>
        </div>
      </section>

      <div className="dt-divider" />

      {/* ── Filters & Grid ── */}
      <section style={{ padding: "60px 5%" }}>

        {/* Filter + Sort Bar */}
        <div className="dt-filter-bar">
          <div className="dt-cats">
            {categories.map(c => (
              <button key={c}
                onClick={() => setFilter(c)}
                className={`dt-cat-btn ${filter === c ? "dt-cat-active" : ""}`}
                style={{
                  background: filter === c ? theme.accent : "rgba(0,0,0,0.04)",
                  color:      filter === c ? "#0a0a0f"   : theme.textMuted,
                  border:     filter === c ? "none"       : `1px solid ${theme.border}`,
                }}
              >{c}</button>
            ))}
          </div>
          <div className="dt-sort-wrap">
            <span style={{ fontSize: 13, color: theme.textMuted, whiteSpace: "nowrap" }}>Sort by:</span>
            <select
              className="dt-sort-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{ color: theme.text, background: theme.bgCard, border: `1px solid ${theme.border}` }}
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Result Count */}
        <div style={{ marginBottom: 28, color: theme.textMuted, fontSize: 14 }}>
          <span style={{ color: theme.accent, fontWeight: 700 }}>{filtered.length}</span> destinations found
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: theme.textMuted }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 16 }}>No destination found. Please try another search.</p>
          </div>
        ) : (
          <div className="dt-grid">
            {filtered.map((d, i) => (
              <div key={d.id} className="dt-card"
                style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, animationDelay: `${i * 0.08}s` }}
                onClick={() => setSelected(d)}
              >
                <div className="dt-card-img-wrap">
                  <img src={d.img} alt={d.name} className="dt-card-img" />
                  <div className="dt-card-overlay" />
                  <span className="dt-card-tag" style={{ color: theme.accent }}>{d.tag}</span>
                  <div className="dt-card-cat"
                    style={{ background: d.category === "Umrah" ? "rgba(76,175,125,0.9)" : "rgba(0,0,0,0.55)" }}>
                    {d.category}
                  </div>
                </div>
                <div className="dt-card-body">
                  <div className="dt-card-top">
                    <div>
                      <h3 className="dt-card-name" style={{ color: theme.text }}>{d.name}</h3>
                      <span className="dt-card-country" style={{ color: theme.textMuted }}>📍 {d.country}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="dt-card-price" style={{ color: theme.accent }}>{d.price}</div>
                      <div style={{ fontSize: 11, color: theme.textMuted }}>per person</div>
                    </div>
                  </div>
                  <p className="dt-card-desc" style={{ color: theme.textMuted }}>{d.desc}</p>
                  <div className="dt-card-meta" style={{ borderTop: `1px solid ${theme.border}` }}>
                    <span style={{ fontSize: 12, color: theme.textMuted }}>⏱ {d.days}</span>
                    <span style={{ fontSize: 12, color: theme.accent }}>★ {d.rating}</span>
                    <span style={{ fontSize: 12, color: theme.textMuted }}>({d.reviews})</span>
                    <button className="dt-book-btn"
                      style={{ background: theme.accent, color: "#0a0a0f" }}
                      onClick={e => { e.stopPropagation(); window.location.hash = '#/contact'; }}
                    >Book Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Detail Modal ── */}
      {selected && (
        <div className="dt-modal-overlay" onClick={() => setSelected(null)}>
          <div className="dt-modal" onClick={e => e.stopPropagation()}
            style={{ background: theme.bg, border: `1px solid ${theme.border}` }}>
            <button className="dt-modal-close" onClick={() => setSelected(null)}
              style={{ color: theme.text }}>✕</button>
            <div className="dt-modal-img">
              <img src={selected.img} alt={selected.name} />
              <div className="dt-modal-img-overlay" />
              <div className="dt-modal-img-text">
                <h2 style={{ fontSize: 32, fontWeight: 700, color: "#fff", fontFamily: "'Playfair Display',serif" }}>{selected.name}</h2>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>📍 {selected.country}</p>
              </div>
            </div>
            <div className="dt-modal-body">
              <div className="dt-modal-stats">
                {[["💰", selected.price, "per person"],["⏱", selected.days, "duration"],["★", selected.rating, "rating"],["💬", selected.reviews, "reviews"]].map(([icon,val,lbl]) => (
                  <div key={lbl} className="dt-modal-stat" style={{ background: theme.bgCard, border: `1px solid ${theme.border}` }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
                    <div style={{ fontWeight: 700, color: theme.accent, fontSize: 16 }}>{val}</div>
                    <div style={{ fontSize: 11, color: theme.textMuted }}>{lbl}</div>
                  </div>
                ))}
              </div>
              <p style={{ color: theme.textMuted, lineHeight: 1.8, fontSize: 15, marginBottom: 28 }}>{selected.desc}</p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  onClick={() => { setSelected(null); window.location.hash = '#/contact'; }}
                  style={{
                    flex: 1, minWidth: 140,
                    background: theme.accent, color: "#0a0a0f", border: "none",
                    padding: "14px 28px", borderRadius: 50,
                    fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer",
                  }}
                >Book This Package</button>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    flex: 1, minWidth: 140,
                    background: "transparent", color: theme.text,
                    border: `1.5px solid ${theme.border}`,
                    padding: "13px 28px", borderRadius: 50,
                    fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, cursor: "pointer",
                  }}
                >← Back</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}