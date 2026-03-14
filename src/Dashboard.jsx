// ─── Dashboard.jsx — Edafay CMS Admin Panel ──────────────────────────────────
import { useState, useEffect, useRef } from "react";
import { getContent, saveContent, resetContent, EVENT_NAME, DEFAULTS } from "./contentStore.js";
import Navbar from "./Navbar.jsx";
import theme from "./theme.js";

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  page:    { minHeight:"100vh", background:"#f4f5f9", fontFamily:"'DM Sans',sans-serif" },
  wrap:    { display:"flex", minHeight:"calc(100vh - 72px)" },
  sidebar: { width:220, background:"#1a3c6e", color:"#fff", padding:"28px 0", flexShrink:0, position:"sticky", top:72, height:"calc(100vh - 72px)", overflowY:"auto" },
  sbTitle: { fontSize:11, fontWeight:700, letterSpacing:"1.2px", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", padding:"0 20px 10px" },
  sbItem:  (active) => ({ display:"flex", alignItems:"center", gap:10, padding:"11px 20px", cursor:"pointer", fontSize:13, fontWeight: active?700:500, background: active?"rgba(255,255,255,0.12)":"transparent", color: active?"#fff":"rgba(255,255,255,0.65)", borderLeft: active?"3px solid #fff":"3px solid transparent", transition:"all 0.18s" }),
  main:    { flex:1, padding:"32px 36px", overflowY:"auto" },
  card:    { background:"#fff", borderRadius:16, border:"1px solid #e8eaf0", padding:"24px 28px", marginBottom:20, boxShadow:"0 1px 8px rgba(0,0,0,0.04)" },
  cardTitle: { fontSize:15, fontWeight:700, color:"#1a1a2e", marginBottom:18, paddingBottom:14, borderBottom:"1px solid #f0f1f5", display:"flex", alignItems:"center", gap:8 },
  label:   { display:"block", fontSize:11, fontWeight:700, color:"#6b6880", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.6px" },
  input:   { width:"100%", padding:"10px 14px", border:"1.5px solid #e2e4ea", borderRadius:10, fontSize:13, color:"#1a1a2e", outline:"none", fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box", transition:"border 0.2s" },
  row2:    { display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 },
  row3:    { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 },
  saveBtn: { background:"#1a3c6e", color:"#fff", border:"none", padding:"11px 28px", borderRadius:10, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s" },
  badge:   (on) => ({ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:700, background: on?"rgba(22,163,74,0.1)":"rgba(239,68,68,0.08)", color: on?"#16a34a":"#dc2626", border:`1px solid ${on?"rgba(22,163,74,0.25)":"rgba(239,68,68,0.2)"}` }),
};

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0", borderBottom:"1px solid #f5f5f8" }}>
      <span style={{ fontSize:13, fontWeight:600, color:"#1a1a2e" }}>{label}</span>
      <div onClick={() => onChange(!checked)}
        style={{ width:44, height:24, borderRadius:12, background: checked?"#1a3c6e":"#d1d5db", cursor:"pointer", position:"relative", transition:"background 0.25s", flexShrink:0 }}>
        <div style={{ position:"absolute", top:3, left: checked?23:3, width:18, height:18, borderRadius:"50%", background:"#fff", transition:"left 0.25s", boxShadow:"0 1px 4px rgba(0,0,0,0.15)" }} />
      </div>
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return <div><label style={S.label}>{label}</label>{children}</div>;
}
function Input({ value, onChange, placeholder, style={} }) {
  return <input style={{ ...S.input, ...style }} value={value||""} placeholder={placeholder} onChange={e=>onChange(e.target.value)}
    onFocus={e=>e.target.style.borderColor="#1a3c6e"} onBlur={e=>e.target.style.borderColor="#e2e4ea"} />;
}
function ImageInput({ value, onChange, label }) {
  return (
    <div>
      <label style={S.label}>{label||"Image URL"}</label>
      <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
        <input style={{ ...S.input, flex:1 }} value={value||""} placeholder="https://..." onChange={e=>onChange(e.target.value)}
          onFocus={e=>e.target.style.borderColor="#1a3c6e"} onBlur={e=>e.target.style.borderColor="#e2e4ea"} />
        {value && <img src={value} alt="" style={{ width:52, height:52, borderRadius:8, objectFit:"cover", flexShrink:0, border:"1px solid #e2e4ea" }} onError={e=>e.target.style.display="none"} />}
      </div>
    </div>
  );
}

// ─── Save Toast ───────────────────────────────────────────────────────────────
function SaveToast({ show }) {
  if (!show) return null;
  return (
    <div style={{ position:"fixed", bottom:28, right:28, zIndex:9999, background:"#1a3c6e", color:"#fff", padding:"12px 24px", borderRadius:12, fontSize:13, fontWeight:700, boxShadow:"0 8px 28px rgba(26,60,110,0.35)", display:"flex", alignItems:"center", gap:8 }}>
      ✅ Changes saved & live!
    </div>
  );
}

// ─── Confirm Modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#fff", borderRadius:16, padding:"28px 32px", maxWidth:380, width:"90%", textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:12 }}>⚠️</div>
        <p style={{ fontSize:14, color:"#1a1a2e", lineHeight:1.7, marginBottom:22 }}>{message}</p>
        <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
          <button onClick={onCancel} style={{ padding:"10px 22px", borderRadius:10, border:"1.5px solid #e2e4ea", background:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding:"10px 22px", borderRadius:10, border:"none", background:"#dc2626", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>Confirm Reset</button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Item Modal ──────────────────────────────────────────────────────────
function EditModal({ item, fields, title, onSave, onClose }) {
  const [data, setData] = useState({ ...item });
  const set = (k,v) => setData(p => ({ ...p, [k]:v }));
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#fff", borderRadius:20, padding:"28px 32px", width:"100%", maxWidth:580, maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22, paddingBottom:16, borderBottom:"1px solid #f0f1f5" }}>
          <h3 style={{ fontSize:17, fontWeight:700, color:"#1a1a2e", margin:0 }}>{title}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:"#6b6880" }}>✕</button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {fields.map(f => {
            if (f.type==="image") return <ImageInput key={f.key} label={f.label} value={data[f.key]} onChange={v=>set(f.key,v)} />;
            if (f.type==="toggle") return (
              <div key={f.key}>
                <label style={S.label}>{f.label}</label>
                <Toggle checked={!!data[f.key]} onChange={v=>set(f.key,v)} label={data[f.key]?"Available":"Unavailable"} />
              </div>
            );
            return (
              <Field key={f.key} label={f.label}>
                <Input value={data[f.key]} onChange={v=>set(f.key,v)} placeholder={f.placeholder||""} />
              </Field>
            );
          })}
        </div>
        <div style={{ display:"flex", gap:10, marginTop:24, paddingTop:18, borderTop:"1px solid #f0f1f5" }}>
          <button onClick={() => onSave(data)} style={{ ...S.saveBtn, flex:1, padding:"12px" }}>💾 Save Changes</button>
          <button onClick={onClose} style={{ padding:"12px 22px", borderRadius:10, border:"1.5px solid #e2e4ea", background:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── ItemList ─────────────────────────────────────────────────────────────────
function ItemList({ items, fields, title, editTitle, onUpdate, renderPreview }) {
  const [editing, setEditing] = useState(null);
  const handleSave = (updated) => {
    onUpdate(items.map(it => it.id===updated.id ? updated : it));
    setEditing(null);
  };
  return (
    <div>
      {items.map((item,i) => (
        <div key={item.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px", background: i%2===0?"#fafafa":"#fff", border:"1px solid #f0f1f5", borderRadius:12, marginBottom:8 }}>
          {renderPreview && renderPreview(item)}
          <div style={{ flex:1, minWidth:0 }}>
            {title(item)}
          </div>
          <button onClick={() => setEditing(item)} style={{ padding:"8px 18px", borderRadius:9, border:"1.5px solid #1a3c6e", background:"transparent", color:"#1a3c6e", fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>
            ✏️ Edit
          </button>
        </div>
      ))}
      {editing && (
        <EditModal item={editing} fields={fields} title={editTitle} onSave={handleSave} onClose={()=>setEditing(null)} />
      )}
    </div>
  );
}

// ─── Tab: Sections Visibility ─────────────────────────────────────────────────
function SectionsTab({ content, setContent, onSave }) {
  const update = (key,val) => setContent(p => ({ ...p, sections:{ ...p.sections, [key]:val } }));
  const secs = [
    { key:"hero",      label:"🏠 Hero Section (Main Banner)" },
    { key:"umrah",     label:"🕌 Umrah Packages Section" },
    { key:"carRental", label:"🚗 Car Rental Section" },
    { key:"features",  label:"💎 Features / Why Us Section" },
    { key:"visa",      label:"🛂 Visa Services Section" },
    { key:"reviews",   label:"⭐ Customer Reviews Section" },
    { key:"cta",       label:"📧 Subscribe / CTA Section" },
  ];
  return (
    <div>
      <div style={{ ...S.card }}>
        <div style={S.cardTitle}>👁️ Page Sections — Show / Hide</div>
        <p style={{ fontSize:13, color:"#6b6880", marginBottom:18, lineHeight:1.7 }}>Toggle sections on or off. Changes apply immediately on the home page after saving.</p>
        {secs.map(s => (
          <Toggle key={s.key} label={s.label} checked={content.sections[s.key]} onChange={v=>update(s.key,v)} />
        ))}
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <button style={S.saveBtn} onClick={onSave}>💾 Save Visibility Settings</button>
      </div>
    </div>
  );
}

// ─── Tab: Hero Section ────────────────────────────────────────────────────────
function HeroTab({ content, setContent, onSave }) {
  const h = content.hero;
  const upd = (k,v) => setContent(p => ({ ...p, hero:{ ...p.hero, [k]:v } }));
  return (
    <div>
      <div style={S.card}>
        <div style={S.cardTitle}>🖼️ Hero Image</div>
        <ImageInput label="Hero Image URL" value={h.heroImage} onChange={v=>upd("heroImage",v)} />
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>📝 Main Heading</div>
        <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
          <Field label="Line 1 (before accent)"><Input value={h.heading1} onChange={v=>upd("heading1",v)} /></Field>
          <Field label="Accent Word (gradient color)"><Input value={h.headingAccent} onChange={v=>upd("headingAccent",v)} /></Field>
          <Field label="Italic Word"><Input value={h.headingItalic} onChange={v=>upd("headingItalic",v)} /></Field>
          <Field label="Subtitle / Description"><Input value={h.subtext} onChange={v=>upd("subtext",v)} /></Field>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>📊 Stats (3 Numbers)</div>
        <div style={S.row3}>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <Field label="Stat 1 Number"><Input value={h.stat1Num} onChange={v=>upd("stat1Num",v)} /></Field>
            <Field label="Stat 1 Label"><Input value={h.stat1Label} onChange={v=>upd("stat1Label",v)} /></Field>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <Field label="Stat 2 Number"><Input value={h.stat2Num} onChange={v=>upd("stat2Num",v)} /></Field>
            <Field label="Stat 2 Label"><Input value={h.stat2Label} onChange={v=>upd("stat2Label",v)} /></Field>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <Field label="Stat 3 Number"><Input value={h.stat3Num} onChange={v=>upd("stat3Num",v)} /></Field>
            <Field label="Stat 3 Label"><Input value={h.stat3Label} onChange={v=>upd("stat3Label",v)} /></Field>
          </div>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>🏷️ Floating Badge</div>
        <div style={S.row2}>
          <Field label="Badge Title"><Input value={h.badgeLabel} onChange={v=>upd("badgeLabel",v)} /></Field>
          <Field label="Badge Subtitle"><Input value={h.badgeSub} onChange={v=>upd("badgeSub",v)} /></Field>
        </div>
      </div>
      <button style={S.saveBtn} onClick={onSave}>💾 Save Hero Section</button>
    </div>
  );
}

// ─── Tab: Umrah Packages ──────────────────────────────────────────────────────
function UmrahTab({ content, setContent, onSave }) {
  const sec = content.umrahSection;
  const updSec = (k,v) => setContent(p => ({ ...p, umrahSection:{ ...p.umrahSection, [k]:v } }));
  const updPkgs = (pkgs) => setContent(p => ({ ...p, umrahPackages: pkgs }));

  const fields = [
    { key:"name",     label:"Package Name",    type:"text"  },
    { key:"category", label:"Category",        type:"text"  },
    { key:"price",    label:"Price",           type:"text", placeholder:"PKR 0,000" },
    { key:"days",     label:"Duration",        type:"text", placeholder:"14 Days" },
    { key:"tag",      label:"Tag (Badge)",     type:"text", placeholder:"Popular" },
    { key:"rating",   label:"Rating (e.g. 4.9)", type:"text" },
    { key:"reviews",  label:"Review Count",   type:"text", placeholder:"1.2k" },
    { key:"img",      label:"Package Image",  type:"image" },
  ];

  return (
    <div>
      <div style={S.card}>
        <div style={S.cardTitle}>📝 Section Heading</div>
        <div style={S.row3}>
          <Field label="Heading"><Input value={sec.heading} onChange={v=>updSec("heading",v)} /></Field>
          <Field label="Accent Word"><Input value={sec.headingAccent} onChange={v=>updSec("headingAccent",v)} /></Field>
          <Field label="Subtext"><Input value={sec.subtext} onChange={v=>updSec("subtext",v)} /></Field>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>🕌 Umrah Packages ({content.umrahPackages.length})</div>
        <ItemList
          items={content.umrahPackages}
          fields={fields}
          editTitle="Edit Umrah Package"
          title={item => (
            <div>
              <div style={{ fontWeight:700, fontSize:13, color:"#1a1a2e" }}>{item.name}</div>
              <div style={{ fontSize:12, color:"#6b6880", marginTop:2 }}>{item.price} · {item.days} · ⭐{item.rating}</div>
            </div>
          )}
          renderPreview={item => (
            <img src={item.img} alt="" style={{ width:60, height:46, borderRadius:8, objectFit:"cover", flexShrink:0 }} onError={e=>e.target.style.display="none"} />
          )}
          onUpdate={updPkgs}
        />
      </div>
      <button style={S.saveBtn} onClick={onSave}>💾 Save Umrah Changes</button>
    </div>
  );
}

// ─── Tab: Car Rental ─────────────────────────────────────────────────────────
function CarsTab({ content, setContent, onSave }) {
  const sec = content.carsSection;
  const updSec = (k,v) => setContent(p => ({ ...p, carsSection:{ ...p.carsSection, [k]:v } }));
  const updCars = (cars) => setContent(p => ({ ...p, carRentalHighlights: cars }));

  const fields = [
    { key:"name",     label:"Car Name",        type:"text" },
    { key:"company",  label:"Company / Brand", type:"text" },
    { key:"type",     label:"Car Type",        type:"text", placeholder:"Sedan / SUV / Hatchback" },
    { key:"seats",    label:"Seats",           type:"text", placeholder:"4" },
    { key:"price",    label:"Price per Day",   type:"text", placeholder:"PKR 0,000" },
    { key:"tag",      label:"Tag (Badge)",     type:"text" },
    { key:"available",label:"Availability",   type:"toggle" },
    { key:"img",      label:"Car Image",       type:"image" },
  ];

  return (
    <div>
      <div style={S.card}>
        <div style={S.cardTitle}>📝 Section Heading</div>
        <div style={S.row3}>
          <Field label="Heading"><Input value={sec.heading} onChange={v=>updSec("heading",v)} /></Field>
          <Field label="Accent Word"><Input value={sec.headingAccent} onChange={v=>updSec("headingAccent",v)} /></Field>
          <Field label="Subtext"><Input value={sec.subtext} onChange={v=>updSec("subtext",v)} /></Field>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>🚗 Featured Cars on Home Page ({content.carRentalHighlights.length})</div>
        <ItemList
          items={content.carRentalHighlights}
          fields={fields}
          editTitle="Edit Car"
          title={item => (
            <div>
              <div style={{ fontWeight:700, fontSize:13, color:"#1a1a2e" }}>{item.name}</div>
              <div style={{ fontSize:12, color:"#6b6880", marginTop:2 }}>{item.company} · {item.type} · 🪑{item.seats} Seats · {item.price}/day</div>
              <span style={S.badge(item.available !== false)}>{item.available !== false ? "Available" : "Unavailable"}</span>
            </div>
          )}
          renderPreview={item => (
            <img src={item.img} alt="" style={{ width:60, height:46, borderRadius:8, objectFit:"cover", flexShrink:0 }} onError={e=>e.target.style.display="none"} />
          )}
          onUpdate={updCars}
        />
      </div>
      <button style={S.saveBtn} onClick={onSave}>💾 Save Car Rental Changes</button>
    </div>
  );
}

// ─── Tab: Visas ───────────────────────────────────────────────────────────────
function VisasTab({ content, setContent, onSave }) {
  const sec = content.visaSection;
  const updSec = (k,v) => setContent(p => ({ ...p, visaSection:{ ...p.visaSection, [k]:v } }));
  const updVisas = (visas) => setContent(p => ({ ...p, visasList: visas }));

  const fields = [
    { key:"country",      label:"Country Name",        type:"text" },
    { key:"flag",         label:"Flag Emoji",          type:"text", placeholder:"🇵🇰" },
    { key:"type",         label:"Visa Type",           type:"text", placeholder:"Tourist / e-Visa" },
    { key:"processing",   label:"Processing Time",     type:"text", placeholder:"3-5 Days" },
    { key:"fee",          label:"Fee",                 type:"text", placeholder:"PKR 8,500 or FREE" },
    { key:"approvalRate", label:"Approval Rate",       type:"text", placeholder:"99%" },
    { key:"img",          label:"Country/Visa Image",  type:"image" },
  ];

  return (
    <div>
      <div style={S.card}>
        <div style={S.cardTitle}>📝 Section Heading</div>
        <div style={S.row2}>
          <Field label="Heading"><Input value={sec.heading} onChange={v=>updSec("heading",v)} /></Field>
          <Field label="Accent Word"><Input value={sec.headingAccent} onChange={v=>updSec("headingAccent",v)} /></Field>
          <Field label="After Accent"><Input value={sec.headingEnd} onChange={v=>updSec("headingEnd",v)} /></Field>
          <Field label="Subtext"><Input value={sec.subtext} onChange={v=>updSec("subtext",v)} /></Field>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>🛂 Visa Listings ({content.visasList.length})</div>
        <ItemList
          items={content.visasList}
          fields={fields}
          editTitle="Edit Visa"
          title={item => (
            <div>
              <div style={{ fontWeight:700, fontSize:13, color:"#1a1a2e" }}>{item.flag} {item.country}</div>
              <div style={{ fontSize:12, color:"#6b6880", marginTop:2 }}>{item.type} · {item.processing} · {item.fee} · ✅ {item.approvalRate}</div>
            </div>
          )}
          renderPreview={item => (
            <img src={item.img} alt="" style={{ width:60, height:46, borderRadius:8, objectFit:"cover", flexShrink:0 }} onError={e=>e.target.style.display="none"} />
          )}
          onUpdate={updVisas}
        />
      </div>
      <button style={S.saveBtn} onClick={onSave}>💾 Save Visa Changes</button>
    </div>
  );
}

// ─── Tab: Reviews & CTA ───────────────────────────────────────────────────────
function OtherTab({ content, setContent, onSave }) {
  const rv = content.reviewsSection;
  const ct = content.ctaSection;
  const updRv = (k,v) => setContent(p => ({ ...p, reviewsSection:{ ...p.reviewsSection, [k]:v } }));
  const updCt = (k,v) => setContent(p => ({ ...p, ctaSection:{ ...p.ctaSection, [k]:v } }));
  return (
    <div>
      <div style={S.card}>
        <div style={S.cardTitle}>⭐ Reviews Section</div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <Field label="Heading"><Input value={rv.heading} onChange={v=>updRv("heading",v)} /></Field>
          <Field label="Accent Word"><Input value={rv.headingAccent} onChange={v=>updRv("headingAccent",v)} /></Field>
          <Field label="After Accent"><Input value={rv.headingEnd} onChange={v=>updRv("headingEnd",v)} /></Field>
          <Field label="Subtext"><Input value={rv.subtext} onChange={v=>updRv("subtext",v)} /></Field>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>📧 CTA / Subscribe Section</div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <Field label="Heading"><Input value={ct.heading} onChange={v=>updCt("heading",v)} /></Field>
          <Field label="Accent Word"><Input value={ct.headingAccent} onChange={v=>updCt("headingAccent",v)} /></Field>
          <Field label="Subtext"><Input value={ct.subtext} onChange={v=>updCt("subtext",v)} /></Field>
        </div>
      </div>
      <button style={S.saveBtn} onClick={onSave}>💾 Save Changes</button>
    </div>
  );
}

// ─── Dashboard Main ───────────────────────────────────────────────────────────
const TABS = [
  { key:"sections", icon:"👁️", label:"Sections Visibility" },
  { key:"hero",     icon:"🏠", label:"Hero Section" },
  { key:"umrah",    icon:"🕌", label:"Umrah Packages" },
  { key:"cars",     icon:"🚗", label:"Car Rental" },
  { key:"visas",    icon:"🛂", label:"Visas" },
  { key:"other",    icon:"⚙️", label:"Reviews & CTA" },
];

export default function Dashboard() {
  const [activeTab,  setActiveTab]  = useState("sections");
  const [content,    setContent]    = useState(() => getContent());
  const [showToast,  setShowToast]  = useState(false);
  const [showReset,  setShowReset]  = useState(false);
  const toastTimer = useRef(null);

  const handleSave = () => {
    saveContent(content);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setShowToast(true);
    toastTimer.current = setTimeout(() => setShowToast(false), 2500);
  };

  const handleReset = () => {
    resetContent();
    setContent(getContent());
    setShowReset(false);
    setShowToast(true);
    toastTimer.current = setTimeout(() => setShowToast(false), 2500);
  };

  const tabProps = { content, setContent, onSave: handleSave };

  return (
    <>
      <Navbar />
      <style>{`
        @media(max-width:768px){
          .dash-sidebar { display:none !important; }
          .dash-main    { padding:20px !important; }
        }
      `}</style>
      <div style={S.page}>
        <div style={S.wrap}>

          {/* Sidebar */}
          <div style={S.sidebar} className="dash-sidebar">
            <div style={S.sbTitle}>CMS Admin</div>
            {TABS.map(t => (
              <div key={t.key} style={S.sbItem(activeTab===t.key)} onClick={() => setActiveTab(t.key)}>
                <span style={{ fontSize:16 }}>{t.icon}</span>
                <span>{t.label}</span>
              </div>
            ))}
            <div style={{ marginTop:24, padding:"0 16px" }}>
              <div style={{ height:1, background:"rgba(255,255,255,0.1)", marginBottom:20 }} />
              <button onClick={() => window.location.hash = ""} style={{ width:"100%", padding:"10px", borderRadius:10, background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", marginBottom:8 }}>
                🏠 View Home Page
              </button>
              <button onClick={() => setShowReset(true)} style={{ width:"100%", padding:"10px", borderRadius:10, background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)", color:"#fca5a5", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                🔄 Reset to Default
              </button>
            </div>
          </div>

          {/* Main */}
          <div style={S.main} className="dash-main">
            {/* Header */}
            <div style={{ marginBottom:28 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
                <div>
                  <h1 style={{ fontSize:22, fontWeight:700, color:"#1a1a2e", margin:"0 0 6px" }}>
                    {TABS.find(t=>t.key===activeTab)?.icon} {TABS.find(t=>t.key===activeTab)?.label}
                  </h1>
                  <p style={{ fontSize:13, color:"#6b6880", margin:0 }}>Edit and save changes — they update the website live.</p>
                </div>
                <button style={{ ...S.saveBtn, padding:"10px 24px" }} onClick={handleSave}>💾 Save Now</button>
              </div>
            </div>

            {activeTab === "sections" && <SectionsTab  {...tabProps} />}
            {activeTab === "hero"     && <HeroTab       {...tabProps} />}
            {activeTab === "umrah"    && <UmrahTab      {...tabProps} />}
            {activeTab === "cars"     && <CarsTab       {...tabProps} />}
            {activeTab === "visas"    && <VisasTab      {...tabProps} />}
            {activeTab === "other"    && <OtherTab      {...tabProps} />}
          </div>
        </div>
      </div>

      <SaveToast show={showToast} />
      {showReset && <ConfirmModal message="This will reset ALL content to default values. Are you sure?" onConfirm={handleReset} onCancel={()=>setShowReset(false)} />}
    </>
  );
}