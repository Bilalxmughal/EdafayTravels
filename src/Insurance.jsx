import { useState } from "react";
import theme from './theme.js'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

// ─── Countries Data ───────────────────────────────────────────────────────────
const COUNTRIES = [
  { name:"Afghanistan", flag:"🇦🇫" }, { name:"Albania", flag:"🇦🇱" }, { name:"Algeria", flag:"🇩🇿" },
  { name:"Argentina", flag:"🇦🇷" }, { name:"Armenia", flag:"🇦🇲" }, { name:"Australia", flag:"🇦🇺" },
  { name:"Austria", flag:"🇦🇹" }, { name:"Azerbaijan", flag:"🇦🇿" }, { name:"Bahrain", flag:"🇧🇭" },
  { name:"Bangladesh", flag:"🇧🇩" }, { name:"Belgium", flag:"🇧🇪" }, { name:"Bosnia", flag:"🇧🇦" },
  { name:"Brazil", flag:"🇧🇷" }, { name:"Bulgaria", flag:"🇧🇬" }, { name:"Cambodia", flag:"🇰🇭" },
  { name:"Canada", flag:"🇨🇦" }, { name:"Chile", flag:"🇨🇱" }, { name:"China", flag:"🇨🇳" },
  { name:"Colombia", flag:"🇨🇴" }, { name:"Croatia", flag:"🇭🇷" }, { name:"Cyprus", flag:"🇨🇾" },
  { name:"Czech Republic", flag:"🇨🇿" }, { name:"Denmark", flag:"🇩🇰" }, { name:"Egypt", flag:"🇪🇬" },
  { name:"Estonia", flag:"🇪🇪" }, { name:"Ethiopia", flag:"🇪🇹" }, { name:"Finland", flag:"🇫🇮" },
  { name:"France", flag:"🇫🇷" }, { name:"Georgia", flag:"🇬🇪" }, { name:"Germany", flag:"🇩🇪" },
  { name:"Ghana", flag:"🇬🇭" }, { name:"Greece", flag:"🇬🇷" }, { name:"Hong Kong", flag:"🇭🇰" },
  { name:"Hungary", flag:"🇭🇺" }, { name:"Iceland", flag:"🇮🇸" }, { name:"India", flag:"🇮🇳" },
  { name:"Indonesia", flag:"🇮🇩" }, { name:"Iran", flag:"🇮🇷" }, { name:"Iraq", flag:"🇮🇶" },
  { name:"Ireland", flag:"🇮🇪" }, { name:"Israel", flag:"🇮🇱" }, { name:"Italy", flag:"🇮🇹" },
  { name:"Japan", flag:"🇯🇵" }, { name:"Jordan", flag:"🇯🇴" }, { name:"Kazakhstan", flag:"🇰🇿" },
  { name:"Kenya", flag:"🇰🇪" }, { name:"Kuwait", flag:"🇰🇼" }, { name:"Kyrgyzstan", flag:"🇰🇬" },
  { name:"Latvia", flag:"🇱🇻" }, { name:"Lebanon", flag:"🇱🇧" }, { name:"Libya", flag:"🇱🇾" },
  { name:"Lithuania", flag:"🇱🇹" }, { name:"Luxembourg", flag:"🇱🇺" }, { name:"Malaysia", flag:"🇲🇾" },
  { name:"Maldives", flag:"🇲🇻" }, { name:"Malta", flag:"🇲🇹" }, { name:"Mexico", flag:"🇲🇽" },
  { name:"Moldova", flag:"🇲🇩" }, { name:"Morocco", flag:"🇲🇦" }, { name:"Nepal", flag:"🇳🇵" },
  { name:"Netherlands", flag:"🇳🇱" }, { name:"New Zealand", flag:"🇳🇿" }, { name:"Nigeria", flag:"🇳🇬" },
  { name:"Norway", flag:"🇳🇴" }, { name:"Oman", flag:"🇴🇲" }, { name:"Pakistan", flag:"🇵🇰" },
  { name:"Peru", flag:"🇵🇪" }, { name:"Philippines", flag:"🇵🇭" }, { name:"Poland", flag:"🇵🇱" },
  { name:"Portugal", flag:"🇵🇹" }, { name:"Qatar", flag:"🇶🇦" }, { name:"Romania", flag:"🇷🇴" },
  { name:"Russia", flag:"🇷🇺" }, { name:"Saudi Arabia", flag:"🇸🇦" }, { name:"Serbia", flag:"🇷🇸" },
  { name:"Singapore", flag:"🇸🇬" }, { name:"Slovakia", flag:"🇸🇰" }, { name:"Slovenia", flag:"🇸🇮" },
  { name:"South Africa", flag:"🇿🇦" }, { name:"South Korea", flag:"🇰🇷" }, { name:"Spain", flag:"🇪🇸" },
  { name:"Sri Lanka", flag:"🇱🇰" }, { name:"Sweden", flag:"🇸🇪" }, { name:"Switzerland", flag:"🇨🇭" },
  { name:"Syria", flag:"🇸🇾" }, { name:"Taiwan", flag:"🇹🇼" }, { name:"Tajikistan", flag:"🇹🇯" },
  { name:"Tanzania", flag:"🇹🇿" }, { name:"Thailand", flag:"🇹🇭" }, { name:"Tunisia", flag:"🇹🇳" },
  { name:"Turkey", flag:"🇹🇷" }, { name:"Turkmenistan", flag:"🇹🇲" }, { name:"UAE", flag:"🇦🇪" },
  { name:"Uganda", flag:"🇺🇬" }, { name:"Ukraine", flag:"🇺🇦" }, { name:"United Kingdom", flag:"🇬🇧" },
  { name:"United States", flag:"🇺🇸" }, { name:"Uzbekistan", flag:"🇺🇿" }, { name:"Vietnam", flag:"🇻🇳" },
  { name:"Yemen", flag:"🇾🇪" }, { name:"Zimbabwe", flag:"🇿🇼" },
];

const DURATIONS = [
  { label:"1 Week",  days:7   },
  { label:"2 Weeks", days:14  },
  { label:"3 Weeks", days:21  },
  { label:"1 Month", days:30  },
  { label:"2 Months",days:60  },
  { label:"3 Months",days:90  },
  { label:"6 Months",days:180 },
  { label:"1 Year",  days:365 },
  { label:"2 Years", days:730 },
  { label:"3 Years", days:1095},
  { label:"4 Years", days:1460},
  { label:"5 Years", days:1825},
];

// ─── Mock Insurance Companies ─────────────────────────────────────────────────
const generateCompanies = (duration, country) => {
  const multiplier = duration ? Math.max(1, duration.days / 7) : 1;
  const base = [
    {
      id:1,
      name:"TPL Travel Insurance",
      initials:"TPL",
      color:"#1a3c6e",
      coverage:"USD 50,000",
      maxStay: duration ? duration.label : "7 Days",
      medicalCover:"USD 30,000",
      tripCancel:"USD 3,000",
      lostBaggage:"USD 1,000",
      flightDelay:"USD 300",
      perPersonOriginal: 1500,
      perPersonDiscount: 20,
      familyOriginal: 2550,
      familyDiscount: 20,
      familyDesc:"Covers husband, wife (under 65 years) and 3 children under ages of 18 each.",
      ageLimits:"Age limits or old age surcharges may apply.",
      rulesImg:"https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    },
    {
      id:2,
      name:"EFU General Insurance",
      initials:"EFU",
      color:"#16a34a",
      coverage:"USD 50,000",
      maxStay: duration ? duration.label : "7 Days",
      medicalCover:"USD 40,000",
      tripCancel:"USD 4,000",
      lostBaggage:"USD 1,200",
      flightDelay:"USD 400",
      perPersonOriginal: 1800,
      perPersonDiscount: 20,
      familyOriginal: 3060,
      familyDiscount: 20,
      familyDesc:"Covers husband, wife (under 65 years) and 3 children under ages of 18 each.",
      ageLimits:"Age limits or old age surcharges may apply.",
      rulesImg:"https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    },
    {
      id:3,
      name:"Adamjee Insurance",
      initials:"ADJ",
      color:"#7c3aed",
      coverage:"USD 50,000",
      maxStay: duration ? duration.label : "7 Days",
      medicalCover:"USD 35,000",
      tripCancel:"USD 2,500",
      lostBaggage:"USD 800",
      flightDelay:"USD 250",
      perPersonOriginal: 1350,
      perPersonDiscount: 20,
      familyOriginal: 2295,
      familyDiscount: 20,
      familyDesc:"Covers husband, wife (under 65 years) and 3 children under ages of 18 each.",
      ageLimits:"Age limits or old age surcharges may apply.",
      rulesImg:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    },
    {
      id:4,
      name:"New Hampshire Insurance",
      initials:"NHI",
      color:"#dc2626",
      coverage:"USD 100,000",
      maxStay: duration ? duration.label : "7 Days",
      medicalCover:"USD 75,000",
      tripCancel:"USD 6,000",
      lostBaggage:"USD 2,000",
      flightDelay:"USD 600",
      perPersonOriginal: 3200,
      perPersonDiscount: 20,
      familyOriginal: 5440,
      familyDiscount: 20,
      familyDesc:"Covers husband, wife (under 65 years) and 3 children under ages of 18 each.",
      ageLimits:"Age limits or old age surcharges may apply.",
      rulesImg:"https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80",
    },
    {
      id:5,
      name:"Allianz Travel Insurance",
      initials:"ALZ",
      color:"#0369a1",
      coverage:"USD 75,000",
      maxStay: duration ? duration.label : "7 Days",
      medicalCover:"USD 55,000",
      tripCancel:"USD 5,000",
      lostBaggage:"USD 1,500",
      flightDelay:"USD 500",
      perPersonOriginal: 2600,
      perPersonDiscount: 20,
      familyOriginal: 4420,
      familyDiscount: 20,
      familyDesc:"Covers husband, wife (under 65 years) and 3 children under ages of 18 each.",
      ageLimits:"Age limits or old age surcharges may apply.",
      rulesImg:"https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
    },
    {
      id:6,
      name:"AXA Travel Insurance",
      initials:"AXA",
      color:"#c2410c",
      coverage:"USD 60,000",
      maxStay: duration ? duration.label : "7 Days",
      medicalCover:"USD 45,000",
      tripCancel:"USD 4,500",
      lostBaggage:"USD 1,300",
      flightDelay:"USD 450",
      perPersonOriginal: 2200,
      perPersonDiscount: 20,
      familyOriginal: 3740,
      familyDiscount: 20,
      familyDesc:"Covers husband, wife (under 65 years) and 3 children under ages of 18 each.",
      ageLimits:"Age limits or old age surcharges may apply.",
      rulesImg:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    },
  ];

  return base.map(c => ({
    ...c,
    perPersonFinal: Math.round(c.perPersonOriginal * multiplier * (1 - c.perPersonDiscount / 100)),
    perPersonOriginalFinal: Math.round(c.perPersonOriginal * multiplier),
    familyFinal: Math.round(c.familyOriginal * multiplier * (1 - c.familyDiscount / 100)),
    familyOriginalFinal: Math.round(c.familyOriginal * multiplier),
  }));
};

// ─── QuantitySelector ─────────────────────────────────────────────────────────
function QuantitySelector({ label, price, onClose }) {
  const [qty, setQty] = useState(1);
  return (
    <div style={{ marginTop:10, padding:"14px 16px", background:"rgba(26,60,110,0.04)", border:`1px solid rgba(26,60,110,0.2)`, borderRadius:12 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:16 }}>
        <div style={{ fontSize:13, fontWeight:600, color:theme.text }}>{label}</div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={() => setQty(q => Math.max(1,q-1))}
            style={{ width:30, height:30, borderRadius:"50%", border:`1px solid ${theme.border}`, background:"#fff", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:theme.textMuted }}>−</button>
          <span style={{ fontWeight:700, fontSize:15, minWidth:20, textAlign:"center", color:theme.text }}>{qty}</span>
          <button onClick={() => setQty(q => q+1)}
            style={{ width:30, height:30, borderRadius:"50%", border:`1px solid ${theme.accent}`, background:theme.accent, fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>+</button>
        </div>
        <div style={{ fontWeight:700, fontSize:14, color:theme.accent }}>PKR {(price * qty).toLocaleString()}</div>
        <button onClick={onClose}
          style={{ padding:"8px 18px", background:theme.accent, color:"#fff", border:"none", borderRadius:10, fontWeight:700, fontSize:13, cursor:"pointer" }}>
          Proceed →
        </button>
      </div>
    </div>
  );
}

// ─── RulesModal ───────────────────────────────────────────────────────────────
function RulesModal({ company, onClose }) {
  if (!company) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:24, maxWidth:680, width:"100%", maxHeight:"90vh", overflowY:"auto", padding:0 }}
        onClick={e => e.stopPropagation()}>
        {/* Header image */}
        <div style={{ position:"relative", height:220, borderRadius:"24px 24px 0 0", overflow:"hidden" }}>
          <img src={company.rulesImg} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%)" }} />
          <div style={{ position:"absolute", bottom:20, left:24 }}>
            <h2 style={{ color:"#fff", fontSize:22, fontWeight:700, margin:0, fontFamily:"'Playfair Display',serif" }}>{company.name}</h2>
            <p style={{ color:"rgba(255,255,255,0.8)", fontSize:13, margin:"6px 0 0" }}>Rules & Benefits Summary</p>
          </div>
          <button onClick={onClose} style={{ position:"absolute", top:16, right:16, width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.3)", color:"#fff", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(8px)" }}>×</button>
        </div>

        {/* Content */}
        <div style={{ padding:"24px 28px 32px" }}>
          {/* Coverage grid */}
          <h3 style={{ fontSize:16, fontWeight:700, color:theme.text, marginBottom:16 }}>Coverage Details</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>
            {[
              { label:"Medical Emergency",     value:company.medicalCover },
              { label:"Total Coverage",         value:company.coverage    },
              { label:"Trip Cancellation",      value:company.tripCancel  },
              { label:"Lost Baggage",           value:company.lostBaggage },
              { label:"Flight Delay",           value:company.flightDelay },
              { label:"Maximum Stay",           value:company.maxStay     },
            ].map(item => (
              <div key={item.label} style={{ padding:"12px 16px", background:theme.bgCard, borderRadius:12, border:`1px solid ${theme.border}` }}>
                <div style={{ fontSize:11, color:theme.textMuted, marginBottom:4 }}>{item.label}</div>
                <div style={{ fontSize:15, fontWeight:700, color:theme.accent }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Family plan */}
          <h3 style={{ fontSize:16, fontWeight:700, color:theme.text, marginBottom:10 }}>Family Plan</h3>
          <div style={{ padding:"14px 16px", background:"rgba(26,60,110,0.04)", border:`1px solid rgba(26,60,110,0.15)`, borderRadius:12, marginBottom:16 }}>
            <p style={{ color:theme.text, fontSize:13, lineHeight:1.7, margin:0 }}>{company.familyDesc}</p>
            <p style={{ color:theme.textMuted, fontSize:12, marginTop:8, marginBottom:0 }}>{company.ageLimits}</p>
          </div>

          {/* General terms */}
          <h3 style={{ fontSize:16, fontWeight:700, color:theme.text, marginBottom:10 }}>General Terms</h3>
          <ul style={{ color:theme.textMuted, fontSize:13, lineHeight:2, paddingLeft:20, margin:0 }}>
            <li>Policy is valid from the departure date mentioned at the time of purchase.</li>
            <li>Pre-existing medical conditions are not covered under this plan.</li>
            <li>Claims must be reported within 30 days of the incident.</li>
            <li>Coverage is limited to the destination country selected.</li>
            <li>Adventure sports and hazardous activities require additional riders.</li>
            <li>This policy is non-transferable and non-refundable once issued.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── InsuranceRow Component ───────────────────────────────────────────────────
function InsuranceRow({ company }) {
  const [personSel,  setPersonSel]  = useState(false);
  const [familySel,  setFamilySel]  = useState(false);
  const [rulesOpen,  setRulesOpen]  = useState(false);

  return (
    <>
      {rulesOpen && <RulesModal company={company} onClose={() => setRulesOpen(false)} />}
      <div style={{
        background:"#fff",
        border:`1px solid ${theme.border}`,
        borderRadius:20,
        padding:"20px 24px",
        marginBottom:16,
        boxShadow:"0 2px 12px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display:"grid", gridTemplateColumns:"auto 1fr 1.2fr auto", gap:20, alignItems:"start" }}>

          {/* Company Logo */}
          <div style={{ width:72, height:72, borderRadius:16, background:company.color, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:17, flexShrink:0, fontFamily:"'Playfair Display', serif", boxShadow:`0 4px 12px ${company.color}40` }}>
            {company.initials}
          </div>

          {/* Name + Coverage Details */}
          <div>
            <h3 style={{ fontSize:16, fontWeight:700, color:theme.text, margin:"0 0 6px" }}>{company.name}</h3>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:10 }}>
              <span style={{ fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20, background:"rgba(26,60,110,0.08)", color:theme.accent, border:`1px solid rgba(26,60,110,0.2)` }}>
                Coverage {company.coverage}
              </span>
              <span style={{ fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20, background:"rgba(76,175,125,0.08)", color:"#16a34a", border:"1px solid rgba(76,175,125,0.2)" }}>
                Max Stay {company.maxStay}
              </span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              {[
                { label:"Medical Cover", value:company.medicalCover },
                { label:"Trip Cancellation", value:company.tripCancel },
                { label:"Lost Baggage", value:company.lostBaggage },
                { label:"Flight Delay", value:company.flightDelay },
              ].map(d => (
                <div key={d.label} style={{ fontSize:12, color:theme.textMuted }}>
                  <span style={{ color:theme.text, fontWeight:600 }}>{d.label}: </span>{d.value}
                </div>
              ))}
            </div>
            <button onClick={() => setRulesOpen(true)}
              style={{ marginTop:12, padding:"6px 14px", borderRadius:50, border:`1px solid ${theme.border}`, background:"#fff", color:theme.accent, fontSize:12, fontWeight:600, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:6 }}>
              📄 View Rules & Benefits
            </button>
          </div>

          {/* Family Plan Info */}
          <div style={{ padding:"12px 16px", background:theme.bgCard, borderRadius:14, border:`1px solid ${theme.border}` }}>
            <div style={{ fontSize:12, fontWeight:700, color:theme.text, marginBottom:8 }}>Family Plan</div>
            <p style={{ fontSize:12, color:theme.textMuted, lineHeight:1.65, margin:0 }}>{company.familyDesc}</p>
            <p style={{ fontSize:11, color:theme.textMuted, marginTop:8, marginBottom:0, fontStyle:"italic" }}>{company.ageLimits}</p>
          </div>

          {/* Pricing */}
          <div style={{ display:"flex", flexDirection:"column", gap:12, minWidth:180 }}>
            {/* Per Person */}
            <div style={{ padding:"12px 14px", background:theme.bgCard, borderRadius:14, border:`1px solid ${theme.border}` }}>
              <div style={{ fontSize:11, color:theme.textMuted, marginBottom:6, fontWeight:600 }}>Per Person</div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <span style={{ fontSize:12, color:theme.textMuted, textDecoration:"line-through" }}>PKR {company.perPersonOriginalFinal.toLocaleString()}</span>
                <span style={{ fontSize:10, fontWeight:700, background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", padding:"2px 7px", borderRadius:20 }}>-{company.perPersonDiscount}%</span>
              </div>
              <div style={{ fontSize:17, fontWeight:800, color:theme.accent, marginBottom:10 }}>PKR {company.perPersonFinal.toLocaleString()}</div>
              <button onClick={() => { setPersonSel(s => !s); setFamilySel(false); }}
                style={{ width:"100%", padding:"8px", borderRadius:10, border:`1px solid ${theme.accent}`, background: personSel ? theme.accent : "#fff", color: personSel ? "#fff" : theme.accent, fontWeight:700, fontSize:12, cursor:"pointer", transition:"all 0.2s" }}>
                {personSel ? "✓ Selected" : "Select"}
              </button>
            </div>

            {/* Family Plan */}
            <div style={{ padding:"12px 14px", background:theme.bgCard, borderRadius:14, border:`1px solid ${theme.border}` }}>
              <div style={{ fontSize:11, color:theme.textMuted, marginBottom:6, fontWeight:600 }}>Family Plan</div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <span style={{ fontSize:12, color:theme.textMuted, textDecoration:"line-through" }}>PKR {company.familyOriginalFinal.toLocaleString()}</span>
                <span style={{ fontSize:10, fontWeight:700, background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", padding:"2px 7px", borderRadius:20 }}>-{company.familyDiscount}%</span>
              </div>
              <div style={{ fontSize:17, fontWeight:800, color:theme.accent, marginBottom:10 }}>PKR {company.familyFinal.toLocaleString()}</div>
              <button onClick={() => { setFamilySel(s => !s); setPersonSel(false); }}
                style={{ width:"100%", padding:"8px", borderRadius:10, border:`1px solid ${theme.accent}`, background: familySel ? theme.accent : "#fff", color: familySel ? "#fff" : theme.accent, fontWeight:700, fontSize:12, cursor:"pointer", transition:"all 0.2s" }}>
                {familySel ? "✓ Selected" : "Select"}
              </button>
            </div>
          </div>
        </div>

        {/* Quantity selectors */}
        {personSel && (
          <QuantitySelector
            label="Per Person Quantity"
            price={company.perPersonFinal}
            onClose={() => setPersonSel(false)}
          />
        )}
        {familySel && (
          <QuantitySelector
            label="Family Plan Quantity"
            price={company.familyFinal}
            onClose={() => setFamilySel(false)}
          />
        )}
      </div>
    </>
  );
}

// ─── CountrySelect ────────────────────────────────────────────────────────────
function CountrySelect({ value, onChange }) {
  const [query, setQuery] = useState(value ? `${value.flag} ${value.name}` : "");
  const [open, setOpen]   = useState(false);

  const filtered = query.replace(/\p{Emoji}/u, "").trim().length > 0
    ? COUNTRIES.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 10)
    : COUNTRIES;

  return (
    <div style={{ position:"relative" }}>
      <label style={{ display:"block", fontSize:12, fontWeight:600, color:theme.textMuted, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px" }}>Destination Country</label>
      <div style={{ position:"relative" }}>
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); if (value) onChange(null); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 180)}
          placeholder="Search country..."
          style={{ width:"100%", padding:"12px 16px", border:`1px solid ${theme.border}`, borderRadius:12, fontSize:14, color:theme.text, outline:"none", fontFamily:"'DM Sans', sans-serif", background:"#fff", boxSizing:"border-box" }}
        />
        {open && (
          <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, right:0, zIndex:9999, background:"#fff", border:`1px solid ${theme.border}`, borderRadius:14, boxShadow:"0 12px 40px rgba(0,0,0,0.13)", maxHeight:260, overflowY:"auto" }}>
            {filtered.slice(0, 50).map(c => (
              <div key={c.name}
                onMouseDown={e => { e.preventDefault(); onChange(c); setQuery(`${c.flag} ${c.name}`); setOpen(false); }}
                style={{ padding:"10px 16px", cursor:"pointer", fontSize:14, color:theme.text, display:"flex", alignItems:"center", gap:10, borderBottom:`1px solid ${theme.border}` }}
                onMouseEnter={e => e.currentTarget.style.background = theme.bgCard}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <span style={{ fontSize:20 }}>{c.flag}</span>
                <span style={{ fontWeight:500 }}>{c.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Insurance Page ───────────────────────────────────────────────────────────
export default function Insurance() {
  const [country,     setCountry]     = useState(null);
  const [duration,    setDuration]    = useState(null);
  const [startDate,   setStartDate]   = useState("");
  const [results,     setResults]     = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading,     setLoading]     = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleGetPrice = () => {
    if (!country || !duration || !startDate) {
      alert("Please select a country, duration, and start date.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setResults(generateCompanies(duration, country));
      setHasSearched(true);
      setLoading(false);
    }, 900);
  };

  const formatResultDate = () => {
    if (!startDate) return "";
    const d = new Date(startDate);
    return d.toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
  };

  return (
    <>
      <Navbar />

      {/* Hero Banner */}
      <section style={{
        background:`linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%), url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=80) center/cover`,
        padding:"130px 5% 80px",
        textAlign:"center",
        color:"#000000",
      }}>
        <div style={{ maxWidth:700, margin:"0 auto" }}>

          <h1 className="serif" style={{ fontSize:"clamp(32px,4.5vw,58px)", fontWeight:700, lineHeight:1.15, marginBottom:18, letterSpacing:"-0.5px" }}>
            Book Travel Insurance<br />Online with Ease
          </h1>
          <p style={{ fontSize:17, lineHeight:1.75, color:"rgba(0, 0, 0, 0.85)", maxWidth:520, margin:"0 auto" }}>
            Secure your travels with our online travel insurance booking
          </p>
        </div>
      </section>

      {/* Search Form */}
      <section style={{ background:theme.bgCard, padding:"0 5% 60px" }}>
        <div style={{ maxWidth:900, margin:"0 auto", background:"#fff", borderRadius:24, padding:"36px 40px", boxShadow:"0 8px 40px rgba(0,0,0,0.10)", marginTop:-40, position:"relative", zIndex:10, border:`1px solid ${theme.border}` }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1.5fr 1.5fr auto", gap:20, alignItems:"end" }}>

            {/* Country */}
            <CountrySelect value={country} onChange={setCountry} />

            {/* Duration */}
            <div>
              <label style={{ display:"block", fontSize:12, fontWeight:600, color:theme.textMuted, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px" }}>Duration</label>
              <select
                value={duration ? duration.label : ""}
                onChange={e => setDuration(DURATIONS.find(d => d.label === e.target.value) || null)}
                style={{ width:"100%", padding:"12px 16px", border:`1px solid ${theme.border}`, borderRadius:12, fontSize:14, color: duration ? theme.text : theme.textMuted, outline:"none", fontFamily:"'DM Sans', sans-serif", background:"#fff", cursor:"pointer", appearance:"none" }}>
                <option value="">Select duration</option>
                {DURATIONS.map(d => <option key={d.label} value={d.label}>{d.label}</option>)}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label style={{ display:"block", fontSize:12, fontWeight:600, color:theme.textMuted, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px" }}>Start Date</label>
              <input
                type="date"
                min={today}
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                style={{ width:"100%", padding:"12px 16px", border:`1px solid ${theme.border}`, borderRadius:12, fontSize:14, color:theme.text, outline:"none", fontFamily:"'DM Sans', sans-serif", colorScheme:"light", background:"#fff", boxSizing:"border-box" }}
              />
            </div>

            {/* Get Price Button */}
            <button
              onClick={handleGetPrice}
              style={{ padding:"13px 28px", background:theme.accent, color:"#fff", border:"none", borderRadius:14, fontWeight:700, fontSize:15, cursor:"pointer", whiteSpace:"nowrap", transition:"background 0.2s", height:48 }}
              onMouseEnter={e => e.currentTarget.style.background = "#2a5298"}
              onMouseLeave={e => e.currentTarget.style.background = theme.accent}>
              {loading ? "Loading..." : "Get Price"}
            </button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section style={{ padding:"0 5% 100px", background:theme.bgCard, minHeight:200 }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          {hasSearched && results.length > 0 && (
            <>
              {/* Results Header */}
              <div style={{ background:`linear-gradient(135deg, rgba(26,60,110,0.05), rgba(26,60,110,0.02))`, border:`1px solid rgba(26,60,110,0.15)`, borderRadius:16, padding:"18px 24px", marginBottom:28, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
                <div>
                  <div style={{ fontSize:18, fontWeight:700, color:theme.text }}>
                    Travel Insurance Prices for {country?.flag} {country?.name}
                  </div>
                  <div style={{ fontSize:13, color:theme.textMuted, marginTop:4 }}>
                    For {duration?.label} starting {formatResultDate()}
                  </div>
                </div>
                <button
                  onClick={() => { setHasSearched(false); setResults([]); setCountry(null); setDuration(null); setStartDate(""); }}
                  style={{ padding:"8px 18px", background:"#fff", color:theme.accent, border:`1px solid ${theme.accent}`, borderRadius:50, fontSize:13, fontWeight:600, cursor:"pointer" }}>
                  Change Search
                </button>
              </div>

              {/* Insurance Rows */}
              {results.map(company => (
                <InsuranceRow key={company.id} company={company} />
              ))}
            </>
          )}

          {!hasSearched && (
            <div style={{ textAlign:"center", paddingTop:60, paddingBottom:20 }}>
              <div style={{ fontSize:64, marginBottom:16 }}>🛡️</div>
              <h3 style={{ fontSize:20, fontWeight:700, color:theme.text, marginBottom:10 }}>Find Your Perfect Coverage</h3>
              <p style={{ color:theme.textMuted, fontSize:14 }}>Select a country, duration and start date above, then click Get Price to compare plans.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}