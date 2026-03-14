import { useState, useEffect } from "react";
import theme from './theme.js'
import './App.css'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import { getContent, EVENT_NAME } from './contentStore.js'

// ─── Airports Data ────────────────────────────────────────────────────────────
const AIRPORTS = [
  { code:"LHE", name:"Allama Iqbal International Airport",       city:"Lahore",            country:"Pakistan" },
  { code:"KHI", name:"Jinnah International Airport",            city:"Karachi",           country:"Pakistan" },
  { code:"ISB", name:"New Islamabad International Airport",      city:"Islamabad",         country:"Pakistan" },
  { code:"PEW", name:"Bacha Khan International Airport",        city:"Peshawar",          country:"Pakistan" },
  { code:"SKT", name:"Sialkot International Airport",           city:"Sialkot",           country:"Pakistan" },
  { code:"MUX", name:"Multan International Airport",            city:"Multan",            country:"Pakistan" },
  { code:"DXB", name:"Dubai International Airport",             city:"Dubai",             country:"UAE" },
  { code:"AUH", name:"Abu Dhabi International Airport",         city:"Abu Dhabi",         country:"UAE" },
  { code:"DOH", name:"Hamad International Airport",             city:"Doha",              country:"Qatar" },
  { code:"RUH", name:"King Khalid International Airport",       city:"Riyadh",            country:"Saudi Arabia" },
  { code:"JED", name:"King Abdulaziz International Airport",    city:"Jeddah",            country:"Saudi Arabia" },
  { code:"MED", name:"Prince Mohammad Bin Abdulaziz Airport",   city:"Madinah",           country:"Saudi Arabia" },
  { code:"BAH", name:"Bahrain International Airport",           city:"Manama",            country:"Bahrain" },
  { code:"KWI", name:"Kuwait International Airport",            city:"Kuwait City",       country:"Kuwait" },
  { code:"MCT", name:"Muscat International Airport",            city:"Muscat",            country:"Oman" },
  { code:"CAI", name:"Cairo International Airport",             city:"Cairo",             country:"Egypt" },
  { code:"IST", name:"Istanbul Airport",                        city:"Istanbul",          country:"Turkey" },
  { code:"DEL", name:"Indira Gandhi International Airport",     city:"New Delhi",         country:"India" },
  { code:"BOM", name:"Chhatrapati Shivaji International Airport",city:"Mumbai",           country:"India" },
  { code:"DAC", name:"Hazrat Shahjalal International Airport",  city:"Dhaka",             country:"Bangladesh" },
  { code:"KUL", name:"Kuala Lumpur International Airport",      city:"Kuala Lumpur",      country:"Malaysia" },
  { code:"SIN", name:"Singapore Changi Airport",                city:"Singapore",         country:"Singapore" },
  { code:"BKK", name:"Suvarnabhumi Airport",                    city:"Bangkok",           country:"Thailand" },
  { code:"LHR", name:"Heathrow Airport",                        city:"London",            country:"United Kingdom" },
  { code:"CDG", name:"Charles de Gaulle Airport",               city:"Paris",             country:"France" },
  { code:"FRA", name:"Frankfurt Airport",                       city:"Frankfurt",         country:"Germany" },
  { code:"AMS", name:"Amsterdam Schiphol Airport",              city:"Amsterdam",         country:"Netherlands" },
  { code:"JFK", name:"John F. Kennedy International Airport",   city:"New York",          country:"USA" },
  { code:"LAX", name:"Los Angeles International Airport",       city:"Los Angeles",       country:"USA" },
  { code:"SYD", name:"Sydney Kingsford Smith Airport",          city:"Sydney",            country:"Australia" },
  { code:"ICN", name:"Incheon International Airport",           city:"Seoul",             country:"South Korea" },
  { code:"NRT", name:"Narita International Airport",            city:"Tokyo",             country:"Japan" },
  { code:"GYD", name:"Heydar Aliyev International Airport",     city:"Baku",              country:"Azerbaijan" },
  { code:"MLE", name:"Velana International Airport",            city:"Male",              country:"Maldives" },
];

const features = [
  { icon:"🛡️", title:"Safe & Secure",       desc:"100% verified tour packages with full insurance coverage and 24/7 support." },
  { icon:"💎", title:"Premium Quality",      desc:"Hand-picked 5-star hotels, private transfers and exclusive experiences." },
  { icon:"🗺️", title:"Expert Guides",        desc:"Local certified guides who know every hidden gem of the destination." },
  { icon:"💳", title:"Easy Payment",          desc:"Flexible payment plans with zero-cost EMI and multiple currency support." },
];

const reviews = [
  { name:"Salman Naseer", loc:"Lahore, Pakistan",    rating:5, text:"Absolutely magical experience! The Umrah trip was perfectly organized. Every tiny detail was taken care of.", img:"https://i.pravatar.cc/60?img=47", tour:"Economy Umrah Package" },
  { name:"Faizan Mughal",  loc:"Islamabad, Pakistan", rating:5, text:"The hotel was right next to Haram — everything exceeded expectations. Smooth and well-organized from start to finish!", img:"https://i.pravatar.cc/60?img=12", tour:"Standard Umrah Package" },
  { name:"Bilal Mughal",   loc:"Islamabad, Pakistan", rating:5, text:"Chose the Premium package — 5-star hotel, private transport and dedicated guide. Best trip of my life. 10/10!", img:"https://i.pravatar.cc/60?img=33", tour:"Premium Umrah Package" },
];

// ─── Hook: use live content ───────────────────────────────────────────────────
function useContent() {
  const [content, setContent] = useState(() => getContent());
  useEffect(() => {
    const handler = () => setContent(getContent());
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, []);
  return content;
}

// ─── AirportInput ─────────────────────────────────────────────────────────────
function AirportInput({ label, value, onChange }) {
  const [query, setQuery] = useState("");
  const [open,  setOpen]  = useState(false);
  useEffect(() => { setQuery(value ? `${value.code} – ${value.city}, ${value.country}` : ""); }, [value]);
  const q = query.toLowerCase();
  const filtered = q.length > 0
    ? AIRPORTS.filter(a => a.code.toLowerCase().startsWith(q) || a.city.toLowerCase().includes(q) || a.country.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)).slice(0,10)
    : AIRPORTS.slice(0,10);
  return (
    <div style={{ position:"relative" }}>
      <div style={{ fontSize:11, color:theme.textMuted, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600 }}>{label}</div>
      <input value={query} onChange={e=>{ setQuery(e.target.value); setOpen(true); if(value) onChange(null); }} onFocus={()=>setOpen(true)} onBlur={()=>setTimeout(()=>setOpen(false),180)} placeholder="Search airport or city..."
        style={{ width:"100%", border:"none", background:"transparent", outline:"none", fontSize:14, color:theme.text, fontFamily:"'DM Sans',sans-serif", padding:0 }} />
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 10px)", left:-16, right:-16, zIndex:9999, background:"#fff", border:`1px solid ${theme.border}`, borderRadius:14, boxShadow:"0 12px 40px rgba(0,0,0,0.14)", maxHeight:280, overflowY:"auto" }}>
          {filtered.length === 0
            ? <div style={{ padding:"14px 16px", color:theme.textMuted, fontSize:13 }}>No airports found</div>
            : filtered.map(a => (
              <div key={a.code} onMouseDown={e=>{ e.preventDefault(); onChange(a); setOpen(false); }}
                style={{ padding:"10px 16px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${theme.border}` }}
                onMouseEnter={e=>e.currentTarget.style.background=theme.bgCard}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div>
                  <div style={{ fontWeight:700, fontSize:13, color:theme.text }}>{a.city}, {a.country}</div>
                  <div style={{ fontSize:11, color:theme.textMuted, marginTop:2 }}>{a.name}</div>
                </div>
                <span style={{ fontWeight:800, fontSize:16, color:theme.accent, marginLeft:12 }}>{a.code}</span>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

// ─── TravelersDropdown ────────────────────────────────────────────────────────
function TravelersDropdown({ travelers, onChange }) {
  const [open, setOpen] = useState(false);
  const total = travelers.adults + travelers.children + travelers.infants;
  const update = (type,delta) => { const min=type==="adults"?1:0; onChange({...travelers,[type]:Math.max(min,travelers[type]+delta)}); };
  const types = [{ key:"adults",label:"Adult",sub:"12 years and above"},{ key:"children",label:"Child",sub:"2 to under 12 years"},{ key:"infants",label:"Infant",sub:"Under 2 years"}];
  return (
    <div style={{ position:"relative" }}>
      <div style={{ fontSize:11, color:theme.textMuted, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600 }}>Travelers</div>
      <div onClick={()=>setOpen(!open)} style={{ cursor:"pointer", fontSize:14, color:theme.text, userSelect:"none", fontFamily:"'DM Sans',sans-serif" }}>
        {total} Traveler{total!==1?"s":""}
        <span style={{ color:theme.textMuted, fontSize:12, marginLeft:6 }}>({travelers.adults} Adult{travelers.adults!==1?"s":""}
          {travelers.children>0?`, ${travelers.children} Child`:""}{travelers.infants>0?`, ${travelers.infants} Infant`:""})</span>
      </div>
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 10px)", right:0, zIndex:9999, width:300, background:"#fff", border:`1px solid ${theme.border}`, borderRadius:16, boxShadow:"0 12px 40px rgba(0,0,0,0.14)", padding:20 }}>
          {types.map(t => (
            <div key={t.key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:theme.text }}>{t.label}</div>
                <div style={{ fontSize:11, color:theme.textMuted, marginTop:2 }}>{t.sub}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <button onMouseDown={e=>{e.preventDefault();update(t.key,-1);}} style={{ width:30,height:30,borderRadius:"50%",border:`1px solid ${theme.border}`,background:"#fff",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:theme.textMuted }}>−</button>
                <span style={{ minWidth:22, textAlign:"center", fontWeight:700, fontSize:15, color:theme.text }}>{travelers[t.key]}</span>
                <button onMouseDown={e=>{e.preventDefault();update(t.key,1);}} style={{ width:30,height:30,borderRadius:"50%",border:`1px solid ${theme.accent}`,background:theme.accent,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff" }}>+</button>
              </div>
            </div>
          ))}
          <button onMouseDown={e=>{e.preventDefault();setOpen(false);}} style={{ width:"100%",padding:"11px",background:theme.accent,color:"#fff",border:"none",borderRadius:12,fontWeight:700,fontSize:14,cursor:"pointer" }}>Done</button>
        </div>
      )}
    </div>
  );
}

// ─── FlightPanel ──────────────────────────────────────────────────────────────
function FlightPanel() {
  const [tripType,   setTripType]   = useState("One Way");
  const [from,       setFrom]       = useState(null);
  const [to,         setTo]         = useState(null);
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cabinClass, setCabinClass] = useState("Economy");
  const [travelers,  setTravelers]  = useState({ adults:1, children:0, infants:0 });
  const today = new Date().toISOString().split("T")[0];
  const swapAirports = () => { const t=from; setFrom(to); setTo(t); };
  const fieldBox = (children) => (
    <div style={{ padding:"14px 16px", background:"#fff", borderRadius:14, border:`1px solid ${theme.border}`, position:"relative" }}>{children}</div>
  );
  return (
    <div style={{ background:theme.bgCard, borderRadius:20, border:`1px solid ${theme.border}`, padding:"24px 28px", boxShadow:"0 4px 24px rgba(0,0,0,0.06)" }}>
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {["One Way","Return","Multi City"].map(type => (
          <button key={type} onClick={()=>setTripType(type)} style={{ padding:"8px 20px", borderRadius:50, fontSize:13, fontWeight:600, cursor:"pointer", border: tripType===type?`2px solid ${theme.accent}`:`1px solid ${theme.border}`, background: tripType===type?"rgba(26,60,110,0.08)":"#fff", color: tripType===type?theme.accent:theme.textMuted, transition:"all 0.2s" }}>{type}</button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 40px 1fr", gap:10, marginBottom:14, alignItems:"center" }}>
        {fieldBox(<AirportInput label="From" value={from} onChange={setFrom} />)}
        <button onClick={swapAirports} style={{ width:36,height:36,borderRadius:"50%",border:`1px solid ${theme.border}`,background:"#fff",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",transition:"transform 0.3s",color:theme.accent }} onMouseEnter={e=>e.currentTarget.style.transform="rotate(180deg)"} onMouseLeave={e=>e.currentTarget.style.transform="rotate(0deg)"}>⇄</button>
        {fieldBox(<AirportInput label="To" value={to} onChange={setTo} />)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns: tripType==="Return"?"1fr 1fr 1.2fr 1.4fr":"1fr 1.2fr 1.4fr", gap:10, marginBottom:20 }}>
        {fieldBox(<><div style={{ fontSize:11,color:theme.textMuted,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.5px",fontWeight:600 }}>Departure Date</div><input type="date" min={today} value={departDate} onChange={e=>setDepartDate(e.target.value)} style={{ border:"none",background:"transparent",outline:"none",fontSize:14,color:theme.text,fontFamily:"'DM Sans',sans-serif",colorScheme:"light",width:"100%" }} /></>)}
        {tripType==="Return" && fieldBox(<><div style={{ fontSize:11,color:theme.textMuted,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.5px",fontWeight:600 }}>Return Date</div><input type="date" min={departDate||today} value={returnDate} onChange={e=>setReturnDate(e.target.value)} style={{ border:"none",background:"transparent",outline:"none",fontSize:14,color:theme.text,fontFamily:"'DM Sans',sans-serif",colorScheme:"light",width:"100%" }} /></>)}
        {fieldBox(<><div style={{ fontSize:11,color:theme.textMuted,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.5px",fontWeight:600 }}>Cabin Class</div><select value={cabinClass} onChange={e=>setCabinClass(e.target.value)} style={{ border:"none",background:"transparent",outline:"none",fontSize:14,color:theme.text,fontFamily:"'DM Sans',sans-serif",width:"100%",cursor:"pointer",appearance:"none" }}><option>Economy</option><option>Economy Premium</option><option>Business Class</option><option>First Class</option></select></>)}
        {fieldBox(<TravelersDropdown travelers={travelers} onChange={setTravelers} />)}
      </div>
      <button className="btn-primary" style={{ width:"100%",padding:"15px",borderRadius:14,fontSize:15,fontWeight:700 }}>🔍 Search Flights</button>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function Hero({ h }) {
  const [activeTab, setActiveTab] = useState("Flights");
  return (
    <section style={{ minHeight:"100vh", background:`radial-gradient(ellipse at 70% 30%, rgba(26,60,110,0.07) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(76,175,125,0.05) 0%, transparent 50%), ${theme.bg}`, padding:"120px 5% 80px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, alignItems:"center" }} className="hero-grid">
      <div>
        <h1 className="serif fade-up-delay1" style={{ fontSize:"clamp(42px,5vw,68px)", fontWeight:700, lineHeight:1.1, letterSpacing:"-1px", marginBottom:24, color:theme.text }}>
          {h.heading1}<br /><span className="gradient-text">{h.headingAccent}</span>{" "}<em>{h.headingItalic}</em>
        </h1>
        <p className="fade-up-delay2" style={{ color:theme.textMuted, fontSize:16, lineHeight:1.75, maxWidth:440, marginBottom:36 }}>{h.subtext}</p>
        <div className="fade-up-delay3" style={{ display:"flex", gap:14, marginBottom:48, flexWrap:"wrap" }}>
          <button className="btn-primary" onClick={()=>window.location.hash="#/umrah"}>Explore Packages</button>
          <button className="btn-outline" onClick={()=>window.location.hash="#/cars"} style={{ display:"flex", alignItems:"center", gap:8, color:theme.text }}>

            Car Rental
          </button>
        </div>
        <div className="fade-up-delay4" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
          {[{ num:h.stat1Num,label:h.stat1Label },{ num:h.stat2Num,label:h.stat2Label },{ num:h.stat3Num,label:h.stat3Label }].map(s => (
            <div key={s.label}>
              <div style={{ fontSize:28, fontWeight:700, color:theme.accent, fontFamily:"'Playfair Display',serif" }}>{s.num}</div>
              <div style={{ fontSize:13, color:theme.textMuted, marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position:"relative" }} className="fade-up-delay2">
        <div className="hero-image-wrap float-anim" style={{ height:480 }}>
          <img src={h.heroImage} alt="hero" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
          <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top, rgba(10,10,15,0.3) 0%, transparent 50%)" }} />
        </div>
        <div className="parallax-badge" style={{ bottom:28,left:-32,animation:"scaleIn 0.6s 0.8s both" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ fontSize:28 }}>🕌</div>
            <div>
              <div style={{ fontSize:13,fontWeight:600,color:theme.text }}>{h.badgeLabel}</div>
              <div style={{ fontSize:11,color:theme.textMuted }}>{h.badgeSub}</div>
            </div>
            <div style={{ marginLeft:8,background:theme.green,color:"#fff",fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:20 }}>OPEN</div>
          </div>
        </div>
        <div className="parallax-badge" style={{ top:28,right:-24,animation:"slideLeft 0.6s 0.6s both" }}>
          <div style={{ fontSize:11,color:theme.textMuted,marginBottom:4 }}>Rating</div>
          <div style={{ display:"flex",gap:2,fontSize:14,color:theme.accent }}>★★★★★</div>
          <div style={{ fontSize:13,fontWeight:600,marginTop:2,color:theme.text }}>4.98 / 5.0</div>
        </div>
      </div>
      <div style={{ gridColumn:"1 / -1" }}>
        <div style={{ display:"flex", gap:28, marginBottom:20 }}>
          {["Flights","Insurance"].map(tab => (
            <button key={tab} onClick={()=>{ if(tab==="Insurance"){ window.location.hash="#/insurance"; } else setActiveTab(tab); }}
              style={{ background:"none",border:"none",color:activeTab===tab?theme.accent:theme.textMuted,fontSize:15,fontWeight:600,cursor:"pointer",paddingBottom:10,borderBottom:activeTab===tab?`2px solid ${theme.accent}`:"2px solid transparent",fontFamily:"'DM Sans',sans-serif",transition:"color 0.2s",display:"flex",alignItems:"center",gap:6 }}>
              {tab==="Flights"?"✈️":"🛡️"} {tab}
            </button>
          ))}
        </div>
        {activeTab==="Flights" && <FlightPanel />}
      </div>
    </section>
  );
}

// ─── Umrah Section ─────────────────────────────────────────────────────────────
function UmrahSection({ sec, packages }) {
  return (
    <section style={{ padding:"100px 5%", background:theme.bg }}>
      <div style={{ textAlign:"center", marginBottom:52 }}>
        <h2 className="serif" style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:700, marginBottom:16, color:theme.text }}>
          {sec.heading} <span className="gradient-text">{sec.headingAccent}</span>
        </h2>
        <p style={{ color:theme.textMuted, maxWidth:520, margin:"0 auto", lineHeight:1.7 }}>{sec.subtext}</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }} className="dest-grid">
        {packages.map((pkg,i) => (
          <div key={pkg.id} className="dest-card card-hover" style={{ borderRadius:20,overflow:"hidden",background:theme.bgCard,border:`1px solid ${theme.border}`,cursor:"pointer",animation:`fadeUp 0.6s ${i*0.1}s both` }} onClick={()=>window.location.hash="#/umrah"}>
            <div style={{ position:"relative",height:210,overflow:"hidden" }}>
              <img src={pkg.img} alt={pkg.name} style={{ width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.5s" }} />
              <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.6) 0%,transparent 55%)" }} />
              <span style={{ position:"absolute",top:14,right:14,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(8px)",color:theme.accent,fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:20,border:"1px solid rgba(26,60,110,0.3)" }}>{pkg.tag}</span>
              <span style={{ position:"absolute",top:14,left:14,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(6px)",color:"#fff",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,textTransform:"uppercase" }}>{pkg.category}</span>
              <div style={{ position:"absolute",bottom:14,left:16 }}><h3 style={{ fontSize:17,fontWeight:700,color:"#fff",margin:0,fontFamily:"'Playfair Display',serif" }}>{pkg.name}</h3></div>
            </div>
            <div style={{ padding:"16px 18px 18px" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
                <div><div style={{ fontSize:19,fontWeight:800,color:theme.accent,fontFamily:"'Playfair Display',serif" }}>{pkg.price}</div><div style={{ fontSize:10,color:theme.textMuted }}>per person</div></div>
                <div style={{ fontSize:13,fontWeight:600,color:theme.text }}>⏱ {pkg.days}</div>
              </div>
              <div style={{ display:"flex",gap:12,alignItems:"center",paddingTop:12,borderTop:`1px solid ${theme.border}`,justifyContent:"space-between" }}>
                <div style={{ display:"flex",gap:8,alignItems:"center" }}><span style={{ fontSize:13,color:theme.accent,fontWeight:700 }}>★ {pkg.rating}</span><span style={{ fontSize:12,color:theme.textMuted }}>({pkg.reviews} reviews)</span></div>
                <span style={{ fontSize:11,color:theme.textMuted,background:theme.bgCard,border:`1px solid ${theme.border}`,padding:"3px 10px",borderRadius:20 }}>✈ Visa Included</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign:"center",marginTop:48 }}><button className="btn-outline" style={{ color:theme.text }} onClick={()=>window.location.hash="#/umrah"}>All Packages →</button></div>
    </section>
  );
}

// ─── Car Rental Section ────────────────────────────────────────────────────────
function CarRentalSection({ sec, cars }) {
  return (
    <section style={{ padding:"100px 5%", background:theme.bgCard }}>
      <div style={{ textAlign:"center", marginBottom:52 }}>
        <h2 className="serif" style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:700, marginBottom:16, color:theme.text }}>
          {sec.heading} <span className="gradient-text">{sec.headingAccent}</span>
        </h2>
        <p style={{ color:theme.textMuted, maxWidth:520, margin:"0 auto", lineHeight:1.7 }}>{sec.subtext}</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }} className="dest-grid">
        {cars.map((car,i) => (
          <div key={car.id} className="dest-card card-hover" style={{ borderRadius:20,overflow:"hidden",background:theme.bg,border:`1px solid ${theme.border}`,cursor:"pointer",animation:`fadeUp 0.6s ${i*0.1}s both` }} onClick={()=>window.location.hash="#/cars"}>
            <div style={{ position:"relative",height:200,overflow:"hidden" }}>
              <img src={car.img} alt={car.name} style={{ width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.5s" }} />
              <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.6) 0%,transparent 55%)" }} />
              <span style={{ position:"absolute",top:12,right:12,background:"rgba(26,60,110,0.85)",backdropFilter:"blur(6px)",color:"#fff",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,textTransform:"uppercase" }}>{car.type}</span>
              <span style={{ position:"absolute",top:12,left:12,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(6px)",color:"#fff",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20 }}>🪑 {car.seats} Seats</span>
              <div style={{ position:"absolute",bottom:14,left:16 }}><h3 style={{ fontSize:16,fontWeight:700,color:"#fff",margin:0,fontFamily:"'Playfair Display',serif" }}>{car.name}</h3></div>
            </div>
            <div style={{ padding:"14px 16px 16px" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
                <span style={{ fontSize:11,color:theme.accent,fontWeight:700,background:"rgba(26,60,110,0.08)",border:"1px solid rgba(26,60,110,0.15)",padding:"3px 10px",borderRadius:20 }}>{car.tag}</span>
                <div style={{ textAlign:"right" }}><div style={{ fontSize:17,fontWeight:800,color:theme.accent,fontFamily:"'Playfair Display',serif" }}>{car.price}</div><div style={{ fontSize:10,color:theme.textMuted }}>per day</div></div>
              </div>
              <div style={{ paddingTop:10,borderTop:`1px solid ${theme.border}`,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <span style={{ fontSize:12,color:theme.textMuted }}>🚗 {car.company} • With Driver Available</span>
                <span style={{ fontSize:11,color: car.available!==false?"#16a34a":"#ef4444",fontWeight:700,background: car.available!==false?"rgba(34,197,94,0.08)":"rgba(239,68,68,0.08)",border:`1px solid ${car.available!==false?"rgba(34,197,94,0.2)":"rgba(239,68,68,0.2)"}`,padding:"2px 8px",borderRadius:12 }}>{car.available!==false?"✅ Available":"❌ Unavailable"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign:"center",marginTop:48 }}><button className="btn-outline" style={{ color:theme.text }} onClick={()=>window.location.hash="#/cars"}>All Cars →</button></div>
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
function Features() {
  return (
    <section style={{ padding:"100px 5%", background:`radial-gradient(ellipse at 30% 50%, rgba(26,60,110,0.05) 0%, transparent 60%), ${theme.bgCard}` }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }} className="hero-grid">
        <div>
          <h2 className="serif" style={{ fontSize:"clamp(30px,3.5vw,48px)", fontWeight:700, marginBottom:20, lineHeight:1.2, color:theme.text }}>Travel Smarter,<br /><span className="gradient-text">Live Better</span></h2>
          <p style={{ color:theme.textMuted, lineHeight:1.75, marginBottom:36 }}>We believe travel changes lives. That's why we obsess over every detail — so you can focus on what matters.</p>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {features.map(f => (
              <div key={f.title} style={{ display:"flex", gap:16, alignItems:"start" }}>
                <div className="feature-icon">{f.icon}</div>
                <div><div style={{ fontWeight:600,marginBottom:4,color:theme.text }}>{f.title}</div><div style={{ fontSize:13,color:theme.textMuted,lineHeight:1.6 }}>{f.desc}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {["https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80","https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80","https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80","https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=400&q=80"].map((img,i) => (
            <div key={i} style={{ borderRadius:16,overflow:"hidden",height:180,marginTop:i%2===1?24:0 }}>
              <img src={img} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.4s" }} onMouseEnter={e=>e.target.style.transform="scale(1.05)"} onMouseLeave={e=>e.target.style.transform="scale(1)"} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Visa Section ─────────────────────────────────────────────────────────────
function VisaSection({ sec, visas }) {
  return (
    <section style={{ padding:"100px 5%", background:theme.bg }}>
      <div style={{ textAlign:"center", marginBottom:52 }}>
        <h2 className="serif" style={{ fontSize:"clamp(32px,4vw,52px)", fontWeight:700, marginBottom:16, color:theme.text }}>
          {sec.heading} <span className="gradient-text">{sec.headingAccent}</span> {sec.headingEnd}
        </h2>
        <p style={{ color:theme.textMuted, maxWidth:520, margin:"0 auto", lineHeight:1.7 }}>{sec.subtext}</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }} className="dest-grid">
        {visas.map((visa,i) => (
          <div key={visa.id} className="dest-card card-hover" style={{ borderRadius:20,overflow:"hidden",background:theme.bgCard,border:`1px solid ${theme.border}`,cursor:"pointer",animation:`fadeUp 0.6s ${i*0.1}s both` }} onClick={()=>window.location.hash="#/visas"}>
            <div style={{ position:"relative",height:180,overflow:"hidden" }}>
              <img src={visa.img} alt={visa.country} style={{ width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.5s" }} />
              <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 55%)" }} />
              <span style={{ position:"absolute",top:12,right:14,fontSize:30,filter:"drop-shadow(0 2px 6px rgba(0,0,0,0.3))" }}>{visa.flag}</span>
              <span style={{ position:"absolute",top:14,left:14,background:visa.type==="Visa On Arrival"?"rgba(34,197,94,0.75)":visa.type.includes("e-Visa")?"rgba(59,130,246,0.75)":"rgba(0,0,0,0.55)",backdropFilter:"blur(6px)",color:"#fff",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,textTransform:"uppercase" }}>{visa.type}</span>
              <div style={{ position:"absolute",bottom:12,left:14 }}><h3 style={{ fontSize:18,fontWeight:700,color:"#fff",margin:0,fontFamily:"'Playfair Display',serif" }}>{visa.country}</h3></div>
            </div>
            <div style={{ padding:"14px 16px 16px" }}>
              <div style={{ display:"flex",gap:8,marginBottom:12,flexWrap:"wrap" }}>
                <span style={{ fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:20,background:"rgba(26,60,110,0.1)",color:theme.accent,border:"1px solid rgba(26,60,110,0.25)" }}>⏱ {visa.processing}</span>
                <span style={{ fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:20,background:"rgba(34,197,94,0.08)",color:"#16a34a",border:"1px solid rgba(34,197,94,0.2)" }}>✅ {visa.approvalRate}</span>
              </div>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:`1px solid ${theme.border}` }}>
                <div><div style={{ fontSize:10,color:theme.textMuted,marginBottom:2 }}>Starting from</div><div style={{ fontSize:17,fontWeight:800,color:theme.accent,fontFamily:"'Playfair Display',serif" }}>{visa.fee==="FREE"?<span style={{ color:"#16a34a" }}>FREE ✓</span>:visa.fee}</div></div>
                <span style={{ fontSize:11,color:theme.textMuted,background:theme.bg,border:`1px solid ${theme.border}`,padding:"4px 12px",borderRadius:20,fontWeight:600 }}>Apply →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign:"center",marginTop:48 }}><button className="btn-outline" style={{ color:theme.text }} onClick={()=>window.location.hash="#/visas"}>All Visas →</button></div>
    </section>
  );
}

// ─── Reviews Section ──────────────────────────────────────────────────────────
function Reviews({ sec }) {
  return (
    <section style={{ padding:"100px 5%", background:theme.bgCard }}>
      <div style={{ textAlign:"center", marginBottom:52 }}>
        <h2 className="serif" style={{ fontSize:"clamp(30px,3.5vw,48px)", fontWeight:700, marginBottom:16, color:theme.text }}>
          {sec.heading} <span className="gradient-text">{sec.headingAccent}</span> {sec.headingEnd}
        </h2>
        <p style={{ color:theme.textMuted, maxWidth:460, margin:"0 auto", lineHeight:1.7 }}>{sec.subtext}</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }} className="three-col">
        {reviews.map((r,i) => (
          <div key={r.name} className="review-card" style={{ background:theme.bg, border:`1px solid ${theme.border}`, animation:`fadeUp 0.6s ${i*0.15}s both` }}>
            <div style={{ display:"flex",gap:4,marginBottom:16 }}>{Array(r.rating).fill(0).map((_,j)=><span key={j} style={{ color:theme.accent,fontSize:16 }}>★</span>)}</div>
            <p style={{ color:theme.textMuted,lineHeight:1.7,fontSize:14,marginBottom:20,fontStyle:"italic" }}>"{r.text}"</p>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <div style={{ display:"flex",gap:12,alignItems:"center" }}>
                <img src={r.img} alt={r.name} style={{ width:44,height:44,borderRadius:"50%",objectFit:"cover",border:`2px solid ${theme.accent}` }} />
                <div><div style={{ fontWeight:600,fontSize:14,color:theme.text }}>{r.name}</div><div style={{ fontSize:12,color:theme.textMuted }}>{r.loc}</div></div>
              </div>
              <div style={{ fontSize:11,color:theme.accent,background:"rgba(26,60,110,0.1)",padding:"4px 10px",borderRadius:20,border:"1px solid rgba(26,60,110,0.2)" }}>{r.tour}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────
function CTA({ sec }) {
  return (
    <section style={{ padding:"100px 5%", background:`linear-gradient(135deg, rgba(26,60,110,0.08) 0%, rgba(76,175,125,0.05) 100%), ${theme.bg}`, textAlign:"center" }}>
      <div style={{ maxWidth:640, margin:"0 auto" }}>
        <h2 className="serif" style={{ fontSize:"clamp(32px,4vw,58px)", fontWeight:700, marginBottom:20, lineHeight:1.15, color:theme.text }}>
          {sec.heading} <span className="gradient-text">{sec.headingAccent}</span>
        </h2>
        <p style={{ color:theme.textMuted, lineHeight:1.75, marginBottom:40, fontSize:16 }}>{sec.subtext}</p>
        <div style={{ display:"flex", gap:12, maxWidth:480, margin:"0 auto", background:"rgba(0,0,0,0.04)", border:`1px solid ${theme.border}`, borderRadius:50, padding:"6px 6px 6px 24px" }}>
          <input className="search-input" placeholder="Enter your email address" style={{ flex:1, color:theme.text }} />
          <button className="btn-primary" style={{ borderRadius:50,padding:"12px 28px",flexShrink:0 }}>Get Started</button>
        </div>
        <p style={{ color:theme.textMuted, fontSize:12, marginTop:14 }}>No spam, ever. Unsubscribe any time.</p>
      </div>
    </section>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const c = useContent();
  const { sections: s } = c;
  return (
    <>
      <Navbar />
      {s.hero      && <Hero            h={c.hero} />}
      {s.hero      && <div className="section-divider" />}
      {s.umrah     && <UmrahSection    sec={c.umrahSection}  packages={c.umrahPackages} />}
      {s.umrah     && <div className="section-divider" />}
      {s.carRental && <CarRentalSection sec={c.carsSection}  cars={c.carRentalHighlights} />}
      {s.carRental && <div className="section-divider" />}
      {s.features  && <Features />}
      {s.features  && <div className="section-divider" />}
      {s.visa      && <VisaSection     sec={c.visaSection}   visas={c.visasList} />}
      {s.visa      && <div className="section-divider" />}
      {s.reviews   && <Reviews         sec={c.reviewsSection} />}
      {s.cta       && <CTA             sec={c.ctaSection} />}
      <Footer />
    </>
  );
}