// ─── Auth.jsx — Edafay Admin Login ───────────────────────────────────────────
import { useState } from "react";
import {
  loginWithEmail, updateLastLogin,
  getAuth, setAuthSession, clearAuth,
  seedUsers, getUsers, saveUser, deleteUser, saveUsers
} from "./services/authService.js";

export { getAuth, clearAuth, getUsers, saveUser, saveUsers, deleteUser, setAuthSession };
export { setAuthSession as setAuth };
export const ROLE_LABELS = { super_admin:"Super Admin", editor:"Editor", viewer:"Viewer" };
export const ROLE_COLORS = { super_admin:"#1a3c6e", editor:"#16a34a", viewer:"#7c3aed" };

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

// ─── Auth Component ───────────────────────────────────────────────────────────
export default function Auth({ onLogin }) {
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [error,      setError]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [googleLoad, setGoogleLoad] = useState(false);

  const handleLogin = async () => {
  setError("");
  if (!email || !password) { 
    setError("Please enter your email and password."); 
    return; 
  }
  setLoading(true);
  try {
    // Pehle seed check karo (sirf first time)
    await seedUsers(); 
    
    const user = await loginWithEmail(email, password);
    if (user) {
      await updateLastLogin(user.id);
      const loggedIn = { ...user, lastLogin: new Date().toISOString() };
      setAuthSession(loggedIn);
      onLogin(loggedIn);
    } else {
      setError("Invalid email or password. Please try again.");
    }
  } catch (err) {
    setError("Connection error. Please try again.");
    console.error(err);
  }
  setLoading(false);
};

  const handleGoogle = () => {
    setGoogleLoad(true);
    setTimeout(() => { setGoogleLoad(false); setError("Google login requires backend OAuth setup. Use email login for now."); }, 1200);
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", fontFamily:"'DM Sans',sans-serif", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing:border-box; }
        @keyframes authFadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes authFadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes floatY      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .auth-inp { width:100%; padding:13px 16px; border:1.5px solid #e2e4ea; border-radius:12px; font-size:14px; color:#1a1a2e; outline:none; font-family:'DM Sans',sans-serif; background:#fff; transition:border 0.2s, box-shadow 0.2s; }
        .auth-inp:focus { border-color:#1a3c6e; box-shadow:0 0 0 3px rgba(26,60,110,0.1); }
        .auth-inp::placeholder { color:#b0b4c0; }
        .auth-btn-primary { transition:all 0.22s; }
        .auth-btn-primary:hover:not(:disabled) { background:#2a5298 !important; transform:translateY(-1px); box-shadow:0 8px 24px rgba(26,60,110,0.38) !important; }
        .auth-google:hover:not(:disabled) { background:#f5f6fa !important; box-shadow:0 4px 16px rgba(0,0,0,0.1) !important; transform:translateY(-1px); }
        .auth-hint { background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:5px 13px; font-size:11px; color:rgba(255,255,255,0.85); font-weight:600; cursor:pointer; transition:all 0.18s; font-family:'DM Sans',sans-serif; }
        .auth-hint:hover { background:rgba(255,255,255,0.22); }
        .eye-btn { position:absolute; right:14px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#9ca3af; display:flex; align-items:center; padding:4px; border-radius:6px; transition:color 0.18s; }
        .eye-btn:hover { color:#1a3c6e; }
        @media(max-width:768px){ .auth-left{ display:none !important; } .auth-right{ width:100% !important; } }
      `}</style>

      {/* ── LEFT PANEL ── */}
        <div className="auth-left" style={{
        width:"48%",
        background:"linear-gradient(145deg, #0a1628 0%, #1a3c6e 55%, #1e4d8c 100%)",
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        padding:"52px",
        position:"relative",
        overflow:"hidden",
        }}>

        {/* Background decorative circles */}
        <div style={{ position:"absolute", top:-80, left:-80, width:320, height:320, borderRadius:"50%", background:"rgba(255,255,255,0.04)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-100, right:-60, width:380, height:380, borderRadius:"50%", background:"rgba(255,255,255,0.03)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"40%", right:-40, width:200, height:200, borderRadius:"50%", background:"rgba(74,158,255,0.07)", pointerEvents:"none" }} />

        {/* Logo */}
        <div style={{ animation:"authFadeUp 0.5s ease both" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
            <img src="/logod.png" alt="logo" style={{ height:120 }} />
          </div>
        </div>

        {/* Center content */}
        <div style={{ animation:"authFadeUp 0.6s 0.1s ease both" }}>

          <p style={{ fontSize:14, color:"rgba(255,255,255,0.6)", lineHeight:1.8, maxWidth:340, marginBottom:36 }}>
            Manage Umrah packages, visas, car rentals, blog posts, careers, and all customer inquiries from one powerful dashboard.
          </p>

          {/* Feature chips */}
<div style={{ display:"flex", flexDirection:"column", gap:14 }}>
  {[
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7">
          <path d="M3 10l9-7 9 7"/>
          <path d="M4 10v10h16V10"/>
          <path d="M10 20v-6h4v6"/>
        </svg>
      ),
      text:"Umrah & Travel Packages"
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7">
          <rect x="3" y="4" width="18" height="16" rx="2"/>
          <path d="M7 8h10M7 12h6"/>
        </svg>
      ),
      text:"Customer Inquiry Tickets"
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>
        </svg>
      ),
      text:"Blog & Content Management"
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7">
          <circle cx="9" cy="7" r="4"/>
          <path d="M17 11a4 4 0 1 0 0-8"/>
          <path d="M3 21v-2a6 6 0 0 1 12 0v2"/>
        </svg>
      ),
      text:"Team & User Management"
    }
  ].map(f => (
    <div key={f.text} style={{ display:"flex", alignItems:"center", gap:12 }}>
      <div style={{
        width:34,
        height:34,
        borderRadius:10,
        background:"rgba(255,255,255,0.08)",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        flexShrink:0
      }}>
        {f.icon}
      </div>

      <span style={{
        fontSize:13,
        color:"rgba(255,255,255,0.78)",
        fontWeight:500
      }}>
        {f.text}
      </span>
    </div>
  ))}
</div>
        </div>

        {/* Bottom demo hint  
        <div style={{ animation:"authFadeUp 0.6s 0.2s ease both" }}>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:24 }}>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:10, textTransform:"uppercase", letterSpacing:"1px" }}>Demo Accounts</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {[
                { label:"Super Admin", e:"admin@edafay.com",   p:"admin123"   },
                { label:"Editor",      e:"content@edafay.com", p:"content123" },
                { label:"Viewer",      e:"view@edafay.com",     p:"view123"    },
              ].map(h => (
                <button key={h.label} className="auth-hint"
                  onClick={() => { setEmail(h.e); setPassword(h.p); setError(""); }}>
                  {h.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        */}
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-right" style={{
        width:"52%", background:"#f7f8fc",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:"40px 5%",
      }}>
        <div style={{ width:"100%", maxWidth:420, animation:"authFadeUp 0.6s 0.15s ease both" }}>

          {/* Mobile logo (hidden on desktop) */}
          <div style={{ display:"none" }} className="mobile-logo">
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, color:"#1a1a2e", marginBottom:32 }}>Edafay<span style={{ color:"#1a3c6e" }}>.</span></div>
          </div>

          <h2 style={{ fontSize:26, fontWeight:700, color:"#1a1a2e", margin:"0 0 6px", fontFamily:"'Playfair Display',serif" }}>Welcome back</h2>
          <p style={{ fontSize:14, color:"#9ca3af", marginBottom:32 }}>Sign in to access the admin panel</p>

          {/* Google Button */}
          <button className="auth-google" onClick={handleGoogle} disabled={googleLoad}
            style={{ width:"100%", padding:"13px 20px", border:"1.5px solid #e2e4ea", borderRadius:14, background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:12, fontSize:14, fontWeight:600, color:"#1a1a2e", marginBottom:22, fontFamily:"'DM Sans',sans-serif", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", transition:"all 0.2s" }}>
            {googleLoad
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              : <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
            }
            {googleLoad ? "Connecting..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:22 }}>
            <div style={{ flex:1, height:1, background:"#e8eaef" }} />
            <span style={{ fontSize:12, color:"#b0b4c0", fontWeight:600 }}>OR</span>
            <div style={{ flex:1, height:1, background:"#e8eaef" }} />
          </div>

          {/* Email field */}
          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#6b6880", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.7px" }}>Email Address</label>
            <input className="auth-inp" value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="name@edafay.com" type="email"
              onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
          </div>

          {/* Password field */}
          <div style={{ marginBottom:22 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#6b6880", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.7px" }}>Password</label>
            <div style={{ position:"relative" }}>
              <input className="auth-inp" value={password} onChange={e=>setPassword(e.target.value)}
                placeholder="••••••••" type={showPass?"text":"password"}
                style={{ paddingRight:46 }}
                onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
              <button className="eye-btn" onClick={()=>setShowPass(s=>!s)} tabIndex={-1} title={showPass?"Hide password":"Show password"}>
                {showPass ? <EyeOff /> : <EyeOpen />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div style={{ background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.22)", borderRadius:12, padding:"11px 14px", fontSize:13, color:"#dc2626", marginBottom:18, display:"flex", alignItems:"center", gap:9 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          {/* Sign in button */}
          <button className="auth-btn-primary" onClick={handleLogin} disabled={loading}
            style={{ width:"100%", padding:"14px", background:"#1a3c6e", color:"#fff", border:"none", borderRadius:14, fontWeight:700, fontSize:15, cursor:loading?"not-allowed":"pointer", fontFamily:"'DM Sans',sans-serif", opacity:loading?0.75:1, boxShadow:"0 4px 16px rgba(26,60,110,0.25)", letterSpacing:"0.2px" }}>
            {loading
              ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" style={{ animation:"spin 0.8s linear infinite" }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/></svg>
                  Signing in...
                </span>
              : "Sign In →"
            }
          </button>

          <p style={{ textAlign:"center", fontSize:12, color:"#b0b4c0", marginTop:20, marginBottom:0, lineHeight:1.6 }}>
            Edafay Travel & Tours — Admin Access Only
          </p>
        </div>
      </div>
    </div>
  );
}
