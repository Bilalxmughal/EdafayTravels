// ─── Dashboard.jsx — Edafay CMS 2026 ────────────────────────────────────────
import { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import { getContent, saveContent, resetContent, EVENT_NAME, DEFAULTS } from "./contentStore.js";
import { getAuth, clearAuth, ROLE_LABELS, ROLE_COLORS } from "./Auth.jsx";
import { getUsers, saveUser, deleteUser } from "./services/authService.js";
import { getInquiries, updateInquiry, addComment, CATEGORIES, STATUSES, PRIORITIES, INQUIRY_EVENT } from "./inquiryStore.js";
import { getJobs, addJob, updateJob, deleteJob, getApplications, updateApplication, APP_STATUSES, JOB_EV } from "./jobStore.js";
import { getBlogPosts, saveBlogPost, deleteBlogPost, BLOG_EV } from "./blogStore.js";
import theme from "./theme.js";

const fmtDate      = (iso) => { if (!iso) return "Never"; const d = new Date(iso); return d.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})+" "+d.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}); };
const fmtDateShort = (iso) => { if (!iso) return "—"; return new Date(iso).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}); };
const initials     = (name="") => name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)||"?";
const pct          = (v,t) => t ? Math.round(v/t*100) : 0;

// ─── SVG Icon System ──────────────────────────────────────────────────────────
const Icon = ({ d, size=16, stroke="#current", fill="none", sw=1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p,i)=><path key={i} d={p}/>) : <path d={d}/>}
  </svg>
);
const IC = {
  overview:   ["M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"],
  umrah:      ["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z","M9 22V12h6v10"],
  car:        ["M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v5m-4 6h-6m8 0a2 2 0 100-4 2 2 0 000 4zm-8 0a2 2 0 100-4 2 2 0 000 4z"],
  visa:       ["M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"],
  flight:     "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064",
  insurance:  ["M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"],
  content:    ["M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"],
  visibility: ["M15 12a3 3 0 11-6 0 3 3 0 016 0z","M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"],
  blog:       ["M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"],
  jobs:       ["M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"],
  users:      ["M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"],
  settings:   ["M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z","M15 12a3 3 0 11-6 0 3 3 0 016 0z"],
  home:       ["M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"],
  logout:     ["M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"],
  back:       "M10 19l-7-7m0 0l7-7m-7 7h18",
  save:       ["M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"],
  add:        "M12 4v16m8-8H4",
  edit:       ["M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"],
  trash:      ["M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"],
  eye:        ["M15 12a3 3 0 11-6 0 3 3 0 016 0z","M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"],
  ticket:     ["M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"],
  chart:      ["M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"],
  comment:    ["M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"],
  check:      "M5 13l4 4L19 7",
  warn:       ["M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"],
  img:        ["M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"],
  lock:       ["M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"],
  refresh:    "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
};

// ─── Base styles ──────────────────────────────────────────────────────────────
const inputCss  = {width:"100%",padding:"10px 14px",border:"1.5px solid #e2e4ea",borderRadius:10,fontSize:13,color:"#1a1a2e",outline:"none",fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box",transition:"border 0.2s,box-shadow 0.2s",background:"#fff"};
const cardCss   = {background:"#fff",borderRadius:16,border:"1px solid #eaecf2",padding:"22px 26px",marginBottom:20,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"};
const btnPrimary= {background:"#1a3c6e",color:"#fff",border:"none",padding:"10px 22px",borderRadius:10,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"inline-flex",alignItems:"center",gap:7,transition:"all 0.2s"};
const btnOutline= (color="#1a3c6e")=>({background:"transparent",color,border:`1.5px solid ${color}`,padding:"7px 14px",borderRadius:9,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"inline-flex",alignItems:"center",gap:6,transition:"all 0.18s"});

// ─── Micro UI components ──────────────────────────────────────────────────────
function FInput({value,onChange,placeholder,type="text",style={}}) {
  return <input style={{...inputCss,...style}} value={value||""} type={type} placeholder={placeholder} onChange={e=>onChange(e.target.value)}
    onFocus={e=>{e.target.style.borderColor="#1a3c6e";e.target.style.boxShadow="0 0 0 3px rgba(26,60,110,0.09)";}}
    onBlur={e=>{e.target.style.borderColor="#e2e4ea";e.target.style.boxShadow="none";}}/>;
}
function FField({label,children}) {
  return <div><label style={{display:"block",fontSize:11,fontWeight:700,color:"#8b90a0",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.7px"}}>{label}</label>{children}</div>;
}
function ImgInput({value,onChange,label}) {
  return <div><label style={{display:"block",fontSize:11,fontWeight:700,color:"#8b90a0",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.7px"}}>{label||"Image URL"}</label>
    <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
      <input style={{...inputCss,flex:1}} value={value||""} placeholder="https://..." onChange={e=>onChange(e.target.value)}
        onFocus={e=>{e.target.style.borderColor="#1a3c6e";e.target.style.boxShadow="0 0 0 3px rgba(26,60,110,0.09)";}}
        onBlur={e=>{e.target.style.borderColor="#e2e4ea";e.target.style.boxShadow="none";}}/>
      {value&&<img src={value} alt="" onError={e=>e.target.style.display="none"} style={{width:52,height:44,borderRadius:9,objectFit:"cover",flexShrink:0,border:"1px solid #eaecf2"}}/>}
    </div></div>;
}
function Toggle({checked,onChange,label,inline}) {
  const knob=<div onClick={()=>onChange(!checked)} style={{width:40,height:22,borderRadius:11,background:checked?"#1a3c6e":"#d4d8e2",cursor:"pointer",position:"relative",transition:"background 0.25s",flexShrink:0,boxShadow:"inset 0 1px 3px rgba(0,0,0,0.1)"}}>
    <div style={{position:"absolute",top:3,left:checked?21:3,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left 0.25s",boxShadow:"0 1px 4px rgba(0,0,0,0.18)"}}/></div>;
  if(inline) return <div style={{display:"flex",alignItems:"center",gap:10}}>{knob}<span style={{fontSize:13,fontWeight:600,color:"#1a1a2e"}}>{label}</span></div>;
  return <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid #f3f4f8"}}><span style={{fontSize:13,fontWeight:600,color:"#1a1a2e"}}>{label}</span>{knob}</div>;
}

// ─── Stat Card with bar ───────────────────────────────────────────────────────
function StatCard({label,value,color,total,showBar=true}) {
  const p = total ? pct(value,total) : null;
  return (
    <div style={{background:"#fff",borderRadius:16,border:"1px solid #eaecf2",padding:"20px 22px",position:"relative",overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:color,borderRadius:"16px 16px 0 0"}}/>
      <div style={{fontSize:11,color:"#8b90a0",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:10}}>{label}</div>
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:8}}>
        <div style={{fontSize:38,fontWeight:800,color,fontFamily:"'Playfair Display',serif",lineHeight:1}}>{value}</div>
        {p!==null&&<div style={{marginBottom:4,textAlign:"right"}}>
          <div style={{fontSize:15,fontWeight:800,color}}>{p}%</div>
          <div style={{fontSize:10,color:"#b0b4c0",marginTop:1}}>of total</div>
        </div>}
      </div>
      {showBar&&p!==null&&<div style={{marginTop:14,height:5,background:"#f0f1f6",borderRadius:99,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${p}%`,background:color,borderRadius:99,transition:"width 0.7s cubic-bezier(.4,0,.2,1)"}}/>
      </div>}
    </div>
  );
}

function SaveToast({show}) {
  if(!show) return null;
  return <div style={{position:"fixed",bottom:28,right:28,zIndex:9999,background:"#1a3c6e",color:"#fff",padding:"13px 22px",borderRadius:14,fontSize:13,fontWeight:700,boxShadow:"0 8px 32px rgba(26,60,110,0.35)",display:"flex",alignItems:"center",gap:9,animation:"dashToast 0.3s ease"}}>
    <Icon d={IC.check} size={16} stroke="#fff" sw={2.5}/> Saved & live on website!
  </div>;
}
function ConfirmModal({msg,onOk,onCancel}) {
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
    <div style={{background:"#fff",borderRadius:20,padding:"32px 36px",maxWidth:380,width:"90%",textAlign:"center",boxShadow:"0 24px 64px rgba(0,0,0,0.18)"}}>
      <div style={{width:52,height:52,borderRadius:16,background:"rgba(239,68,68,0.08)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
        <Icon d={IC.warn} size={24} stroke="#dc2626" sw={2}/>
      </div>
      <p style={{fontSize:14,color:"#1a1a2e",lineHeight:1.75,marginBottom:24}}>{msg}</p>
      <div style={{display:"flex",gap:10,justifyContent:"center"}}>
        <button onClick={onCancel} style={{...btnOutline(),padding:"10px 24px"}}>Cancel</button>
        <button onClick={onOk} style={{...btnPrimary,background:"#dc2626",padding:"10px 24px"}}>Confirm</button>
      </div>
    </div></div>;
}
function EditModal({item,fields,title,onSave,onClose}) {
  const [data,setData]=useState({...item});
  const set=(k,v)=>setData(p=>({...p,[k]:v}));
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(4px)"}}>
    <div style={{background:"#fff",borderRadius:20,padding:"28px 32px",width:"100%",maxWidth:560,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,0.18)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,paddingBottom:14,borderBottom:"1px solid #f3f4f8"}}>
        <h3 style={{fontSize:16,fontWeight:700,color:"#1a1a2e",margin:0}}>{title}</h3>
        <button onClick={onClose} style={{background:"#f5f6fa",border:"none",borderRadius:8,width:30,height:30,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#6b6880"}}>✕</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {fields.map(f=>{
          if(f.type==="image") return <ImgInput key={f.key} label={f.label} value={data[f.key]} onChange={v=>set(f.key,v)}/>;
          if(f.type==="toggle") return <div key={f.key}><label style={{display:"block",fontSize:11,fontWeight:700,color:"#8b90a0",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.7px"}}>{f.label}</label><Toggle inline checked={!!data[f.key]} onChange={v=>set(f.key,v)} label={data[f.key]?"Yes":"No"}/></div>;
          if(f.type==="select") return <div key={f.key}><label style={{display:"block",fontSize:11,fontWeight:700,color:"#8b90a0",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.7px"}}>{f.label}</label><select style={{...inputCss,appearance:"none",cursor:"pointer"}} value={data[f.key]||""} onChange={e=>set(f.key,e.target.value)} onFocus={e=>e.target.style.borderColor="#1a3c6e"} onBlur={e=>e.target.style.borderColor="#e2e4ea"}>{f.options.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select></div>;
          return <FField key={f.key} label={f.label}><FInput value={data[f.key]} onChange={v=>set(f.key,v)} placeholder={f.placeholder||""}/></FField>;
        })}
      </div>
      <div style={{display:"flex",gap:10,marginTop:22,paddingTop:16,borderTop:"1px solid #f3f4f8"}}>
        <button onClick={()=>onSave(data)} style={{...btnPrimary,flex:1,padding:"12px",justifyContent:"center"}}><Icon d={IC.save} size={15} stroke="#fff"/> Save Changes</button>
        <button onClick={onClose} style={{...btnOutline(),padding:"12px 20px"}}>Cancel</button>
      </div>
    </div></div>;
}
function ItemList({items,fields,editTitle,onUpdate,renderPrev,renderInfo}) {
  const [editing,setEditing]=useState(null);
  return <div>
    {items.map((it,i)=>(
      <div key={it.id} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",background:i%2===0?"#fafbff":"#fff",border:"1px solid #f0f1f6",borderRadius:12,marginBottom:7}}>
        {renderPrev&&renderPrev(it)}
        <div style={{flex:1,minWidth:0}}>{renderInfo(it)}</div>
        <button onClick={()=>setEditing(it)} style={btnOutline()}><Icon d={IC.edit} size={13} stroke="#1a3c6e"/> Edit</button>
      </div>
    ))}
    {editing&&<EditModal item={editing} fields={fields} title={editTitle} onSave={d=>{onUpdate(items.map(it=>it.id===d.id?d:it));setEditing(null);}} onClose={()=>setEditing(null)}/>}
  </div>;
}

// ─── Badges ───────────────────────────────────────────────────────────────────
const dot = (color) => <span style={{width:6,height:6,borderRadius:"50%",background:color,display:"inline-block",flexShrink:0}}/>;
function StatusBadge({status}) {
  const s=STATUSES[status]||STATUSES.open;
  return <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:s.bg,color:s.color,border:`1px solid ${s.color}35`}}>{dot(s.color)}{s.label}</span>;
}
function PrioBadge({priority}) {
  const p=PRIORITIES[priority]||PRIORITIES.medium;
  return <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:`${p.color}10`,color:p.color,border:`1px solid ${p.color}30`}}>{p.label}</span>;
}
function CatBadge({category}) {
  const c=CATEGORIES[category]||{label:category,color:"#666"};
  return <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:`${c.color}10`,color:c.color,border:`1px solid ${c.color}25`}}>{c.label}</span>;
}


// ─── TICKET DETAIL ────────────────────────────────────────────────────────────
function TicketDetail({ticket,auth,onBack,onChange}) {
  const [comment,setComment]=useState("");
  const [status,setStatus]=useState(ticket.status);
  const [priority,setPriority]=useState(ticket.priority);
  const [assigned,setAssigned]=useState(ticket.assignedTo||"");
  const users=getUsers();
  const save=()=>{ updateInquiry(ticket.id,{status,priority,assignedTo:assigned||null}); onChange(); };
  const submitComment=()=>{ if(!comment.trim()) return; addComment(ticket.id,auth?.name||"Admin",comment.trim()); setComment(""); onChange(); };
  const formRows=Object.entries(ticket.form||{}).filter(([k])=>k!=="notes"&&k!=="message");
  const noteVal=ticket.form?.notes||ticket.form?.message||"";
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24,flexWrap:"wrap"}}>
        <button onClick={onBack} style={{...btnOutline(),gap:6}}><Icon d={IC.back} size={14} stroke="#1a3c6e"/> Back</button>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            <span style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#1a1a2e"}}>{ticket.id}</span>
            <CatBadge category={ticket.category}/><StatusBadge status={status}/><PrioBadge priority={priority}/>
          </div>
          <div style={{fontSize:12,color:"#9ca3af",marginTop:4}}>Created: {fmtDate(ticket.createdAt)} · Customer: <strong style={{color:"#1a1a2e"}}>{ticket.form?.name||"—"}</strong></div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:20,alignItems:"start"}}>
        <div>
          <div style={cardCss}>
            <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f3f4f8",display:"flex",alignItems:"center",gap:8}}><Icon d={IC.ticket} size={15} stroke="#1a3c6e"/> Inquiry Details</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {formRows.map(([k,v])=>(
                <div key={k} style={{padding:"10px 14px",background:"#fafbff",borderRadius:10,border:"1px solid #eaecf2"}}>
                  <div style={{fontSize:10,color:"#9ca3af",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:3}}>{k.replace(/([A-Z])/g," $1")}</div>
                  <div style={{fontSize:13,fontWeight:600,color:"#1a1a2e"}}>{String(v)||"—"}</div>
                </div>
              ))}
            </div>
            {noteVal&&<div style={{marginTop:12,padding:"12px 14px",background:"rgba(26,60,110,0.04)",borderRadius:10,border:"1px solid rgba(26,60,110,0.1)"}}>
              <div style={{fontSize:10,color:"#9ca3af",fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Special Requirements</div>
              <div style={{fontSize:13,color:"#1a1a2e",lineHeight:1.65}}>{noteVal}</div>
            </div>}
          </div>
          <div style={cardCss}>
            <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f3f4f8",display:"flex",alignItems:"center",gap:8}}><Icon d={IC.comment} size={15} stroke="#1a3c6e"/> Comments & Activity ({ticket.comments?.length||0})</div>
            {(!ticket.comments||ticket.comments.length===0)&&<div style={{textAlign:"center",padding:"24px 0",color:"#9ca3af",fontSize:13}}>No comments yet — add the first one below.</div>}
            {ticket.comments?.map(c=>(
              <div key={c.id} style={{display:"flex",gap:10,marginBottom:16}}>
                <div style={{width:34,height:34,borderRadius:10,background:"#1a3c6e",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,flexShrink:0}}>{initials(c.author)}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}><span style={{fontWeight:700,fontSize:13,color:"#1a1a2e"}}>{c.author}</span><span style={{fontSize:11,color:"#9ca3af"}}>{fmtDate(c.time)}</span></div>
                  <div style={{fontSize:13,color:"#374151",lineHeight:1.65,background:"#f9fafb",padding:"10px 14px",borderRadius:10,border:"1px solid #f0f1f6"}}>{c.text}</div>
                </div>
              </div>
            ))}
            <div style={{display:"flex",gap:10,marginTop:16,paddingTop:14,borderTop:"1px solid #f3f4f8"}}>
              <div style={{width:34,height:34,borderRadius:10,background:auth?.color||"#1a3c6e",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,flexShrink:0}}>{initials(auth?.name||"A")}</div>
              <div style={{flex:1}}>
                <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Write a comment..." rows={3}
                  style={{...inputCss,resize:"none",lineHeight:1.6}} onFocus={e=>e.target.style.borderColor="#1a3c6e"} onBlur={e=>e.target.style.borderColor="#e2e4ea"}/>
                <button onClick={submitComment} disabled={!comment.trim()} style={{...btnPrimary,marginTop:8,opacity:comment.trim()?1:0.5}}><Icon d={IC.comment} size={13} stroke="#fff"/> Post Comment</button>
              </div>
            </div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{...cardCss,marginBottom:0}}>
            <div style={{fontSize:13,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f3f4f8",display:"flex",alignItems:"center",gap:7}}><Icon d={IC.settings} size={14} stroke="#1a3c6e"/> Manage Ticket</div>
            <div style={{display:"flex",flexDirection:"column",gap:11}}>
              <FField label="Status"><select style={{...inputCss,appearance:"none",cursor:"pointer"}} value={status} onChange={e=>setStatus(e.target.value)} onFocus={e=>e.target.style.borderColor="#1a3c6e"} onBlur={e=>e.target.style.borderColor="#e2e4ea"}>{Object.entries(STATUSES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></FField>
              <FField label="Priority"><select style={{...inputCss,appearance:"none",cursor:"pointer"}} value={priority} onChange={e=>setPriority(e.target.value)} onFocus={e=>e.target.style.borderColor="#1a3c6e"} onBlur={e=>e.target.style.borderColor="#e2e4ea"}>{Object.entries(PRIORITIES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></FField>
              <FField label="Assign To"><select style={{...inputCss,appearance:"none",cursor:"pointer"}} value={assigned} onChange={e=>setAssigned(e.target.value)} onFocus={e=>e.target.style.borderColor="#1a3c6e"} onBlur={e=>e.target.style.borderColor="#e2e4ea"}><option value="">— Unassigned —</option>{users.filter(u=>u.active).map(u=><option key={u.email} value={u.email}>{u.name} ({ROLE_LABELS[u.role]})</option>)}</select></FField>
              <button onClick={save} style={{...btnPrimary,width:"100%",justifyContent:"center",padding:"11px"}}><Icon d={IC.save} size={14} stroke="#fff"/> Update Ticket</button>
            </div>
          </div>
          <div style={{...cardCss,marginBottom:0}}>
            <div style={{fontSize:13,fontWeight:700,color:"#1a1a2e",marginBottom:12,display:"flex",alignItems:"center",gap:7}}><Icon d={IC.ticket} size={14} stroke="#1a3c6e"/> Ticket Info</div>
            {[["ID",ticket.id],["Category",CATEGORIES[ticket.category]?.label||ticket.category],["Created",fmtDateShort(ticket.createdAt)],["Comments",ticket.comments?.length||0],["Assigned",users.find(u=>u.email===ticket.assignedTo)?.name||"Unassigned"]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f3f4f8",fontSize:13}}>
                <span style={{color:"#9ca3af",fontWeight:600}}>{k}</span><span style={{color:"#1a1a2e",fontWeight:700}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── INQUIRY TAB ──────────────────────────────────────────────────────────────
function InquiryTab({category,auth}) {
  const [tickets,setTickets]=useState(()=>getInquiries().filter(t=>t.category===category));
  const [detail,setDetail]=useState(null);
  const [filter,setFilter]=useState("all");
  const [search,setSearch]=useState("");
  useEffect(()=>{ const h=()=>setTickets(getInquiries().filter(t=>t.category===category)); window.addEventListener("edafay_inquiries_updated",h); return ()=>window.removeEventListener("edafay_inquiries_updated",h); },[category]);
  const refresh=()=>setTickets(getInquiries().filter(t=>t.category===category));
  const shown=tickets.filter(t=>{ if(filter!=="all"&&t.status!==filter) return false; if(search){ const q=search.toLowerCase(); return t.id.toLowerCase().includes(q)||(t.form?.name||"").toLowerCase().includes(q)||(t.form?.phone||"").toLowerCase().includes(q); } return true; });
  const counts={total:tickets.length,open:tickets.filter(t=>t.status==="open").length,in_progress:tickets.filter(t=>t.status==="in_progress").length,closed:tickets.filter(t=>t.status==="closed").length};
  if(detail) return <TicketDetail ticket={getInquiries().find(t=>t.id===detail)||tickets.find(t=>t.id===detail)||detail} auth={auth} onBack={()=>{setDetail(null);refresh();}} onChange={refresh}/>;
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
        <StatCard label="Total"       value={counts.total}       color="#1a3c6e" total={null}         showBar={false}/>
        <StatCard label="Open"        value={counts.open}        color="#dc2626" total={counts.total}/>
        <StatCard label="In Progress" value={counts.in_progress} color="#ea580c" total={counts.total}/>
        <StatCard label="Closed"      value={counts.closed}      color="#16a34a" total={counts.total}/>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{position:"relative",flex:1,maxWidth:300}}>
          <input style={{...inputCss,paddingLeft:36}} placeholder="Search name, phone, ID..." value={search} onChange={e=>setSearch(e.target.value)} onFocus={e=>e.target.style.borderColor="#1a3c6e"} onBlur={e=>e.target.style.borderColor="#e2e4ea"}/>
          <div style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:"#9ca3af"}}><Icon d={IC.eye} size={15} stroke="#9ca3af"/></div>
        </div>
        {["all","open","in_progress","closed"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{...btnOutline(filter===f?"#1a3c6e":"#9ca3af"),background:filter===f?"rgba(26,60,110,0.07)":"#fff",padding:"8px 16px",fontSize:12}}>
            {f==="all"?"All":f==="in_progress"?"In Progress":f.charAt(0).toUpperCase()+f.slice(1)} ({f==="all"?counts.total:counts[f]||0})
          </button>
        ))}
      </div>
      <div style={{background:"#fff",borderRadius:16,border:"1px solid #eaecf2",overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"90px 1fr 120px 110px 100px 110px 80px",padding:"11px 16px",background:"#f8f9fc",borderBottom:"1px solid #eaecf2",fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.7px"}}>
          {["Ticket ID","Customer","Date","Status","Priority","Assigned",""].map((h,i)=><div key={i}>{h}</div>)}
        </div>
        {shown.length===0&&<div style={{textAlign:"center",padding:"48px",color:"#9ca3af",fontSize:14}}>No tickets found.</div>}
        {shown.map((t,i)=>{ const users=getUsers(); const assignee=users.find(u=>u.email===t.assignedTo); return (
          <div key={t.id} style={{display:"grid",gridTemplateColumns:"90px 1fr 120px 110px 100px 110px 80px",padding:"12px 16px",borderBottom:i<shown.length-1?"1px solid #f3f4f8":"none",alignItems:"center",transition:"background 0.15s",cursor:"pointer"}}
            onMouseEnter={e=>e.currentTarget.style.background="#fafbff"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{fontWeight:700,fontSize:12,color:"#1a3c6e"}}>{t.id}</div>
            <div><div style={{fontWeight:600,fontSize:13,color:"#1a1a2e"}}>{t.form?.name||"—"}</div><div style={{fontSize:11,color:"#9ca3af"}}>{t.form?.phone||t.form?.email||"—"}</div></div>
            <div style={{fontSize:12,color:"#6b6880"}}>{fmtDateShort(t.createdAt)}</div>
            <div><StatusBadge status={t.status}/></div>
            <div><PrioBadge priority={t.priority}/></div>
            <div style={{fontSize:12,color:"#6b6880"}}>{assignee?<span style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:22,height:22,borderRadius:6,background:assignee.color||"#1a3c6e",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700}}>{initials(assignee.name)}</div>{assignee.name.split(" ")[0]}</span>:"—"}</div>
            <div><button onClick={()=>setDetail(t.id)} style={{...btnOutline(),padding:"5px 12px",fontSize:11}}>View</button></div>
          </div>
        );})}
      </div>
    </div>
  );
}


// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────
function OverviewTab({content,auth}) {
  const [tickets,setTickets]=useState(()=>getInquiries());
  useEffect(()=>{ const h=()=>setTickets(getInquiries()); window.addEventListener("edafay_inquiries_updated",h); return ()=>window.removeEventListener("edafay_inquiries_updated",h); },[]);
  const users=getUsers();
  const total=tickets.length, open=tickets.filter(t=>t.status==="open").length, inprog=tickets.filter(t=>t.status==="in_progress").length, closed=tickets.filter(t=>t.status==="closed").length;
  const resolveRate=pct(closed,total);
  const catStats=Object.entries(CATEGORIES).map(([k,v])=>{ const ct=tickets.filter(t=>t.category===k); return {key:k,...v,total:ct.length,open:ct.filter(t=>t.status==="open").length,closed:ct.filter(t=>t.status==="closed").length}; });
  const recent=tickets.slice(0,6);
  return (
    <div>
      {/* Welcome */}
      <div style={{background:"linear-gradient(135deg,#0f1f3d 0%,#1a3c6e 60%,#1e4d8c 100%)",borderRadius:18,padding:"24px 28px",marginBottom:24,color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,0.04)",pointerEvents:"none"}}/>
        <div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.8px"}}>Welcome back</div>
          <div style={{fontSize:22,fontWeight:700,fontFamily:"'Playfair Display',serif"}}>{auth?.name} <span style={{color:"rgba(255,255,255,0.45)",fontSize:15,fontWeight:400}}>({ROLE_LABELS[auth?.role]})</span></div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:3}}>Last login: {fmtDate(auth?.lastLogin)}</div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          {/* Overall resolve rate */}
          <div style={{background:"rgba(255,255,255,0.1)",borderRadius:14,padding:"14px 20px",border:"1px solid rgba(255,255,255,0.15)",textAlign:"center"}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.55)",textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:4}}>Overall Resolve Rate</div>
            <div style={{fontSize:28,fontWeight:800,color:"#fff",fontFamily:"'Playfair Display',serif"}}>{resolveRate}%</div>
            <div style={{marginTop:8,height:4,background:"rgba(255,255,255,0.15)",borderRadius:99}}>
              <div style={{height:"100%",width:`${resolveRate}%`,background:"#4ade80",borderRadius:99,transition:"width 0.7s ease"}}/>
            </div>
          </div>
          <button onClick={()=>{window.location.hash="";}} style={{...btnOutline(),background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",color:"#fff",padding:"9px 18px",gap:6}}>
            <Icon d={IC.home} size={14} stroke="#fff"/> View Site
          </button>
        </div>
      </div>

      {/* Main stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}} className="stat-grid">
        <StatCard label="Total Inquiries" value={total}  color="#1a3c6e" total={null}  showBar={false}/>
        <StatCard label="Open"            value={open}   color="#dc2626" total={total}/>
        <StatCard label="In Progress"     value={inprog} color="#ea580c" total={total}/>
        <StatCard label="Closed"          value={closed} color="#16a34a" total={total}/>
      </div>

      {/* Per category */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:24}} className="cat-grid">
        {catStats.map(c=>{
          const rr=pct(c.closed,c.total);
          return (
            <div key={c.key} style={{background:"#fff",borderRadius:16,border:`1px solid ${c.color}20`,padding:"16px 18px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:c.color}}/>
              <div style={{fontSize:11,fontWeight:700,color:c.color,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.7px"}}>{c.label}</div>
              <div style={{fontSize:28,fontWeight:800,color:"#1a1a2e",fontFamily:"'Playfair Display',serif",lineHeight:1,marginBottom:8}}>{c.total}</div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#9ca3af",marginBottom:8}}>
                <span style={{color:"#dc2626",fontWeight:600}}>{c.open} open</span>
                <span style={{color:c.color,fontWeight:700}}>{rr}% resolved</span>
              </div>
              <div style={{height:4,background:"#f0f1f6",borderRadius:99,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${rr}%`,background:c.color,borderRadius:99}}/>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        {/* Recent tickets */}
        <div style={cardCss}>
          <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f3f4f8",display:"flex",alignItems:"center",gap:8}}><Icon d={IC.ticket} size={15} stroke="#1a3c6e"/> Recent Tickets</div>
          {recent.map(t=>(
            <div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid #f3f4f8"}}>
              <div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontWeight:700,fontSize:12,color:"#1a3c6e"}}>{t.id}</span><CatBadge category={t.category}/></div>
                <div style={{fontSize:12,color:"#6b6880",marginTop:2}}>{t.form?.name||"—"} · {fmtDateShort(t.createdAt)}</div>
              </div>
              <StatusBadge status={t.status}/>
            </div>
          ))}
        </div>

        {/* Team workload with resolve ratio */}
        <div style={cardCss}>
          <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f3f4f8",display:"flex",alignItems:"center",gap:8}}><Icon d={IC.users} size={15} stroke="#1a3c6e"/> Team Workload & Resolve Rate</div>
          {users.filter(u=>u.active).map(u=>{
            const assigned=tickets.filter(t=>t.assignedTo===u.email);
            const openCount=assigned.filter(t=>t.status!=="closed").length;
            const closedCount=assigned.filter(t=>t.status==="closed").length;
            const userResolve=pct(closedCount,assigned.length);
            return (
              <div key={u.id} style={{padding:"10px 0",borderBottom:"1px solid #f3f4f8"}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
                  <div style={{width:34,height:34,borderRadius:10,background:u.color||"#1a3c6e",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,flexShrink:0}}>{initials(u.name)}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:13,color:"#1a1a2e"}}>{u.name}</div>
                    <div style={{fontSize:11,color:"#9ca3af"}}>{ROLE_LABELS[u.role]}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:15,fontWeight:800,color:"#1a3c6e",fontFamily:"'Playfair Display',serif"}}>{assigned.length}</div>
                    <div style={{fontSize:10,color:"#9ca3af"}}>assigned</div>
                  </div>
                  {openCount>0&&<span style={{fontSize:10,fontWeight:700,background:"rgba(239,68,68,0.09)",color:"#dc2626",padding:"2px 8px",borderRadius:20,border:"1px solid rgba(239,68,68,0.2)"}}>{openCount} open</span>}
                </div>
                {assigned.length>0&&<div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#9ca3af",marginBottom:4}}>
                    <span>Resolve rate</span><span style={{fontWeight:700,color:userResolve>=70?"#16a34a":userResolve>=40?"#ea580c":"#dc2626"}}>{userResolve}%</span>
                  </div>
                  <div style={{height:4,background:"#f0f1f6",borderRadius:99,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${userResolve}%`,background:userResolve>=70?"#16a34a":userResolve>=40?"#ea580c":"#dc2626",borderRadius:99,transition:"width 0.7s ease"}}/>
                  </div>
                </div>}
              </div>
            );
          })}
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"9px 0"}}>
            <div style={{width:34,height:34,borderRadius:10,background:"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon d={IC.users} size={14} stroke="#9ca3af"/></div>
            <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:"#6b6880"}}>Unassigned</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:15,fontWeight:800,color:"#9ca3af",fontFamily:"'Playfair Display',serif"}}>{tickets.filter(t=>!t.assignedTo).length}</div><div style={{fontSize:10,color:"#9ca3af"}}>tickets</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── CONTENT TAB ─────────────────────────────────────────────────────────────
function ContentTab({content,setContent,onSave}) {
  const [section,setSection]=useState("hero");
  const h=content.hero,us=content.umrahSection,cs=content.carsSection,vs=content.visaSection,rv=content.reviewsSection,ct=content.ctaSection;
  const updH=(k,v)=>setContent(p=>({...p,hero:{...p.hero,[k]:v}}));
  const updUs=(k,v)=>setContent(p=>({...p,umrahSection:{...p.umrahSection,[k]:v}}));
  const updCs=(k,v)=>setContent(p=>({...p,carsSection:{...p.carsSection,[k]:v}}));
  const updVs=(k,v)=>setContent(p=>({...p,visaSection:{...p.visaSection,[k]:v}}));
  const updRv=(k,v)=>setContent(p=>({...p,reviewsSection:{...p.reviewsSection,[k]:v}}));
  const updCt=(k,v)=>setContent(p=>({...p,ctaSection:{...p.ctaSection,[k]:v}}));
  const secs=[{k:"hero",i:IC.home,l:"Hero"},{k:"umrah",i:IC.umrah,l:"Umrah"},{k:"cars",i:IC.car,l:"Cars"},{k:"visas",i:IC.visa,l:"Visas"},{k:"reviews",i:IC.chart,l:"Reviews"},{k:"cta",i:IC.comment,l:"CTA"}];
  const umrahFields=[{key:"name",label:"Package Name"},{key:"category",label:"Category"},{key:"price",label:"Price",placeholder:"PKR 0,000"},{key:"days",label:"Duration",placeholder:"14 Days"},{key:"tag",label:"Tag / Badge"},{key:"rating",label:"Rating",placeholder:"4.9"},{key:"reviews",label:"Review Count"},{key:"img",label:"Image",type:"image"}];
  const carFields=[{key:"name",label:"Car Name"},{key:"company",label:"Company"},{key:"type",label:"Type"},{key:"seats",label:"Seats"},{key:"price",label:"Price/Day",placeholder:"PKR 0,000"},{key:"tag",label:"Tag"},{key:"available",label:"Available",type:"toggle"},{key:"img",label:"Image",type:"image"}];
  const visaFields=[{key:"country",label:"Country"},{key:"flag",label:"Flag Emoji",placeholder:"🇵🇰"},{key:"type",label:"Visa Type"},{key:"processing",label:"Processing"},{key:"fee",label:"Fee",placeholder:"PKR 8,500"},{key:"approvalRate",label:"Approval Rate",placeholder:"99%"},{key:"img",label:"Image",type:"image"}];
  return (
    <div>
      <div style={{display:"flex",gap:6,marginBottom:24,flexWrap:"wrap",alignItems:"center"}}>
        {secs.map(s=>(
          <button key={s.k} onClick={()=>setSection(s.k)} style={{...btnOutline(section===s.k?"#1a3c6e":"#9ca3af"),background:section===s.k?"rgba(26,60,110,0.07)":"#fff",padding:"8px 18px",gap:7}}>
            <Icon d={s.i} size={13} stroke={section===s.k?"#1a3c6e":"#9ca3af"}/> {s.l}
          </button>
        ))}
        <button onClick={onSave} style={{...btnPrimary,marginLeft:"auto"}}><Icon d={IC.save} size={14} stroke="#fff"/> Save All</button>
      </div>
      {section==="hero"&&<div>
        <div style={cardCss}><div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f3f4f8",display:"flex",alignItems:"center",gap:7}}><Icon d={IC.img} size={15} stroke="#1a3c6e"/> Hero Image</div><ImgInput label="Hero Image URL" value={h.heroImage} onChange={v=>updH("heroImage",v)}/></div>
        <div style={cardCss}><div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f3f4f8",display:"flex",alignItems:"center",gap:7}}><Icon d={IC.edit} size={15} stroke="#1a3c6e"/> Heading & Text</div>
          <div style={{display:"flex",flexDirection:"column",gap:13}}>
            <FField label="Line 1"><FInput value={h.heading1} onChange={v=>updH("heading1",v)}/></FField>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><FField label="Accent Word"><FInput value={h.headingAccent} onChange={v=>updH("headingAccent",v)}/></FField><FField label="Italic Word"><FInput value={h.headingItalic} onChange={v=>updH("headingItalic",v)}/></FField></div>
            <FField label="Subtitle"><FInput value={h.subtext} onChange={v=>updH("subtext",v)}/></FField>
          </div>
        </div>
        <div style={cardCss}><div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f3f4f8",display:"flex",alignItems:"center",gap:7}}><Icon d={IC.chart} size={15} stroke="#1a3c6e"/> Stats & Badge</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:14}}>
            {[["stat1Num","stat1Label","Stat 1"],["stat2Num","stat2Label","Stat 2"],["stat3Num","stat3Label","Stat 3"]].map(([nk,lk,t])=>(
              <div key={nk} style={{padding:"14px",background:"#fafbff",borderRadius:12,border:"1px solid #eaecf2"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#9ca3af",marginBottom:10,textTransform:"uppercase"}}>{t}</div>
                <FField label="Number"><FInput value={h[nk]} onChange={v=>updH(nk,v)}/></FField>
                <div style={{marginTop:8}}><FField label="Label"><FInput value={h[lk]} onChange={v=>updH(lk,v)}/></FField></div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><FField label="Badge Title"><FInput value={h.badgeLabel} onChange={v=>updH("badgeLabel",v)}/></FField><FField label="Badge Subtitle"><FInput value={h.badgeSub} onChange={v=>updH("badgeSub",v)}/></FField></div>
        </div>
      </div>}
      {section==="umrah"&&<div>
        <div style={cardCss}><div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f3f4f8"}}>Section Text</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:13}}><FField label="Heading"><FInput value={us.heading} onChange={v=>updUs("heading",v)}/></FField><FField label="Accent Word"><FInput value={us.headingAccent} onChange={v=>updUs("headingAccent",v)}/></FField><FField label="Subtext"><FInput value={us.subtext} onChange={v=>updUs("subtext",v)}/></FField></div></div>
        <div style={cardCss}><div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f3f4f8"}}>Packages ({content.umrahPackages?.length})</div><ItemList items={content.umrahPackages||[]} fields={umrahFields} editTitle="Edit Umrah Package" onUpdate={v=>setContent(p=>({...p,umrahPackages:v}))} renderPrev={it=><img src={it.img} alt="" onError={e=>e.target.style.display="none"} style={{width:60,height:44,borderRadius:8,objectFit:"cover",flexShrink:0}}/>} renderInfo={it=><><div style={{fontWeight:700,fontSize:13,color:"#1a1a2e"}}>{it.name}</div><div style={{fontSize:12,color:"#6b6880",marginTop:2}}>{it.price} · {it.days} · ⭐{it.rating}</div></>}/></div>
      </div>}
      {section==="cars"&&<div>
        <div style={cardCss}><div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f3f4f8"}}>Section Text</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:13}}><FField label="Heading"><FInput value={cs.heading} onChange={v=>updCs("heading",v)}/></FField><FField label="Accent Word"><FInput value={cs.headingAccent} onChange={v=>updCs("headingAccent",v)}/></FField><FField label="Subtext"><FInput value={cs.subtext} onChange={v=>updCs("subtext",v)}/></FField></div></div>
        <div style={cardCss}><div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f3f4f8"}}>Featured Cars ({content.carRentalHighlights?.length})</div><ItemList items={content.carRentalHighlights||[]} fields={carFields} editTitle="Edit Car" onUpdate={v=>setContent(p=>({...p,carRentalHighlights:v}))} renderPrev={it=><img src={it.img} alt="" onError={e=>e.target.style.display="none"} style={{width:60,height:44,borderRadius:8,objectFit:"cover",flexShrink:0}}/>} renderInfo={it=><><div style={{fontWeight:700,fontSize:13,color:"#1a1a2e"}}>{it.name}</div><div style={{fontSize:12,color:"#6b6880",marginTop:2}}>{it.company} · {it.type} · 🪑{it.seats} · {it.price}/day</div></>}/></div>
      </div>}
      {section==="visas"&&<div>
        <div style={cardCss}><div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f3f4f8"}}>Section Text</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}><FField label="Heading"><FInput value={vs.heading} onChange={v=>updVs("heading",v)}/></FField><FField label="Accent Word"><FInput value={vs.headingAccent} onChange={v=>updVs("headingAccent",v)}/></FField><FField label="After Accent"><FInput value={vs.headingEnd} onChange={v=>updVs("headingEnd",v)}/></FField><FField label="Subtext"><FInput value={vs.subtext} onChange={v=>updVs("subtext",v)}/></FField></div></div>
        <div style={cardCss}><div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f3f4f8"}}>Visas ({content.visasList?.length})</div><ItemList items={content.visasList||[]} fields={visaFields} editTitle="Edit Visa" onUpdate={v=>setContent(p=>({...p,visasList:v}))} renderPrev={it=><img src={it.img} alt="" onError={e=>e.target.style.display="none"} style={{width:60,height:44,borderRadius:8,objectFit:"cover",flexShrink:0}}/>} renderInfo={it=><><div style={{fontWeight:700,fontSize:13,color:"#1a1a2e"}}>{it.flag} {it.country}</div><div style={{fontSize:12,color:"#6b6880",marginTop:2}}>{it.type} · {it.processing} · {it.fee}</div></>}/></div>
      </div>}
      {section==="reviews"&&<div style={cardCss}><div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f3f4f8"}}>Reviews Section</div><div style={{display:"flex",flexDirection:"column",gap:12}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><FField label="Heading"><FInput value={rv.heading} onChange={v=>updRv("heading",v)}/></FField><FField label="Accent Word"><FInput value={rv.headingAccent} onChange={v=>updRv("headingAccent",v)}/></FField></div><FField label="After Accent"><FInput value={rv.headingEnd} onChange={v=>updRv("headingEnd",v)}/></FField><FField label="Subtext"><FInput value={rv.subtext} onChange={v=>updRv("subtext",v)}/></FField></div></div>}
      {section==="cta"&&<div style={cardCss}><div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f3f4f8"}}>CTA / Subscribe</div><div style={{display:"flex",flexDirection:"column",gap:12}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><FField label="Heading"><FInput value={ct.heading} onChange={v=>updCt("heading",v)}/></FField><FField label="Accent Word"><FInput value={ct.headingAccent} onChange={v=>updCt("headingAccent",v)}/></FField></div><FField label="Subtext"><FInput value={ct.subtext} onChange={v=>updCt("subtext",v)}/></FField></div></div>}
    </div>
  );
}

// ─── VISIBILITY TAB ───────────────────────────────────────────────────────────
function VisibilityTab({content,setContent,onSave}) {
  const up=(k,v)=>setContent(p=>({...p,sections:{...p.sections,[k]:v}}));
  const secs=[{k:"hero",i:IC.home,l:"Hero / Main Banner"},{k:"umrah",i:IC.umrah,l:"Umrah Packages"},{k:"carRental",i:IC.car,l:"Car Rental"},{k:"features",i:IC.chart,l:"Features / Why Us"},{k:"visa",i:IC.visa,l:"Visa Services"},{k:"reviews",i:IC.comment,l:"Reviews"},{k:"cta",i:IC.comment,l:"Subscribe / CTA"}];
  return (
    <div>
      <div style={cardCss}>
        <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:16,paddingBottom:12,borderBottom:"1px solid #f3f4f8",display:"flex",alignItems:"center",gap:7}}><Icon d={IC.visibility} size={15} stroke="#1a3c6e"/> Show / Hide Sections</div>
        {secs.map(s=>(
          <div key={s.k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 0",borderBottom:"1px solid #f3f4f8"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}><Icon d={s.i} size={16} stroke="#6b6880"/><span style={{fontSize:13,fontWeight:600,color:"#1a1a2e"}}>{s.l}</span></div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:content.sections[s.k]?"rgba(22,163,74,0.09)":"rgba(239,68,68,0.07)",color:content.sections[s.k]?"#16a34a":"#dc2626",border:`1px solid ${content.sections[s.k]?"rgba(22,163,74,0.22)":"rgba(239,68,68,0.18)"}`}}>{content.sections[s.k]?"Visible":"Hidden"}</span>
              <div onClick={()=>up(s.k,!content.sections[s.k])} style={{width:44,height:24,borderRadius:12,background:content.sections[s.k]?"#1a3c6e":"#d4d8e2",cursor:"pointer",position:"relative",transition:"background 0.25s"}}>
                <div style={{position:"absolute",top:3,left:content.sections[s.k]?23:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left 0.25s",boxShadow:"0 1px 4px rgba(0,0,0,0.15)"}}/>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button style={btnPrimary} onClick={onSave}><Icon d={IC.save} size={14} stroke="#fff"/> Save Visibility</button>
    </div>
  );
}

// ─── USER TAB ─────────────────────────────────────────────────────────────────
function UserTab({auth}) {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(false);
  const isSA = auth?.role === "super_admin";

  // Firebase se users load karo
  useEffect(() => {
    getUsers().then(u => setUsers(u));
  }, []);

  const persist = async (updatedUsers) => {
    for (const u of updatedUsers) {
      await saveUser(u);
    }
    setUsers(updatedUsers);
    setToast(true);
    setTimeout(() => setToast(false), 2200);
  };

  const newUser = {id:String(Date.now()),name:"",email:"",password:"",role:"editor",color:"#1a3c6e",active:true,createdAt:new Date().toISOString().split("T")[0],lastLogin:null};
  const userFields = [{key:"name",label:"Full Name"},{key:"email",label:"Email"},{key:"password",label:"Password",type:"password",placeholder:"Leave blank to keep"},{key:"role",label:"Role",type:"select",options:[{v:"super_admin",l:"Super Admin"},{v:"editor",l:"Editor"},{v:"viewer",l:"Viewer"}]},{key:"active",label:"Account Active",type:"toggle"},{key:"color",label:"Avatar Color",placeholder:"#1a3c6e"}];

  const handleSave = async (data) => {
    const existing = users.find(u => u.id === data.id);
    if (!data.password && existing) data = {...data, password: existing.password};
    data = {...data, avatar: initials(data.name || "?")};
    if (addMode) {
      const newU = {...data, id: String(Date.now())};
      await saveUser(newU);
      setUsers([...users, newU]);
      setAddMode(false);
    } else {
      await saveUser(data);
      setUsers(users.map(u => u.id === data.id ? data : u));
    }
    setToast(true);
    setTimeout(() => setToast(false), 2200);
    setEditing(null);
  };

  return (
    <div>
      {toast&&<div style={{position:"fixed",bottom:28,right:28,zIndex:9999,background:"#16a34a",color:"#fff",padding:"12px 22px",borderRadius:12,fontSize:13,fontWeight:700}}>User updated!</div>}
      {confirm&&<ConfirmModal msg={`Delete "${confirm.name}"?`} onOk={async()=>{await deleteUser(confirm.id);setUsers(users.filter(u=>u.id!==confirm.id));setConfirm(null);}} onCancel={()=>setConfirm(null)}/>}
      {(editing||addMode)&&<EditModal item={editing||newUser} fields={userFields} title={addMode?"Add User":"Edit User"} onSave={handleSave} onClose={()=>{setEditing(null);setAddMode(false);}}/>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div><div style={{fontSize:14,fontWeight:700,color:"#1a1a2e"}}>Admin Users ({users.length})</div><div style={{fontSize:12,color:"#9ca3af",marginTop:2}}>Manage dashboard access</div></div>
        {isSA&&<button onClick={()=>setAddMode(true)} style={{...btnPrimary,background:"#16a34a"}}><Icon d={IC.add} size={14} stroke="#fff"/> Add User</button>}
      </div>
      <div style={cardCss}>
        {users.map((u,i)=>(
          <div key={u.id} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 0",borderBottom:i<users.length-1?"1px solid #f3f4f8":"none",flexWrap:"wrap"}}>
            <div style={{width:44,height:44,borderRadius:14,background:u.color||"#1a3c6e",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,flexShrink:0}}>{initials(u.name)}</div>
            <div style={{flex:1,minWidth:150}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <span style={{fontWeight:700,fontSize:13,color:"#1a1a2e"}}>{u.name}</span>
                {u.id===auth?.id&&<span style={{fontSize:10,fontWeight:700,background:"rgba(26,60,110,0.09)",color:"#1a3c6e",padding:"2px 8px",borderRadius:20}}>YOU</span>}
              </div>
              <div style={{fontSize:12,color:"#9ca3af",marginTop:2}}>{u.email}</div>
              <div style={{fontSize:11,color:"#9ca3af",marginTop:1}}>Last login: {fmtDate(u.lastLogin)}</div>
            </div>
            <div style={{display:"flex",gap:7,alignItems:"center",flexWrap:"wrap"}}>
              <span style={{display:"inline-flex",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:`${ROLE_COLORS[u.role]}15`,color:ROLE_COLORS[u.role],border:`1px solid ${ROLE_COLORS[u.role]}30`}}>{ROLE_LABELS[u.role]}</span>
              <span style={{display:"inline-flex",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:u.active?"rgba(22,163,74,0.09)":"rgba(239,68,68,0.07)",color:u.active?"#16a34a":"#dc2626",border:`1px solid ${u.active?"rgba(22,163,74,0.22)":"rgba(239,68,68,0.18)"}`}}>{u.active?"Active":"Inactive"}</span>
            </div>
            {isSA&&<div style={{display:"flex",gap:7,flexShrink:0}}>
              <button onClick={()=>setEditing(u)} style={btnOutline()}><Icon d={IC.edit} size={12} stroke="#1a3c6e"/> Edit</button>
              <button onClick={async()=>{const updated=users.map(x=>x.id===u.id?{...x,active:!x.active}:x);await persist(updated);}} style={btnOutline(u.active?"#ea580c":"#16a34a")}>{u.active?"Deactivate":"Activate"}</button>
              {u.id!==auth?.id&&<button onClick={()=>setConfirm(u)} style={btnOutline("#dc2626")}><Icon d={IC.trash} size={12} stroke="#dc2626"/></button>}
            </div>}
          </div>
        ))}
      </div>
      <div style={cardCss}>
        <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f3f4f8",display:"flex",alignItems:"center",gap:7}}><Icon d={IC.lock} size={15} stroke="#1a3c6e"/> Role Permissions</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {[{role:"super_admin",perms:["Full CMS access","User management","Reset content","All sections","All tickets"]},{role:"editor",perms:["Edit CMS content","Manage tickets","Assign tickets","Add comments","Section visibility"]},{role:"viewer",perms:["Read-only dashboard","View statistics","View tickets","No edit access","No user management"]}].map(r=>(
            <div key={r.role} style={{padding:"14px 16px",borderRadius:12,border:`1px solid ${ROLE_COLORS[r.role]}25`,background:`${ROLE_COLORS[r.role]}05`}}>
              <div style={{fontWeight:700,fontSize:13,color:ROLE_COLORS[r.role],marginBottom:10}}>{ROLE_LABELS[r.role]}</div>
              {r.perms.map(p=><div key={p} style={{fontSize:12,color:"#6b6880",marginBottom:5,display:"flex",gap:6}}><Icon d={IC.check} size={12} stroke={ROLE_COLORS[r.role]} sw={2.5}/>{p}</div>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS TAB ─────────────────────────────────────────────────────────────
function SettingsTab({content,setContent,auth,onLogout,onSave}) {
  const [pwForm,setPwForm]=useState({current:"",newPw:"",confirm:""});
  const [pwMsg,setPwMsg]=useState("");
  const [resetConf,setResetConf]=useState(false);
  const handlePw = async () => {
  const allUsers = await getUsers();
  const me = allUsers.find(u => u.id === auth?.id);
  if (!me || me.password !== pwForm.current) { setPwMsg("Incorrect current password."); return; }
  if (pwForm.newPw.length < 6) { setPwMsg("Min 6 characters."); return; }
  if (pwForm.newPw !== pwForm.confirm) { setPwMsg("Passwords do not match."); return; }
  await saveUser({...me, password: pwForm.newPw});
  setPwForm({current:"", newPw:"", confirm:""});
  setPwMsg("Password changed!");
  setTimeout(() => setPwMsg(""), 3000);
};
  return (
    <div>
      {resetConf&&<ConfirmModal msg="Reset ALL website content to default? Cannot be undone." onOk={()=>{resetContent();setContent(getContent());setResetConf(false);onSave();}} onCancel={()=>setResetConf(false)}/>}
      <div style={cardCss}>
        <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f3f4f8",display:"flex",alignItems:"center",gap:7}}><Icon d={IC.users} size={15} stroke="#1a3c6e"/> My Account</div>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{width:56,height:56,borderRadius:18,background:auth?.color||"#1a3c6e",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:18}}>{initials(auth?.name||"")}</div>
          <div><div style={{fontWeight:700,fontSize:16,color:"#1a1a2e"}}>{auth?.name}</div><div style={{fontSize:13,color:"#6b6880"}}>{auth?.email}</div><span style={{display:"inline-flex",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:`${ROLE_COLORS[auth?.role]||"#1a3c6e"}15`,color:ROLE_COLORS[auth?.role]||"#1a3c6e",border:`1px solid ${ROLE_COLORS[auth?.role]||"#1a3c6e"}30`,marginTop:6}}>{ROLE_LABELS[auth?.role]}</span></div>
        </div>
      </div>
      <div style={cardCss}>
        <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f3f4f8",display:"flex",alignItems:"center",gap:7}}><Icon d={IC.lock} size={15} stroke="#1a3c6e"/> Change Password</div>
        <div style={{display:"flex",flexDirection:"column",gap:12,maxWidth:400}}>
          <FField label="Current Password"><FInput value={pwForm.current} onChange={v=>setPwForm(p=>({...p,current:v}))} type="password" placeholder="Current password"/></FField>
          <FField label="New Password"><FInput value={pwForm.newPw} onChange={v=>setPwForm(p=>({...p,newPw:v}))} type="password" placeholder="Min 6 characters"/></FField>
          <FField label="Confirm New Password"><FInput value={pwForm.confirm} onChange={v=>setPwForm(p=>({...p,confirm:v}))} type="password" placeholder="Repeat new password"/></FField>
          {pwMsg&&<div style={{fontSize:13,color:pwMsg==="Password changed!"?"#16a34a":"#dc2626",fontWeight:600,display:"flex",alignItems:"center",gap:6}}><Icon d={pwMsg==="Password changed!"?IC.check:IC.warn} size={13} stroke={pwMsg==="Password changed!"?"#16a34a":"#dc2626"} sw={2}/>{pwMsg}</div>}
          <button onClick={handlePw} style={{...btnPrimary,alignSelf:"flex-start"}}><Icon d={IC.lock} size={13} stroke="#fff"/> Update Password</button>
        </div>
      </div>
      <div style={{...cardCss,border:"1px solid rgba(239,68,68,0.2)",background:"rgba(239,68,68,0.015)"}}>
        <div style={{fontSize:14,fontWeight:700,color:"#dc2626",marginBottom:12,paddingBottom:10,borderBottom:"1px solid rgba(239,68,68,0.12)",display:"flex",alignItems:"center",gap:7}}><Icon d={IC.warn} size={15} stroke="#dc2626"/> Actions</div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          {auth?.role==="super_admin"&&<button onClick={()=>setResetConf(true)} style={{...btnOutline("#dc2626"),padding:"11px 20px"}}><Icon d={IC.refresh} size={13} stroke="#dc2626"/> Reset All Content</button>}
          <button onClick={onLogout} style={{...btnOutline("#ea580c"),padding:"11px 20px"}}><Icon d={IC.logout} size={13} stroke="#ea580c"/> Sign Out</button>
        </div>
      </div>
    </div>
  );
}


// ─── JOBS TAB ─────────────────────────────────────────────────────────────────
function JobsTab({auth}) {
  const [view,setView]=useState("applications");
  const [jobs,setJobs]=useState(()=>getJobs());
  const [apps,setApps]=useState(()=>getApplications());
  const [selJob,setSelJob]=useState(null);
  const [selApp,setSelApp]=useState(null);
  const [addJobMode,setAddJobMode]=useState(false);
  const [editJob,setEditJob]=useState(null);
  const [confirm,setConfirm]=useState(null);
  const [toast,setToast]=useState("");
  useEffect(()=>{ const h=()=>{setJobs(getJobs());setApps(getApplications());}; window.addEventListener(JOB_EV,h); return ()=>window.removeEventListener(JOB_EV,h); },[]);
  const showToast=(msg)=>{setToast(msg);setTimeout(()=>setToast(""),2500);};
  const isSA=auth?.role!=="viewer";
  const shownApps=selJob?apps.filter(a=>a.jobId===selJob):apps;
  const jobFields=[{key:"title",label:"Job Title"},{key:"department",label:"Department"},{key:"type",label:"Employment Type",placeholder:"Full-time / Part-time / Remote"},{key:"location",label:"Location",placeholder:"Lahore / Remote"},{key:"salary",label:"Salary Range",placeholder:"PKR 50,000–80,000/month"},{key:"description",label:"Job Description"},{key:"active",label:"Active (visible to applicants)",type:"toggle"}];
  const handleSaveJob=(data)=>{ if(editJob){updateJob(data.id,data);showToast("Job updated!");}else{addJob(data);showToast("Job posted!");} setJobs(getJobs());setEditJob(null);setAddJobMode(false); };
  const handleDeleteJob=(id)=>{ deleteJob(id);setJobs(getJobs());setApps(getApplications());setConfirm(null);showToast("Job deleted."); };
  const handleUpdateApp=(id,patch)=>{ updateApplication(id,patch);setApps(getApplications());if(selApp?.id===id)setSelApp({...selApp,...patch});showToast("Application updated!"); };

  if(selApp){
    const [reason,setReason]=useState(selApp.statusReason||"");
    const [notes,setNotes]=useState(selApp.notes||"");
    const st=selApp.status;
    return (
      <div>
        {toast&&<div style={{position:"fixed",bottom:28,right:28,zIndex:9999,background:"#1a3c6e",color:"#fff",padding:"12px 22px",borderRadius:12,fontSize:13,fontWeight:700}}>{toast}</div>}
        <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:24}}>
          <button onClick={()=>setSelApp(null)} style={{...btnOutline(),gap:6}}><Icon d={IC.back} size={14} stroke="#1a3c6e"/> Back</button>
          <div><div style={{fontSize:18,fontWeight:700,color:"#1a1a2e",fontFamily:"'Playfair Display',serif"}}>{selApp.name}</div><div style={{fontSize:12,color:"#9ca3af",marginTop:2}}>Applied for: <strong>{selApp.jobTitle}</strong> · {new Date(selApp.appliedAt).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</div></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:20,alignItems:"start"}}>
          <div>
            <div style={cardCss}>
              <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f3f4f8",display:"flex",alignItems:"center",gap:7}}><Icon d={IC.users} size={15} stroke="#1a3c6e"/> Applicant Details</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[["Name",selApp.name],["Phone",selApp.phone],["Email",selApp.email||"—"],["City",selApp.city||"—"],["Resume",selApp.resumeName||"—"],["Applied",new Date(selApp.appliedAt).toLocaleDateString()]].map(([k,v])=>(
                  <div key={k} style={{padding:"10px 14px",background:"#fafbff",borderRadius:10,border:"1px solid #eaecf2"}}>
                    <div style={{fontSize:10,color:"#9ca3af",fontWeight:700,textTransform:"uppercase",marginBottom:3}}>{k}</div>
                    <div style={{fontSize:13,fontWeight:600,color:"#1a1a2e"}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:14,padding:"14px",background:"rgba(26,60,110,0.03)",borderRadius:12,border:"1px solid rgba(26,60,110,0.09)"}}>
                <div style={{fontSize:11,color:"#9ca3af",fontWeight:700,textTransform:"uppercase",marginBottom:6}}>Cover Letter</div>
                <p style={{fontSize:13,color:"#374151",lineHeight:1.75,margin:0}}>{selApp.coverLetter}</p>
              </div>
            </div>
            <div style={cardCss}>
              <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f3f4f8"}}>HR Notes</div>
              <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={4} placeholder="Add internal notes..." style={{...inputCss,resize:"vertical"}} onFocus={e=>e.target.style.borderColor="#1a3c6e"} onBlur={e=>e.target.style.borderColor="#e2e4ea"}/>
              <button onClick={()=>handleUpdateApp(selApp.id,{notes})} style={{...btnPrimary,marginTop:10}}><Icon d={IC.save} size={13} stroke="#fff"/> Save Notes</button>
            </div>
          </div>
          <div style={{...cardCss,marginBottom:0}}>
            <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f3f4f8",display:"flex",alignItems:"center",gap:7}}><Icon d={IC.check} size={15} stroke="#1a3c6e" sw={2.5}/> Decision</div>
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              {Object.entries(APP_STATUSES).map(([k,s])=>(
                <button key={k} onClick={()=>handleUpdateApp(selApp.id,{status:k})}
                  style={{padding:"11px 14px",borderRadius:10,border:`2px solid ${st===k?s.color:"#e2e4ea"}`,background:st===k?s.bg:"#fff",color:st===k?s.color:"#6b6880",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textAlign:"left",transition:"all 0.18s",display:"flex",alignItems:"center",gap:8}}>
                  {st===k&&<Icon d={IC.check} size={13} stroke={s.color} sw={2.5}/>}{s.label}
                </button>
              ))}
              <div style={{marginTop:6}}>
                <div style={{fontSize:11,color:"#8b90a0",fontWeight:700,textTransform:"uppercase",marginBottom:6,letterSpacing:"0.6px"}}>Rejection Reason</div>
                <input style={{...inputCss}} value={reason} onChange={e=>setReason(e.target.value)} placeholder="Explain rejection reason..." onFocus={e=>e.target.style.borderColor="#1a3c6e"} onBlur={e=>e.target.style.borderColor="#e2e4ea"}/>
                <button onClick={()=>handleUpdateApp(selApp.id,{statusReason:reason})} style={{...btnPrimary,marginTop:8,width:"100%",justifyContent:"center"}}>Save Reason</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {toast&&<div style={{position:"fixed",bottom:28,right:28,zIndex:9999,background:"#1a3c6e",color:"#fff",padding:"12px 22px",borderRadius:12,fontSize:13,fontWeight:700}}>{toast}</div>}
      {confirm&&<ConfirmModal msg={confirm.msg} onOk={confirm.onOk} onCancel={()=>setConfirm(null)}/>}
      {(addJobMode||editJob)&&<EditModal item={editJob||{active:true}} fields={jobFields} title={editJob?"Edit Job":"Post New Job"} onSave={handleSaveJob} onClose={()=>{setAddJobMode(false);setEditJob(null);}}/>}
      <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap",alignItems:"center"}}>
        {["applications","postings"].map(v=>(
          <button key={v} onClick={()=>setView(v)} style={{...btnOutline(view===v?"#1a3c6e":"#9ca3af"),background:view===v?"rgba(26,60,110,0.07)":"#fff",padding:"9px 22px"}}>
            {v==="applications"?<><Icon d={IC.ticket} size={13} stroke={view===v?"#1a3c6e":"#9ca3af"}/> Applications ({apps.length})</>:<><Icon d={IC.jobs} size={13} stroke={view===v?"#1a3c6e":"#9ca3af"}/> Job Postings ({jobs.length})</>}
          </button>
        ))}
        {view==="postings"&&isSA&&<button onClick={()=>setAddJobMode(true)} style={{...btnPrimary,marginLeft:"auto",background:"#16a34a"}}><Icon d={IC.add} size={14} stroke="#fff"/> Post Job</button>}
      </div>
      {view==="applications"&&<div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:20}} className="stat-grid">
          {Object.entries(APP_STATUSES).map(([k,s])=>{
            const cnt=apps.filter(a=>a.status===k).length;
            return <div key={k} style={{background:"#fff",borderRadius:12,border:"1px solid #eaecf2",padding:"14px 16px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:s.color}}/>
              <div style={{fontSize:10,color:"#9ca3af",fontWeight:700,textTransform:"uppercase",marginBottom:6}}>{s.label}</div>
              <div style={{fontSize:24,fontWeight:800,color:s.color,fontFamily:"'Playfair Display',serif"}}>{cnt}</div>
            </div>;
          })}
        </div>
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
          <button onClick={()=>setSelJob(null)} style={{...btnOutline(!selJob?"#1a3c6e":"#9ca3af"),background:!selJob?"rgba(26,60,110,0.07)":"#fff",padding:"6px 14px",fontSize:12}}>All Jobs ({apps.length})</button>
          {jobs.map(j=>{ const cnt=apps.filter(a=>a.jobId===j.id).length; return <button key={j.id} onClick={()=>setSelJob(j.id)} style={{...btnOutline(selJob===j.id?"#1a3c6e":"#9ca3af"),background:selJob===j.id?"rgba(26,60,110,0.07)":"#fff",padding:"6px 14px",fontSize:12}}>{j.title.split(" ").slice(0,2).join(" ")} ({cnt})</button>; })}
        </div>
        <div style={{background:"#fff",borderRadius:16,border:"1px solid #eaecf2",overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 140px 110px 110px 80px",padding:"11px 16px",background:"#f8f9fc",borderBottom:"1px solid #eaecf2",fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.7px"}}>{["Applicant","Job","Date","Status","Resume",""].map((h,i)=><div key={i}>{h}</div>)}</div>
          {shownApps.length===0&&<div style={{textAlign:"center",padding:"48px",color:"#9ca3af",fontSize:14}}>No applications yet.</div>}
          {shownApps.map((a,i)=>{ const s=APP_STATUSES[a.status]||APP_STATUSES.new; return <div key={a.id} style={{display:"grid",gridTemplateColumns:"1fr 1fr 140px 110px 110px 80px",padding:"12px 16px",borderBottom:i<shownApps.length-1?"1px solid #f3f4f8":"none",alignItems:"center"}}>
            <div><div style={{fontWeight:700,fontSize:13,color:"#1a1a2e"}}>{a.name}</div><div style={{fontSize:11,color:"#9ca3af"}}>{a.phone}</div></div>
            <div style={{fontSize:12,color:"#6b6880"}}>{a.jobTitle}</div>
            <div style={{fontSize:12,color:"#6b6880"}}>{new Date(a.appliedAt).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</div>
            <div><span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:s.bg,color:s.color,border:`1px solid ${s.color}35`}}>{dot(s.color)}{s.label}</span></div>
            <div style={{fontSize:11,color:"#6b6880",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.resumeName||"—"}</div>
            <div><button onClick={()=>setSelApp(a)} style={{...btnOutline(),padding:"5px 12px",fontSize:11}}>View</button></div>
          </div>; })}
        </div>
      </div>}
      {view==="postings"&&<div>
        {jobs.map(job=>{ const appCount=apps.filter(a=>a.jobId===job.id).length; return <div key={job.id} style={{background:"#fff",borderRadius:16,border:"1px solid #eaecf2",padding:"18px 22px",marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap",alignItems:"center"}}>
                <span style={{fontWeight:700,fontSize:15,color:"#1a1a2e",fontFamily:"'Playfair Display',serif"}}>{job.title}</span>
                <span style={{fontSize:11,fontWeight:700,padding:"2px 9px",borderRadius:20,background:job.active?"rgba(22,163,74,0.09)":"rgba(239,68,68,0.07)",color:job.active?"#16a34a":"#dc2626",border:`1px solid ${job.active?"rgba(22,163,74,0.22)":"rgba(239,68,68,0.18)"}`}}>{job.active?"Active":"Inactive"}</span>
              </div>
              <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                <span style={{fontSize:12,color:"#6b6880"}}>{job.department}</span>
                <span style={{fontSize:12,color:"#6b6880"}}>{job.location}</span>
                <span style={{fontSize:12,color:"#6b6880"}}>{job.type}</span>
                <span style={{fontSize:12,color:"#1a3c6e",fontWeight:700}}>{appCount} application{appCount!==1?"s":""}</span>
              </div>
            </div>
            {isSA&&<div style={{display:"flex",gap:7,flexShrink:0}}>
              <button onClick={()=>setEditJob(job)} style={btnOutline()}><Icon d={IC.edit} size={12} stroke="#1a3c6e"/> Edit</button>
              <button onClick={()=>{updateJob(job.id,{active:!job.active});setJobs(getJobs());}} style={btnOutline(job.active?"#ea580c":"#16a34a")}>{job.active?"Hide":"Show"}</button>
              <button onClick={()=>setConfirm({msg:`Delete "${job.title}"?`,onOk:()=>handleDeleteJob(job.id)})} style={btnOutline("#dc2626")}><Icon d={IC.trash} size={12} stroke="#dc2626"/></button>
            </div>}
          </div>
        </div>; })}
      </div>}
    </div>
  );
}

// ─── BLOG TAB ─────────────────────────────────────────────────────────────────
function BlogTab() {
  const [posts,setPosts]=useState(()=>getBlogPosts());
  const [editing,setEditing]=useState(null);
  const [addMode,setAddMode]=useState(false);
  const [confirm,setConfirm]=useState(null);
  const [toast,setToast]=useState("");
  const [filter,setFilter]=useState("all");
  useEffect(()=>{ const h=()=>setPosts(getBlogPosts()); window.addEventListener(BLOG_EV,h); return ()=>window.removeEventListener(BLOG_EV,h); },[]);
  const showToast=(msg)=>{setToast(msg);setTimeout(()=>setToast(""),2500);};
  const newPost={title:"",excerpt:"",content:"",category:"Umrah",tags:"",coverImage:"",author:"Edafay Team",authorAvatar:"ET",readTime:"5 min read",status:"draft"};
  const handleSave=(data)=>{ saveBlogPost({...data,tags:typeof data.tags==="string"?data.tags.split(",").map(t=>t.trim()).filter(Boolean):data.tags}); setPosts(getBlogPosts());setEditing(null);setAddMode(false);showToast("Post saved!"); };
  const handleDelete=(id)=>{ deleteBlogPost(id);setPosts(getBlogPosts());setConfirm(null);showToast("Post deleted."); };
  const blogFields=[{key:"title",label:"Post Title"},{key:"excerpt",label:"Excerpt / Summary"},{key:"category",label:"Category",type:"select",options:[{v:"Umrah",l:"Umrah"},{v:"Visa",l:"Visa"},{v:"Travel Tips",l:"Travel Tips"},{v:"Insurance",l:"Insurance"},{v:"Car Rental",l:"Car Rental"},{v:"General",l:"General"}]},{key:"tags",label:"Tags (comma-separated)",placeholder:"Umrah, Guide, 2026"},{key:"author",label:"Author Name"},{key:"authorAvatar",label:"Author Initials (2 chars)",placeholder:"ET"},{key:"readTime",label:"Read Time",placeholder:"5 min read"},{key:"coverImage",label:"Cover Image URL",type:"image"},{key:"status",label:"Status",type:"select",options:[{v:"draft",l:"Draft"},{v:"published",l:"Published"}]},{key:"content",label:"Article Content (HTML or plain text)"}];
  const shown=filter==="all"?posts:posts.filter(p=>p.status===filter);
  const pub=posts.filter(p=>p.status==="published").length, dr=posts.filter(p=>p.status==="draft").length;
  return (
    <div>
      {toast&&<div style={{position:"fixed",bottom:28,right:28,zIndex:9999,background:"#1a3c6e",color:"#fff",padding:"12px 22px",borderRadius:12,fontSize:13,fontWeight:700}}>{toast}</div>}
      {confirm&&<ConfirmModal msg={confirm.msg} onOk={confirm.onOk} onCancel={()=>setConfirm(null)}/>}
      {(addMode||editing)&&<EditModal item={editing||newPost} fields={blogFields} title={editing?"Edit Post":"New Blog Post"} onSave={handleSave} onClose={()=>{setEditing(null);setAddMode(false);}}/>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
        {[["Total",posts.length,"#1a3c6e"],["Published",pub,"#16a34a"],["Drafts",dr,"#ea580c"]].map(([l,v,c])=>(
          <div key={l} style={{background:"#fff",borderRadius:14,border:"1px solid #eaecf2",padding:"16px 20px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:c}}/>
            <div style={{fontSize:11,color:"#8b90a0",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.6px",marginBottom:6}}>{l}</div>
            <div style={{fontSize:28,fontWeight:800,color:c,fontFamily:"'Playfair Display',serif"}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
        {["all","published","draft"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{...btnOutline(filter===f?"#1a3c6e":"#9ca3af"),background:filter===f?"rgba(26,60,110,0.07)":"#fff",padding:"7px 16px",fontSize:12,textTransform:"capitalize"}}>{f}</button>
        ))}
        <button onClick={()=>setAddMode(true)} style={{...btnPrimary,marginLeft:"auto"}}><Icon d={IC.add} size={14} stroke="#fff"/> New Post</button>
      </div>
      {shown.map(post=>(
        <div key={post.id} style={{display:"flex",gap:16,background:"#fff",borderRadius:16,border:"1px solid #eaecf2",padding:"16px 18px",marginBottom:10,alignItems:"center"}}>
          {post.coverImage&&<img src={post.coverImage} alt="" onError={e=>e.target.style.display="none"} style={{width:80,height:60,borderRadius:10,objectFit:"cover",flexShrink:0}}/>}
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",gap:8,marginBottom:5,alignItems:"center",flexWrap:"wrap"}}>
              <span style={{fontWeight:700,fontSize:14,color:"#1a1a2e",fontFamily:"'Playfair Display',serif"}}>{post.title}</span>
              <span style={{fontSize:11,fontWeight:700,padding:"2px 9px",borderRadius:20,background:post.status==="published"?"rgba(22,163,74,0.09)":"rgba(234,88,12,0.07)",color:post.status==="published"?"#16a34a":"#ea580c",border:`1px solid ${post.status==="published"?"rgba(22,163,74,0.22)":"rgba(234,88,12,0.18)"}`}}>{post.status}</span>
            </div>
            <div style={{fontSize:12,color:"#9ca3af"}}>{post.category} · {post.author} · {post.readTime} · 👁 {post.views?.toLocaleString()||0} views</div>
          </div>
          <div style={{display:"flex",gap:7,flexShrink:0}}>
            <button onClick={()=>{const p={...post,tags:post.tags?.join?post.tags.join(", "):post.tags};setEditing(p);}} style={btnOutline()}><Icon d={IC.edit} size={12} stroke="#1a3c6e"/> Edit</button>
            <button onClick={()=>{saveBlogPost({...post,status:post.status==="published"?"draft":"published"});setPosts(getBlogPosts());showToast(post.status==="published"?"Set to draft":"Published!");}} style={btnOutline(post.status==="published"?"#ea580c":"#16a34a")}>{post.status==="published"?"Unpublish":"Publish"}</button>
            <button onClick={()=>setConfirm({msg:`Delete "${post.title}"?`,onOk:()=>handleDelete(post.id)})} style={btnOutline("#dc2626")}><Icon d={IC.trash} size={12} stroke="#dc2626"/></button>
          </div>
        </div>
      ))}
    </div>
  );
}


// ─── NAV CONFIG ───────────────────────────────────────────────────────────────
const NAV = [
  { section:"MAIN",      items:[{ k:"overview",      i:IC.overview,    l:"Overview"     }]},
  { section:"INQUIRIES", items:[{ k:"inq_umrah",     i:IC.umrah,       l:"Umrah"        },
                                { k:"inq_car",       i:IC.car,         l:"Car Rental"   },
                                { k:"inq_visa",      i:IC.visa,        l:"Visas"        },
                                { k:"inq_flight",    i:IC.flight,      l:"Flights"      },
                                { k:"inq_insurance", i:IC.insurance,   l:"Insurance"    }]},
  { section:"WEBSITE",   items:[{ k:"content",       i:IC.content,     l:"Content"      },
                                { k:"visibility",    i:IC.visibility,  l:"Visibility"   },
                                { k:"blog",          i:IC.blog,        l:"Blog"         },
                                { k:"jobs",          i:IC.jobs,        l:"Careers"      }]},
  { section:"ADMIN",     items:[{ k:"users",         i:IC.users,       l:"Users"        },
                                { k:"settings",      i:IC.settings,    l:"Settings"     }]},
];

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function Dashboard({auth,onLogout}) {
  const [tab,     setTab]     = useState("overview");
  const [content, setContent] = useState(()=>getContent());
  const [toast,   setToast]   = useState(false);
  const [tickets, setTickets] = useState(()=>getInquiries());
  const timer = useRef(null);

  useEffect(()=>{
    const h=()=>setTickets(getInquiries());
    window.addEventListener("edafay_inquiries_updated",h);
    return ()=>window.removeEventListener("edafay_inquiries_updated",h);
  },[]);

  const handleSave=()=>{
    saveContent(content);
    if(timer.current) clearTimeout(timer.current);
    setToast(true);
    timer.current=setTimeout(()=>setToast(false),2500);
  };
  const handleLogout=()=>{ clearAuth(); onLogout(); };
  const tabProps={content,setContent,onSave:handleSave,auth};
  const activeInfo=NAV.flatMap(s=>s.items).find(t=>t.k===tab)||{i:IC.overview,l:""};
  const openCount=(cat)=>tickets.filter(t=>t.category===cat&&t.status!=="closed").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; }
        body { margin:0; padding:0; overflow-x:hidden; background:#f0f2f7; }
        @keyframes dashToast { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .dash-sb-item { transition:all 0.18s; }
        .dash-sb-item:hover { background:rgba(255,255,255,0.09) !important; color:#fff !important; }
        @media(max-width:768px){
          .dash-sidebar { width:56px !important; }
          .sb-label,.sb-section { display:none !important; }
          .dash-main { margin-left:56px !important; padding:14px !important; }
          .stat-grid,.cat-grid { grid-template-columns:1fr 1fr !important; }
        }
        @media(min-width:769px){ .dash-sidebar { width:224px; } .dash-main { margin-left:224px; } }
        input[type="password"]::-ms-reveal { display:none; }
      `}</style>

      <div style={{background:"#f0f2f7",minHeight:"100vh",fontFamily:"'DM Sans',sans-serif"}}>

        {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
        <div className="dash-sidebar" style={{position:"fixed",top:0,left:0,height:"100vh",background:"#0c1929",color:"#fff",display:"flex",flexDirection:"column",overflowY:"auto",zIndex:100,flexShrink:0,borderRight:"1px solid rgba(255,255,255,0.06)"}}>

          {/* Logo */}
          <div style={{padding:"18px 16px 14px",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#1a3c6e,#2a5298)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Icon d={IC.flight} size={16} stroke="#fff" sw={1.8}/>
              </div>
              <div className="sb-label">
                <div style={{fontSize:14,fontWeight:700,color:"#fff",letterSpacing:"-0.3px"}}>Edafay</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginTop:1}}>Admin Panel</div>
              </div>
            </div>
          </div>

          {/* User chip */}
          <div style={{padding:"12px 14px 10px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:32,height:32,borderRadius:9,background:auth?.color||"#1a3c6e",border:"1.5px solid rgba(255,255,255,0.15)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,flexShrink:0}}>{initials(auth?.name||"A")}</div>
              <div className="sb-label" style={{minWidth:0}}>
                <div style={{fontSize:12,fontWeight:700,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{auth?.name}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.38)",marginTop:1}}>{ROLE_LABELS[auth?.role]}</div>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <div style={{flex:1,paddingTop:6,overflowY:"auto"}}>
            {NAV.map(sec=>(
              <div key={sec.section}>
                <div className="sb-section" style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.28)",letterSpacing:"1.4px",textTransform:"uppercase",padding:"14px 18px 5px"}}>{sec.section}</div>
                {sec.items.map(item=>{
                  const catKey=item.k.replace("inq_","");
                  const badge=item.k.startsWith("inq_")?openCount(catKey):0;
                  const isActive=tab===item.k;
                  return (
                    <div key={item.k} className="dash-sb-item" onClick={()=>setTab(item.k)}
                      style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 12px",margin:"1px 8px",borderRadius:10,cursor:"pointer",background:isActive?"rgba(255,255,255,0.12)":"transparent",color:isActive?"#fff":"rgba(255,255,255,0.55)",borderLeft:isActive?"2px solid rgba(255,255,255,0.4)":"2px solid transparent"}}>
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        <Icon d={item.i} size={15} stroke={isActive?"#fff":"rgba(255,255,255,0.55)"} sw={isActive?2:1.8}/>
                        <span className="sb-label" style={{fontSize:12,fontWeight:isActive?700:500}}>{item.l}</span>
                      </div>
                      {badge>0&&<span className="sb-label" style={{fontSize:10,fontWeight:700,background:"#dc2626",color:"#fff",padding:"2px 7px",borderRadius:20,flexShrink:0,minWidth:20,textAlign:"center"}}>{badge}</span>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Bottom actions */}
          <div style={{padding:"10px 10px 16px",borderTop:"1px solid rgba(255,255,255,0.07)"}}>
            <button onClick={()=>window.location.hash=""} title="View Site"
              style={{width:"100%",padding:"9px 10px",borderRadius:9,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.65)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:6,display:"flex",alignItems:"center",justifyContent:"center",gap:7,transition:"background 0.18s"}}>
              <Icon d={IC.home} size={14} stroke="rgba(255,255,255,0.65)"/><span className="sb-label">View Site</span>
            </button>
            <button onClick={handleLogout} title="Sign Out"
              style={{width:"100%",padding:"9px 10px",borderRadius:9,background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.22)",color:"#fca5a5",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:7,transition:"background 0.18s"}}>
              <Icon d={IC.logout} size={14} stroke="#fca5a5"/><span className="sb-label">Sign Out</span>
            </button>
          </div>
        </div>

        {/* ── MAIN ─────────────────────────────────────────────────────────── */}
        <div className="dash-main" style={{minHeight:"100vh",padding:"28px 32px",overflowX:"hidden"}}>
          {/* Page header */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:36,height:36,borderRadius:10,background:"#fff",border:"1px solid #eaecf2",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Icon d={activeInfo.i} size={17} stroke="#1a3c6e" sw={1.9}/>
              </div>
              <div>
                <h1 style={{fontSize:18,fontWeight:700,color:"#1a1a2e",margin:0,lineHeight:1.2}}>{activeInfo.l}</h1>
                <p style={{fontSize:11,color:"#9ca3af",margin:0,marginTop:2}}>Edafay Admin — changes save live</p>
              </div>
            </div>
            {["content","visibility"].includes(tab)&&<button style={btnPrimary} onClick={handleSave}><Icon d={IC.save} size={14} stroke="#fff"/> Save Now</button>}
          </div>

          {/* Tab renders */}
          {tab==="overview"      && <OverviewTab    {...tabProps}/>}
          {tab==="inq_umrah"     && <InquiryTab     category="umrah"     auth={auth}/>}
          {tab==="inq_car"       && <InquiryTab     category="car"       auth={auth}/>}
          {tab==="inq_visa"      && <InquiryTab     category="visa"      auth={auth}/>}
          {tab==="inq_flight"    && <InquiryTab     category="flight"    auth={auth}/>}
          {tab==="inq_insurance" && <InquiryTab     category="insurance" auth={auth}/>}
          {tab==="content"       && <ContentTab     {...tabProps}/>}
          {tab==="visibility"    && <VisibilityTab  {...tabProps}/>}
          {tab==="users"         && <UserTab        auth={auth}/>}
          {tab==="settings"      && <SettingsTab    {...tabProps} onLogout={handleLogout}/>}
          {tab==="jobs"          && <JobsTab        auth={auth}/>}
          {tab==="blog"          && <BlogTab/>}
        </div>
      </div>

      <SaveToast show={toast}/>
    </>
  );
}