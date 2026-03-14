// ─── Careers.jsx — Edafay Careers Page ───────────────────────────────────────
import { useState, useEffect } from "react";
import theme from './theme.js';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { getJobs, submitApplication, JOB_EV } from './jobStore.js';

const CSS = `
@keyframes carFadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
.car-page { font-family:'DM Sans',sans-serif; }
.job-card { transition:all 0.22s; cursor:pointer; }
.job-card:hover { transform:translateY(-4px); box-shadow:0 16px 48px rgba(0,0,0,0.10) !important; }
.inp-career { width:100%; padding:12px 16px; border:1.5px solid rgba(0,0,0,0.09); border-radius:12px; font-size:14px; color:#1a1a2e; outline:none; font-family:'DM Sans',sans-serif; box-sizing:border-box; transition:border 0.2s,box-shadow 0.2s; background:#fff; }
.inp-career:focus { border-color:#1a3c6e; box-shadow:0 0 0 3px rgba(26,60,110,0.10); }
.inp-career::placeholder { color:rgba(26,26,46,0.28); }
.upload-zone { border:2px dashed rgba(26,60,110,0.25); border-radius:16px; padding:32px; text-align:center; cursor:pointer; transition:all 0.2s; background:rgba(26,60,110,0.02); }
.upload-zone:hover,.upload-zone.drag { border-color:#1a3c6e; background:rgba(26,60,110,0.05); }
@media(max-width:768px){ .career-grid{ grid-template-columns:1fr !important; } }
`;

const DEPT_COLORS = {
  Sales:"#1a3c6e", Marketing:"#7c3aed", Support:"#16a34a", Operations:"#ea580c", Tech:"#0369a1", Finance:"#dc2626",
};

// ─── Application Form Modal ───────────────────────────────────────────────────
function ApplyModal({ job, onClose }) {
  const [form, setForm] = useState({ name:"", phone:"", email:"", city:"", coverLetter:"" });
  const [resume, setResume] = useState(null);
  const [drag, setDrag] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(p => ({ ...p, [k]:v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Full name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.city.trim())  e.city  = "City is required";
    if (!resume)            e.resume= "Please upload your resume";
    if (!form.coverLetter.trim()) e.coverLetter = "Cover letter is required";
    return e;
  };

  const handleFile = (file) => {
    if (!file) return;
    const allowed = ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      alert("Please upload a PDF or Word document.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) { alert("File must be under 5 MB."); return; }
    setResume(file);
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => {
      submitApplication(job.id, job.title, { ...form, resumeName: resume.name });
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const inp = (field) => ({
    className:"inp-career",
    value: form[field],
    onChange: e => { set(field, e.target.value); if (errors[field]) setErrors(p => ({ ...p, [field]:null })); },
  });

  if (submitted) return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#fff", borderRadius:24, padding:"48px 40px", maxWidth:460, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
        <h2 style={{ fontSize:24, fontWeight:700, color:"#1a1a2e", marginBottom:10, fontFamily:"'Playfair Display',serif" }}>Application Submitted!</h2>
        <p style={{ color:"#6b6880", lineHeight:1.75, marginBottom:6 }}>Thank you for applying for <strong style={{ color:"#1a1a2e" }}>{job.title}</strong> at Edafay.</p>
        <p style={{ color:"#6b6880", lineHeight:1.75, marginBottom:28, fontSize:14 }}>Our HR team will review your application and get back to you within 3–5 business days.</p>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(26,60,110,0.07)", border:"1px solid rgba(26,60,110,0.18)", borderRadius:12, padding:"12px 22px", marginBottom:28 }}>
          <span style={{ fontSize:18 }}>📧</span>
          <span style={{ fontSize:13, color:"#1a1a2e", fontWeight:600 }}>Confirmation sent to {form.email}</span>
        </div>
        <button onClick={onClose} style={{ background:"#1a3c6e", color:"#fff", border:"none", padding:"12px 32px", borderRadius:12, fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Back to Careers</button>
      </div>
    </div>
  );

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:24, width:"100%", maxWidth:580, maxHeight:"92vh", overflowY:"auto" }}
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding:"24px 28px", borderBottom:"1px solid #f0f1f6", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <h2 style={{ fontSize:20, fontWeight:700, color:"#1a1a2e", margin:"0 0 4px", fontFamily:"'Playfair Display',serif" }}>Apply for {job.title}</h2>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <span style={{ fontSize:12, color:"#6b6880" }}>🏢 {job.department}</span>
              <span style={{ fontSize:12, color:"#6b6880" }}>📍 {job.location}</span>
              <span style={{ fontSize:12, color:"#6b6880" }}>⏰ {job.type}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:"#9ca3af", padding:0, flexShrink:0 }}>✕</button>
        </div>

        {/* Form */}
        <div style={{ padding:"24px 28px", display:"flex", flexDirection:"column", gap:16 }}>
          {/* Name + Phone */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#6b6880", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.6px" }}>Full Name *</label>
              <input {...inp("name")} placeholder="e.g. Ahmed Khan" />
              {errors.name && <div style={{ fontSize:11, color:"#dc2626", marginTop:4 }}>⚠ {errors.name}</div>}
            </div>
            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#6b6880", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.6px" }}>Phone Number *</label>
              <input {...inp("phone")} placeholder="+92 300 0000000" type="tel" />
              {errors.phone && <div style={{ fontSize:11, color:"#dc2626", marginTop:4 }}>⚠ {errors.phone}</div>}
            </div>
          </div>

          {/* Email + City */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#6b6880", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.6px" }}>Email Address *</label>
              <input {...inp("email")} placeholder="you@example.com" type="email" />
              {errors.email && <div style={{ fontSize:11, color:"#dc2626", marginTop:4 }}>⚠ {errors.email}</div>}
            </div>
            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#6b6880", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.6px" }}>City *</label>
              <input {...inp("city")} placeholder="Lahore / Karachi / Islamabad" />
              {errors.city && <div style={{ fontSize:11, color:"#dc2626", marginTop:4 }}>⚠ {errors.city}</div>}
            </div>
          </div>

          {/* Resume Upload */}
          <div>
            <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#6b6880", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.6px" }}>Resume / CV * <span style={{ fontWeight:400, textTransform:"none" }}>(PDF or Word, max 5MB)</span></label>
            <div className={`upload-zone${drag?" drag":""}`}
              onDragOver={e => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => document.getElementById("resume-inp").click()}>
              {resume ? (
                <div>
                  <div style={{ fontSize:32, marginBottom:8 }}>📄</div>
                  <div style={{ fontWeight:700, color:"#1a3c6e", fontSize:14 }}>{resume.name}</div>
                  <div style={{ fontSize:12, color:"#9ca3af", marginTop:4 }}>{(resume.size/1024).toFixed(1)} KB</div>
                  <button onClick={e => { e.stopPropagation(); setResume(null); }} style={{ marginTop:10, background:"none", border:"1px solid #fca5a5", color:"#dc2626", padding:"4px 12px", borderRadius:8, fontSize:12, cursor:"pointer" }}>Remove</button>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize:36, marginBottom:10 }}>📎</div>
                  <div style={{ fontWeight:600, color:"#1a1a2e", fontSize:14, marginBottom:4 }}>Drag & drop your resume here</div>
                  <div style={{ fontSize:13, color:"#9ca3af" }}>or <span style={{ color:"#1a3c6e", fontWeight:700 }}>click to browse</span></div>
                  <div style={{ fontSize:11, color:"#9ca3af", marginTop:8 }}>Supported: PDF, DOC, DOCX</div>
                </div>
              )}
              <input id="resume-inp" type="file" accept=".pdf,.doc,.docx" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />
            </div>
            {errors.resume && <div style={{ fontSize:11, color:"#dc2626", marginTop:4 }}>⚠ {errors.resume}</div>}
          </div>

          {/* Cover Letter */}
          <div>
            <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#6b6880", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.6px" }}>Cover Letter *</label>
            <textarea className="inp-career" rows={5} placeholder="Tell us why you are a great fit for this role, and what relevant experience you bring..." value={form.coverLetter}
              onChange={e => { set("coverLetter", e.target.value); if (errors.coverLetter) setErrors(p => ({ ...p, coverLetter:null })); }}
              style={{ resize:"vertical", lineHeight:1.65 }} />
            {errors.coverLetter && <div style={{ fontSize:11, color:"#dc2626", marginTop:4 }}>⚠ {errors.coverLetter}</div>}
          </div>

          {/* Submit */}
          <button onClick={handleSubmit} disabled={loading}
            style={{ background:"#1a3c6e", color:"#fff", border:"none", padding:"14px", borderRadius:12, fontWeight:700, fontSize:15, cursor:loading?"not-allowed":"pointer", fontFamily:"'DM Sans',sans-serif", opacity:loading?0.7:1, marginTop:4, transition:"all 0.2s" }}>
            {loading ? "⏳ Submitting Application..." : "📩 Submit Application"}
          </button>
          <p style={{ textAlign:"center", fontSize:12, color:"#9ca3af", margin:0 }}>🔒 Your information is secure and will only be shared with our HR team.</p>
        </div>
      </div>
    </div>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job, onApply }) {
  const [open, setOpen] = useState(false);
  const dc = DEPT_COLORS[job.department] || "#1a3c6e";
  return (
    <div className="job-card" style={{ background:"#fff", borderRadius:18, border:"1px solid #e8eaef", overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
      {/* Header */}
      <div style={{ padding:"22px 24px", cursor:"pointer" }} onClick={() => setOpen(!open)}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
              <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, background:`${dc}12`, color:dc, border:`1px solid ${dc}30` }}>{job.department}</span>
              <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, background:"rgba(22,163,74,0.08)", color:"#16a34a", border:"1px solid rgba(22,163,74,0.2)" }}>{job.type}</span>
            </div>
            <h3 style={{ fontSize:18, fontWeight:700, color:"#1a1a2e", margin:"0 0 8px", fontFamily:"'Playfair Display',serif" }}>{job.title}</h3>
            <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
              <span style={{ fontSize:13, color:"#6b6880", display:"flex", alignItems:"center", gap:5 }}>📍 {job.location}</span>
              <span style={{ fontSize:13, color:"#6b6880", display:"flex", alignItems:"center", gap:5 }}>💰 {job.salary}</span>
            </div>
          </div>
          <div style={{ flexShrink:0 }}>
            <button style={{ padding:"10px 22px", borderRadius:10, background:"#1a3c6e", color:"#fff", border:"none", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s" }}
              onClick={e => { e.stopPropagation(); onApply(job); }}
              onMouseEnter={e => { e.currentTarget.style.background="#2a5298"; e.currentTarget.style.transform="translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="#1a3c6e"; e.currentTarget.style.transform="translateY(0)"; }}>
              Apply Now
            </button>
          </div>
        </div>
        <div style={{ marginTop:10, display:"flex", alignItems:"center", gap:6, color:"#9ca3af", fontSize:12 }}>
          <span>{open ? "▲" : "▼"}</span>
          <span>{open ? "Hide details" : "View job details"}</span>
        </div>
      </div>

      {/* Expandable details */}
      {open && (
        <div style={{ padding:"0 24px 24px", borderTop:"1px solid #f0f1f6" }}>
          <div style={{ paddingTop:20 }}>
            <h4 style={{ fontSize:14, fontWeight:700, color:"#1a1a2e", marginBottom:10, marginTop:0 }}>About This Role</h4>
            <p style={{ fontSize:14, color:"#374151", lineHeight:1.75, marginBottom:16 }}>{job.description}</p>
            {job.requirements?.length > 0 && (
              <>
                <h4 style={{ fontSize:14, fontWeight:700, color:"#1a1a2e", marginBottom:10, marginTop:0 }}>Requirements</h4>
                <ul style={{ paddingLeft:20, margin:0 }}>
                  {job.requirements.map((r,i) => (
                    <li key={i} style={{ fontSize:14, color:"#374151", lineHeight:1.75, marginBottom:6 }}>{r}</li>
                  ))}
                </ul>
              </>
            )}
            <button style={{ marginTop:18, padding:"12px 28px", borderRadius:10, background:"#1a3c6e", color:"#fff", border:"none", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}
              onClick={() => onApply(job)}>
              Apply Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Careers Page ─────────────────────────────────────────────────────────────
export default function Careers() {
  const [jobs, setJobs]         = useState(() => getJobs().filter(j => j.active));
  const [applying, setApplying] = useState(null);
  const [filter, setFilter]     = useState("All");

  useEffect(() => {
    const h = () => setJobs(getJobs().filter(j => j.active));
    window.addEventListener(JOB_EV, h);
    return () => window.removeEventListener(JOB_EV, h);
  }, []);

  const depts = ["All", ...new Set(jobs.map(j => j.department))];
  const shown = filter === "All" ? jobs : jobs.filter(j => j.department === filter);

  return (
    <>
      <style>{CSS}</style>
      <div className="car-page" style={{ background:theme.bg, color:theme.text, minHeight:"100vh" }}>
        <Navbar />

        {/* Hero */}
        <section style={{ padding:"130px 5% 80px", background:`radial-gradient(ellipse at 70% 30%, rgba(26,60,110,0.08) 0%, transparent 60%), ${theme.bg}`, textAlign:"center" }}>

          <h1 className="serif" style={{ fontSize:"clamp(36px,5vw,64px)", fontWeight:700, lineHeight:1.1, letterSpacing:"-1px", marginBottom:18, color:theme.text }}>
            Build Your Career at <span className="gradient-text">Edafay</span>
          </h1>
          <p style={{ color:theme.textMuted, fontSize:17, lineHeight:1.8, maxWidth:540, margin:"0 auto 40px" }}>
            Join a passionate team helping thousands of people travel the world. We are growing fast and looking for talented people who share our values.
          </p>
          {/* Culture chips */}
          <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap", marginBottom:20 }}>
            {["Hybrid Work","Travel Perks","Growth","Team Culture","Competitive Pay"].map(t => (
              <span key={t} style={{ fontSize:13, fontWeight:600, padding:"7px 16px", borderRadius:50, background:theme.bgCard, border:`1px solid ${theme.border}`, color:theme.text }}>{t}</span>
            ))}
          </div>
        </section>

        {/* Job Listings */}
        <section style={{ padding:"80px 5%", background:theme.bgCard }}>
          <div style={{ maxWidth:860, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:48 }}>
              <h2 className="serif" style={{ fontSize:"clamp(28px,3.5vw,44px)", fontWeight:700, marginBottom:14, color:theme.text }}>
                Open <span className="gradient-text">Positions</span>
              </h2>
              <p style={{ color:theme.textMuted, fontSize:15, lineHeight:1.7 }}>
                {shown.length} position{shown.length !== 1 ? "s" : ""} currently available
              </p>
            </div>

            {/* Dept filter */}
            {depts.length > 1 && (
              <div style={{ display:"flex", gap:8, marginBottom:28, flexWrap:"wrap", justifyContent:"center" }}>
                {depts.map(d => (
                  <button key={d} onClick={() => setFilter(d)} style={{ padding:"8px 20px", borderRadius:50, border:`1.5px solid ${filter===d?"#1a3c6e":"rgba(0,0,0,0.1)"}`, background:filter===d?"rgba(26,60,110,0.08)":"#fff", color:filter===d?"#1a3c6e":"#6b6880", fontSize:13, fontWeight:700, cursor:"pointer", transition:"all 0.18s" }}>
                    {d} {d !== "All" && `(${jobs.filter(j=>j.department===d).length})`}
                  </button>
                ))}
              </div>
            )}

            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {shown.length === 0 ? (
                <div style={{ textAlign:"center", padding:"60px 20px", color:theme.textMuted }}>
                  <div style={{ fontSize:48, marginBottom:14 }}>📭</div>
                  <div style={{ fontSize:16, fontWeight:600 }}>No open positions in this department right now.</div>
                  <div style={{ fontSize:14, marginTop:8 }}>Check back soon or send your resume to <strong>contact@edafay.com</strong></div>
                </div>
              ) : shown.map(job => (
                <JobCard key={job.id} job={job} onApply={setApplying} />
              ))}
            </div>

            {/* Spontaneous application */}
            <div style={{ marginTop:52, background:"#fff", borderRadius:20, border:`1px solid ${theme.border}`, padding:"32px 36px", textAlign:"center", boxShadow:"0 2px 16px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize:40, marginBottom:12 }}>💌</div>
              <h3 style={{ fontSize:20, fontWeight:700, color:theme.text, marginBottom:8, fontFamily:"'Playfair Display',serif" }}>Don't See Your Role?</h3>
              <p style={{ color:theme.textMuted, fontSize:14, lineHeight:1.75, marginBottom:18 }}>We are always on the lookout for talented people. Send your resume to <strong style={{ color:theme.accent }}>careers@edafay.com</strong> and we will be in touch.</p>
              <a href="mailto:careers@edafay.com" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"12px 28px", borderRadius:12, background:theme.accent, color:"#fff", fontWeight:700, fontSize:14, textDecoration:"none", fontFamily:"'DM Sans',sans-serif" }}>
                Send Your Resume
              </a>
            </div>
          </div>
        </section>

        {applying && <ApplyModal job={applying} onClose={() => setApplying(null)} />}
        <Footer />
      </div>
    </>
  );
}