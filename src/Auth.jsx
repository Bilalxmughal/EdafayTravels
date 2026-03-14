// ─── Auth.jsx — Edafay Admin Login ───────────────────────────────────────────
import { useState } from "react";

// ─── Auth Store ───────────────────────────────────────────────────────────────
const AUTH_KEY    = "edafay_auth_v1";
const USERS_KEY   = "edafay_users_v1";

const DEFAULT_USERS = [
  { id:1, name:"Super Admin",    email:"admin@edafay.com",    password:"admin123",     role:"super_admin", avatar:"SA", color:"#1a3c6e", active:true,  createdAt:"2024-01-01", lastLogin:null },
  { id:2, name:"Content Manager",email:"content@edafay.com", password:"content123",   role:"editor",      avatar:"CM", color:"#16a34a", active:true,  createdAt:"2024-02-15", lastLogin:null },
  { id:3, name:"Viewer Staff",   email:"view@edafay.com",     password:"view123",      role:"viewer",      avatar:"VS", color:"#7c3aed", active:true,  createdAt:"2024-03-10", lastLogin:null },
];

export function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || DEFAULT_USERS; }
  catch { return DEFAULT_USERS; }
}
export function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

export function getAuth() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; }
}
export function setAuth(user) {
  const users = getUsers();
  const updated = users.map(u => u.id===user.id ? { ...u, lastLogin: new Date().toISOString() } : u);
  saveUsers(updated);
  localStorage.setItem(AUTH_KEY, JSON.stringify({ ...user, lastLogin: new Date().toISOString() }));
}
export function clearAuth() { localStorage.removeItem(AUTH_KEY); }

export function loginWithEmail(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase()===email.toLowerCase() && u.password===password && u.active);
  return user || null;
}

const ROLE_LABELS = { super_admin:"Super Admin", editor:"Editor", viewer:"Viewer" };
const ROLE_COLORS = { super_admin:"#1a3c6e", editor:"#16a34a", viewer:"#7c3aed" };
export { ROLE_LABELS, ROLE_COLORS };

// ─── Auth Component ───────────────────────────────────────────────────────────
export default function Auth({ onLogin }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [googleLoad, setGoogleLoad] = useState(false);

  const handleLogin = () => {
    setError("");
    if (!email || !password) { setError("Please enter email and password."); return; }
    setLoading(true);
    setTimeout(() => {
      const user = loginWithEmail(email, password);
      if (user) { setAuth(user); onLogin(user); }
      else { setError("Invalid email or password. Please try again."); }
      setLoading(false);
    }, 700);
  };

  const handleGoogle = () => {
    setGoogleLoad(true);
    setTimeout(() => {
      setGoogleLoad(false);
      setError("Google login requires backend OAuth setup. Use email login for now.");
    }, 1200);
  };

  const inp = (focused) => ({
    width:"100%", padding:"13px 16px", border:`1.5px solid ${focused?"#1a3c6e":"#e2e4ea"}`,
    borderRadius:12, fontSize:14, color:"#1a1a2e", outline:"none",
    fontFamily:"'DM Sans',sans-serif", background:"#fff", boxSizing:"border-box",
  });

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg, #0f1f3d 0%, #1a3c6e 50%, #0f2850 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:20, fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes authFadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .auth-card { animation: authFadeUp 0.6s ease both; }
        .auth-inp:focus { border-color:#1a3c6e !important; box-shadow: 0 0 0 3px rgba(26,60,110,0.12) !important; }
        .auth-btn-primary { transition: all 0.2s; }
        .auth-btn-primary:hover:not(:disabled) { background:#2a5298 !important; transform:translateY(-1px); box-shadow:0 8px 24px rgba(26,60,110,0.4) !important; }
        .auth-google:hover { background:#f8f9fa !important; box-shadow:0 4px 16px rgba(0,0,0,0.12) !important; }
        .auth-hint-row { display:flex; gap:8px; flex-wrap:wrap; margin-top:4px; }
        .auth-hint { background:rgba(26,60,110,0.08); border:1px solid rgba(26,60,110,0.18); border-radius:8px; padding:5px 12px; font-size:11px; color:#1a3c6e; font-weight:600; cursor:pointer; transition:all 0.18s; }
        .auth-hint:hover { background:rgba(26,60,110,0.15); }
      `}</style>

      <div style={{ width:"100%", maxWidth:440 }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:32, animation:"authFadeUp 0.5s ease both" }}>
          <div style={{ width:56, height:56, borderRadius:16, background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, margin:"0 auto 14px", backdropFilter:"blur(8px)" }}>✈️</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:"#fff", letterSpacing:"-0.5px" }}>Edafay<span style={{ color:"#4a9eff" }}>.</span></div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.55)", marginTop:4 }}>Admin Dashboard</div>
        </div>

        {/* Card */}
        <div className="auth-card" style={{ background:"#fff", borderRadius:24, padding:"36px 40px", boxShadow:"0 32px 80px rgba(0,0,0,0.35)" }}>
          <h2 style={{ fontSize:20, fontWeight:700, color:"#1a1a2e", marginBottom:6, margin:"0 0 6px" }}>Welcome Back</h2>
          <p style={{ fontSize:13, color:"#6b6880", marginBottom:28 }}>Sign in to access the admin panel</p>

          {/* Google Button */}
          <button className="auth-google" onClick={handleGoogle} disabled={googleLoad}
            style={{ width:"100%", padding:"12px 20px", border:"1.5px solid #e2e4ea", borderRadius:12, background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:12, fontSize:14, fontWeight:600, color:"#1a1a2e", marginBottom:20, fontFamily:"'DM Sans',sans-serif" }}>
            {googleLoad ? (
              <span style={{ fontSize:16, animation:"spin 1s linear infinite", display:"inline-block" }}>⌛</span>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
            )}
            {googleLoad ? "Connecting..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <div style={{ flex:1, height:1, background:"#e2e4ea" }} />
            <span style={{ fontSize:12, color:"#9ca3af", fontWeight:600 }}>OR</span>
            <div style={{ flex:1, height:1, background:"#e2e4ea" }} />
          </div>

          {/* Email */}
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#6b6880", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.6px" }}>Email Address</label>
            <input className="auth-inp" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@edafay.com" type="email"
              style={{ width:"100%", padding:"13px 16px", border:"1.5px solid #e2e4ea", borderRadius:12, fontSize:14, color:"#1a1a2e", outline:"none", fontFamily:"'DM Sans',sans-serif", background:"#fff", boxSizing:"border-box" }}
              onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
          </div>

          {/* Password */}
          <div style={{ marginBottom:8 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#6b6880", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.6px" }}>Password</label>
            <div style={{ position:"relative" }}>
              <input className="auth-inp" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" type={showPass?"text":"password"}
                style={{ width:"100%", padding:"13px 46px 13px 16px", border:"1.5px solid #e2e4ea", borderRadius:12, fontSize:14, color:"#1a1a2e", outline:"none", fontFamily:"'DM Sans',sans-serif", background:"#fff", boxSizing:"border-box" }}
                onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
              <button onClick={()=>setShowPass(s=>!s)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:16, color:"#9ca3af", padding:0 }}>
                {showPass?"🙈":"👁️"}
              </button>
            </div>
          </div>

          {/* Quick login hints */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, color:"#9ca3af", marginBottom:6 }}>Quick fill demo accounts:</div>
            <div className="auth-hint-row">
              {[{label:"Super Admin", e:"admin@edafay.com", p:"admin123"},{label:"Editor", e:"content@edafay.com", p:"content123"},{label:"Viewer", e:"view@edafay.com", p:"view123"}].map(h => (
                <button key={h.label} className="auth-hint" onClick={()=>{ setEmail(h.e); setPassword(h.p); setError(""); }}>{h.label}</button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#dc2626", marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Login Button */}
          <button className="auth-btn-primary" onClick={handleLogin} disabled={loading}
            style={{ width:"100%", padding:"14px", background:"#1a3c6e", color:"#fff", border:"none", borderRadius:12, fontWeight:700, fontSize:15, cursor:loading?"not-allowed":"pointer", fontFamily:"'DM Sans',sans-serif", opacity:loading?0.7:1 }}>
            {loading ? "⏳ Signing in..." : "Sign In to Dashboard →"}
          </button>

          <p style={{ textAlign:"center", fontSize:12, color:"#9ca3af", marginTop:16, marginBottom:0 }}>
            Edafay Travel & Tours — Admin Access Only
          </p>
        </div>
      </div>
    </div>
  );
}