// ─── Dashboard.jsx — Edafay Advanced CMS + User Management ──────────────────
import { useState, useEffect, useRef } from "react";
import { getContent, saveContent, resetContent, EVENT_NAME, DEFAULTS } from "./contentStore.js";
import { getAuth, clearAuth, getUsers, saveUsers, ROLE_LABELS, ROLE_COLORS } from "./Auth.jsx";
import Navbar from "./Navbar.jsx";
import theme from "./theme.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (iso) => {
  if (!iso) return "Never";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" }) + " " +
         d.toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" });
};
const initials = (name) => name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  page:    { minHeight:"100vh", background:"#f0f2f7", fontFamily:"'DM Sans',sans-serif" },
  wrap:    { display:"flex", minHeight:"calc(100vh - 72px)" },
  sidebar: {
    width:240, background:"#0f1f3d", color:"#fff",
    display:"flex", flexDirection:"column",
    position:"sticky", top:72, height:"calc(100vh - 72px)", overflowY:"auto", flexShrink:0,
  },
  sbTop:   { padding:"20px 16px 8px" },
  sbSection: { fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.3)", letterSpacing:"1.4px", textTransform:"uppercase", padding:"16px 20px 8px" },
  sbItem:  (active) => ({
    display:"flex", alignItems:"center", gap:10, padding:"10px 16px",
    cursor:"pointer", fontSize:13, fontWeight: active?700:500, margin:"1px 8px",
    borderRadius:10,
    background: active?"rgba(255,255,255,0.13)":"transparent",
    color: active?"#fff":"rgba(255,255,255,0.6)",
    transition:"all 0.18s",
  }),
  sbBottom: { marginTop:"auto", padding:"12px 16px 20px", borderTop:"1px solid rgba(255,255,255,0.08)" },
  main:    { flex:1, padding:"28px 32px", overflowY:"auto", minWidth:0 },
  card:    { background:"#fff", borderRadius:16, border:"1px solid #e8eaef", padding:"22px 26px", marginBottom:20, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" },
  cardTitle: { fontSize:14, fontWeight:700, color:"#1a1a2e", marginBottom:16, paddingBottom:12, borderBottom:"1px solid #f0f1f6", display:"flex", alignItems:"center", gap:8 },
  label:   { display:"block", fontSize:11, fontWeight:700, color:"#6b6880", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.6px" },
  input:   { width:"100%", padding:"10px 14px", border:"1.5px solid #e2e4ea", borderRadius:10, fontSize:13, color:"#1a1a2e", outline:"none", fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box", transition:"border 0.2s" },
  row2:    { display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 },
  row3:    { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 },
  saveBtn: { background:"#1a3c6e", color:"#fff", border:"none", padding:"11px 26px", borderRadius:10, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s", display:"inline-flex", alignItems:"center", gap:6 },
  badge:   (on) => ({ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, background: on?"rgba(22,163,74,0.1)":"rgba(239,68,68,0.08)", color: on?"#16a34a":"#dc2626", border:`1px solid ${on?"rgba(22,163,74,0.25)":"rgba(239,68,68,0.2)"}` }),
  roleBadge: (role) => ({ display:"inline-flex", alignItems:"center", padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, background:`${ROLE_COLORS[role]}18`, color:ROLE_COLORS[role], border:`1px solid ${ROLE_COLORS[role]}35` }),
  statCard: { background:"#fff", borderRadius:16, border:"1px solid #e8eaef", padding:"20px 22px", boxShadow:"0 1px 6px rgba(0,0,0,0.04)" },
};

function Input({ value, onChange, placeholder, type="text", style={} }) {
  return <input style={{ ...S.input, ...style }} value={value||""} type={type} placeholder={placeholder} onChange={e=>onChange(e.target.value)}
    onFocus={e=>e.target.style.borderColor="#1a3c6e"} onBlur={e=>e.target.style.borderColor="#e2e4ea"} />;
}
function Field({ label, children }) { return <div><label style={S.label}>{label}</label>{children}</div>; }
function ImageInput({ value, onChange, label }) {
  return (
    <div>
      <label style={S.label}>{label||"Image URL"}</label>
      <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
        <input style={{ ...S.input, flex:1 }} value={value||""} placeholder="https://..." onChange={e=>onChange(e.target.value)}
          onFocus={e=>e.target.style.borderColor="#1a3c6e"} onBlur={e=>e.target.style.borderColor="#e2e4ea"} />
        {value && <img src={value} alt="" onError={e=>e.target.style.display="none"} style={{ width:52, height:44, borderRadius:8, objectFit:"cover", flexShrink:0, border:"1px solid #e2e4ea" }} />}
      </div>
    </div>
  );
}
function Toggle({ checked, onChange, label, small }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:small?"8px 0":"12px 0", borderBottom:small?"none":"1px solid #f5f5f8" }}>
      <span style={{ fontSize:small?12:13, fontWeight:600, color:"#1a1a2e" }}>{label}</span>
      <div onClick={() => onChange(!checked)} style={{ width:40, height:22, borderRadius:11, background:checked?"#1a3c6e":"#d1d5db", cursor:"pointer", position:"relative", transition:"background 0.25s", flexShrink:0 }}>
        <div style={{ position:"absolute", top:3, left:checked?21:3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left 0.25s", boxShadow:"0 1px 4px rgba(0,0,0,0.15)" }} />
      </div>
    </div>
  );
}
function SaveToast({ show }) {
  if (!show) return null;
  return <div style={{ position:"fixed", bottom:28, right:28, zIndex:9999, background:"#1a3c6e", color:"#fff", padding:"12px 22px", borderRadius:12, fontSize:13, fontWeight:700, boxShadow:"0 8px 28px rgba(26,60,110,0.35)", display:"flex", alignItems:"center", gap:8, animation:"toastIn 0.3s ease" }}>✅ Saved & live!</div>;
}
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#fff", borderRadius:18, padding:"28px 32px", maxWidth:380, width:"90%", textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:12 }}>⚠️</div>
        <p style={{ fontSize:14, color:"#1a1a2e", lineHeight:1.7, marginBottom:22 }}>{message}</p>
        <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
          <button onClick={onCancel} style={{ padding:"10px 22px", borderRadius:10, border:"1.5px solid #e2e4ea", background:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding:"10px 22px", borderRadius:10, border:"none", background:"#dc2626", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
function EditModal({ item, fields, title, onSave, onClose }) {
  const [data, setData] = useState({ ...item });
  const set = (k,v) => setData(p=>({ ...p, [k]:v }));
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#fff", borderRadius:20, padding:"28px 32px", width:"100%", maxWidth:560, maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, paddingBottom:14, borderBottom:"1px solid #f0f1f5" }}>
          <h3 style={{ fontSize:16, fontWeight:700, color:"#1a1a2e", margin:0 }}>{title}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:"#6b6880" }}>✕</button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {fields.map(f => {
            if (f.type==="image")  return <ImageInput key={f.key} label={f.label} value={data[f.key]} onChange={v=>set(f.key,v)} />;
            if (f.type==="toggle") return <div key={f.key}><label style={S.label}>{f.label}</label><Toggle small checked={!!data[f.key]} onChange={v=>set(f.key,v)} label={data[f.key]?"Yes":"No"} /></div>;
            if (f.type==="select") return <div key={f.key}><label style={S.label}>{f.label}</label><select style={{ ...S.input, appearance:"none", cursor:"pointer" }} value={data[f.key]||""} onChange={e=>set(f.key,e.target.value)} onFocus={e=>e.target.style.borderColor="#1a3c6e"} onBlur={e=>e.target.style.borderColor="#e2e4ea"}>{f.options.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select></div>;
            if (f.type==="password") return <div key={f.key}><label style={S.label}>{f.label}</label><Input value={data[f.key]} onChange={v=>set(f.key,v)} placeholder={f.placeholder||"New password"} type="password" /></div>;
            return <Field key={f.key} label={f.label}><Input value={data[f.key]} onChange={v=>set(f.key,v)} placeholder={f.placeholder||""} /></Field>;
          })}
        </div>
        <div style={{ display:"flex", gap:10, marginTop:22, paddingTop:16, borderTop:"1px solid #f0f1f5" }}>
          <button onClick={()=>onSave(data)} style={{ ...S.saveBtn, flex:1, padding:"12px", justifyContent:"center" }}>💾 Save Changes</button>
          <button onClick={onClose} style={{ padding:"12px 20px", borderRadius:10, border:"1.5px solid #e2e4ea", background:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
function ItemList({ items, fields, editTitle, onUpdate, renderPreview, renderInfo }) {
  const [editing, setEditing] = useState(null);
  return (
    <div>
      {items.map((item,i) => (
        <div key={item.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 14px", background:i%2===0?"#fafbff":"#fff", border:"1px solid #f0f1f6", borderRadius:12, marginBottom:7 }}>
          {renderPreview && renderPreview(item)}
          <div style={{ flex:1, minWidth:0 }}>{renderInfo(item)}</div>
          <button onClick={()=>setEditing(item)} style={{ padding:"7px 16px", borderRadius:8, border:"1.5px solid #1a3c6e", background:"transparent", color:"#1a3c6e", fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>✏️ Edit</button>
        </div>
      ))}
      {editing && <EditModal item={editing} fields={fields} title={editTitle} onSave={d=>{ onUpdate(items.map(it=>it.id===d.id?d:it)); setEditing(null); }} onClose={()=>setEditing(null)} />}
    </div>
  );
}

// ─── TABS ─────────────────────────────────────────────────────────────────────

// Overview / Stats
function OverviewTab({ content, auth }) {
  const users   = getUsers();
  const pkgs    = content.umrahPackages || [];
  const cars    = content.carRentalHighlights || [];
  const visas   = content.visasList || [];
  const secOn   = Object.values(content.sections||{}).filter(Boolean).length;

  const stats = [
    { icon:"🕌", label:"Umrah Packages", value:pkgs.length,       color:"#1a3c6e" },
    { icon:"🚗", label:"Featured Cars",  value:cars.length,       color:"#ea580c" },
    { icon:"🛂", label:"Visa Services",  value:visas.length,      color:"#0369a1" },
    { icon:"👁️", label:"Active Sections",value:`${secOn}/7`,      color:"#16a34a" },
    { icon:"👥", label:"Admin Users",    value:users.filter(u=>u.active).length, color:"#7c3aed" },
    { icon:"📦", label:"Total Content",  value:pkgs.length+cars.length+visas.length, color:"#dc2626" },
  ];
  return (
    <div>
      {/* Welcome banner */}
      <div style={{ background:"linear-gradient(135deg, #1a3c6e 0%, #2a5298 100%)", borderRadius:18, padding:"24px 28px", marginBottom:24, color:"#fff", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:14 }}>
        <div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.8px" }}>Welcome back</div>
          <div style={{ fontSize:22, fontWeight:700, fontFamily:"'Playfair Display',serif" }}>
            {auth?.name || "Admin"} <span style={{ color:"rgba(255,255,255,0.55)", fontSize:16, fontWeight:400 }}>({ROLE_LABELS[auth?.role]})</span>
          </div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.65)", marginTop:4 }}>Last login: {fmtDate(auth?.lastLogin)}</div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={()=>window.location.hash=""} style={{ padding:"10px 20px", borderRadius:10, background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>🏠 View Site</button>
        </div>
      </div>

      {/* Stat grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:24 }} className="stat-grid">
        {stats.map(s => (
          <div key={s.label} style={S.statCard}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ fontSize:11, color:"#6b6880", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:8 }}>{s.label}</div>
                <div style={{ fontSize:32, fontWeight:800, color:s.color, fontFamily:"'Playfair Display',serif", lineHeight:1 }}>{s.value}</div>
              </div>
              <div style={{ width:44, height:44, borderRadius:12, background:`${s.color}14`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Section status */}
      <div style={S.card}>
        <div style={S.cardTitle}>👁️ Sections Status</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
          {Object.entries(content.sections||{}).map(([key,val]) => {
            const labels = { hero:"Hero",umrah:"Umrah",carRental:"Car Rental",features:"Features",visa:"Visa",reviews:"Reviews",cta:"CTA" };
            return (
              <div key={key} style={{ padding:"10px 14px", borderRadius:10, border:`1px solid ${val?"rgba(22,163,74,0.25)":"rgba(239,68,68,0.2)"}`, background:val?"rgba(22,163,74,0.06)":"rgba(239,68,68,0.04)" }}>
                <div style={{ fontSize:11, color:"#6b6880", marginBottom:3 }}>{labels[key]||key}</div>
                <div style={{ fontSize:12, fontWeight:700, color:val?"#16a34a":"#dc2626" }}>{val?"● Active":"○ Hidden"}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent users */}
      <div style={S.card}>
        <div style={S.cardTitle}>👥 Admin Users Overview</div>
        {getUsers().map(u => (
          <div key={u.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid #f5f5f8" }}>
            <div style={{ width:38, height:38, borderRadius:12, background:u.color, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, flexShrink:0 }}>{initials(u.name)}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:13, color:"#1a1a2e" }}>{u.name}</div>
              <div style={{ fontSize:11, color:"#9ca3af" }}>{u.email}</div>
            </div>
            <span style={S.roleBadge(u.role)}>{ROLE_LABELS[u.role]}</span>
            <span style={S.badge(u.active)}>{u.active?"Active":"Inactive"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Sections Visibility
function SectionsTab({ content, setContent, onSave }) {
  const up = (k,v) => setContent(p=>({ ...p, sections:{ ...p.sections, [k]:v } }));
  const secs = [
    { key:"hero",      icon:"🏠", label:"Hero / Main Banner" },
    { key:"umrah",     icon:"🕌", label:"Umrah Packages Section" },
    { key:"carRental", icon:"🚗", label:"Car Rental Section" },
    { key:"features",  icon:"💎", label:"Features / Why Us Section" },
    { key:"visa",      icon:"🛂", label:"Visa Services Section" },
    { key:"reviews",   icon:"⭐", label:"Customer Reviews Section" },
    { key:"cta",       icon:"📧", label:"Subscribe / CTA Section" },
  ];
  return (
    <div>
      <div style={S.card}>
        <div style={S.cardTitle}>👁️ Page Sections — Show / Hide</div>
        <p style={{ fontSize:13, color:"#6b6880", marginBottom:18, lineHeight:1.7 }}>Toggle sections to show or hide them on the home page. Changes are live after saving.</p>
        {secs.map(s => (
          <div key={s.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 0", borderBottom:"1px solid #f5f5f8" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:18 }}>{s.icon}</span>
              <span style={{ fontSize:13, fontWeight:600, color:"#1a1a2e" }}>{s.label}</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={S.badge(content.sections[s.key])}>{content.sections[s.key]?"Visible":"Hidden"}</span>
              <div onClick={()=>up(s.key,!content.sections[s.key])} style={{ width:44, height:24, borderRadius:12, background:content.sections[s.key]?"#1a3c6e":"#d1d5db", cursor:"pointer", position:"relative", transition:"background 0.25s" }}>
                <div style={{ position:"absolute", top:3, left:content.sections[s.key]?23:3, width:18, height:18, borderRadius:"50%", background:"#fff", transition:"left 0.25s", boxShadow:"0 1px 4px rgba(0,0,0,0.15)" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button style={S.saveBtn} onClick={onSave}>💾 Save Visibility</button>
    </div>
  );
}

// Hero Tab
function HeroTab({ content, setContent, onSave }) {
  const h = content.hero;
  const upd = (k,v) => setContent(p=>({ ...p, hero:{ ...p.hero, [k]:v } }));
  return (
    <div>
      <div style={S.card}>
        <div style={S.cardTitle}>🖼️ Hero Image</div>
        <ImageInput label="Hero Image URL" value={h.heroImage} onChange={v=>upd("heroImage",v)} />
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>📝 Heading & Description</div>
        <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
          <Field label="Line 1"><Input value={h.heading1} onChange={v=>upd("heading1",v)} /></Field>
          <div style={S.row2}>
            <Field label="Accent Word (gradient)"><Input value={h.headingAccent} onChange={v=>upd("headingAccent",v)} /></Field>
            <Field label="Italic Word"><Input value={h.headingItalic} onChange={v=>upd("headingItalic",v)} /></Field>
          </div>
          <Field label="Subtitle"><Input value={h.subtext} onChange={v=>upd("subtext",v)} /></Field>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>📊 Stats</div>
        <div style={S.row3}>
          {[["stat1Num","stat1Label","Stat 1"],["stat2Num","stat2Label","Stat 2"],["stat3Num","stat3Label","Stat 3"]].map(([nk,lk,title]) => (
            <div key={nk} style={{ padding:"14px 16px", background:"#fafbff", borderRadius:12, border:"1px solid #e8eaef" }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#6b6880", marginBottom:10, textTransform:"uppercase" }}>{title}</div>
              <Field label="Number"><Input value={h[nk]} onChange={v=>upd(nk,v)} /></Field>
              <div style={{ marginTop:8 }}><Field label="Label"><Input value={h[lk]} onChange={v=>upd(lk,v)} /></Field></div>
            </div>
          ))}
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>🏷️ Floating Badge</div>
        <div style={S.row2}>
          <Field label="Title"><Input value={h.badgeLabel} onChange={v=>upd("badgeLabel",v)} /></Field>
          <Field label="Subtitle"><Input value={h.badgeSub} onChange={v=>upd("badgeSub",v)} /></Field>
        </div>
      </div>
      <button style={S.saveBtn} onClick={onSave}>💾 Save Hero</button>
    </div>
  );
}

// Umrah Tab
function UmrahTab({ content, setContent, onSave }) {
  const sec = content.umrahSection;
  const updSec = (k,v) => setContent(p=>({ ...p, umrahSection:{ ...p.umrahSection, [k]:v } }));
  const fields = [
    { key:"name",     label:"Package Name"  },
    { key:"category", label:"Category"      },
    { key:"price",    label:"Price",         placeholder:"PKR 0,000" },
    { key:"days",     label:"Duration",      placeholder:"14 Days" },
    { key:"tag",      label:"Tag / Badge",   placeholder:"Popular" },
    { key:"rating",   label:"Rating",        placeholder:"4.9" },
    { key:"reviews",  label:"Review Count",  placeholder:"1.2k" },
    { key:"img",      label:"Package Image", type:"image" },
  ];
  return (
    <div>
      <div style={S.card}>
        <div style={S.cardTitle}>📝 Section Text</div>
        <div style={S.row3}>
          <Field label="Heading"><Input value={sec.heading} onChange={v=>updSec("heading",v)} /></Field>
          <Field label="Accent Word"><Input value={sec.headingAccent} onChange={v=>updSec("headingAccent",v)} /></Field>
          <Field label="Subtext"><Input value={sec.subtext} onChange={v=>updSec("subtext",v)} /></Field>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>🕌 Packages ({content.umrahPackages?.length})</div>
        <ItemList items={content.umrahPackages||[]} fields={fields} editTitle="Edit Umrah Package"
          onUpdate={v=>setContent(p=>({ ...p, umrahPackages:v }))}
          renderPreview={item => <img src={item.img} alt="" onError={e=>e.target.style.display="none"} style={{ width:62,height:46,borderRadius:8,objectFit:"cover",flexShrink:0 }} />}
          renderInfo={item => <><div style={{ fontWeight:700,fontSize:13,color:"#1a1a2e" }}>{item.name}</div><div style={{ fontSize:12,color:"#6b6880",marginTop:2 }}>{item.price} · {item.days} · ⭐{item.rating} · <em>{item.category}</em></div></>}
        />
      </div>
      <button style={S.saveBtn} onClick={onSave}>💾 Save Umrah</button>
    </div>
  );
}

// Cars Tab
function CarsTab({ content, setContent, onSave }) {
  const sec = content.carsSection;
  const updSec = (k,v) => setContent(p=>({ ...p, carsSection:{ ...p.carsSection, [k]:v } }));
  const fields = [
    { key:"name",      label:"Car Name" },
    { key:"company",   label:"Company" },
    { key:"type",      label:"Type",       placeholder:"Sedan / SUV / Hatchback" },
    { key:"seats",     label:"Seats",      placeholder:"4" },
    { key:"price",     label:"Price/Day",  placeholder:"PKR 0,000" },
    { key:"tag",       label:"Tag / Badge" },
    { key:"available", label:"Available",  type:"toggle" },
    { key:"img",       label:"Car Image",  type:"image" },
  ];
  return (
    <div>
      <div style={S.card}>
        <div style={S.cardTitle}>📝 Section Text</div>
        <div style={S.row3}>
          <Field label="Heading"><Input value={sec.heading} onChange={v=>updSec("heading",v)} /></Field>
          <Field label="Accent Word"><Input value={sec.headingAccent} onChange={v=>updSec("headingAccent",v)} /></Field>
          <Field label="Subtext"><Input value={sec.subtext} onChange={v=>updSec("subtext",v)} /></Field>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>🚗 Featured Cars ({content.carRentalHighlights?.length})</div>
        <ItemList items={content.carRentalHighlights||[]} fields={fields} editTitle="Edit Car"
          onUpdate={v=>setContent(p=>({ ...p, carRentalHighlights:v }))}
          renderPreview={item => <img src={item.img} alt="" onError={e=>e.target.style.display="none"} style={{ width:62,height:46,borderRadius:8,objectFit:"cover",flexShrink:0 }} />}
          renderInfo={item => <><div style={{ fontWeight:700,fontSize:13,color:"#1a1a2e" }}>{item.name}</div><div style={{ fontSize:12,color:"#6b6880",marginTop:2 }}>{item.company} · {item.type} · 🪑{item.seats} · {item.price}/day</div><span style={S.badge(item.available!==false)}>{item.available!==false?"Available":"Unavailable"}</span></>}
        />
      </div>
      <button style={S.saveBtn} onClick={onSave}>💾 Save Cars</button>
    </div>
  );
}

// Visas Tab
function VisasTab({ content, setContent, onSave }) {
  const sec = content.visaSection;
  const updSec = (k,v) => setContent(p=>({ ...p, visaSection:{ ...p.visaSection, [k]:v } }));
  const fields = [
    { key:"country",     label:"Country Name" },
    { key:"flag",        label:"Flag Emoji",   placeholder:"🇵🇰" },
    { key:"type",        label:"Visa Type",    placeholder:"Tourist / e-Visa" },
    { key:"processing",  label:"Processing",   placeholder:"3-5 Days" },
    { key:"fee",         label:"Fee",          placeholder:"PKR 8,500 or FREE" },
    { key:"approvalRate",label:"Approval Rate",placeholder:"99%" },
    { key:"img",         label:"Image",        type:"image" },
  ];
  return (
    <div>
      <div style={S.card}>
        <div style={S.cardTitle}>📝 Section Text</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:13 }}>
          <Field label="Heading"><Input value={sec.heading} onChange={v=>updSec("heading",v)} /></Field>
          <Field label="Accent Word"><Input value={sec.headingAccent} onChange={v=>updSec("headingAccent",v)} /></Field>
          <Field label="After Accent"><Input value={sec.headingEnd} onChange={v=>updSec("headingEnd",v)} /></Field>
          <Field label="Subtext"><Input value={sec.subtext} onChange={v=>updSec("subtext",v)} /></Field>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>🛂 Visas ({content.visasList?.length})</div>
        <ItemList items={content.visasList||[]} fields={fields} editTitle="Edit Visa"
          onUpdate={v=>setContent(p=>({ ...p, visasList:v }))}
          renderPreview={item => <img src={item.img} alt="" onError={e=>e.target.style.display="none"} style={{ width:62,height:46,borderRadius:8,objectFit:"cover",flexShrink:0 }} />}
          renderInfo={item => <><div style={{ fontWeight:700,fontSize:13,color:"#1a1a2e" }}>{item.flag} {item.country}</div><div style={{ fontSize:12,color:"#6b6880",marginTop:2 }}>{item.type} · {item.processing} · {item.fee} · ✅{item.approvalRate}</div></>}
        />
      </div>
      <button style={S.saveBtn} onClick={onSave}>💾 Save Visas</button>
    </div>
  );
}

// Other Sections
function OtherTab({ content, setContent, onSave }) {
  const rv = content.reviewsSection, ct = content.ctaSection;
  const updRv = (k,v) => setContent(p=>({ ...p, reviewsSection:{ ...p.reviewsSection, [k]:v } }));
  const updCt = (k,v) => setContent(p=>({ ...p, ctaSection:{ ...p.ctaSection, [k]:v } }));
  return (
    <div>
      <div style={S.card}>
        <div style={S.cardTitle}>⭐ Reviews Section</div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={S.row2}><Field label="Heading"><Input value={rv.heading} onChange={v=>updRv("heading",v)} /></Field><Field label="Accent Word"><Input value={rv.headingAccent} onChange={v=>updRv("headingAccent",v)} /></Field></div>
          <Field label="After Accent"><Input value={rv.headingEnd} onChange={v=>updRv("headingEnd",v)} /></Field>
          <Field label="Subtext"><Input value={rv.subtext} onChange={v=>updRv("subtext",v)} /></Field>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>📧 CTA / Subscribe</div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={S.row2}><Field label="Heading"><Input value={ct.heading} onChange={v=>updCt("heading",v)} /></Field><Field label="Accent Word"><Input value={ct.headingAccent} onChange={v=>updCt("headingAccent",v)} /></Field></div>
          <Field label="Subtext"><Input value={ct.subtext} onChange={v=>updCt("subtext",v)} /></Field>
        </div>
      </div>
      <button style={S.saveBtn} onClick={onSave}>💾 Save Changes</button>
    </div>
  );
}

// ─── User Management ──────────────────────────────────────────────────────────
function UserMgmtTab({ auth }) {
  const [users,   setUsers]   = useState(() => getUsers());
  const [editing, setEditing] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [toast,   setToast]   = useState(false);

  const persist = (u) => { saveUsers(u); setUsers(u); setToast(true); setTimeout(()=>setToast(false),2200); };
  const isSuperAdmin = auth?.role === "super_admin";

  const newUser = { id: Date.now(), name:"", email:"", password:"", role:"editor", avatar:"", color:"#1a3c6e", active:true, createdAt:new Date().toISOString().split("T")[0], lastLogin:null };

  const userFields = [
    { key:"name",     label:"Full Name"       },
    { key:"email",    label:"Email Address"   },
    { key:"password", label:"Password",  type:"password", placeholder:"New password (leave blank to keep)" },
    { key:"role",     label:"Role",      type:"select", options:[{v:"super_admin",l:"Super Admin"},{v:"editor",l:"Editor"},{v:"viewer",l:"Viewer"}] },
    { key:"active",   label:"Account Active", type:"toggle" },
    { key:"color",    label:"Avatar Color (hex)", placeholder:"#1a3c6e" },
  ];

  const handleSaveUser = (data) => {
    const updated = data.password ? data : { ...data };
    if (!updated.password) delete updated.password;
    else { /* keep password as-is */ }
    const existing = users.find(u => u.id === updated.id);
    if (existing && !updated.password) updated.password = existing.password;
    updated.avatar = initials(updated.name || "?");
    if (addMode) { persist([...users, updated]); setAddMode(false); }
    else { persist(users.map(u => u.id===updated.id ? updated : u)); }
    setEditing(null);
  };

  const toggleStatus = (id) => { persist(users.map(u => u.id===id ? { ...u, active:!u.active } : u)); };
  const deleteUser   = (id) => { persist(users.filter(u => u.id!==id)); setConfirm(null); };

  return (
    <div>
      {toast && <div style={{ position:"fixed", bottom:28, right:28, zIndex:9999, background:"#16a34a", color:"#fff", padding:"12px 22px", borderRadius:12, fontSize:13, fontWeight:700 }}>✅ User updated!</div>}
      {confirm && <ConfirmModal message={`Delete user "${confirm.name}"? This cannot be undone.`} onConfirm={()=>deleteUser(confirm.id)} onCancel={()=>setConfirm(null)} />}
      {(editing || addMode) && (
        <EditModal item={editing||newUser} fields={userFields} title={addMode?"Add New User":"Edit User"}
          onSave={handleSaveUser} onClose={()=>{ setEditing(null); setAddMode(false); }} />
      )}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:10 }}>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:"#1a1a2e" }}>Admin Users ({users.length})</div>
          <div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>Manage who can access the dashboard</div>
        </div>
        {isSuperAdmin && (
          <button onClick={()=>setAddMode(true)} style={{ ...S.saveBtn, background:"#16a34a" }}>+ Add User</button>
        )}
      </div>

      <div style={S.card}>
        {users.map((u, i) => (
          <div key={u.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom: i<users.length-1?"1px solid #f5f5f8":"none", flexWrap:"wrap", gap:12 }}>
            {/* Avatar */}
            <div style={{ width:44, height:44, borderRadius:14, background:u.color||"#1a3c6e", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14, flexShrink:0 }}>
              {initials(u.name)}
            </div>
            {/* Info */}
            <div style={{ flex:1, minWidth:160 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                <span style={{ fontWeight:700, fontSize:14, color:"#1a1a2e" }}>{u.name}</span>
                {u.id === auth?.id && <span style={{ fontSize:10, fontWeight:700, background:"rgba(26,60,110,0.1)", color:"#1a3c6e", padding:"2px 8px", borderRadius:20, border:"1px solid rgba(26,60,110,0.2)" }}>YOU</span>}
              </div>
              <div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>{u.email}</div>
              <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>Last login: {fmtDate(u.lastLogin)}</div>
            </div>
            {/* Badges */}
            <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
              <span style={S.roleBadge(u.role)}>{ROLE_LABELS[u.role]}</span>
              <span style={S.badge(u.active)}>{u.active?"Active":"Inactive"}</span>
            </div>
            {/* Actions — only super admin can edit others */}
            {isSuperAdmin && (
              <div style={{ display:"flex", gap:7, flexShrink:0 }}>
                <button onClick={()=>setEditing(u)} style={{ padding:"7px 14px", borderRadius:8, border:"1.5px solid #1a3c6e", background:"transparent", color:"#1a3c6e", fontSize:12, fontWeight:700, cursor:"pointer" }}>✏️ Edit</button>
                <button onClick={()=>toggleStatus(u.id)} style={{ padding:"7px 14px", borderRadius:8, border:`1.5px solid ${u.active?"#ea580c":"#16a34a"}`, background:"transparent", color:u.active?"#ea580c":"#16a34a", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                  {u.active?"Deactivate":"Activate"}
                </button>
                {u.id !== auth?.id && (
                  <button onClick={()=>setConfirm(u)} style={{ padding:"7px 14px", borderRadius:8, border:"1.5px solid #dc2626", background:"transparent", color:"#dc2626", fontSize:12, fontWeight:700, cursor:"pointer" }}>🗑️</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Role Permissions Reference */}
      <div style={S.card}>
        <div style={S.cardTitle}>🔑 Role Permissions</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {[
            { role:"super_admin", perms:["Full CMS Access","User Management","Create/Edit/Delete Users","Reset Content","All Sections"] },
            { role:"editor",      perms:["CMS Content Edit","Hero / Umrah / Cars / Visas","Section Visibility","Cannot manage users","Cannot delete content"] },
            { role:"viewer",      perms:["Read-only Dashboard","View Statistics","Cannot edit content","Cannot manage users","View Only"] },
          ].map(r => (
            <div key={r.role} style={{ padding:"14px 16px", borderRadius:12, border:`1px solid ${ROLE_COLORS[r.role]}30`, background:`${ROLE_COLORS[r.role]}06` }}>
              <div style={{ fontWeight:700, fontSize:13, color:ROLE_COLORS[r.role], marginBottom:10 }}>{ROLE_LABELS[r.role]}</div>
              {r.perms.map(p => <div key={p} style={{ fontSize:12, color:"#6b6880", marginBottom:5, display:"flex", gap:6 }}><span>•</span>{p}</div>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────
function SettingsTab({ content, setContent, auth, onLogout, onSave }) {
  const [resetConfirm, setResetConfirm] = useState(false);
  const [pwForm, setPwForm] = useState({ current:"", newPw:"", confirm:"" });
  const [pwMsg, setPwMsg] = useState("");

  const handlePwChange = () => {
    const users = getUsers();
    const me = users.find(u => u.id===auth?.id);
    if (!me || me.password !== pwForm.current) { setPwMsg("❌ Current password is incorrect."); return; }
    if (pwForm.newPw.length < 6) { setPwMsg("❌ New password must be at least 6 characters."); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwMsg("❌ Passwords do not match."); return; }
    saveUsers(users.map(u => u.id===auth.id ? { ...u, password:pwForm.newPw } : u));
    setPwForm({ current:"", newPw:"", confirm:"" });
    setPwMsg("✅ Password changed successfully!");
    setTimeout(()=>setPwMsg(""),3000);
  };

  return (
    <div>
      {resetConfirm && <ConfirmModal message="Reset ALL website content to default? This cannot be undone." onConfirm={()=>{ resetContent(); setContent(getContent()); setResetConfirm(false); onSave(); }} onCancel={()=>setResetConfirm(false)} />}

      {/* My Account */}
      <div style={S.card}>
        <div style={S.cardTitle}>👤 My Account</div>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
          <div style={{ width:56, height:56, borderRadius:18, background:auth?.color||"#1a3c6e", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:18 }}>{initials(auth?.name||"")}</div>
          <div>
            <div style={{ fontWeight:700, fontSize:16, color:"#1a1a2e" }}>{auth?.name}</div>
            <div style={{ fontSize:13, color:"#6b6880" }}>{auth?.email}</div>
            <span style={S.roleBadge(auth?.role||"viewer")}>{ROLE_LABELS[auth?.role]}</span>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div style={S.card}>
        <div style={S.cardTitle}>🔐 Change Password</div>
        <div style={{ display:"flex", flexDirection:"column", gap:12, maxWidth:400 }}>
          <Field label="Current Password"><Input value={pwForm.current} onChange={v=>setPwForm(p=>({...p,current:v}))} type="password" placeholder="Current password" /></Field>
          <Field label="New Password"><Input value={pwForm.newPw} onChange={v=>setPwForm(p=>({...p,newPw:v}))} type="password" placeholder="Min 6 characters" /></Field>
          <Field label="Confirm New Password"><Input value={pwForm.confirm} onChange={v=>setPwForm(p=>({...p,confirm:v}))} type="password" placeholder="Repeat new password" /></Field>
          {pwMsg && <div style={{ fontSize:13, color: pwMsg.startsWith("✅")?"#16a34a":"#dc2626", fontWeight:600 }}>{pwMsg}</div>}
          <button onClick={handlePwChange} style={{ ...S.saveBtn, alignSelf:"flex-start" }}>🔐 Update Password</button>
        </div>
      </div>

      {/* Danger Zone */}
      <div style={{ ...S.card, border:"1px solid rgba(239,68,68,0.3)", background:"rgba(239,68,68,0.02)" }}>
        <div style={{ ...S.cardTitle, color:"#dc2626" }}>⚠️ Danger Zone</div>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          {auth?.role==="super_admin" && (
            <button onClick={()=>setResetConfirm(true)} style={{ padding:"11px 22px", borderRadius:10, border:"1.5px solid #dc2626", background:"transparent", color:"#dc2626", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
              🔄 Reset All Content to Default
            </button>
          )}
          <button onClick={onLogout} style={{ padding:"11px 22px", borderRadius:10, border:"1.5px solid #ea580c", background:"transparent", color:"#ea580c", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
            🚪 Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Main ───────────────────────────────────────────────────────────
const TABS = [
  { section:"OVERVIEW",  items:[
    { key:"overview", icon:"📊", label:"Overview" },
  ]},
  { section:"CONTENT",   items:[
    { key:"sections", icon:"👁️", label:"Sections" },
    { key:"hero",     icon:"🏠", label:"Hero Section" },
    { key:"umrah",    icon:"🕌", label:"Umrah Packages" },
    { key:"cars",     icon:"🚗", label:"Car Rental" },
    { key:"visas",    icon:"🛂", label:"Visas" },
    { key:"other",    icon:"⚙️", label:"Reviews & CTA" },
  ]},
  { section:"ADMIN",     items:[
    { key:"users",    icon:"👥", label:"User Management" },
    { key:"settings", icon:"🔧", label:"Settings" },
  ]},
];

export default function Dashboard({ auth, onLogout }) {
  const [activeTab, setActiveTab]  = useState("overview");
  const [content,   setContent]    = useState(() => getContent());
  const [showToast, setShowToast]  = useState(false);
  const toastTimer = useRef(null);

  const handleSave = () => {
    saveContent(content);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setShowToast(true);
    toastTimer.current = setTimeout(() => setShowToast(false), 2500);
  };

  const tabProps = { content, setContent, onSave:handleSave, auth };

  const activeLabel = TABS.flatMap(s=>s.items).find(t=>t.key===activeTab)?.label || "";
  const activeIcon  = TABS.flatMap(s=>s.items).find(t=>t.key===activeTab)?.icon  || "";

  return (
    <>
      <Navbar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes toastIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @media(max-width:768px){
          .dash-sidebar { width:52px !important; }
          .dash-sidebar .sb-label { display:none !important; }
          .dash-sidebar .sb-section { display:none !important; }
          .dash-main { padding:16px !important; }
          .stat-grid { grid-template-columns:1fr 1fr !important; }
        }
      `}</style>
      <div style={S.page}>
        <div style={S.wrap}>

          {/* Sidebar */}
          <div style={S.sidebar} className="dash-sidebar">
            {/* User card */}
            <div style={{ padding:"16px", borderBottom:"1px solid rgba(255,255,255,0.08)", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:auth?.color||"#1a3c6e", border:"2px solid rgba(255,255,255,0.2)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:12, flexShrink:0 }}>
                  {initials(auth?.name||"A")}
                </div>
                <div className="sb-label" style={{ minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{auth?.name}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)", marginTop:1 }}>{ROLE_LABELS[auth?.role]}</div>
                </div>
              </div>
            </div>

            {/* Nav sections */}
            {TABS.map(sec => (
              <div key={sec.section}>
                <div style={S.sbSection} className="sb-section">{sec.section}</div>
                {sec.items.map(t => (
                  <div key={t.key} style={S.sbItem(activeTab===t.key)} onClick={()=>setActiveTab(t.key)} title={t.label}>
                    <span style={{ fontSize:16, flexShrink:0 }}>{t.icon}</span>
                    <span className="sb-label">{t.label}</span>
                  </div>
                ))}
              </div>
            ))}

            {/* Bottom actions */}
            <div style={S.sbBottom}>
              <button onClick={()=>window.location.hash=""} title="View Site"
                style={{ width:"100%", padding:"9px 12px", borderRadius:10, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.7)", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", marginBottom:7, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <span>🏠</span> <span className="sb-label">View Site</span>
              </button>
              <button onClick={onLogout} title="Sign Out"
                style={{ width:"100%", padding:"9px 12px", borderRadius:10, background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.25)", color:"#fca5a5", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <span>🚪</span> <span className="sb-label">Sign Out</span>
              </button>
            </div>
          </div>

          {/* Main */}
          <div style={S.main} className="dash-main">
            {/* Page header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, flexWrap:"wrap", gap:12 }}>
              <div>
                <h1 style={{ fontSize:20, fontWeight:700, color:"#1a1a2e", margin:"0 0 4px" }}>{activeIcon} {activeLabel}</h1>
                <p style={{ fontSize:12, color:"#9ca3af", margin:0 }}>Edafay CMS — changes save live to the website</p>
              </div>
              {!["overview","users","settings"].includes(activeTab) && (
                <button style={S.saveBtn} onClick={handleSave}>💾 Save Now</button>
              )}
            </div>

            {activeTab==="overview" && <OverviewTab  {...tabProps} />}
            {activeTab==="sections" && <SectionsTab  {...tabProps} />}
            {activeTab==="hero"     && <HeroTab       {...tabProps} />}
            {activeTab==="umrah"    && <UmrahTab      {...tabProps} />}
            {activeTab==="cars"     && <CarsTab       {...tabProps} />}
            {activeTab==="visas"    && <VisasTab      {...tabProps} />}
            {activeTab==="other"    && <OtherTab      {...tabProps} />}
            {activeTab==="users"    && <UserMgmtTab   {...tabProps} />}
            {activeTab==="settings" && <SettingsTab   {...tabProps} onLogout={onLogout} />}
          </div>
        </div>
      </div>
      <SaveToast show={showToast} />
    </>
  );
}