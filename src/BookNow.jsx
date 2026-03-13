import { useState } from "react";
import theme from './theme.js';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

// ─── Reusable Field Components ────────────────────────────────────────────────
const inputStyle = {
  width:"100%", padding:"13px 16px", border:`1px solid #e2e4ea`,
  borderRadius:12, fontSize:14, color:"#1a1a2e", outline:"none",
  fontFamily:"'DM Sans', sans-serif", background:"#fff",
  boxSizing:"border-box", transition:"border 0.2s",
};
const labelStyle = {
  display:"block", fontSize:12, fontWeight:700, color:"#6b6880",
  marginBottom:6, textTransform:"uppercase", letterSpacing:"0.6px",
};
function Field({ label, required, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}{required && <span style={{ color:"#ef4444" }}> *</span>}</label>
      {children}
    </div>
  );
}
function TextInput({ placeholder, value, onChange, type="text" }) {
  return (
    <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
      style={inputStyle}
      onFocus={e => e.target.style.border=`1px solid ${theme.accent}`}
      onBlur={e  => e.target.style.border="1px solid #e2e4ea"}
    />
  );
}
function SelectInput({ options, value, onChange, placeholder }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ ...inputStyle, appearance:"none", cursor:"pointer", color: value ? "#1a1a2e" : "#9ca3af" }}
      onFocus={e => e.target.style.border=`1px solid ${theme.accent}`}
      onBlur={e  => e.target.style.border="1px solid #e2e4ea"}>
      <option value="" disabled>{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
function TextareaInput({ placeholder, value, onChange, rows=3 }) {
  return (
    <textarea placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} rows={rows}
      style={{ ...inputStyle, resize:"vertical", lineHeight:1.6 }}
      onFocus={e => e.target.style.border=`1px solid ${theme.accent}`}
      onBlur={e  => e.target.style.border="1px solid #e2e4ea"}
    />
  );
}

// ─── Common User Details ──────────────────────────────────────────────────────
function UserDetails({ data, onChange }) {
  return (
    <>
      <Field label="Full Name" required>
        <TextInput placeholder="e.g. Ahmed Khan" value={data.name} onChange={v => onChange("name", v)} />
      </Field>
      <Field label="Phone Number" required>
        <TextInput placeholder="+92 300 0000000" value={data.phone} onChange={v => onChange("phone", v)} type="tel" />
      </Field>
      <Field label="Email Address">
        <TextInput placeholder="example@email.com (optional)" value={data.email} onChange={v => onChange("email", v)} type="email" />
      </Field>
    </>
  );
}

// ─── Thank You Screen ─────────────────────────────────────────────────────────
function ThankYou({ category, onReset }) {
  return (
    <div style={{ textAlign:"center", padding:"60px 20px" }}>
      <div style={{ fontSize:72, marginBottom:20 }}></div>
      <h2 style={{ fontSize:28, fontWeight:700, color:theme.text, marginBottom:12, fontFamily:"'Playfair Display',serif" }}>
        Booking Received!
      </h2>
      <p style={{ fontSize:16, color:theme.textMuted, lineHeight:1.75, maxWidth:440, margin:"0 auto 16px" }}>
        Thank you for your <strong style={{ color:theme.text }}>{category}</strong> inquiry.
        Our team will contact you shortly to confirm your booking details.
      </p>
      <div style={{ display:"inline-flex", alignItems:"center", gap:10, background:"rgba(26,60,110,0.07)", border:"1px solid rgba(26,60,110,0.2)", borderRadius:16, padding:"14px 24px", marginBottom:36 }}>
        <span style={{ fontSize:20 }}>📞</span>
        <span style={{ fontSize:14, color:theme.text, fontWeight:600 }}>Typically within 1–2 business hours</span>
      </div>
      <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
        <button onClick={onReset} className="btn-primary" style={{ padding:"13px 32px" }}>Make Another Booking</button>
        <button onClick={() => window.location.hash = ""} className="btn-outline" style={{ color:theme.text, padding:"13px 32px" }}>Back to Home</button>
      </div>
    </div>
  );
}

// ─── FORM: Umrah Package ──────────────────────────────────────────────────────
function UmrahForm({ onSubmit }) {
  const [user, setUser]       = useState({ name:"", phone:"", email:"" });
  const [pkg,  setPkg]        = useState("");
  const [persons, setPersons] = useState(1);
  const [notes, setNotes]     = useState("");
  const setU = (k,v) => setUser(p => ({ ...p, [k]:v }));

  const packages = [
    "Economy Umrah Package",
    "Standard Umrah Package",
    "Premium Umrah Package",
    "Luxury Umrah Package",
    "Family Umrah Package",
    "Group Umrah Package",
  ];

  const handle = () => {
    if (!user.name || !user.phone || !pkg) { alert("Please fill all required fields."); return; }
    onSubmit();
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <Field label="Package Type" required>
        <SelectInput options={packages} value={pkg} onChange={setPkg} placeholder="Select Umrah Package" />
      </Field>
      <Field label="Number of Persons" required>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <button onClick={() => setPersons(p => Math.max(1, p-1))}
            style={{ width:38, height:38, borderRadius:"50%", border:`1px solid #e2e4ea`, background:"#fff", fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:theme.textMuted }}>−</button>
          <span style={{ fontWeight:700, fontSize:18, color:theme.text, minWidth:30, textAlign:"center" }}>{persons}</span>
          <button onClick={() => setPersons(p => p+1)}
            style={{ width:38, height:38, borderRadius:"50%", border:`1px solid ${theme.accent}`, background:theme.accent, fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>+</button>
          <span style={{ fontSize:13, color:theme.textMuted }}>person{persons !== 1 ? "s" : ""}</span>
        </div>
      </Field>
      <UserDetails data={user} onChange={setU} />
      <Field label="Special Requirements">
        <TextareaInput placeholder="Any special requirements, medical conditions, etc." value={notes} onChange={setNotes} />
      </Field>
      <button onClick={handle} className="btn-primary" style={{ width:"100%", padding:"15px", borderRadius:14, fontSize:15, fontWeight:700, marginTop:4 }}>
        Submit Booking Request
      </button>
    </div>
  );
}

// ─── FORM: Visa ───────────────────────────────────────────────────────────────
function VisaForm({ onSubmit }) {
  const [user,    setUser]    = useState({ name:"", phone:"", email:"" });
  const [country, setCountry] = useState("");
  const [visaType,setVisaType]= useState("");
  const [persons, setPersons] = useState(1);
  const [passport,setPassport]= useState("");
  const [notes,   setNotes]   = useState("");
  const setU = (k,v) => setUser(p => ({ ...p, [k]:v }));

  const countries = ["Malaysia", "UAE (Dubai)", "Turkey", "Maldives", "Azerbaijan", "Saudi Arabia", "United Kingdom", "Schengen Europe", "USA", "Canada", "Australia", "New Zealand"];
  const visaTypes = ["Tourist Visa", "Business Visa", "Student Visa", "Family Visit Visa", "Umrah Visa", "Transit Visa"];

  const handle = () => {
    if (!user.name || !user.phone || !country) { alert("Please fill all required fields."); return; }
    onSubmit();
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <Field label="Visit Country" required>
        <SelectInput options={countries} value={country} onChange={setCountry} placeholder="Select Destination Country" />
      </Field>
      <Field label="Visa Type" required>
        <SelectInput options={visaTypes} value={visaType} onChange={setVisaType} placeholder="Select Visa Type" />
      </Field>
      <Field label="Number of Applicants" required>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <button onClick={() => setPersons(p => Math.max(1, p-1))}
            style={{ width:38, height:38, borderRadius:"50%", border:`1px solid #e2e4ea`, background:"#fff", fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:theme.textMuted }}>−</button>
          <span style={{ fontWeight:700, fontSize:18, color:theme.text, minWidth:30, textAlign:"center" }}>{persons}</span>
          <button onClick={() => setPersons(p => p+1)}
            style={{ width:38, height:38, borderRadius:"50%", border:`1px solid ${theme.accent}`, background:theme.accent, fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>+</button>
          <span style={{ fontSize:13, color:theme.textMuted }}>applicant{persons !== 1 ? "s" : ""}</span>
        </div>
      </Field>
      <UserDetails data={user} onChange={setU} />
      <Field label="Passport Expiry Date" required>
        <input type="date" value={passport} onChange={e => setPassport(e.target.value)}
          style={{ ...inputStyle, colorScheme:"light" }}
          onFocus={e => e.target.style.border=`1px solid ${theme.accent}`}
          onBlur={e  => e.target.style.border="1px solid #e2e4ea"} />
      </Field>
      <Field label="Additional Notes">
        <TextareaInput placeholder="Any additional information..." value={notes} onChange={setNotes} />
      </Field>
      <button onClick={handle} className="btn-primary" style={{ width:"100%", padding:"15px", borderRadius:14, fontSize:15, fontWeight:700, marginTop:4 }}>
        Submit Visa Request
      </button>
    </div>
  );
}

// ─── FORM: Insurance ─────────────────────────────────────────────────────────
const DURATIONS = ["1 Week","2 Weeks","3 Weeks","1 Month","2 Months","3 Months","6 Months","1 Year","2 Years","3 Years","4 Years","5 Years"];
const COUNTRIES_INS = ["Afghanistan","Albania","Algeria","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahrain","Bangladesh","Belgium","Brazil","Canada","China","Colombia","Czech Republic","Denmark","Egypt","Finland","France","Germany","Greece","Hong Kong","Hungary","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Japan","Jordan","Kazakhstan","Kenya","Kuwait","Malaysia","Maldives","Mexico","Morocco","Nepal","Netherlands","New Zealand","Nigeria","Norway","Oman","Pakistan","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Saudi Arabia","Singapore","South Africa","South Korea","Spain","Sri Lanka","Sweden","Switzerland","Turkey","UAE","Ukraine","United Kingdom","United States","Uzbekistan","Vietnam","Yemen"];

function InsuranceForm({ onSubmit }) {
  const [user,      setUser]      = useState({ name:"", phone:"", email:"" });
  const [country,   setCountry]   = useState("");
  const [duration,  setDuration]  = useState("");
  const [startDate, setStartDate] = useState("");
  const [planType,  setPlanType]  = useState("");
  const setU = (k,v) => setUser(p => ({ ...p, [k]:v }));
  const today = new Date().toISOString().split("T")[0];

  const handle = () => {
    if (!user.name || !user.phone || !country || !duration || !startDate) { alert("Please fill all required fields."); return; }
    onSubmit();
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <Field label="Destination Country" required>
        <SelectInput options={COUNTRIES_INS} value={country} onChange={setCountry} placeholder="Select Country" />
      </Field>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Field label="Stay Duration" required>
          <SelectInput options={DURATIONS} value={duration} onChange={setDuration} placeholder="Select Duration" />
        </Field>
        <Field label="Start Date" required>
          <input type="date" min={today} value={startDate} onChange={e => setStartDate(e.target.value)}
            style={{ ...inputStyle, colorScheme:"light" }}
            onFocus={e => e.target.style.border=`1px solid ${theme.accent}`}
            onBlur={e  => e.target.style.border="1px solid #e2e4ea"} />
        </Field>
      </div>
      <Field label="Plan Type" required>
        <SelectInput options={["Per Person Plan","Family Plan"]} value={planType} onChange={setPlanType} placeholder="Select Plan Type" />
      </Field>
      <UserDetails data={user} onChange={setU} />
      <button onClick={handle} className="btn-primary" style={{ width:"100%", padding:"15px", borderRadius:14, fontSize:15, fontWeight:700, marginTop:4 }}>
        Submit Insurance Request
      </button>
    </div>
  );
}

// ─── FORM: Flight (mini booking panel) ───────────────────────────────────────
const AIRPORTS_SHORT = [
  "LHE – Lahore, Pakistan","KHI – Karachi, Pakistan","ISB – Islamabad, Pakistan",
  "DXB – Dubai, UAE","AUH – Abu Dhabi, UAE","DOH – Doha, Qatar",
  "JED – Jeddah, Saudi Arabia","RUH – Riyadh, Saudi Arabia","MED – Madinah, Saudi Arabia",
  "LHR – London, UK","CDG – Paris, France","FRA – Frankfurt, Germany",
  "IST – Istanbul, Turkey","CAI – Cairo, Egypt","BAH – Bahrain",
  "KWI – Kuwait City, Kuwait","MCT – Muscat, Oman",
  "DEL – New Delhi, India","BOM – Mumbai, India","DAC – Dhaka, Bangladesh",
  "KUL – Kuala Lumpur, Malaysia","SIN – Singapore","BKK – Bangkok, Thailand",
  "JFK – New York, USA","LAX – Los Angeles, USA","ORD – Chicago, USA",
  "SYD – Sydney, Australia","ICN – Seoul, South Korea","NRT – Tokyo, Japan",
  "AMS – Amsterdam, Netherlands","YYZ – Toronto, Canada","GYD – Baku, Azerbaijan",
];
function FlightForm({ onSubmit }) {
  const [user,      setUser]      = useState({ name:"", phone:"", email:"" });
  const [tripType,  setTripType]  = useState("One Way");
  const [from,      setFrom]      = useState("");
  const [to,        setTo]        = useState("");
  const [depDate,   setDepDate]   = useState("");
  const [retDate,   setRetDate]   = useState("");
  const [cabinClass,setCabinClass]= useState("");
  const [adults,    setAdults]    = useState(1);
  const [children,  setChildren]  = useState(0);
  const [infants,   setInfants]   = useState(0);
  const setU = (k,v) => setUser(p => ({ ...p, [k]:v }));
  const today = new Date().toISOString().split("T")[0];

  const Counter = ({ label, sub, value, onChange, min=0 }) => (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid #f0f0f5` }}>
      <div>
        <div style={{ fontWeight:600, fontSize:14, color:theme.text }}>{label}</div>
        <div style={{ fontSize:12, color:theme.textMuted, marginTop:2 }}>{sub}</div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={() => onChange(v => Math.max(min,v-1))}
          style={{ width:32, height:32, borderRadius:"50%", border:`1px solid #e2e4ea`, background:"#fff", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:theme.textMuted }}>−</button>
        <span style={{ fontWeight:700, fontSize:15, minWidth:20, textAlign:"center", color:theme.text }}>{value}</span>
        <button onClick={() => onChange(v => v+1)}
          style={{ width:32, height:32, borderRadius:"50%", border:`1px solid ${theme.accent}`, background:theme.accent, fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>+</button>
      </div>
    </div>
  );

  const handle = () => {
    if (!user.name || !user.phone || !from || !to || !depDate) { alert("Please fill all required fields."); return; }
    onSubmit();
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      {/* Trip Type */}
      <div>
        <label style={labelStyle}>Trip Type <span style={{ color:"#ef4444" }}>*</span></label>
        <div style={{ display:"flex", gap:8 }}>
          {["One Way","Return","Multi City"].map(t => (
            <button key={t} onClick={() => setTripType(t)} style={{
              padding:"8px 18px", borderRadius:50, fontSize:13, fontWeight:600, cursor:"pointer",
              border: tripType===t ? `2px solid ${theme.accent}` : `1px solid #e2e4ea`,
              background: tripType===t ? "rgba(26,60,110,0.08)" : "#fff",
              color: tripType===t ? theme.accent : theme.textMuted,
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Field label="From" required>
          <SelectInput options={AIRPORTS_SHORT} value={from} onChange={setFrom} placeholder="Select Origin Airport" />
        </Field>
        <Field label="To" required>
          <SelectInput options={AIRPORTS_SHORT} value={to} onChange={setTo} placeholder="Select Destination Airport" />
        </Field>
      </div>

      <div style={{ display:"grid", gridTemplateColumns: tripType==="Return" ? "1fr 1fr" : "1fr", gap:14 }}>
        <Field label="Departure Date" required>
          <input type="date" min={today} value={depDate} onChange={e => setDepDate(e.target.value)}
            style={{ ...inputStyle, colorScheme:"light" }}
            onFocus={e => e.target.style.border=`1px solid ${theme.accent}`}
            onBlur={e  => e.target.style.border="1px solid #e2e4ea"} />
        </Field>
        {tripType==="Return" && (
          <Field label="Return Date" required>
            <input type="date" min={depDate||today} value={retDate} onChange={e => setRetDate(e.target.value)}
              style={{ ...inputStyle, colorScheme:"light" }}
              onFocus={e => e.target.style.border=`1px solid ${theme.accent}`}
              onBlur={e  => e.target.style.border="1px solid #e2e4ea"} />
          </Field>
        )}
      </div>

      <Field label="Cabin Class" required>
        <SelectInput options={["Economy","Economy Premium","Business Class","First Class"]} value={cabinClass} onChange={setCabinClass} placeholder="Select Cabin Class" />
      </Field>

      {/* Travelers */}
      <div>
        <label style={labelStyle}>Travelers <span style={{ color:"#ef4444" }}>*</span></label>
        <div style={{ background:"#fafafa", border:`1px solid #e2e4ea`, borderRadius:12, padding:"4px 16px" }}>
          <Counter label="Adult"  sub="12 years and above"      value={adults}   onChange={setAdults}   min={1} />
          <Counter label="Child"  sub="2 to under 12 years"     value={children} onChange={setChildren} min={0} />
          <Counter label="Infant" sub="Under 2 years"           value={infants}  onChange={setInfants}  min={0} />
        </div>
      </div>

      <UserDetails data={user} onChange={setU} />

      <button onClick={handle} className="btn-primary" style={{ width:"100%", padding:"15px", borderRadius:14, fontSize:15, fontWeight:700, marginTop:4 }}>
        Submit Flight Request
      </button>
    </div>
  );
}

// ─── FORM: Car Rental ─────────────────────────────────────────────────────────
function CarForm({ onSubmit }) {
  const [user,      setUser]      = useState({ name:"", phone:"", email:"" });
  const [carType,   setCarType]   = useState("");
  const [carName,   setCarName]   = useState("");
  const [city,      setCity]      = useState("");
  const [pickLoc,   setPickLoc]   = useState("");
  const [dropLoc,   setDropLoc]   = useState("");
  const [pickDate,  setPickDate]  = useState("");
  const [returnDate,setReturnDate]= useState("");
  const [withDriver,setWithDriver]= useState("With Driver");
  const [passengers,setPassengers]= useState(1);
  const [notes,     setNotes]     = useState("");
  const setU = (k,v) => setUser(p => ({ ...p, [k]:v }));
  const today = new Date().toISOString().split("T")[0];

  const carTypes = ["Hatchback","Sedan","SUV","Grand Cabin","Coaster","Minibus"];
  const carOptions = {
    Hatchback:    ["Suzuki Alto","Suzuki Wagon R","Suzuki Cultus","Suzuki Swift"],
    Sedan:        ["Toyota Corolla","Honda Civic","Toyota Yaris"],
    SUV:          ["Toyota Fortuner","KIA Sportage","Hyundai Tucson","Honda BRV"],
    "Grand Cabin":["Toyota HiAce Grand Cabin","Changan Karvaan"],
    Coaster:      ["Toyota Coaster (28 Seats)"],
    Minibus:      ["Toyota HiAce Minibus (22 Seats)"],
  };
  const cities = ["Lahore","Karachi","Islamabad","Rawalpindi","Peshawar","Multan","Faisalabad","Quetta","Sialkot","Gujranwala"];

  const handle = () => {
    if (!user.name || !user.phone || !carType || !city || !pickDate) { alert("Please fill all required fields."); return; }
    onSubmit();
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Field label="Car Type" required>
          <SelectInput options={carTypes} value={carType} onChange={v => { setCarType(v); setCarName(""); }} placeholder="Select Car Type" />
        </Field>
        <Field label="Car Model">
          <SelectInput options={carType ? carOptions[carType] : []} value={carName} onChange={setCarName} placeholder={carType ? "Select Model" : "Select type first"} />
        </Field>
      </div>
      <Field label="City" required>
        <SelectInput options={cities} value={city} onChange={setCity} placeholder="Select City" />
      </Field>
      <Field label="Pickup Location" required>
        <TextInput placeholder="e.g. Allama Iqbal Airport, Lahore" value={pickLoc} onChange={setPickLoc} />
      </Field>
      <Field label="Drop Location">
        <TextInput placeholder="e.g. Hotel, address (optional)" value={dropLoc} onChange={setDropLoc} />
      </Field>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Field label="Pickup Date" required>
          <input type="date" min={today} value={pickDate} onChange={e => setPickDate(e.target.value)}
            style={{ ...inputStyle, colorScheme:"light" }}
            onFocus={e => e.target.style.border=`1px solid ${theme.accent}`}
            onBlur={e  => e.target.style.border="1px solid #e2e4ea"} />
        </Field>
        <Field label="Return Date">
          <input type="date" min={pickDate||today} value={returnDate} onChange={e => setReturnDate(e.target.value)}
            style={{ ...inputStyle, colorScheme:"light" }}
            onFocus={e => e.target.style.border=`1px solid ${theme.accent}`}
            onBlur={e  => e.target.style.border="1px solid #e2e4ea"} />
        </Field>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Field label="Driver Option" required>
          <SelectInput options={["With Driver","Self Drive"]} value={withDriver} onChange={setWithDriver} placeholder="Select" />
        </Field>
        <Field label="Number of Passengers" required>
          <div style={{ display:"flex", alignItems:"center", gap:14, paddingTop:4 }}>
            <button onClick={() => setPassengers(p => Math.max(1,p-1))}
              style={{ width:38, height:38, borderRadius:"50%", border:`1px solid #e2e4ea`, background:"#fff", fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:theme.textMuted }}>−</button>
            <span style={{ fontWeight:700, fontSize:18, color:theme.text, minWidth:30, textAlign:"center" }}>{passengers}</span>
            <button onClick={() => setPassengers(p => p+1)}
              style={{ width:38, height:38, borderRadius:"50%", border:`1px solid ${theme.accent}`, background:theme.accent, fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>+</button>
          </div>
        </Field>
      </div>
      <UserDetails data={user} onChange={setU} />
      <Field label="Special Requirements">
        <TextareaInput placeholder="Any additional requirements..." value={notes} onChange={setNotes} />
      </Field>
      <button onClick={handle} className="btn-primary" style={{ width:"100%", padding:"15px", borderRadius:14, fontSize:15, fontWeight:700, marginTop:4 }}>
        Submit Car Rental Request
      </button>
    </div>
  );
}

// ─── Booking Categories ───────────────────────────────────────────────────────
const CATEGORIES = [
  { key:"umrah",     icon:"🕌", label:"Umrah Package",  color:"#1a3c6e", bg:"rgba(26,60,110,0.08)"  },
  { key:"visa",      icon:"🛂", label:"Visa",            color:"#0369a1", bg:"rgba(3,105,161,0.08)"  },
  { key:"insurance", icon:"🛡️", label:"Insurance",       color:"#16a34a", bg:"rgba(22,163,74,0.08)"  },
  { key:"flight",    icon:"✈️", label:"Flight",           color:"#7c3aed", bg:"rgba(124,58,237,0.08)" },
  { key:"car",       icon:"🚗", label:"Car Rental",       color:"#dc2626", bg:"rgba(220,38,38,0.08)"  },
];

// ─── BookNow Page ─────────────────────────────────────────────────────────────
export default function BookNow() {
  const [selected,  setSelected]  = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const cat = CATEGORIES.find(c => c.key === selected);

  const handleReset = () => { setSelected(null); setSubmitted(false); };

  return (
    <>
      <Navbar />
      <style>{`
        .book-cat-card {
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          gap:12px; padding:28px 20px; border-radius:20px; cursor:pointer;
          border:2px solid transparent; transition:all 0.22s; text-align:center;
          background:#fff; box-shadow:0 2px 12px rgba(0,0,0,0.05);
        }
        .book-cat-card:hover { transform:translateY(-4px); box-shadow:0 8px 32px rgba(0,0,0,0.12); }
        .book-cat-card.active { border-color:var(--cat-color); background:var(--cat-bg); }
      `}</style>

      {/* Page Hero */}
      <section style={{
        background:`linear-gradient(135deg, rgba(255, 255, 255, 0.97) 0%, rgba(255, 255, 255, 0.97) 100%), url(https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1400&q=80) center/cover`,
        padding:"120px 5% 70px", textAlign:"center", color:"#000000",
      }}>

        <h1 className="serif" style={{ fontSize:"clamp(30px,4vw,52px)", fontWeight:700, lineHeight:1.2, marginBottom:14 }}>
          Book Your Next Journey
        </h1>
        <p style={{ fontSize:16, color:"rgba(0, 0, 0, 0.85)", maxWidth:480, margin:"0 auto" }}>
          Select a service below and fill in your details — our team will get back to you shortly.
        </p>
      </section>

      {/* Main Content */}
      <section style={{ padding:"0 5% 100px", background:theme.bgCard, minHeight:"60vh" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>

          {/* Category Cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:16, marginTop:-32, marginBottom:40, position:"relative", zIndex:10 }}
            className="book-grid">
            <style>{`@media(max-width:768px){ .book-grid{ grid-template-columns:1fr 1fr !important; } }`}</style>
            {CATEGORIES.map(c => (
              <div key={c.key}
                className={`book-cat-card${selected===c.key?" active":""}`}
                style={{ "--cat-color":c.color, "--cat-bg":c.bg }}
                onClick={() => { setSelected(c.key); setSubmitted(false); }}>
                <div style={{ fontSize:36, lineHeight:1 }}>{c.icon}</div>
                <div style={{ fontSize:13, fontWeight:700, color: selected===c.key ? c.color : theme.text }}>{c.label}</div>
              </div>
            ))}
          </div>

          {/* Form Area */}
          {selected && !submitted && (
            <div style={{ background:"#fff", borderRadius:24, padding:"36px 40px", border:`1px solid ${theme.border}`, boxShadow:"0 4px 24px rgba(0,0,0,0.07)" }}>
              {/* Form Header */}
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28, paddingBottom:20, borderBottom:`1px solid ${theme.border}` }}>
                <div style={{ width:52, height:52, borderRadius:16, background:cat.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, border:`1px solid ${cat.color}30` }}>
                  {cat.icon}
                </div>
                <div>
                  <h2 style={{ fontSize:20, fontWeight:700, color:theme.text, margin:0, fontFamily:"'Playfair Display',serif" }}>
                    {cat.label} Booking
                  </h2>
                  <p style={{ fontSize:13, color:theme.textMuted, margin:"4px 0 0" }}>
                    Fill in the details below and we will contact you shortly.
                  </p>
                </div>
              </div>

              {selected==="umrah"     && <UmrahForm     onSubmit={() => setSubmitted(true)} />}
              {selected==="visa"      && <VisaForm       onSubmit={() => setSubmitted(true)} />}
              {selected==="insurance" && <InsuranceForm  onSubmit={() => setSubmitted(true)} />}
              {selected==="flight"    && <FlightForm     onSubmit={() => setSubmitted(true)} />}
              {selected==="car"       && <CarForm        onSubmit={() => setSubmitted(true)} />}
            </div>
          )}

          {/* Empty State */}
          {!selected && (
            <div style={{ textAlign:"center", paddingTop:20, paddingBottom:40 }}>
              <div style={{ fontSize:52, marginBottom:14 }}>☝️</div>
              <p style={{ color:theme.textMuted, fontSize:15 }}>Please select a booking category above to continue.</p>
            </div>
          )}

          {/* Thank You */}
          {submitted && <div style={{ background:"#fff", borderRadius:24, border:`1px solid ${theme.border}`, boxShadow:"0 4px 24px rgba(0,0,0,0.07)" }}>
            <ThankYou category={cat?.label} onReset={handleReset} />
          </div>}
        </div>
      </section>

      <Footer />
    </>
  );
}