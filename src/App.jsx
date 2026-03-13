import { useState } from "react";
import theme from './theme.js'
import './App.css'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

// ─── Data ────────────────────────────────────────────────────────────────────
const umrahPackages = [
  { id: 1, name: "Economy Umrah Package", category: "Economy", img: "https://images.unsplash.com/photo-1564769610726-59cead6a6f8f?w=600&q=80", price: "PKR 195,000", rating: "4.8", reviews: "1.2k", tag: "Best Value", days: "15 Days" },
  { id: 2, name: "Standard Umrah Package", category: "Standard", img: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80", price: "PKR 280,000", rating: "4.9", reviews: "2.4k", tag: "Popular", days: "21 Days" },
  { id: 3, name: "Premium Umrah Package", category: "Premium", img: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=600&q=80", price: "PKR 420,000", rating: "5.0", reviews: "980", tag: "Recommended", days: "14 Days" },
  { id: 4, name: "Luxury Umrah Package", category: "Luxury", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", price: "PKR 650,000", rating: "5.0", reviews: "540", tag: "Exclusive", days: "18 Days" },
  { id: 5, name: "Family Umrah Package", category: "Family", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80", price: "PKR 520,000", rating: "4.9", reviews: "760", tag: "Family Special", days: "20 Days" },
  { id: 6, name: "Group Umrah Package", category: "Economy", img: "https://images.unsplash.com/photo-1516571137133-b5d1a6f14e96?w=600&q=80", price: "PKR 175,000", rating: "4.7", reviews: "1.8k", tag: "Group Deal", days: "12 Days" },
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
  { name: "Salman Naseer", loc: "Lahore, Pakistan", rating: 5, text: "Absolutely magical experience! The Umrah trip was perfectly organized. Every tiny detail was taken care of, and the guide was phenomenal.", img: "https://i.pravatar.cc/60?img=47", tour: "Economy Umrah Package" },
  { name: "Faizan Mughal", loc: "Islamabad, Pakistan", rating: 5, text: "Edafay ne hamara Umrah safar aur bhi yadgar bana diya. Hotel Haram ke bilkul qareeb tha — sab kuch umeed se barhkar tha!", img: "https://i.pravatar.cc/60?img=12", tour: "Standard Umrah Package" },
  { name: "Bilal Mughal", loc: "Islamabad, Pakistan", rating: 5, text: "Premium package liya — 5 star hotel, private transport aur dedicated guide. Zindagi ka best safar tha. 10/10 recommend karunga!", img: "https://i.pravatar.cc/60?img=33", tour: "Premium Umrah Package" },
];

const visasList = [
  { id: 1, country: "Malaysia",     flag: "🇲🇾", img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&q=80", type: "Tourist",          processing: "3-5 Days",  fee: "PKR 8,500",  approvalRate: "99%" },
  { id: 2, country: "UAE (Dubai)",  flag: "🇦🇪", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80", type: "Tourist",          processing: "2-4 Days",  fee: "PKR 22,000", approvalRate: "98%" },
  { id: 3, country: "Turkey",       flag: "🇹🇷", img: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600&q=80", type: "e-Visa",           processing: "1-3 Days",  fee: "PKR 12,000", approvalRate: "97%" },
  { id: 4, country: "Maldives",     flag: "🇲🇻", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80", type: "Visa On Arrival",  processing: "On Arrival",fee: "FREE",       approvalRate: "100%" },
  { id: 5, country: "Azerbaijan",   flag: "🇦🇿", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", type: "e-Visa",           processing: "3 Days",    fee: "PKR 9,500",  approvalRate: "98%" },
  { id: 6, country: "Saudi Arabia", flag: "🇸🇦", img: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80", type: "Tourist / Umrah",  processing: "7-10 Days", fee: "PKR 28,000", approvalRate: "96%" },
];

const carRentalHighlights = [
  { id: 1, name: "Toyota Corolla",      company: "Toyota", type: "Sedan",       seats: 4,  img: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&q=80", price: "PKR 8,000",  tag: "Most Popular" },
  { id: 2, name: "Toyota Fortuner",     company: "Toyota", type: "SUV",         seats: 6,  img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80", price: "PKR 22,000", tag: "Luxury SUV" },
  { id: 3, name: "Toyota Coaster",      company: "Toyota", type: "Coaster",     seats: 28, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", price: "PKR 35,000", tag: "Group Travel" },
  { id: 4, name: "Honda Civic",         company: "Honda",  type: "Sedan",       seats: 4,  img: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80", price: "PKR 9,500",  tag: "Premium" },
  { id: 5, name: "KIA Sportage",        company: "KIA",    type: "SUV",         seats: 6,  img: "https://images.unsplash.com/photo-1580711508375-56e8c39e8d7d?w=600&q=80", price: "PKR 16,000", tag: "Modern SUV" },
  { id: 6, name: "Toyota HiAce Cabin",  company: "Toyota", type: "Grand Cabin", seats: 13, img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80", price: "PKR 18,000", tag: "Family Cabin" },
];

// ─── Component: Hero ─────────────────────────────────────────────────────────
function Hero() {
  const [activeTab, setActiveTab] = useState("Tours");
  const tabs = ["Flights", "Insurance"];

  return (
    <section style={{
      minHeight: "100vh",
      background: `radial-gradient(ellipse at 70% 30%, rgba(26,60,110,0.07) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(76,175,125,0.05) 0%, transparent 50%), ${theme.bg}`,
      padding: "120px 5% 80px",
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center",
    }} className="hero-grid">

      <div>
        <h1 className="serif fade-up-delay1" style={{ fontSize: "clamp(42px, 5vw, 68px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-1px", marginBottom: 24, color: theme.text }}>
          Discover Your<br /><span className="gradient-text">Umrah</span>{" "}<em>Package</em>
        </h1>
        <p className="fade-up-delay2" style={{ color: theme.textMuted, fontSize: 16, lineHeight: 1.75, maxWidth: 440, marginBottom: 36 }}>
          Plan unforgettable journeys with our expert Umrah travel guides — your perfect Umrah trip awaits.
        </p>
        <div className="fade-up-delay3" style={{ display: "flex", gap: 14, marginBottom: 48, flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={() => window.location.hash = '#/umrah'}>Explore Packages</button>
          <button className="btn-outline" style={{ display: "flex", alignItems: "center", gap: 8, color: theme.text }}>
            <span style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(26,60,110,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>▶</span>
            Watch Video
          </button>
        </div>
        <div className="fade-up-delay4" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {[{ num: "10K+", label: "Happy Travelers" }, { num: "20+", label: "Destinations" }, { num: "5Yr", label: "Experience" }].map(s => (
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
            <div style={{ fontSize: 28 }}>🕌</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>Next Umrah</div>
              <div style={{ fontSize: 11, color: theme.textMuted }}>Makkah & Madina</div>
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
          <button className="btn-primary" style={{ margin: 4, padding: "16px 32px", borderRadius: 12, whiteSpace: "nowrap" }}>Search</button>
        </div>
      </div>
    </section>
  );
}

// ─── Component: Umrah Packages Section ───────────────────────────────────────
function UmrahSection() {
  return (
    <section style={{ padding: "100px 5%", background: theme.bg }} id="umrah">
      <div style={{ textAlign: "center", marginBottom: 52 }}>

        <h2 className="serif" style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 700, marginBottom: 16, color: theme.text }}>
          Umrah <span className="gradient-text">Package</span>
        </h2>
        <p style={{ color: theme.textMuted, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
          We offer carefully designed Umrah packages for every budget — from economy to luxury — including visa processing, flights, hotel accommodation, and transportation.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="dest-grid">
        {umrahPackages.map((pkg, i) => (
          <div key={pkg.id} className="dest-card card-hover"
            style={{ borderRadius: 20, overflow: "hidden", background: theme.bgCard, border: `1px solid ${theme.border}`, cursor: "pointer", animation: `fadeUp 0.6s ${i * 0.1}s both` }}
            onClick={() => window.location.hash = '#/umrah'}>
            <div style={{ position: "relative", height: 210, overflow: "hidden" }}>
              <img src={pkg.img} alt={pkg.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)" }} />
              <span style={{ position: "absolute", top: 14, right: 14, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", color: theme.accent, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, border: "1px solid rgba(26,60,110,0.3)" }}>{pkg.tag}</span>
              <span style={{ position: "absolute", top: 14, left: 14, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.5px" }}>{pkg.category}</span>
              <div style={{ position: "absolute", bottom: 14, left: 16 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", margin: 0, fontFamily: "'Playfair Display',serif" }}>{pkg.name}</h3>
              </div>
            </div>
            <div style={{ padding: "16px 18px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 19, fontWeight: 800, color: theme.accent, fontFamily: "'Playfair Display',serif" }}>{pkg.price}</div>
                  <div style={{ fontSize: 10, color: theme.textMuted }}>per person</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>⏱ {pkg.days}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", paddingTop: 12, borderTop: `1px solid ${theme.border}`, justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: theme.accent, fontWeight: 700 }}>★ {pkg.rating}</span>
                  <span style={{ fontSize: 12, color: theme.textMuted }}>({pkg.reviews} reviews)</span>
                </div>
                <span style={{ fontSize: 11, color: theme.textMuted, background: theme.bgCard, border: `1px solid ${theme.border}`, padding: "3px 10px", borderRadius: 20 }}>✈ Visa Included</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 48 }}>
        <button className="btn-outline" style={{ color: theme.text }} onClick={() => window.location.hash = '#/umrah'}>
          All Packages →
        </button>
      </div>
    </section>
  );
}

// ─── Component: Car Rental Section ───────────────────────────────────────────
function CarRentalSection() {
  return (
    <section style={{ padding: "100px 5%", background: theme.bgCard }} id="cars">
      <div style={{ textAlign: "center", marginBottom: 52 }}>

        <h2 className="serif" style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 700, marginBottom: 16, color: theme.text }}>
          Book the <span className="gradient-text">Car You Love</span>
        </h2>
        <p style={{ color: theme.textMuted, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
          From hatchbacks to coaches — 4 to 28 seats. Toyota, Honda, Suzuki, and more. With driver — it’s your choice!
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="dest-grid">
        {carRentalHighlights.map((car, i) => (
          <div key={car.id} className="dest-card card-hover"
            style={{ borderRadius: 20, overflow: "hidden", background: theme.bg, border: `1px solid ${theme.border}`, cursor: "pointer", animation: `fadeUp 0.6s ${i * 0.1}s both` }}
            onClick={() => window.location.hash = '#/cars'}>

            <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
              <img src={car.img} alt={car.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)" }} />
              <span style={{ position: "absolute", top: 12, right: 12, background: "rgba(26,60,110,0.85)", backdropFilter: "blur(6px)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {car.type}
              </span>
              <span style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
                🪑 {car.seats} Seats
              </span>
              <div style={{ position: "absolute", bottom: 14, left: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0, fontFamily: "'Playfair Display',serif" }}>{car.name}</h3>
              </div>
            </div>

            <div style={{ padding: "14px 16px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 11, color: theme.accent, fontWeight: 700, background: "rgba(26,60,110,0.08)", border: "1px solid rgba(26,60,110,0.15)", padding: "3px 10px", borderRadius: 20 }}>
                  {car.tag}
                </span>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 17, fontWeight: 800, color: theme.accent, fontFamily: "'Playfair Display',serif" }}>{car.price}</div>
                  <div style={{ fontSize: 10, color: theme.textMuted }}>per day</div>
                </div>
              </div>
              <div style={{ paddingTop: 10, borderTop: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: theme.textMuted }}>🚗 {car.company} • With Driver Available</span>
                <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 700, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", padding: "2px 8px", borderRadius: 12 }}>✅ Available</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 48 }}>
        <button className="btn-outline" style={{ color: theme.text }} onClick={() => window.location.hash = '#/cars'}>
          All Cars →
        </button>
      </div>
    </section>
  );
}

// ─── Component: Features ─────────────────────────────────────────────────────
function Features() {
  return (
    <section style={{ padding: "100px 5%", background: `radial-gradient(ellipse at 30% 50%, rgba(26,60,110,0.05) 0%, transparent 60%), ${theme.bgCard}` }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="hero-grid">
        <div>
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

// ─── Component: Visas Section ────────────────────────────────────────────────
function VisaSection() {
  return (
    <section style={{ padding: "100px 5%", background: theme.bg }}>
      <div style={{ textAlign: "center", marginBottom: 52 }}>

        <h2 className="serif" style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 700, marginBottom: 16, color: theme.text }}>
          Get Your <span className="gradient-text">Visa</span> Hassle-Free
        </h2>
        <p style={{ color: theme.textMuted, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
          We provide tourist visa services for 8+ countries with fast processing and a high approval rate. From documentation to application submission, Edafay handles the entire process for you.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="dest-grid">
        {visasList.map((visa, i) => (
          <div key={visa.id} className="dest-card card-hover"
            style={{ borderRadius: 20, overflow: "hidden", background: theme.bgCard, border: `1px solid ${theme.border}`, cursor: "pointer", animation: `fadeUp 0.6s ${i * 0.1}s both` }}
            onClick={() => window.location.hash = '#/visas'}>
            <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
              <img src={visa.img} alt={visa.country} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)" }} />
              <span style={{ position: "absolute", top: 12, right: 14, fontSize: 30, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))" }}>{visa.flag}</span>
              <span style={{ position: "absolute", top: 14, left: 14, background: visa.type === "Visa On Arrival" ? "rgba(34,197,94,0.75)" : visa.type.includes("e-Visa") ? "rgba(59,130,246,0.75)" : "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.5px" }}>{visa.type}</span>
              <div style={{ position: "absolute", bottom: 12, left: 14 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: 0, fontFamily: "'Playfair Display',serif" }}>{visa.country}</h3>
              </div>
            </div>
            <div style={{ padding: "14px 16px 16px" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, background: "rgba(26,60,110,0.1)", color: theme.accent, border: "1px solid rgba(26,60,110,0.25)" }}>⏱ {visa.processing}</span>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, background: "rgba(34,197,94,0.08)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.2)" }}>✅ {visa.approvalRate}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: `1px solid ${theme.border}` }}>
                <div>
                  <div style={{ fontSize: 10, color: theme.textMuted, marginBottom: 2 }}>Starting from</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: theme.accent, fontFamily: "'Playfair Display',serif" }}>
                    {visa.fee === "FREE" ? <span style={{ color: "#16a34a" }}>FREE ✓</span> : visa.fee}
                  </div>
                </div>
                <span style={{ fontSize: 11, color: theme.textMuted, background: theme.bg, border: `1px solid ${theme.border}`, padding: "4px 12px", borderRadius: 20, fontWeight: 600 }}>Apply →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 48 }}>
        <button className="btn-outline" style={{ color: theme.text }} onClick={() => window.location.hash = '#/visas'}>
          All Visas →
        </button>
      </div>
    </section>
  );
}

// ─── Component: Reviews ──────────────────────────────────────────────────────
function Reviews() {
  return (
    <section style={{ padding: "100px 5%", background: theme.bgCard }}>
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <h2 className="serif" style={{ fontSize: "clamp(30px,3.5vw,48px)", fontWeight: 700, marginBottom: 16, color: theme.text }}>What Our <span className="gradient-text">Travelers</span> Say</h2>
        <p style={{ color: theme.textMuted, maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>Real stories from real adventures. Join 10,000+ happy pilgrims who've completed Umrah with Edafay.</p>
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
              <div style={{ fontSize: 11, color: theme.accent, background: "rgba(26,60,110,0.1)", padding: "4px 10px", borderRadius: 20, border: "1px solid rgba(26,60,110,0.2)" }}>{r.tour}</div>
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
    <section style={{ padding: "100px 5%", background: `linear-gradient(135deg, rgba(26,60,110,0.08) 0%, rgba(76,175,125,0.05) 100%), ${theme.bg}`, textAlign: "center" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <h2 className="serif" style={{ fontSize: "clamp(32px,4vw,58px)", fontWeight: 700, marginBottom: 20, lineHeight: 1.15, color: theme.text }}>Ready for Your<br />Next <span className="gradient-text">Trip?</span></h2>
        <p style={{ color: theme.textMuted, lineHeight: 1.75, marginBottom: 40, fontSize: 16 }}>Join thousands of explorers who've discovered the world with Edafay. Subscribe and get exclusive deals, tips & early access.</p>
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
      <UmrahSection />
      <div className="section-divider" />
      <CarRentalSection />
      <div className="section-divider" />
      <Features />
      <div className="section-divider" />
      <VisaSection />
      <div className="section-divider" />
      <Reviews />
      <CTA />
      <Footer />
    </>
  );
}