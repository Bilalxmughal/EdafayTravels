// ─── Dashboard.jsx — Edafay Advanced CMS (No Navbar, Fixed Layout) ──────────
import { useState, useEffect, useRef } from "react";
import { getContent, saveContent, resetContent, EVENT_NAME, DEFAULTS, getContent as gc } from "./contentStore.js";
import { getAuth, clearAuth, getUsers, saveUsers, ROLE_LABELS, ROLE_COLORS } from "./Auth.jsx";
import { getInquiries, updateInquiry, addComment, CATEGORIES, STATUSES, PRIORITIES, INQUIRY_EVENT } from "./inquiryStore.js";
import { getJobs, saveJobs, addJob, updateJob, deleteJob, getApplications, updateApplication, APP_STATUSES, JOB_EV } from "./jobStore.js";
import { getBlogPosts, saveBlogPost, deleteBlogPost, BLOG_EV } from "./blogStore.js";
import theme from "./theme.js";

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
const fmtDate = (iso) => {
  if (!iso) return "Never";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})+" "+d.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});
};
const fmtDateShort = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
};
const initials = (name="") => name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)||"?";

// ─── Reusable UI ──────────────────────────────────────────────────────────────
const inputCss = {width:"100%",padding:"10px 14px",border:"1.5px solid #e2e4ea",borderRadius:10,fontSize:13,color:"#1a1a2e",outline:"none",fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box",transition:"border 0.2s",background:"#fff"};
const cardCss  = {background:"#fff",borderRadius:16,border:"1px solid #e8eaef",padding:"22px 26px",marginBottom:20,boxShadow:"0 1px 6px rgba(0,0,0,0.04)"};
const saveBtnCss = {background:"#1a3c6e",color:"#fff",border:"none",padding:"10px 24px",borderRadius:10,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"inline-flex",alignItems:"center",gap:6,transition:"all 0.2s"};

function FInput({value,onChange,placeholder,type="text",style={}}) {
  return <input style={{...inputCss,...style}} value={value||""} type={type} placeholder={placeholder} onChange={e=>onChange(e.target.value)}
    onFocus={e=>e.target.style.borderColor="#1a3c6e"} onBlur={e=>e.target.style.borderColor="#e2e4ea"}/>;
}
function FField({label,children,half}) {
  return <div style={half?{}:{}}><label style={{display:"block",fontSize:11,fontWeight:700,color:"#6b6880",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.6px"}}>{label}</label>{children}</div>;
}
function ImgInput({value,onChange,label}) {
  return <div><label style={{display:"block",fontSize:11,fontWeight:700,color:"#6b6880",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.6px"}}>{label||"Image URL"}</label>
    <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
      <input style={{...inputCss,flex:1}} value={value||""} placeholder="https://..." onChange={e=>onChange(e.target.value)} onFocus={e=>e.target.style.borderColor="#1a3c6e"} onBlur={e=>e.target.style.borderColor="#e2e4ea"}/>
      {value&&<img src={value} alt="" onError={e=>e.target.style.display="none"} style={{width:52,height:44,borderRadius:8,objectFit:"cover",flexShrink:0,border:"1px solid #e2e4ea"}}/>}
    </div></div>;
}
function Toggle({checked,onChange,label,inline}) {
  const knob = <div onClick={()=>onChange(!checked)} style={{width:40,height:22,borderRadius:11,background:checked?"#1a3c6e":"#d1d5db",cursor:"pointer",position:"relative",transition:"background 0.25s",flexShrink:0}}>
    <div style={{position:"absolute",top:3,left:checked?21:3,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left 0.25s",boxShadow:"0 1px 4px rgba(0,0,0,0.15)"}}/></div>;
  if (inline) return <div style={{display:"flex",alignItems:"center",gap:10}}>{knob}<span style={{fontSize:13,fontWeight:600,color:"#1a1a2e"}}>{label}</span></div>;
  return <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid #f5f5f8"}}><span style={{fontSize:13,fontWeight:600,color:"#1a1a2e"}}>{label}</span>{knob}</div>;
}
function SaveToast({show}) {
  if (!show) return null;
  return <div style={{position:"fixed",bottom:28,right:28,zIndex:9999,background:"#1a3c6e",color:"#fff",padding:"12px 22px",borderRadius:12,fontSize:13,fontWeight:700,boxShadow:"0 8px 28px rgba(26,60,110,0.35)",display:"flex",alignItems:"center",gap:8,animation:"dashToast 0.3s ease"}}>✅ Saved & live on website!</div>;
}
function ConfirmModal({msg,onOk,onCancel}) {
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{background:"#fff",borderRadius:18,padding:"28px 32px",maxWidth:380,width:"90%",textAlign:"center"}}>
      <div style={{fontSize:40,marginBottom:12}}>⚠️</div>
      <p style={{fontSize:14,color:"#1a1a2e",lineHeight:1.7,marginBottom:22}}>{msg}</p>
      <div style={{display:"flex",gap:10,justifyContent:"center"}}>
        <button onClick={onCancel} style={{padding:"10px 22px",borderRadius:10,border:"1.5px solid #e2e4ea",background:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>Cancel</button>
        <button onClick={onOk} style={{padding:"10px 22px",borderRadius:10,border:"none",background:"#dc2626",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>Confirm</button>
      </div>
    </div></div>;
}
function EditModal({item,fields,title,onSave,onClose}) {
  const [data,setData]=useState({...item});
  const set=(k,v)=>setData(p=>({...p,[k]:v}));
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div style={{background:"#fff",borderRadius:20,padding:"28px 32px",width:"100%",maxWidth:560,maxHeight:"90vh",overflowY:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,paddingBottom:14,borderBottom:"1px solid #f0f1f5"}}>
        <h3 style={{fontSize:16,fontWeight:700,color:"#1a1a2e",margin:0}}>{title}</h3>
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#6b6880"}}>✕</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {fields.map(f=>{
          if(f.type==="image") return <ImgInput key={f.key} label={f.label} value={data[f.key]} onChange={v=>set(f.key,v)}/>;
          if(f.type==="toggle") return <div key={f.key}><label style={{display:"block",fontSize:11,fontWeight:700,color:"#6b6880",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.6px"}}>{f.label}</label><Toggle inline checked={!!data[f.key]} onChange={v=>set(f.key,v)} label={data[f.key]?"Yes":"No"}/></div>;
          if(f.type==="select") return <div key={f.key}><label style={{display:"block",fontSize:11,fontWeight:700,color:"#6b6880",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.6px"}}>{f.label}</label><select style={{...inputCss,appearance:"none",cursor:"pointer"}} value={data[f.key]||""} onChange={e=>set(f.key,e.target.value)} onFocus={e=>e.target.style.borderColor="#1a3c6e"} onBlur={e=>e.target.style.borderColor="#e2e4ea"}>{f.options.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select></div>;
          return <FField key={f.key} label={f.label}><FInput value={data[f.key]} onChange={v=>set(f.key,v)} placeholder={f.placeholder||""}/></FField>;
        })}
      </div>
      <div style={{display:"flex",gap:10,marginTop:22,paddingTop:16,borderTop:"1px solid #f0f1f5"}}>
        <button onClick={()=>onSave(data)} style={{...saveBtnCss,flex:1,padding:"12px",justifyContent:"center"}}>💾 Save</button>
        <button onClick={onClose} style={{padding:"12px 20px",borderRadius:10,border:"1.5px solid #e2e4ea",background:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>Cancel</button>
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
        <button onClick={()=>setEditing(it)} style={{padding:"7px 14px",borderRadius:8,border:"1.5px solid #1a3c6e",background:"transparent",color:"#1a3c6e",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>✏️ Edit</button>
      </div>
    ))}
    {editing&&<EditModal item={editing} fields={fields} title={editTitle} onSave={d=>{onUpdate(items.map(it=>it.id===d.id?d:it));setEditing(null);}} onClose={()=>setEditing(null)}/>}
  </div>;
}

// ─── STATUS / PRIORITY badges ─────────────────────────────────────────────────
function StatusBadge({status}) {
  const s=STATUSES[status]||STATUSES.open;
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:s.bg,color:s.color,border:`1px solid ${s.color}40`}}>{s.label}</span>;
}
function PrioBadge({priority}) {
  const p=PRIORITIES[priority]||PRIORITIES.medium;
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:`${p.color}12`,color:p.color,border:`1px solid ${p.color}35`}}>{p.label}</span>;
}
function CatBadge({category}) {
  const c=CATEGORIES[category]||{label:category,color:"#666",icon:"📋"};
  return <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:`${c.color}12`,color:c.color,border:`1px solid ${c.color}30`}}>{c.icon} {c.label}</span>;
}


// ─── TICKET DETAIL VIEW ───────────────────────────────────────────────────────
function TicketDetail({ticket,auth,onBack,onChange}) {
  const [comment,setComment]=useState("");
  const [status,setStatus]=useState(ticket.status);
  const [priority,setPriority]=useState(ticket.priority);
  const [assigned,setAssigned]=useState(ticket.assignedTo||"");
  const users=getUsers();

  const save=()=>{
    updateInquiry(ticket.id,{status,priority,assignedTo:assigned||null});
    onChange();
  };
  const submitComment=()=>{
    if(!comment.trim()) return;
    addComment(ticket.id,auth?.name||"Admin",comment.trim());
    setComment(""); onChange();
  };

  const formRows = Object.entries(ticket.form||{}).filter(([k])=>k!=="notes"&&k!=="message");
  const noteVal  = ticket.form?.notes||ticket.form?.message||"";

  return (
    <div>
      {/* Back + header */}
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24,flexWrap:"wrap"}}>
        <button onClick={onBack} style={{padding:"8px 16px",borderRadius:10,border:"1.5px solid #e2e4ea",background:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>← Back</button>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            <span style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#1a1a2e"}}>{ticket.id}</span>
            <CatBadge category={ticket.category}/>
            <StatusBadge status={status}/>
            <PrioBadge priority={priority}/>
          </div>
          <div style={{fontSize:12,color:"#9ca3af",marginTop:4}}>Created: {fmtDate(ticket.createdAt)} · Customer: <strong style={{color:"#1a1a2e"}}>{ticket.form?.name||"—"}</strong></div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:20,alignItems:"start"}}>
        {/* Left: form data + comments */}
        <div>
          {/* Customer info */}
          <div style={cardCss}>
            <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f0f1f6"}}>📋 Inquiry Details</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {formRows.map(([k,v])=>(
                <div key={k} style={{padding:"10px 14px",background:"#fafbff",borderRadius:10,border:"1px solid #e8eaef"}}>
                  <div style={{fontSize:10,color:"#9ca3af",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:3}}>{k.replace(/([A-Z])/g," $1")}</div>
                  <div style={{fontSize:13,fontWeight:600,color:"#1a1a2e"}}>{String(v)||"—"}</div>
                </div>
              ))}
            </div>
            {noteVal&&<div style={{marginTop:12,padding:"12px 14px",background:"rgba(26,60,110,0.04)",borderRadius:10,border:"1px solid rgba(26,60,110,0.12)"}}>
              <div style={{fontSize:10,color:"#9ca3af",fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Special Requirements</div>
              <div style={{fontSize:13,color:"#1a1a2e",lineHeight:1.65}}>{noteVal}</div>
            </div>}
          </div>

          {/* Comments */}
          <div style={cardCss}>
            <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f0f1f6"}}>💬 Comments & Activity ({ticket.comments?.length||0})</div>
            {(!ticket.comments||ticket.comments.length===0)&&<div style={{textAlign:"center",padding:"24px 0",color:"#9ca3af",fontSize:13}}>No comments yet — add the first one below.</div>}
            {ticket.comments?.map(c=>(
              <div key={c.id} style={{display:"flex",gap:10,marginBottom:16}}>
                <div style={{width:34,height:34,borderRadius:10,background:"#1a3c6e",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,flexShrink:0}}>{initials(c.author)}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                    <span style={{fontWeight:700,fontSize:13,color:"#1a1a2e"}}>{c.author}</span>
                    <span style={{fontSize:11,color:"#9ca3af"}}>{fmtDate(c.time)}</span>
                  </div>
                  <div style={{fontSize:13,color:"#374151",lineHeight:1.65,background:"#f9fafb",padding:"10px 14px",borderRadius:10,border:"1px solid #f0f1f6"}}>{c.text}</div>
                </div>
              </div>
            ))}
            {/* Add comment */}
            <div style={{display:"flex",gap:10,marginTop:16,paddingTop:14,borderTop:"1px solid #f5f5f8"}}>
              <div style={{width:34,height:34,borderRadius:10,background:auth?.color||"#1a3c6e",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,flexShrink:0}}>{initials(auth?.name||"A")}</div>
              <div style={{flex:1}}>
                <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Write a comment..." rows={3}
                  style={{...inputCss,resize:"none",lineHeight:1.6}} onFocus={e=>e.target.style.borderColor="#1a3c6e"} onBlur={e=>e.target.style.borderColor="#e2e4ea"}/>
                <button onClick={submitComment} disabled={!comment.trim()} style={{...saveBtnCss,marginTop:8,opacity:comment.trim()?1:0.5}}>💬 Post Comment</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: controls */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={{...cardCss,marginBottom:0}}>
            <div style={{fontSize:13,fontWeight:700,color:"#1a1a2e",marginBottom:12}}>🔧 Manage Ticket</div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <FField label="Status">
                <select style={{...inputCss,appearance:"none",cursor:"pointer"}} value={status} onChange={e=>setStatus(e.target.value)} onFocus={e=>e.target.style.borderColor="#1a3c6e"} onBlur={e=>e.target.style.borderColor="#e2e4ea"}>
                  {Object.entries(STATUSES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                </select>
              </FField>
              <FField label="Priority">
                <select style={{...inputCss,appearance:"none",cursor:"pointer"}} value={priority} onChange={e=>setPriority(e.target.value)} onFocus={e=>e.target.style.borderColor="#1a3c6e"} onBlur={e=>e.target.style.borderColor="#e2e4ea"}>
                  {Object.entries(PRIORITIES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                </select>
              </FField>
              <FField label="Assign To">
                <select style={{...inputCss,appearance:"none",cursor:"pointer"}} value={assigned} onChange={e=>setAssigned(e.target.value)} onFocus={e=>e.target.style.borderColor="#1a3c6e"} onBlur={e=>e.target.style.borderColor="#e2e4ea"}>
                  <option value="">— Unassigned —</option>
                  {users.filter(u=>u.active).map(u=><option key={u.email} value={u.email}>{u.name} ({ROLE_LABELS[u.role]})</option>)}
                </select>
              </FField>
              <button onClick={save} style={{...saveBtnCss,width:"100%",justifyContent:"center",padding:"12px"}}>💾 Update Ticket</button>
            </div>
          </div>

          {/* Quick info */}
          <div style={{...cardCss,marginBottom:0}}>
            <div style={{fontSize:13,fontWeight:700,color:"#1a1a2e",marginBottom:12}}>ℹ️ Ticket Info</div>
            {[["ID",ticket.id],["Category",CATEGORIES[ticket.category]?.label||ticket.category],["Created",fmtDateShort(ticket.createdAt)],["Comments",ticket.comments?.length||0],["Assigned",users.find(u=>u.email===ticket.assignedTo)?.name||"Unassigned"]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #f5f5f8",fontSize:13}}>
                <span style={{color:"#9ca3af",fontWeight:600}}>{k}</span>
                <span style={{color:"#1a1a2e",fontWeight:700}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── INQUIRY TAB (per category) ───────────────────────────────────────────────
function InquiryTab({category,auth}) {
  const [tickets,setTickets]=useState(()=>getInquiries().filter(t=>t.category===category));
  const [detail,setDetail]=useState(null);
  const [filter,setFilter]=useState("all");
  const [search,setSearch]=useState("");

  useEffect(()=>{
    const h=()=>setTickets(getInquiries().filter(t=>t.category===category));
    window.addEventListener(INQUIRY_EVENT||"edafay_inquiries_updated",h);
    return ()=>window.removeEventListener(INQUIRY_EVENT||"edafay_inquiries_updated",h);
  },[category]);

  const refresh=()=>setTickets(getInquiries().filter(t=>t.category===category));

  const shown = tickets.filter(t=>{
    if(filter!=="all"&&t.status!==filter) return false;
    if(search){
      const q=search.toLowerCase();
      return t.id.toLowerCase().includes(q)||(t.form?.name||"").toLowerCase().includes(q)||(t.form?.phone||"").toLowerCase().includes(q);
    }
    return true;
  });

  const cat=CATEGORIES[category]||{label:category,icon:"📋",color:"#666"};
  const counts={total:tickets.length,open:tickets.filter(t=>t.status==="open").length,in_progress:tickets.filter(t=>t.status==="in_progress").length,closed:tickets.filter(t=>t.status==="closed").length};

  if(detail) return <TicketDetail ticket={getInquiries().find(t=>t.id===detail)||tickets.find(t=>t.id===detail)||detail} auth={auth} onBack={()=>{setDetail(null);refresh();}} onChange={refresh}/>;

  return (
    <div>
      {/* Stats row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
        {[{l:"Total",v:counts.total,c:"#1a3c6e"},{l:"Open",v:counts.open,c:"#dc2626"},{l:"In Progress",v:counts.in_progress,c:"#ea580c"},{l:"Closed",v:counts.closed,c:"#16a34a"}].map(s=>(
          <div key={s.l} style={{background:"#fff",borderRadius:14,border:"1px solid #e8eaef",padding:"16px 20px",boxShadow:"0 1px 6px rgba(0,0,0,0.04)"}}>
            <div style={{fontSize:11,color:"#9ca3af",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.6px",marginBottom:6}}>{s.l}</div>
            <div style={{fontSize:30,fontWeight:800,color:s.c,fontFamily:"'Playfair Display',serif",lineHeight:1}}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
        <input style={{...inputCss,flex:1,maxWidth:280}} placeholder="Search by name, phone, ticket ID..." value={search} onChange={e=>setSearch(e.target.value)} onFocus={e=>e.target.style.borderColor="#1a3c6e"} onBlur={e=>e.target.style.borderColor="#e2e4ea"}/>
        {["all","open","in_progress","closed"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{padding:"8px 16px",borderRadius:8,border:`1.5px solid ${filter===f?"#1a3c6e":"#e2e4ea"}`,background:filter===f?"rgba(26,60,110,0.08)":"#fff",color:filter===f?"#1a3c6e":"#6b6880",fontSize:12,fontWeight:700,cursor:"pointer"}}>
            {f==="all"?"All":f==="in_progress"?"In Progress":f.charAt(0).toUpperCase()+f.slice(1)} {f!=="all"?`(${counts[f]||0})`:`(${counts.total})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{background:"#fff",borderRadius:16,border:"1px solid #e8eaef",overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,0.04)"}}>
        <div style={{display:"grid",gridTemplateColumns:"90px 1fr 120px 100px 100px 110px 80px",gap:0,padding:"10px 16px",background:"#f8f9fc",borderBottom:"1px solid #e8eaef",fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.7px"}}>
          {["Ticket ID","Customer","Date","Status","Priority","Assigned","Action"].map(h=><div key={h}>{h}</div>)}
        </div>
        {shown.length===0&&<div style={{textAlign:"center",padding:"48px 20px",color:"#9ca3af",fontSize:14}}>No {filter==="all"?"inquiries":filter} tickets found.</div>}
        {shown.map((t,i)=>{
          const users=getUsers();
          const assignee=users.find(u=>u.email===t.assignedTo);
          return (
            <div key={t.id} style={{display:"grid",gridTemplateColumns:"90px 1fr 120px 100px 100px 110px 80px",gap:0,padding:"12px 16px",borderBottom:i<shown.length-1?"1px solid #f5f5f8":"none",alignItems:"center",cursor:"pointer",transition:"background 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.background="#fafbff"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{fontWeight:700,fontSize:12,color:"#1a3c6e"}}>{t.id}</div>
              <div>
                <div style={{fontWeight:600,fontSize:13,color:"#1a1a2e"}}>{t.form?.name||"—"}</div>
                <div style={{fontSize:11,color:"#9ca3af"}}>{t.form?.phone||t.form?.email||"—"}</div>
              </div>
              <div style={{fontSize:12,color:"#6b6880"}}>{fmtDateShort(t.createdAt)}</div>
              <div><StatusBadge status={t.status}/></div>
              <div><PrioBadge priority={t.priority}/></div>
              <div style={{fontSize:12,color:"#6b6880"}}>{assignee?<span style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:22,height:22,borderRadius:6,background:assignee.color||"#1a3c6e",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700}}>{initials(assignee.name)}</div>{assignee.name.split(" ")[0]}</span>:"—"}</div>
              <div><button onClick={()=>setDetail(t.id)} style={{padding:"6px 12px",borderRadius:8,border:"1.5px solid #1a3c6e",background:"transparent",color:"#1a3c6e",fontSize:11,fontWeight:700,cursor:"pointer"}}>View →</button></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────
function OverviewTab({content,auth}) {
  const [tickets,setTickets]=useState(()=>getInquiries());
  useEffect(()=>{
    const h=()=>setTickets(getInquiries());
    window.addEventListener("edafay_inquiries_updated",h);
    return ()=>window.removeEventListener("edafay_inquiries_updated",h);
  },[]);

  const users=getUsers();
  const total=tickets.length, open=tickets.filter(t=>t.status==="open").length, inprog=tickets.filter(t=>t.status==="in_progress").length, closed=tickets.filter(t=>t.status==="closed").length;

  const catStats=Object.entries(CATEGORIES).map(([k,v])=>{
    const ct=tickets.filter(t=>t.category===k);
    return {key:k,...v,total:ct.length,open:ct.filter(t=>t.status==="open").length};
  });

  const recent=tickets.slice(0,6);

  return (
    <div>
      {/* Welcome */}
      <div style={{background:"linear-gradient(135deg,#1a3c6e 0%,#2a5298 100%)",borderRadius:18,padding:"22px 28px",marginBottom:24,color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.8px"}}>Welcome back</div>
          <div style={{fontSize:20,fontWeight:700,fontFamily:"'Playfair Display',serif"}}>{auth?.name} <span style={{color:"rgba(255,255,255,0.5)",fontSize:15,fontWeight:400}}>({ROLE_LABELS[auth?.role]})</span></div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.6)",marginTop:3}}>Last login: {fmtDate(auth?.lastLogin)}</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>window.open("#","_self")} style={{padding:"9px 18px",borderRadius:10,background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.25)",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}} onClick={()=>{window.location.hash=""}}>🏠 View Site</button>
        </div>
      </div>

      {/* Inquiry stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}} className="stat-grid">
        {[{l:"Total Inquiries",v:total,c:"#1a3c6e",i:""},{l:"Open",v:open,c:"#dc2626",i:""},{l:"In Progress",v:inprog,c:"#ea580c",i:""},{l:"Closed",v:closed,c:"#16a34a",i:""}].map(s=>(
          <div key={s.l} style={{background:"#fff",borderRadius:14,border:"1px solid #e8eaef",padding:"18px 20px",boxShadow:"0 1px 6px rgba(0,0,0,0.04)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div><div style={{fontSize:11,color:"#9ca3af",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.6px",marginBottom:6}}>{s.l}</div>
              <div style={{fontSize:30,fontWeight:800,color:s.c,fontFamily:"'Playfair Display',serif",lineHeight:1}}>{s.v}</div></div>
              <div style={{width:40,height:40,borderRadius:12,background:`${s.c}14`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{s.i}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Per-category */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:24}} className="cat-grid">
        {catStats.map(c=>(
          <div key={c.key} style={{background:"#fff",borderRadius:14,border:`1px solid ${c.color}25`,padding:"16px",boxShadow:"0 1px 6px rgba(0,0,0,0.03)"}}>
            <div style={{fontSize:22,marginBottom:8}}>{c.icon}</div>
            <div style={{fontSize:12,fontWeight:700,color:"#1a1a2e",marginBottom:4}}>{c.label}</div>
            <div style={{display:"flex",gap:6,alignItems:"baseline"}}>
              <span style={{fontSize:24,fontWeight:800,color:c.color,fontFamily:"'Playfair Display',serif"}}>{c.total}</span>
              <span style={{fontSize:11,color:"#9ca3af"}}>total</span>
            </div>
            {c.open>0&&<div style={{fontSize:11,color:"#dc2626",fontWeight:600,marginTop:4}}>🔴 {c.open} open</div>}
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        {/* Recent tickets */}
        <div style={cardCss}>
          <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f0f1f6"}}>🕐 Recent Tickets</div>
          {recent.map(t=>(
            <div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid #f5f5f8"}}>
              <div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontWeight:700,fontSize:12,color:"#1a3c6e"}}>{t.id}</span><CatBadge category={t.category}/></div>
                <div style={{fontSize:12,color:"#6b6880",marginTop:2}}>{t.form?.name||"—"} · {fmtDateShort(t.createdAt)}</div>
              </div>
              <StatusBadge status={t.status}/>
            </div>
          ))}
        </div>

        {/* Team workload */}
        <div style={cardCss}>
          <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f0f1f6"}}>👥 Team Workload</div>
          {users.filter(u=>u.active).map(u=>{
            const assigned=tickets.filter(t=>t.assignedTo===u.email);
            const openCount=assigned.filter(t=>t.status!=="closed").length;
            return (
              <div key={u.id} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:"1px solid #f5f5f8"}}>
                <div style={{width:34,height:34,borderRadius:10,background:u.color||"#1a3c6e",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,flexShrink:0}}>{initials(u.name)}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13,color:"#1a1a2e"}}>{u.name}</div>
                  <div style={{fontSize:11,color:"#9ca3af"}}>{ROLE_LABELS[u.role]}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:16,fontWeight:800,color:"#1a3c6e",fontFamily:"'Playfair Display',serif"}}>{assigned.length}</div>
                  <div style={{fontSize:10,color:"#9ca3af"}}>assigned</div>
                </div>
                {openCount>0&&<span style={{fontSize:11,fontWeight:700,background:"rgba(239,68,68,0.1)",color:"#dc2626",padding:"2px 8px",borderRadius:20,border:"1px solid rgba(239,68,68,0.25)"}}>{openCount} open</span>}
              </div>
            );
          })}
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"9px 0"}}>
            <div style={{width:34,height:34,borderRadius:10,background:"#9ca3af",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,flexShrink:0}}>?</div>
            <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:"#6b6880"}}>Unassigned</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:16,fontWeight:800,color:"#9ca3af",fontFamily:"'Playfair Display',serif"}}>{tickets.filter(t=>!t.assignedTo).length}</div><div style={{fontSize:10,color:"#9ca3af"}}>tickets</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── CONTENT TAB (all-in-one) ─────────────────────────────────────────────────
function ContentTab({content,setContent,onSave}) {
  const [section,setSection]=useState("hero");
  const h=content.hero, us=content.umrahSection, cs=content.carsSection, vs=content.visaSection, rv=content.reviewsSection, ct=content.ctaSection;
  const updH=(k,v)=>setContent(p=>({...p,hero:{...p.hero,[k]:v}}));
  const updUs=(k,v)=>setContent(p=>({...p,umrahSection:{...p.umrahSection,[k]:v}}));
  const updCs=(k,v)=>setContent(p=>({...p,carsSection:{...p.carsSection,[k]:v}}));
  const updVs=(k,v)=>setContent(p=>({...p,visaSection:{...p.visaSection,[k]:v}}));
  const updRv=(k,v)=>setContent(p=>({...p,reviewsSection:{...p.reviewsSection,[k]:v}}));
  const updCt=(k,v)=>setContent(p=>({...p,ctaSection:{...p.ctaSection,[k]:v}}));

  const sections=[{k:"hero",i:"🏠",l:"Hero"},{k:"umrah",i:"🕌",l:"Umrah"},{k:"cars",i:"🚗",l:"Cars"},{k:"visas",i:"🛂",l:"Visas"},{k:"reviews",i:"⭐",l:"Reviews"},{k:"cta",i:"📧",l:"CTA"}];

  const umrahFields=[{key:"name",label:"Package Name"},{key:"category",label:"Category"},{key:"price",label:"Price",placeholder:"PKR 0,000"},{key:"days",label:"Duration",placeholder:"14 Days"},{key:"tag",label:"Tag / Badge"},{key:"rating",label:"Rating",placeholder:"4.9"},{key:"reviews",label:"Review Count"},{key:"img",label:"Image",type:"image"}];
  const carFields=[{key:"name",label:"Car Name"},{key:"company",label:"Company"},{key:"type",label:"Type"},{key:"seats",label:"Seats"},{key:"price",label:"Price/Day",placeholder:"PKR 0,000"},{key:"tag",label:"Tag"},{key:"available",label:"Available",type:"toggle"},{key:"img",label:"Image",type:"image"}];
  const visaFields=[{key:"country",label:"Country"},{key:"flag",label:"Flag Emoji",placeholder:"🇵🇰"},{key:"type",label:"Visa Type"},{key:"processing",label:"Processing"},{key:"fee",label:"Fee",placeholder:"PKR 8,500"},{key:"approvalRate",label:"Approval Rate",placeholder:"99%"},{key:"img",label:"Image",type:"image"}];

  return (
    <div>
      {/* Section tabs */}
      <div style={{display:"flex",gap:6,marginBottom:24,flexWrap:"wrap"}}>
        {sections.map(s=>(
          <button key={s.k} onClick={()=>setSection(s.k)} style={{padding:"8px 18px",borderRadius:9,border:`1.5px solid ${section===s.k?"#1a3c6e":"#e2e4ea"}`,background:section===s.k?"rgba(26,60,110,0.08)":"#fff",color:section===s.k?"#1a3c6e":"#6b6880",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
            {s.i} {s.l}
          </button>
        ))}
        <button onClick={onSave} style={{...saveBtnCss,marginLeft:"auto"}}>💾 Save All</button>
      </div>

      {/* Hero */}
      {section==="hero"&&<div>
        <div style={cardCss}><div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:16,paddingBottom:12,borderBottom:"1px solid #f0f1f6"}}>🖼️ Hero Image</div><ImgInput label="Hero Image URL" value={h.heroImage} onChange={v=>updH("heroImage",v)}/></div>
        <div style={cardCss}><div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:16,paddingBottom:12,borderBottom:"1px solid #f0f1f6"}}>📝 Heading & Text</div>
          <div style={{display:"flex",flexDirection:"column",gap:13}}>
            <FField label="Line 1"><FInput value={h.heading1} onChange={v=>updH("heading1",v)}/></FField>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <FField label="Accent Word"><FInput value={h.headingAccent} onChange={v=>updH("headingAccent",v)}/></FField>
              <FField label="Italic Word"><FInput value={h.headingItalic} onChange={v=>updH("headingItalic",v)}/></FField>
            </div>
            <FField label="Subtitle"><FInput value={h.subtext} onChange={v=>updH("subtext",v)}/></FField>
          </div>
        </div>
        <div style={cardCss}><div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:16,paddingBottom:12,borderBottom:"1px solid #f0f1f6"}}>📊 Stats & Badge</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:14}}>
            {[["stat1Num","stat1Label","Stat 1"],["stat2Num","stat2Label","Stat 2"],["stat3Num","stat3Label","Stat 3"]].map(([nk,lk,t])=>(
              <div key={nk} style={{padding:"14px",background:"#fafbff",borderRadius:12,border:"1px solid #e8eaef"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#9ca3af",marginBottom:10,textTransform:"uppercase"}}>{t}</div>
                <FField label="Number"><FInput value={h[nk]} onChange={v=>updH(nk,v)}/></FField>
                <div style={{marginTop:8}}><FField label="Label"><FInput value={h[lk]} onChange={v=>updH(lk,v)}/></FField></div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <FField label="Badge Title"><FInput value={h.badgeLabel} onChange={v=>updH("badgeLabel",v)}/></FField>
            <FField label="Badge Subtitle"><FInput value={h.badgeSub} onChange={v=>updH("badgeSub",v)}/></FField>
          </div>
        </div>
      </div>}

      {/* Umrah */}
      {section==="umrah"&&<div>
        <div style={cardCss}><div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f0f1f6"}}>📝 Section Text</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:13}}><FField label="Heading"><FInput value={us.heading} onChange={v=>updUs("heading",v)}/></FField><FField label="Accent Word"><FInput value={us.headingAccent} onChange={v=>updUs("headingAccent",v)}/></FField><FField label="Subtext"><FInput value={us.subtext} onChange={v=>updUs("subtext",v)}/></FField></div>
        </div>
        <div style={cardCss}><div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f0f1f6"}}>🕌 Packages ({content.umrahPackages?.length})</div>
          <ItemList items={content.umrahPackages||[]} fields={umrahFields} editTitle="Edit Umrah Package" onUpdate={v=>setContent(p=>({...p,umrahPackages:v}))} renderPrev={it=><img src={it.img} alt="" onError={e=>e.target.style.display="none"} style={{width:60,height:44,borderRadius:8,objectFit:"cover",flexShrink:0}}/>} renderInfo={it=><><div style={{fontWeight:700,fontSize:13,color:"#1a1a2e"}}>{it.name}</div><div style={{fontSize:12,color:"#6b6880",marginTop:2}}>{it.price} · {it.days} · ⭐{it.rating}</div></>}/>
        </div>
      </div>}

      {/* Cars */}
      {section==="cars"&&<div>
        <div style={cardCss}><div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f0f1f6"}}>📝 Section Text</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:13}}><FField label="Heading"><FInput value={cs.heading} onChange={v=>updCs("heading",v)}/></FField><FField label="Accent Word"><FInput value={cs.headingAccent} onChange={v=>updCs("headingAccent",v)}/></FField><FField label="Subtext"><FInput value={cs.subtext} onChange={v=>updCs("subtext",v)}/></FField></div>
        </div>
        <div style={cardCss}><div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f0f1f6"}}>🚗 Featured Cars ({content.carRentalHighlights?.length})</div>
          <ItemList items={content.carRentalHighlights||[]} fields={carFields} editTitle="Edit Car" onUpdate={v=>setContent(p=>({...p,carRentalHighlights:v}))} renderPrev={it=><img src={it.img} alt="" onError={e=>e.target.style.display="none"} style={{width:60,height:44,borderRadius:8,objectFit:"cover",flexShrink:0}}/>} renderInfo={it=><><div style={{fontWeight:700,fontSize:13,color:"#1a1a2e"}}>{it.name}</div><div style={{fontSize:12,color:"#6b6880",marginTop:2}}>{it.company} · {it.type} · 🪑{it.seats} · {it.price}/day</div></>}/>
        </div>
      </div>}

      {/* Visas */}
      {section==="visas"&&<div>
        <div style={cardCss}><div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f0f1f6"}}>📝 Section Text</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}><FField label="Heading"><FInput value={vs.heading} onChange={v=>updVs("heading",v)}/></FField><FField label="Accent Word"><FInput value={vs.headingAccent} onChange={v=>updVs("headingAccent",v)}/></FField><FField label="After Accent"><FInput value={vs.headingEnd} onChange={v=>updVs("headingEnd",v)}/></FField><FField label="Subtext"><FInput value={vs.subtext} onChange={v=>updVs("subtext",v)}/></FField></div>
        </div>
        <div style={cardCss}><div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f0f1f6"}}>🛂 Visas ({content.visasList?.length})</div>
          <ItemList items={content.visasList||[]} fields={visaFields} editTitle="Edit Visa" onUpdate={v=>setContent(p=>({...p,visasList:v}))} renderPrev={it=><img src={it.img} alt="" onError={e=>e.target.style.display="none"} style={{width:60,height:44,borderRadius:8,objectFit:"cover",flexShrink:0}}/>} renderInfo={it=><><div style={{fontWeight:700,fontSize:13,color:"#1a1a2e"}}>{it.flag} {it.country}</div><div style={{fontSize:12,color:"#6b6880",marginTop:2}}>{it.type} · {it.processing} · {it.fee}</div></>}/>
        </div>
      </div>}

      {/* Reviews */}
      {section==="reviews"&&<div style={cardCss}>
        <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f0f1f6"}}>⭐ Reviews Section</div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><FField label="Heading"><FInput value={rv.heading} onChange={v=>updRv("heading",v)}/></FField><FField label="Accent Word"><FInput value={rv.headingAccent} onChange={v=>updRv("headingAccent",v)}/></FField></div>
          <FField label="After Accent"><FInput value={rv.headingEnd} onChange={v=>updRv("headingEnd",v)}/></FField>
          <FField label="Subtext"><FInput value={rv.subtext} onChange={v=>updRv("subtext",v)}/></FField>
        </div>
      </div>}

      {/* CTA */}
      {section==="cta"&&<div style={cardCss}>
        <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f0f1f6"}}>📧 CTA / Subscribe</div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><FField label="Heading"><FInput value={ct.heading} onChange={v=>updCt("heading",v)}/></FField><FField label="Accent Word"><FInput value={ct.headingAccent} onChange={v=>updCt("headingAccent",v)}/></FField></div>
          <FField label="Subtext"><FInput value={ct.subtext} onChange={v=>updCt("subtext",v)}/></FField>
        </div>
      </div>}
    </div>
  );
}

// ─── VISIBILITY TAB ───────────────────────────────────────────────────────────
function VisibilityTab({content,setContent,onSave}) {
  const up=(k,v)=>setContent(p=>({...p,sections:{...p.sections,[k]:v}}));
  const secs=[{k:"hero",i:"🏠",l:"Hero / Main Banner"},{k:"umrah",i:"🕌",l:"Umrah Packages"},{k:"carRental",i:"🚗",l:"Car Rental"},{k:"features",i:"💎",l:"Features / Why Us"},{k:"visa",i:"🛂",l:"Visa Services"},{k:"reviews",i:"⭐",l:"Reviews"},{k:"cta",i:"📧",l:"Subscribe / CTA"}];
  return (
    <div>
      <div style={cardCss}>
        <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:16,paddingBottom:12,borderBottom:"1px solid #f0f1f6"}}>👁️ Show / Hide Sections</div>
        {secs.map(s=>(
          <div key={s.k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 0",borderBottom:"1px solid #f5f5f8"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:18}}>{s.i}</span><span style={{fontSize:13,fontWeight:600,color:"#1a1a2e"}}>{s.l}</span></div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:content.sections[s.k]?"rgba(22,163,74,0.1)":"rgba(239,68,68,0.08)",color:content.sections[s.k]?"#16a34a":"#dc2626",border:`1px solid ${content.sections[s.k]?"rgba(22,163,74,0.25)":"rgba(239,68,68,0.2)"}`}}>{content.sections[s.k]?"Visible":"Hidden"}</span>
              <div onClick={()=>up(s.k,!content.sections[s.k])} style={{width:44,height:24,borderRadius:12,background:content.sections[s.k]?"#1a3c6e":"#d1d5db",cursor:"pointer",position:"relative",transition:"background 0.25s"}}>
                <div style={{position:"absolute",top:3,left:content.sections[s.k]?23:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left 0.25s",boxShadow:"0 1px 4px rgba(0,0,0,0.15)"}}/>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button style={saveBtnCss} onClick={onSave}>💾 Save Visibility</button>
    </div>
  );
}


// ─── USER MANAGEMENT ──────────────────────────────────────────────────────────
function UserTab({auth}) {
  const [users,setUsers]=useState(()=>getUsers());
  const [editing,setEditing]=useState(null);
  const [addMode,setAddMode]=useState(false);
  const [confirm,setConfirm]=useState(null);
  const [toast,setToast]=useState(false);
  const persist=(u)=>{saveUsers(u);setUsers(u);setToast(true);setTimeout(()=>setToast(false),2200);};
  const isSA=auth?.role==="super_admin";
  const newUser={id:Date.now(),name:"",email:"",password:"",role:"editor",color:"#1a3c6e",active:true,createdAt:new Date().toISOString().split("T")[0],lastLogin:null};
  const userFields=[{key:"name",label:"Full Name"},{key:"email",label:"Email"},{key:"password",label:"Password",type:"password",placeholder:"Leave blank to keep"},{key:"role",label:"Role",type:"select",options:[{v:"super_admin",l:"Super Admin"},{v:"editor",l:"Editor"},{v:"viewer",l:"Viewer"}]},{key:"active",label:"Account Active",type:"toggle"},{key:"color",label:"Avatar Color",placeholder:"#1a3c6e"}];
  const handleSave=(data)=>{
    const existing=users.find(u=>u.id===data.id);
    if(!data.password&&existing) data={...data,password:existing.password};
    data={...data,avatar:initials(data.name||"?")};
    if(addMode){persist([...users,data]);setAddMode(false);}
    else persist(users.map(u=>u.id===data.id?data:u));
    setEditing(null);
  };
  return (
    <div>
      {toast&&<div style={{position:"fixed",bottom:28,right:28,zIndex:9999,background:"#16a34a",color:"#fff",padding:"12px 22px",borderRadius:12,fontSize:13,fontWeight:700,boxShadow:"0 4px 20px rgba(22,163,74,0.35)"}}>✅ User updated!</div>}
      {confirm&&<ConfirmModal msg={`Delete "${confirm.name}"? Cannot be undone.`} onOk={()=>{persist(users.filter(u=>u.id!==confirm.id));setConfirm(null);}} onCancel={()=>setConfirm(null)}/>}
      {(editing||addMode)&&<EditModal item={editing||newUser} fields={userFields} title={addMode?"Add User":"Edit User"} onSave={handleSave} onClose={()=>{setEditing(null);setAddMode(false);}}/>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div><div style={{fontSize:14,fontWeight:700,color:"#1a1a2e"}}>Admin Users ({users.length})</div><div style={{fontSize:12,color:"#9ca3af",marginTop:2}}>Manage dashboard access</div></div>
        {isSA&&<button onClick={()=>setAddMode(true)} style={{...saveBtnCss,background:"#16a34a"}}>+ Add User</button>}
      </div>
      <div style={cardCss}>
        {users.map((u,i)=>(
          <div key={u.id} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 0",borderBottom:i<users.length-1?"1px solid #f5f5f8":"none",flexWrap:"wrap"}}>
            <div style={{width:44,height:44,borderRadius:14,background:u.color||"#1a3c6e",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,flexShrink:0}}>{initials(u.name)}</div>
            <div style={{flex:1,minWidth:150}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <span style={{fontWeight:700,fontSize:13,color:"#1a1a2e"}}>{u.name}</span>
                {u.id===auth?.id&&<span style={{fontSize:10,fontWeight:700,background:"rgba(26,60,110,0.1)",color:"#1a3c6e",padding:"2px 8px",borderRadius:20}}>YOU</span>}
              </div>
              <div style={{fontSize:12,color:"#9ca3af",marginTop:2}}>{u.email}</div>
              <div style={{fontSize:11,color:"#9ca3af",marginTop:1}}>Last login: {fmtDate(u.lastLogin)}</div>
            </div>
            <div style={{display:"flex",gap:7,alignItems:"center",flexWrap:"wrap"}}>
              <span style={{display:"inline-flex",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:`${ROLE_COLORS[u.role]}18`,color:ROLE_COLORS[u.role],border:`1px solid ${ROLE_COLORS[u.role]}35`}}>{ROLE_LABELS[u.role]}</span>
              <span style={{display:"inline-flex",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:u.active?"rgba(22,163,74,0.1)":"rgba(239,68,68,0.08)",color:u.active?"#16a34a":"#dc2626",border:`1px solid ${u.active?"rgba(22,163,74,0.25)":"rgba(239,68,68,0.2)"}`}}>{u.active?"Active":"Inactive"}</span>
            </div>
            {isSA&&<div style={{display:"flex",gap:7,flexShrink:0}}>
              <button onClick={()=>setEditing(u)} style={{padding:"7px 14px",borderRadius:8,border:"1.5px solid #1a3c6e",background:"transparent",color:"#1a3c6e",fontSize:12,fontWeight:700,cursor:"pointer"}}>✏️ Edit</button>
              <button onClick={()=>persist(users.map(x=>x.id===u.id?{...x,active:!x.active}:x))} style={{padding:"7px 12px",borderRadius:8,border:`1.5px solid ${u.active?"#ea580c":"#16a34a"}`,background:"transparent",color:u.active?"#ea580c":"#16a34a",fontSize:12,fontWeight:700,cursor:"pointer"}}>{u.active?"Deactivate":"Activate"}</button>
              {u.id!==auth?.id&&<button onClick={()=>setConfirm(u)} style={{padding:"7px 12px",borderRadius:8,border:"1.5px solid #dc2626",background:"transparent",color:"#dc2626",fontSize:12,fontWeight:700,cursor:"pointer"}}>🗑️</button>}
            </div>}
          </div>
        ))}
      </div>
      {/* Role permissions */}
      <div style={cardCss}>
        <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f0f1f6"}}>🔑 Role Permissions</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {[{role:"super_admin",perms:["Full CMS access","User management","Reset content","All sections","All tickets"]},{role:"editor",perms:["Edit CMS content","Manage tickets","Assign tickets","Add comments","Section visibility"]},{role:"viewer",perms:["Read-only dashboard","View statistics","View tickets","No edit access","No user management"]}].map(r=>(
            <div key={r.role} style={{padding:"14px 16px",borderRadius:12,border:`1px solid ${ROLE_COLORS[r.role]}30`,background:`${ROLE_COLORS[r.role]}06`}}>
              <div style={{fontWeight:700,fontSize:13,color:ROLE_COLORS[r.role],marginBottom:10}}>{ROLE_LABELS[r.role]}</div>
              {r.perms.map(p=><div key={p} style={{fontSize:12,color:"#6b6880",marginBottom:5,display:"flex",gap:6}}><span>•</span>{p}</div>)}
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
  const handlePw=()=>{
    const users=getUsers(),me=users.find(u=>u.id===auth?.id);
    if(!me||me.password!==pwForm.current){setPwMsg("❌ Current password is incorrect.");return;}
    if(pwForm.newPw.length<6){setPwMsg("❌ Min 6 characters.");return;}
    if(pwForm.newPw!==pwForm.confirm){setPwMsg("❌ Passwords do not match.");return;}
    saveUsers(users.map(u=>u.id===auth.id?{...u,password:pwForm.newPw}:u));
    setPwForm({current:"",newPw:"",confirm:""});
    setPwMsg("✅ Password changed!");setTimeout(()=>setPwMsg(""),3000);
  };
  return (
    <div>
      {resetConf&&<ConfirmModal msg="Reset ALL website content to default? Cannot be undone." onOk={()=>{resetContent();setContent(getContent());setResetConf(false);onSave();}} onCancel={()=>setResetConf(false)}/>}
      <div style={cardCss}>
        <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f0f1f6"}}>👤 My Account</div>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{width:56,height:56,borderRadius:18,background:auth?.color||"#1a3c6e",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:18}}>{initials(auth?.name||"")}</div>
          <div><div style={{fontWeight:700,fontSize:16,color:"#1a1a2e"}}>{auth?.name}</div><div style={{fontSize:13,color:"#6b6880"}}>{auth?.email}</div><span style={{display:"inline-flex",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:`${ROLE_COLORS[auth?.role]||"#1a3c6e"}18`,color:ROLE_COLORS[auth?.role]||"#1a3c6e",border:`1px solid ${ROLE_COLORS[auth?.role]||"#1a3c6e"}35`,marginTop:6}}>{ROLE_LABELS[auth?.role]}</span></div>
        </div>
      </div>
      <div style={cardCss}>
        <div style={{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f0f1f6"}}>🔐 Change Password</div>
        <div style={{display:"flex",flexDirection:"column",gap:12,maxWidth:400}}>
          <FField label="Current Password"><FInput value={pwForm.current} onChange={v=>setPwForm(p=>({...p,current:v}))} type="password" placeholder="Current password"/></FField>
          <FField label="New Password"><FInput value={pwForm.newPw} onChange={v=>setPwForm(p=>({...p,newPw:v}))} type="password" placeholder="Min 6 characters"/></FField>
          <FField label="Confirm New Password"><FInput value={pwForm.confirm} onChange={v=>setPwForm(p=>({...p,confirm:v}))} type="password" placeholder="Repeat new password"/></FField>
          {pwMsg&&<div style={{fontSize:13,color:pwMsg.startsWith("✅")?"#16a34a":"#dc2626",fontWeight:600}}>{pwMsg}</div>}
          <button onClick={handlePw} style={{...saveBtnCss,alignSelf:"flex-start"}}>🔐 Update Password</button>
        </div>
      </div>
      <div style={{...cardCss,border:"1px solid rgba(239,68,68,0.25)",background:"rgba(239,68,68,0.02)"}}>
        <div style={{fontSize:14,fontWeight:700,color:"#dc2626",marginBottom:12,paddingBottom:10,borderBottom:"1px solid rgba(239,68,68,0.15)"}}>⚠️ Actions</div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          {auth?.role==="super_admin"&&<button onClick={()=>setResetConf(true)} style={{padding:"11px 20px",borderRadius:10,border:"1.5px solid #dc2626",background:"transparent",color:"#dc2626",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>🔄 Reset All Content</button>}
          <button onClick={onLogout} style={{padding:"11px 20px",borderRadius:10,border:"1.5px solid #ea580c",background:"transparent",color:"#ea580c",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>🚪 Sign Out</button>
        </div>
      </div>
    </div>
  );
}



// ─── JOBS TAB ─────────────────────────────────────────────────────────────────
function JobsTab({ auth }) {
  const [view,       setView]       = useState("applications"); // "applications" | "postings"
  const [jobs,       setJobs]       = useState(() => getJobs());
  const [apps,       setApps]       = useState(() => getApplications());
  const [selJob,     setSelJob]     = useState(null);   // filter apps by job
  const [selApp,     setSelApp]     = useState(null);   // detail view
  const [addJobMode, setAddJobMode] = useState(false);
  const [editJob,    setEditJob]    = useState(null);
  const [confirm,    setConfirm]    = useState(null);
  const [toast,      setToast]      = useState("");

  useEffect(() => {
    const h = () => { setJobs(getJobs()); setApps(getApplications()); };
    window.addEventListener(JOB_EV, h);
    return () => window.removeEventListener(JOB_EV, h);
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };
  const isSA = auth?.role !== "viewer";

  const shownApps = selJob ? apps.filter(a => a.jobId === selJob) : apps;

  const jobFields = [
    { key:"title",       label:"Job Title"        },
    { key:"department",  label:"Department"        },
    { key:"type",        label:"Employment Type",  placeholder:"Full-time / Part-time / Remote" },
    { key:"location",    label:"Location",         placeholder:"Lahore / Remote" },
    { key:"salary",      label:"Salary Range",     placeholder:"PKR 50,000–80,000/month" },
    { key:"description", label:"Job Description"   },
    { key:"active",      label:"Active (visible to applicants)", type:"toggle" },
  ];

  const handleSaveJob = (data) => {
    if (editJob) { updateJob(data.id, data); showToast("✅ Job updated!"); }
    else { addJob(data); showToast("✅ Job posted!"); }
    setJobs(getJobs()); setEditJob(null); setAddJobMode(false);
  };

  const handleDeleteJob = (id) => {
    deleteJob(id);
    setJobs(getJobs());
    setApps(getApplications());
    setConfirm(null);
    showToast("🗑️ Job deleted.");
  };

  const handleUpdateApp = (id, patch) => {
    updateApplication(id, patch);
    setApps(getApplications());
    if (selApp?.id === id) setSelApp({ ...selApp, ...patch });
    showToast("✅ Application updated!");
  };

  // Application detail view
  if (selApp) {
    const job = jobs.find(j => j.id === selApp.jobId);
    const [reason, setReason] = useState(selApp.statusReason || "");
    const [notes,  setNotes]  = useState(selApp.notes || "");
    const st = selApp.status;
    return (
      <div>
        {toast && <div style={{ position:"fixed",bottom:28,right:28,zIndex:9999,background:"#1a3c6e",color:"#fff",padding:"12px 22px",borderRadius:12,fontSize:13,fontWeight:700 }}>{toast}</div>}
        <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:24 }}>
          <button onClick={() => setSelApp(null)} style={{ padding:"8px 16px",borderRadius:10,border:"1.5px solid #e2e4ea",background:"#fff",fontSize:13,fontWeight:700,cursor:"pointer" }}>← Back</button>
          <div>
            <div style={{ fontSize:18,fontWeight:700,color:"#1a1a2e",fontFamily:"'Playfair Display',serif" }}>{selApp.name}</div>
            <div style={{ fontSize:12,color:"#9ca3af",marginTop:2 }}>Applied for: <strong>{selApp.jobTitle}</strong> · {new Date(selApp.appliedAt).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</div>
          </div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 300px",gap:20,alignItems:"start" }}>
          <div>
            <div style={cardCss}>
              <div style={{ fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f0f1f6" }}>📋 Applicant Details</div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                {[["Name",selApp.name],["Phone",selApp.phone],["Email",selApp.email||"—"],["City",selApp.city||"—"],["Resume",selApp.resumeName||"—"],["Applied",new Date(selApp.appliedAt).toLocaleDateString()]].map(([k,v])=>(
                  <div key={k} style={{ padding:"10px 14px",background:"#fafbff",borderRadius:10,border:"1px solid #e8eaef" }}>
                    <div style={{ fontSize:10,color:"#9ca3af",fontWeight:700,textTransform:"uppercase",marginBottom:3 }}>{k}</div>
                    <div style={{ fontSize:13,fontWeight:600,color:"#1a1a2e" }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:14,padding:"14px",background:"rgba(26,60,110,0.03)",borderRadius:12,border:"1px solid rgba(26,60,110,0.1)" }}>
                <div style={{ fontSize:11,color:"#9ca3af",fontWeight:700,textTransform:"uppercase",marginBottom:6 }}>Cover Letter</div>
                <p style={{ fontSize:13,color:"#374151",lineHeight:1.75,margin:0 }}>{selApp.coverLetter}</p>
              </div>
            </div>
            <div style={cardCss}>
              <div style={{ fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f0f1f6" }}>📝 HR Notes</div>
              <textarea className="inp-career" value={notes} onChange={e=>setNotes(e.target.value)} rows={4} placeholder="Add internal notes about this applicant..."
                style={{ ...inputCss, resize:"vertical" }} onFocus={e=>e.target.style.borderColor="#1a3c6e"} onBlur={e=>e.target.style.borderColor="rgba(0,0,0,0.09)"}/>
              <button onClick={()=>handleUpdateApp(selApp.id,{notes})} style={{ ...saveBtnCss,marginTop:10 }}>💾 Save Notes</button>
            </div>
          </div>
          <div style={{ ...cardCss,marginBottom:0 }}>
            <div style={{ fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f0f1f6" }}>🔧 Decision</div>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              {Object.entries(APP_STATUSES).map(([k,s])=>(
                <button key={k} onClick={()=>handleUpdateApp(selApp.id,{status:k})}
                  style={{ padding:"11px 14px",borderRadius:10,border:`2px solid ${st===k?s.color:"#e2e4ea"}`,background:st===k?s.bg:"#fff",color:st===k?s.color:"#6b6880",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textAlign:"left",transition:"all 0.18s" }}>
                  {st===k?"✓ ":""}{s.label}
                </button>
              ))}
              <div style={{ marginTop:8 }}>
                <div style={{ fontSize:11,color:"#9ca3af",fontWeight:700,textTransform:"uppercase",marginBottom:6,letterSpacing:"0.6px" }}>Reason (for Rejected)</div>
                <input style={{ ...inputCss }} value={reason} onChange={e=>setReason(e.target.value)} placeholder="Explain rejection reason..."
                  onFocus={e=>e.target.style.borderColor="#1a3c6e"} onBlur={e=>e.target.style.borderColor="rgba(0,0,0,0.09)"}/>
                <button onClick={()=>handleUpdateApp(selApp.id,{statusReason:reason})} style={{ ...saveBtnCss,marginTop:8,width:"100%",justifyContent:"center" }}>Save Reason</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {toast && <div style={{ position:"fixed",bottom:28,right:28,zIndex:9999,background:"#1a3c6e",color:"#fff",padding:"12px 22px",borderRadius:12,fontSize:13,fontWeight:700 }}>{toast}</div>}
      {confirm && <ConfirmModal msg={confirm.msg} onOk={confirm.onOk} onCancel={()=>setConfirm(null)}/>}
      {(addJobMode||editJob) && <EditModal item={editJob||{active:true}} fields={jobFields} title={editJob?"Edit Job":"Post New Job"} onSave={handleSaveJob} onClose={()=>{setAddJobMode(false);setEditJob(null);}}/>}

      {/* View toggle */}
      <div style={{ display:"flex",gap:8,marginBottom:24,flexWrap:"wrap",alignItems:"center" }}>
        {["applications","postings"].map(v=>(
          <button key={v} onClick={()=>setView(v)} style={{ padding:"9px 22px",borderRadius:9,border:`1.5px solid ${view===v?"#1a3c6e":"#e2e4ea"}`,background:view===v?"rgba(26,60,110,0.08)":"#fff",color:view===v?"#1a3c6e":"#6b6880",fontSize:13,fontWeight:700,cursor:"pointer",textTransform:"capitalize" }}>
          {v==="applications"?`📋 Applications (${apps.length})`:`💼 Job Postings (${jobs.length})`}
          </button>
        ))}
        {view==="postings"&&isSA&&<button onClick={()=>setAddJobMode(true)} style={{ ...saveBtnCss,marginLeft:"auto",background:"#16a34a" }}>+ Post Job</button>}
      </div>

      {/* Applications view */}
      {view==="applications"&&<div>
        {/* Stats */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:20 }} className="stat-grid">
          {Object.entries(APP_STATUSES).map(([k,s])=>{
            const cnt=apps.filter(a=>a.status===k).length;
            return <div key={k} style={{ background:"#fff",borderRadius:12,border:"1px solid #e8eaef",padding:"14px 16px" }}>
              <div style={{ fontSize:10,color:"#9ca3af",fontWeight:700,textTransform:"uppercase",marginBottom:4 }}>{s.label}</div>
              <div style={{ fontSize:24,fontWeight:800,color:s.color,fontFamily:"'Playfair Display',serif" }}>{cnt}</div>
            </div>;
          })}
        </div>
        {/* Filter by job */}
        <div style={{ display:"flex",gap:8,marginBottom:16,flexWrap:"wrap" }}>
          <button onClick={()=>setSelJob(null)} style={{ padding:"6px 14px",borderRadius:8,border:`1.5px solid ${!selJob?"#1a3c6e":"#e2e4ea"}`,background:!selJob?"rgba(26,60,110,0.08)":"#fff",color:!selJob?"#1a3c6e":"#6b6880",fontSize:12,fontWeight:700,cursor:"pointer" }}>All Jobs ({apps.length})</button>
          {jobs.map(j=>{
            const cnt=apps.filter(a=>a.jobId===j.id).length;
            return <button key={j.id} onClick={()=>setSelJob(j.id)} style={{ padding:"6px 14px",borderRadius:8,border:`1.5px solid ${selJob===j.id?"#1a3c6e":"#e2e4ea"}`,background:selJob===j.id?"rgba(26,60,110,0.08)":"#fff",color:selJob===j.id?"#1a3c6e":"#6b6880",fontSize:12,fontWeight:700,cursor:"pointer" }}>{j.title.split(" ").slice(0,2).join(" ")} ({cnt})</button>;
          })}
        </div>
        {/* Applications table */}
        <div style={{ background:"#fff",borderRadius:16,border:"1px solid #e8eaef",overflow:"hidden" }}>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 140px 100px 100px 80px",padding:"10px 16px",background:"#f8f9fc",borderBottom:"1px solid #e8eaef",fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.7px" }}>
            {["Applicant","Job","Date","Status","Resume","Action"].map(h=><div key={h}>{h}</div>)}
          </div>
          {shownApps.length===0&&<div style={{ textAlign:"center",padding:"48px",color:"#9ca3af",fontSize:14 }}>No applications yet.</div>}
          {shownApps.map((a,i)=>{
            const s=APP_STATUSES[a.status]||APP_STATUSES.new;
            return <div key={a.id} style={{ display:"grid",gridTemplateColumns:"1fr 1fr 140px 100px 100px 80px",padding:"12px 16px",borderBottom:i<shownApps.length-1?"1px solid #f5f5f8":"none",alignItems:"center" }}>
              <div><div style={{ fontWeight:700,fontSize:13,color:"#1a1a2e" }}>{a.name}</div><div style={{ fontSize:11,color:"#9ca3af" }}>{a.phone}</div></div>
              <div style={{ fontSize:12,color:"#6b6880" }}>{a.jobTitle}</div>
              <div style={{ fontSize:12,color:"#6b6880" }}>{new Date(a.appliedAt).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</div>
              <div><span style={{ display:"inline-flex",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:s.bg,color:s.color,border:`1px solid ${s.color}40` }}>{s.label}</span></div>
              <div style={{ fontSize:11,color:"#6b6880",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{a.resumeName||"—"}</div>
              <div><button onClick={()=>setSelApp(a)} style={{ padding:"6px 12px",borderRadius:8,border:"1.5px solid #1a3c6e",background:"transparent",color:"#1a3c6e",fontSize:11,fontWeight:700,cursor:"pointer" }}>View →</button></div>
            </div>;
          })}
        </div>
      </div>}

      {/* Job postings view */}
      {view==="postings"&&<div>
        {jobs.map((job,i)=>{
          const appCount=apps.filter(a=>a.jobId===job.id).length;
          return <div key={job.id} style={{ background:"#fff",borderRadius:16,border:"1px solid #e8eaef",padding:"18px 22px",marginBottom:12,boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex",gap:8,marginBottom:8,flexWrap:"wrap",alignItems:"center" }}>
                  <span style={{ fontWeight:700,fontSize:15,color:"#1a1a2e",fontFamily:"'Playfair Display',serif" }}>{job.title}</span>
                  <span style={{ fontSize:11,fontWeight:700,padding:"2px 9px",borderRadius:20,background:job.active?"rgba(22,163,74,0.1)":"rgba(239,68,68,0.08)",color:job.active?"#16a34a":"#dc2626",border:`1px solid ${job.active?"rgba(22,163,74,0.25)":"rgba(239,68,68,0.2)"}` }}>{job.active?"Active":"Inactive"}</span>
                </div>
                <div style={{ display:"flex",gap:16,flexWrap:"wrap" }}>
                  <span style={{ fontSize:12,color:"#6b6880" }}>🏢 {job.department}</span>
                  <span style={{ fontSize:12,color:"#6b6880" }}>📍 {job.location}</span>
                  <span style={{ fontSize:12,color:"#6b6880" }}>⏰ {job.type}</span>
                  <span style={{ fontSize:12,color:"#1a3c6e",fontWeight:700 }}>📋 {appCount} application{appCount!==1?"s":""}</span>
                </div>
              </div>
              {isSA&&<div style={{ display:"flex",gap:7,flexShrink:0 }}>
                <button onClick={()=>setEditJob(job)} style={{ padding:"7px 14px",borderRadius:8,border:"1.5px solid #1a3c6e",background:"transparent",color:"#1a3c6e",fontSize:12,fontWeight:700,cursor:"pointer" }}>✏️ Edit</button>
                <button onClick={()=>updateJob(job.id,{active:!job.active})||setJobs(getJobs())} style={{ padding:"7px 12px",borderRadius:8,border:`1.5px solid ${job.active?"#ea580c":"#16a34a"}`,background:"transparent",color:job.active?"#ea580c":"#16a34a",fontSize:12,fontWeight:700,cursor:"pointer" }}>{job.active?"Hide":"Show"}</button>
                <button onClick={()=>setConfirm({msg:`Delete "${job.title}"?`,onOk:()=>handleDeleteJob(job.id)})} style={{ padding:"7px 12px",borderRadius:8,border:"1.5px solid #dc2626",background:"transparent",color:"#dc2626",fontSize:12,fontWeight:700,cursor:"pointer" }}>🗑️</button>
              </div>}
            </div>
          </div>;
        })}
      </div>}
    </div>
  );
}

// ─── BLOG TAB ─────────────────────────────────────────────────────────────────
function BlogTab() {
  const [posts,    setPosts]    = useState(() => getBlogPosts());
  const [editing,  setEditing]  = useState(null);
  const [addMode,  setAddMode]  = useState(false);
  const [confirm,  setConfirm]  = useState(null);
  const [toast,    setToast]    = useState("");
  const [filter,   setFilter]   = useState("all");

  useEffect(() => {
    const h = () => setPosts(getBlogPosts());
    window.addEventListener(BLOG_EV, h);
    return () => window.removeEventListener(BLOG_EV, h);
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };
  const newPost = { title:"", excerpt:"", content:"", category:"Umrah", tags:"", coverImage:"", author:"Edafay Team", authorAvatar:"ET", readTime:"5 min read", status:"draft" };

  const handleSave = (data) => {
    saveBlogPost({ ...data, tags: typeof data.tags === "string" ? data.tags.split(",").map(t=>t.trim()).filter(Boolean) : data.tags });
    setPosts(getBlogPosts());
    setEditing(null); setAddMode(false);
    showToast("✅ Post saved!");
  };

  const handleDelete = (id) => {
    deleteBlogPost(id);
    setPosts(getBlogPosts());
    setConfirm(null);
    showToast("🗑️ Post deleted.");
  };

  const blogFields = [
    { key:"title",      label:"Post Title"              },
    { key:"excerpt",    label:"Excerpt / Summary"       },
    { key:"category",   label:"Category",  type:"select", options:[{v:"Umrah",l:"Umrah"},{v:"Visa",l:"Visa"},{v:"Travel Tips",l:"Travel Tips"},{v:"Insurance",l:"Insurance"},{v:"Car Rental",l:"Car Rental"},{v:"General",l:"General"}] },
    { key:"tags",       label:"Tags (comma-separated)", placeholder:"Umrah, Guide, 2026" },
    { key:"author",     label:"Author Name"             },
    { key:"authorAvatar",label:"Author Initials (2 chars)", placeholder:"ET" },
    { key:"readTime",   label:"Read Time",              placeholder:"5 min read" },
    { key:"coverImage", label:"Cover Image URL",        type:"image" },
    { key:"status",     label:"Status", type:"select",  options:[{v:"draft",l:"Draft"},{v:"published",l:"Published"}] },
    { key:"content",    label:"Article Content (HTML or plain text)" },
  ];

  const shown = filter === "all" ? posts : posts.filter(p => p.status === filter);

  return (
    <div>
      {toast && <div style={{ position:"fixed",bottom:28,right:28,zIndex:9999,background:"#1a3c6e",color:"#fff",padding:"12px 22px",borderRadius:12,fontSize:13,fontWeight:700 }}>{toast}</div>}
      {confirm && <ConfirmModal msg={confirm.msg} onOk={confirm.onOk} onCancel={()=>setConfirm(null)}/>}
      {(addMode||editing) && <EditModal item={editing||newPost} fields={blogFields} title={editing?"Edit Post":"New Blog Post"} onSave={handleSave} onClose={()=>{setEditing(null);setAddMode(false);}}/>}

      {/* Stats + controls */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20 }}>
        {[["📝","Total",posts.length,"#1a3c6e"],["✅","Published",posts.filter(p=>p.status==="published").length,"#16a34a"],["📄","Drafts",posts.filter(p=>p.status==="draft").length,"#ea580c"]].map(([i,l,v,c])=>(
          <div key={l} style={{ background:"#fff",borderRadius:14,border:"1px solid #e8eaef",padding:"16px 20px" }}>
            <div style={{ fontSize:22,marginBottom:6 }}>{i}</div>
            <div style={{ fontSize:11,color:"#9ca3af",fontWeight:700,textTransform:"uppercase",marginBottom:4 }}>{l}</div>
            <div style={{ fontSize:28,fontWeight:800,color:c,fontFamily:"'Playfair Display',serif" }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex",gap:8,marginBottom:20,flexWrap:"wrap",alignItems:"center" }}>
        {["all","published","draft"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{ padding:"7px 16px",borderRadius:8,border:`1.5px solid ${filter===f?"#1a3c6e":"#e2e4ea"}`,background:filter===f?"rgba(26,60,110,0.08)":"#fff",color:filter===f?"#1a3c6e":"#6b6880",fontSize:12,fontWeight:700,cursor:"pointer",textTransform:"capitalize" }}>{f}</button>
        ))}
        <button onClick={()=>setAddMode(true)} style={{ ...saveBtnCss,marginLeft:"auto" }}>+ New Post</button>
      </div>

      {/* Posts list */}
      {shown.map((post, i) => (
        <div key={post.id} style={{ display:"flex",gap:16,background:"#fff",borderRadius:16,border:"1px solid #e8eaef",padding:"16px 18px",marginBottom:10,alignItems:"center",boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
          {post.coverImage && <img src={post.coverImage} alt="" onError={e=>e.target.style.display="none"} style={{ width:80,height:60,borderRadius:10,objectFit:"cover",flexShrink:0 }}/>}
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ display:"flex",gap:8,marginBottom:5,alignItems:"center",flexWrap:"wrap" }}>
              <span style={{ fontWeight:700,fontSize:14,color:"#1a1a2e",fontFamily:"'Playfair Display',serif" }}>{post.title}</span>
              <span style={{ fontSize:11,fontWeight:700,padding:"2px 9px",borderRadius:20,background:post.status==="published"?"rgba(22,163,74,0.1)":"rgba(234,88,12,0.08)",color:post.status==="published"?"#16a34a":"#ea580c",border:`1px solid ${post.status==="published"?"rgba(22,163,74,0.25)":"rgba(234,88,12,0.2)"}` }}>{post.status}</span>
            </div>
            <div style={{ fontSize:12,color:"#9ca3af" }}>{post.category} · {post.author} · {post.readTime} · 👁 {post.views?.toLocaleString()||0} views</div>
          </div>
          <div style={{ display:"flex",gap:7,flexShrink:0 }}>
            <button onClick={()=>{const p={...post,tags:post.tags?.join?post.tags.join(", "):post.tags};setEditing(p);}} style={{ padding:"7px 14px",borderRadius:8,border:"1.5px solid #1a3c6e",background:"transparent",color:"#1a3c6e",fontSize:12,fontWeight:700,cursor:"pointer" }}>✏️ Edit</button>
            <button onClick={()=>{saveBlogPost({...post,status:post.status==="published"?"draft":"published"});setPosts(getBlogPosts());showToast(post.status==="published"?"📄 Set to draft":"✅ Published!");}}
              style={{ padding:"7px 12px",borderRadius:8,border:`1.5px solid ${post.status==="published"?"#ea580c":"#16a34a"}`,background:"transparent",color:post.status==="published"?"#ea580c":"#16a34a",fontSize:12,fontWeight:700,cursor:"pointer" }}>
              {post.status==="published"?"Unpublish":"Publish"}
            </button>
            <button onClick={()=>setConfirm({msg:`Delete "${post.title}"?`,onOk:()=>handleDelete(post.id)})} style={{ padding:"7px 12px",borderRadius:8,border:"1.5px solid #dc2626",background:"transparent",color:"#dc2626",fontSize:12,fontWeight:700,cursor:"pointer" }}>🗑️</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
const NAV=[
  {section:"MAIN",       items:[{k:"overview",i:"📊",l:"Overview"}]},
  {section:"INQUIRIES",  items:[{k:"inq_umrah",i:"🕌",l:"Umrah"},{k:"inq_car",i:"🚗",l:"Car Rental"},{k:"inq_visa",i:"🛂",l:"Visas"},{k:"inq_flight",i:"✈️",l:"Flights"},{k:"inq_insurance",i:"🛡️",l:"Insurance"}]},
  {section:"WEBSITE",    items:[{k:"content",i:"✏️",l:"Content"},{k:"visibility",i:"👁️",l:"Visibility"},{k:"blog",i:"✍️",l:"Blog"},{k:"jobs",i:"👔",l:"Careers"}]},
  {section:"ADMIN",      items:[{k:"users",i:"👥",l:"Users"},{k:"settings",i:"🔧",l:"Settings"}]},
];

export default function Dashboard({auth,onLogout}) {
  const [tab,setTab]    = useState("overview");
  const [content,setContent] = useState(()=>getContent());
  const [toast,setToast]  = useState(false);
  const [tickets,setTickets] = useState(()=>getInquiries());
  const timer = useRef(null);

  // Refresh ticket counts in sidebar
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

  const activeInfo = NAV.flatMap(s=>s.items).find(t=>t.k===tab)||{i:"",l:""};

  // Inquiry badge count
  const openCount=(cat)=>tickets.filter(t=>t.category===cat&&t.status!=="closed").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; }
        body { margin:0; padding:0; overflow-x:hidden; }
        @keyframes dashToast { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .dash-sb-item:hover { background:rgba(255,255,255,0.1) !important; color:#fff !important; }
        @media(max-width:768px){
          .dash-sidebar { width:56px !important; }
          .sb-label,.sb-section { display:none !important; }
          .dash-main { margin-left:56px !important; padding:14px !important; }
          .stat-grid,.cat-grid { grid-template-columns:1fr 1fr !important; }
        }
        @media(min-width:769px){
          .dash-sidebar { width:220px; }
          .dash-main { margin-left:220px; }
        }
      `}</style>

      <div style={{background:"#f0f2f7",minHeight:"100vh",fontFamily:"'DM Sans',sans-serif"}}>

        {/* ── SIDEBAR ── fixed, full height, no navbar dependency */}
        <div className="dash-sidebar" style={{position:"fixed",top:0,left:0,height:"100vh",background:"#0f1f3d",color:"#fff",display:"flex",flexDirection:"column",overflowY:"auto",zIndex:100,flexShrink:0}}>

          {/* Logo */}
          <div style={{padding:"20px 16px 16px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#1a3c6e,#2a5298)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>✈</div>
              <div className="sb-label"><div style={{fontSize:14,fontWeight:700,color:"#fff",letterSpacing:"-0.3px"}}>Edafay</div><div style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>Admin Panel</div></div>
            </div>
          </div>

          {/* User chip */}
          <div style={{padding:"12px 14px",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:32,height:32,borderRadius:10,background:auth?.color||"#1a3c6e",border:"2px solid rgba(255,255,255,0.2)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,flexShrink:0}}>{initials(auth?.name||"A")}</div>
              <div className="sb-label" style={{minWidth:0}}><div style={{fontSize:12,fontWeight:700,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{auth?.name}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.4)",marginTop:1}}>{ROLE_LABELS[auth?.role]}</div></div>
            </div>
          </div>

          {/* Nav */}
          <div style={{flex:1,paddingTop:8}}>
            {NAV.map(sec=>(
              <div key={sec.section}>
                <div className="sb-section" style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.3)",letterSpacing:"1.4px",textTransform:"uppercase",padding:"12px 16px 4px"}}>{sec.section}</div>
                {sec.items.map(item=>{
                  const catKey=item.k.replace("inq_","");
                  const badge=item.k.startsWith("inq_")?openCount(catKey):0;
                  return (
                    <div key={item.k} className="dash-sb-item" onClick={()=>setTab(item.k)}
                      style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 12px",margin:"1px 8px",borderRadius:10,cursor:"pointer",background:tab===item.k?"rgba(255,255,255,0.14)":"transparent",color:tab===item.k?"#fff":"rgba(255,255,255,0.6)",transition:"all 0.18s",borderLeft:tab===item.k?"3px solid rgba(255,255,255,0.5)":"3px solid transparent"}}>
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        <span style={{fontSize:15,flexShrink:0}}>{item.i}</span>
                        <span className="sb-label" style={{fontSize:12,fontWeight:tab===item.k?700:500}}>{item.l}</span>
                      </div>
                      {badge>0&&<span className="sb-label" style={{fontSize:10,fontWeight:700,background:"#dc2626",color:"#fff",padding:"2px 6px",borderRadius:20,flexShrink:0}}>{badge}</span>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div style={{padding:"10px 10px 16px",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
            <button onClick={()=>window.location.hash=""} title="View Site"
              style={{width:"100%",padding:"9px 10px",borderRadius:9,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.7)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:6,display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
              <span>🏠</span><span className="sb-label">View Site</span>
            </button>
            <button onClick={handleLogout} title="Sign Out"
              style={{width:"100%",padding:"9px 10px",borderRadius:9,background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.25)",color:"#fca5a5",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
              <span>🚪</span><span className="sb-label">Sign Out</span>
            </button>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="dash-main" style={{minHeight:"100vh",padding:"28px 32px",overflowX:"hidden"}}>
          {/* Page header */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
            <div>
              <h1 style={{fontSize:20,fontWeight:700,color:"#1a1a2e",margin:"0 0 3px"}}>{activeInfo.i} {activeInfo.l}</h1>
              <p style={{fontSize:12,color:"#9ca3af",margin:0}}>Edafay Admin — changes save live to the website</p>
            </div>
            {["content","visibility"].includes(tab)&&<button style={saveBtnCss} onClick={handleSave}>💾 Save Now</button>}
          </div>

          {tab==="overview"           && <OverviewTab    {...tabProps}/>}
          {tab==="inq_umrah"          && <InquiryTab category="umrah"     auth={auth}/>}
          {tab==="inq_car"            && <InquiryTab category="car"       auth={auth}/>}
          {tab==="inq_visa"           && <InquiryTab category="visa"      auth={auth}/>}
          {tab==="inq_flight"         && <InquiryTab category="flight"    auth={auth}/>}
          {tab==="inq_insurance"      && <InquiryTab category="insurance" auth={auth}/>}
          {tab==="content"            && <ContentTab    {...tabProps}/>}
          {tab==="visibility"         && <VisibilityTab {...tabProps}/>}
          {tab==="users"              && <UserTab       auth={auth}/>}
          {tab==="settings"           && <SettingsTab   {...tabProps} onLogout={handleLogout}/>}
          {tab==="jobs"               && <JobsTab        auth={auth}/>}
          {tab==="blog"               && <BlogTab />}
        </div>
      </div>

      <SaveToast show={toast}/>
    </>
  );
}