import { useState, useEffect } from "react";
import theme from './theme.js'
import './App.css'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

// ─── Data ────────────────────────────────────────────────────────────────────
const destinations = [
  { id: 1, name: "Santorini", country: "Greece", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80", price: "$1,299", rating: "4.9", reviews: "2.4k", tag: "Hot Deal", days: "7 days" },
  { id: 2, name: "Kyoto", country: "Japan", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80", price: "$1,599", rating: "4.8", reviews: "1.8k", tag: "Popular", days: "10 days" },
  { id: 3, name: "Bali", country: "Indonesia", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80", price: "$899", rating: "4.7", reviews: "3.1k", tag: "Best Value", days: "8 days" },
  { id: 4, name: "Amalfi Coast", country: "Italy", img: "https://images.unsplash.com/photo-1533606688076-b6683a5f59f1?w=600&q=80", price: "$1,799", rating: "5.0", reviews: "980", tag: "Luxury", days: "6 days" },
  { id: 5, name: "Machu Picchu", country: "Peru", img: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&q=80", price: "$1,099", rating: "4.9", reviews: "1.5k", tag: "Adventure", days: "9 days" },
  { id: 6, name: "Maldives", country: "Maldives", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80", price: "$2,499", rating: "5.0", reviews: "750", tag: "Luxury", days: "5 days" },
];

const features = [
  { icon: "🛡️", title: "Safe & Secure", desc: "100% verified tour packages with full insurance coverage and 24/7 support." },
  { icon: "💎", title: "Premium Quality", desc: "Hand-picked 5-star hotels, private transfers and exclusive experiences." },
  { icon: "🗺️", title: "Expert Guides", desc: "Local certified guides who know every hidden gem of the destination." },
  { icon: "💳", title: "Easy Payment", desc: "Flexible payment plans with zero-cost EMI and multiple currency support." },
  { icon: "✈️", title: "Best Price Guarantee", desc: "We match any lower price you find, or refund the difference." },
  { icon: "🔔", title: "Instant Booking", desc: "Confirm your trip in minutes with instant hotel & flight booking." },
];

const reviews = [
  { name: "Salman Naseer", loc: "Lahore, Pakistan", rating: 5, text: "Absolutely magical experience! The Santorini trip was perfectly organized. Every tiny detail was taken care of, and the guide was phenomenal.", img: "https://i.pravatar.cc/60?img=47", tour: "Santorini Getaway" },
  { name: "Faizan Mughal", loc: "Islamabad, Pakistan", rating: 5, text: "Tourm made our Bali honeymoon unforgettable. The private villa, sunset dinners — everything was beyond our expectations!", img: "https://i.pravatar.cc/60?img=12", tour: "Bali Honeymoon" },
  { name: "Bilal Mughal", loc: "Islamabad, Pakistan", rating: 5, text: "The Kyoto cultural tour was deeply moving. Our guide Hiroshi shared stories that no guidebook ever could. 10/10 would recommend!", img: "https://i.pravatar.cc/60?img=33", tour: "Economy Umrah Package" },
];

const popularTours = [
  { name: "European Highlights", duration: "14 Days", img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=500&q=80", price: "$2,899", rating: 4.9 },
  { name: "South East Asia", duration: "18 Days", img: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=500&q=80", price: "$1,799", rating: 4.8 },
  { name: "African Safari", duration: "10 Days", img: "https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=500&q=80", price: "$3,299", rating: 5.0 },
];

// ─── Component: Hero ─────────────────────────────────────────────────────────
function Hero() {
  const [activeTab, setActiveTab] = useState("Tours");
  const tabs = ["Tours", "Hotels", "Flights", "Activities"];

  return (
    <section style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 70% 30%, rgba(232,196,106,0.07) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(76,175,125,0.05) 0%, transparent 50%), ${theme.bg}`,
      padding: "120px 5% 80px",
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center",
    }} className="hero-grid">

      <div>
        <div className="badge fade-up" style={{ marginBottom: 20 }}><span>🌍</span> Explore The Umrah Package</div>
        <h1 className="serif fade-up-delay1" style={{ fontSize: "clamp(42px, 5vw, 68px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-1px", marginBottom: 24, color: theme.text }}>
          Discover Your<br /><span className="gradient-text">Umrah</span>{" "}<em>Package</em>
        </h1>
        <p className="fade-up-delay2" style={{ color: theme.textMuted, fontSize: 16, lineHeight: 1.75, maxWidth: 440, marginBottom: 36 }}>
          Plan unforgettable journeys with our expert Umrah travel guides — your perfect Umrah trip awaits.
        </p>
        <div className="fade-up-delay3" style={{ display: "flex", gap: 14, marginBottom: 48, flexWrap: "wrap" }}>
          <button className="btn-primary">Explore Packages</button>
          <button className="btn-outline" style={{ display: "flex", alignItems: "center", gap: 8, color: theme.text }}>
            <span style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(232,196,106,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>▶</span>
            Watch Video
          </button>
        </div>
        <div className="fade-up-delay4" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {[{ num: "10K+", label: "Happy Travelers" }, { num: "50+", label: "Destinations" }, { num: "5Yr", label: "Experience" }].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 28, fontWeight: 700, color: theme.accent, fontFamily: "'Playfair Display',serif" }}>{s.num}</div>
              <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "relative" }} className="fade-up-delay2">
        <div className="hero-image-wrap float-anim" style={{ height: 480 }}>
          <img src="https://scontent.flhe3-2.fna.fbcdn.net/v/t39.30808-6/648106452_122114880333209329_4710445315082844352_n.png?_nc_cat=102&ccb=1-7&_nc_sid=2a1932&_nc_ohc=jTYChci6zIcQ7kNvwE9yl85&_nc_oc=Adkv4jV6vZpsOWfDhQdPv4fdTrExSj7SYVYaQP1p54PMkdBj7X8yt-HBFfClXc_SoyI&_nc_zt=23&_nc_ht=scontent.flhe3-2.fna&_nc_gid=2nCmH9BrzPt5eW4pCemgnA&_nc_ss=8&oh=00_Afyrm0_NbeWCRM1_XA1B2bZFu9pyTKmuQenH71yHYYdktQ&oe=69B4F9E2"
            alt="hero" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,15,0.3) 0%, transparent 50%)" }} />
        </div>
        <div className="parallax-badge" style={{ bottom: 28, left: -32, animation: "scaleIn 0.6s 0.8s both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 28 }}>🏔️</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>Next Adventure</div>
              <div style={{ fontSize: 11, color: theme.textMuted }}>Machu Picchu, Peru</div>
            </div>
            <div style={{ marginLeft: 8, background: theme.green, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>OPEN</div>
          </div>
        </div>
        <div className="parallax-badge" style={{ top: 28, right: -24, animation: "slideLeft 0.6s 0.6s both" }}>
          <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 4 }}>Rating</div>
          <div style={{ display: "flex", gap: 2, fontSize: 14, color: theme.accent }}>{"★★★★★"}</div>
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2, color: theme.text }}>4.98 / 5.0</div>
        </div>
      </div>

      <div style={{ gridColumn: "1 / -1" }}>
        <div style={{ display: "flex", gap: 28, marginBottom: 16 }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? "tab-active" : ""}
              style={{ background: "none", border: "none", color: activeTab === tab ? theme.accent : theme.textMuted, fontSize: 14, fontWeight: 500, cursor: "pointer", paddingBottom: 8, borderBottom: activeTab === tab ? `2px solid ${theme.accent}` : "2px solid transparent", fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s" }}
            >{tab}</button>
          ))}
        </div>
        <div className="search-bar" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 0, padding: "8px 8px 8px 24px", alignItems: "center" }}>
          <div style={{ padding: "12px 20px 12px 0", borderRight: `1px solid ${theme.border}` }}>
            <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>Destination</div>
            <input className="search-input" placeholder="Where do you want to go?" style={{ color: theme.text }} />
          </div>
          <div style={{ padding: "12px 20px", borderRight: `1px solid ${theme.border}` }}>
            <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>Check In</div>
            <input className="search-input" type="date" style={{ color: theme.text, colorScheme: "light" }} />
          </div>
          <div style={{ padding: "12px 20px", borderRight: `1px solid ${theme.border}` }}>
            <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>Travelers</div>
            <select className="search-input" style={{ appearance: "none", color: theme.text }}>
              <option>1 Person</option><option>2 Persons</option><option>3-5 Persons</option><option>6+ Group</option>
            </select>
          </div>
          <button className="btn-primary" style={{ margin: 4, padding: "16px 32px", borderRadius: 12, whiteSpace: "nowrap" }}>🔍 Search</button>
        </div>
      </div>
    </section>
  );
}

// ─── Component: Destinations ─────────────────────────────────────────────────
function Destinations() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Beach", "Mountain", "Cultural", "Adventure", "Luxury"];
  return (
    <section style={{ padding: "100px 5%", background: theme.bg }} id="destinations">
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <div className="badge" style={{ marginBottom: 16 }}>🗺️ Top Picks</div>
        <h2 className="serif" style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 700, marginBottom: 16, color: theme.text }}>Popular <span className="gradient-text">Destinations</span></h2>
        <p style={{ color: theme.textMuted, maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>Curated selections of the world's most breathtaking places, ready for your next adventure</p>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{ padding: "8px 20px", borderRadius: 50, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", background: filter === c ? theme.accent : "rgba(0,0,0,0.04)", color: filter === c ? "#0a0a0f" : theme.textMuted, border: filter === c ? "none" : `1px solid ${theme.border}`, transition: "all 0.2s" }}>{c}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="dest-grid">
        {destinations.map((d, i) => (
          <div key={d.id} className="dest-card card-hover" style={{ borderRadius: 20, overflow: "hidden", background: theme.bgCard, border: `1px solid ${theme.border}`, cursor: "pointer", animation: `fadeUp 0.6s ${i * 0.1}s both` }}>
            <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
              <img src={d.img} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} />
              <div className="dest-overlay" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)", opacity: 0, transition: "opacity 0.3s" }} />
              <span style={{ position: "absolute", top: 14, right: 14, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", color: theme.accent, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, border: "1px solid rgba(232,196,106,0.3)" }}>{d.tag}</span>
            </div>
            <div style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 3, color: theme.text }}>{d.name}</h3>
                  <span style={{ fontSize: 13, color: theme.textMuted }}>📍 {d.country}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: theme.accent }}>{d.price}</div>
                  <div style={{ fontSize: 11, color: theme.textMuted }}>per person</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: 12, color: theme.textMuted }}>⏱ {d.days}</span>
                <span style={{ fontSize: 12, color: theme.accent }}>★ {d.rating}</span>
                <span style={{ fontSize: 12, color: theme.textMuted }}>({d.reviews} reviews)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 48 }}>
        <button className="btn-outline" style={{ color: theme.text }}>View All Destinations →</button>
      </div>
    </section>
  );
}

// ─── Component: Features ─────────────────────────────────────────────────────
function Features() {
  return (
    <section style={{ padding: "100px 5%", background: `radial-gradient(ellipse at 30% 50%, rgba(232,196,106,0.05) 0%, transparent 60%), ${theme.bgCard}` }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="hero-grid">
        <div>
          <div className="badge" style={{ marginBottom: 20 }}>✨ Why Tourm</div>
          <h2 className="serif" style={{ fontSize: "clamp(30px,3.5vw,48px)", fontWeight: 700, marginBottom: 20, lineHeight: 1.2, color: theme.text }}>
            Travel Smarter,<br /><span className="gradient-text">Live Better</span>
          </h2>
          <p style={{ color: theme.textMuted, lineHeight: 1.75, marginBottom: 36 }}>We believe travel changes lives. That's why we obsess over every detail — so you can focus on what matters: the moments that take your breath away.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {features.slice(0, 4).map(f => (
              <div key={f.title} style={{ display: "flex", gap: 16, alignItems: "start" }}>
                <div className="feature-icon">{f.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4, color: theme.text }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {["https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80","https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80","https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80","https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=400&q=80"].map((img, i) => (
            <div key={i} style={{ borderRadius: 16, overflow: "hidden", height: 180, marginTop: i % 2 === 1 ? 24 : 0 }}>
              <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.target.style.transform = "scale(1)"} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Component: Popular Tours ─────────────────────────────────────────────────
function PopularTours() {
  return (
    <section style={{ padding: "100px 5%", background: theme.bg }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
        <div>
          <div className="badge" style={{ marginBottom: 16 }}>🧳 Tours</div>
          <h2 className="serif" style={{ fontSize: "clamp(28px,3.5vw,46px)", fontWeight: 700, color: theme.text }}>Most <span className="gradient-text">Popular</span> Tours</h2>
        </div>
        <button className="btn-outline" style={{ flexShrink: 0, color: theme.text }}>See All Tours</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }} className="three-col">
        {popularTours.map((tour, i) => (
          <div key={tour.name} className="card-hover" style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 20, overflow: "hidden", animation: `fadeUp 0.6s ${i * 0.15}s both` }}>
            <div style={{ position: "relative", height: 260 }}>
              <img src={tour.img} alt={tour.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,15,0.8) 0%, transparent 50%)" }} />
              <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: "#fff" }}>{tour.name}</h3>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>⏱ {tour.duration}</span>
                  <span style={{ fontSize: 12, color: theme.accent }}>★ {tour.rating}</span>
                </div>
              </div>
            </div>
            <div style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 4 }}>Starting from</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: theme.accent }}>{tour.price}</div>
              </div>
              <button className="btn-primary" style={{ padding: "10px 20px", fontSize: 13 }}>Book Now</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Component: Reviews ──────────────────────────────────────────────────────
function Reviews() {
  return (
    <section style={{ padding: "100px 5%", background: theme.bgCard }}>
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <div className="badge" style={{ marginBottom: 16 }}>💬 Testimonials</div>
        <h2 className="serif" style={{ fontSize: "clamp(30px,3.5vw,48px)", fontWeight: 700, marginBottom: 16, color: theme.text }}>What Our <span className="gradient-text">Travelers</span> Say</h2>
        <p style={{ color: theme.textMuted, maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>Real stories from real adventures. Join 50,000+ happy travelers who've explored the world with Tourm.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }} className="three-col">
        {reviews.map((r, i) => (
          <div key={r.name} className="review-card" style={{ background: theme.bg, border: `1px solid ${theme.border}`, animation: `fadeUp 0.6s ${i * 0.15}s both` }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
              {Array(r.rating).fill(0).map((_, j) => <span key={j} style={{ color: theme.accent, fontSize: 16 }}>★</span>)}
            </div>
            <p style={{ color: theme.textMuted, lineHeight: 1.7, fontSize: 14, marginBottom: 20, fontStyle: "italic" }}>"{r.text}"</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <img src={r.img} alt={r.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: `2px solid ${theme.accent}` }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: theme.text }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: theme.textMuted }}>{r.loc}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: theme.accent, background: "rgba(232,196,106,0.1)", padding: "4px 10px", borderRadius: 20, border: "1px solid rgba(232,196,106,0.2)" }}>{r.tour}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Component: CTA ──────────────────────────────────────────────────────────
function CTA() {
  return (
    <section style={{ padding: "100px 5%", background: `linear-gradient(135deg, rgba(232,196,106,0.08) 0%, rgba(76,175,125,0.05) 100%), ${theme.bg}`, textAlign: "center" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div className="badge" style={{ marginBottom: 24, display: "inline-flex" }}>🚀 Start Today</div>
        <h2 className="serif" style={{ fontSize: "clamp(32px,4vw,58px)", fontWeight: 700, marginBottom: 20, lineHeight: 1.15, color: theme.text }}>Ready for Your<br />Next <span className="gradient-text">Adventure?</span></h2>
        <p style={{ color: theme.textMuted, lineHeight: 1.75, marginBottom: 40, fontSize: 16 }}>Join thousands of explorers who've discovered the world with Tourm. Subscribe and get exclusive deals, tips & early access.</p>
        <div style={{ display: "flex", gap: 12, maxWidth: 480, margin: "0 auto", background: "rgba(0,0,0,0.04)", border: `1px solid ${theme.border}`, borderRadius: 50, padding: "6px 6px 6px 24px" }}>
          <input className="search-input" placeholder="Enter your email address" style={{ flex: 1, color: theme.text }} />
          <button className="btn-primary" style={{ borderRadius: 50, padding: "12px 28px", flexShrink: 0 }}>Get Started</button>
        </div>
        <p style={{ color: theme.textMuted, fontSize: 12, marginTop: 14 }}>✓ No spam, ever. Unsubscribe any time.</p>
      </div>
    </section>
  );
}


// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <div className="section-divider" />
      <Destinations />
      <div className="section-divider" />
      <Features />
      <div className="section-divider" />
      <PopularTours />
      <div className="section-divider" />
      <Reviews />
      <CTA />
      <Footer />
    </>
  );
}