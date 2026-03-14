// ─── Auth.jsx — Modern 2026-style Edafay Login ─────────────
import { useState } from "react";

const AUTH_KEY = "edafay_auth_v1";
const USERS_KEY = "edafay_users_v1";

const DEFAULT_USERS = [
  { id:1, name:"Super Admin", email:"admin@edafay.com", password:"admin123", role:"super_admin", avatar:"SA", color:"#1a3c6e", active:true },
  { id:2, name:"Content Manager", email:"content@edafay.com", password:"content123", role:"editor", avatar:"CM", color:"#16a34a", active:true },
  { id:3, name:"Viewer Staff", email:"view@edafay.com", password:"view123", role:"viewer", avatar:"VS", color:"#7c3aed", active:true },
];

export function getUsers() { try { return JSON.parse(localStorage.getItem(USERS_KEY)) || DEFAULT_USERS; } catch { return DEFAULT_USERS; } }
export function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
export function getAuth() { try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; } }
export function setAuth(user) { 
  const users = getUsers();
  saveUsers(users);
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}
export function clearAuth() { localStorage.removeItem(AUTH_KEY); }
export function loginWithEmail(email, password) {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase()===email.toLowerCase() && u.password===password && u.active) || null;
}

// ─── Auth Component ──────────────────────────────────────
export default function Auth({ onLogin }) {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [showPass,setShowPass] = useState(false);
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);
  const [googleLoad,setGoogleLoad] = useState(false);

  const handleLogin = () => {
    setError(""); 
    if(!email||!password){setError("Enter email & password."); return;}
    setLoading(true);
    setTimeout(()=>{
      const user=loginWithEmail(email,password);
      if(user){ setAuth(user); onLogin(user); }
      else{ setError("Invalid email or password."); }
      setLoading(false);
    },700);
  };

  const handleGoogle = () => {
    setGoogleLoad(true);
    setTimeout(()=>{ setGoogleLoad(false); setError("Google login needs backend OAuth setup."); },1200);
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .auth-card { animation:fadeUp 0.5s ease both; }
        .auth-inp:focus { border-color:#1a3c6e; box-shadow:0 0 0 4px rgba(26,60,110,0.12); }
        .auth-btn-primary:hover:not(:disabled){ background:#2a5298; transform:translateY(-1px); box-shadow:0 8px 24px rgba(26,60,110,0.4); }
        .password-toggle { display:flex; align-items:center; justify-content:center; width:32px; height:32px; border-radius:8px; background:#f1f3f8; cursor:pointer; transition:all 0.2s; }
        .password-toggle:hover { background:#e0e4ee; }
      `}</style>

      {/* Left panel with logo */}
      <div style={{ flex:1, background:"#1a3c6e", color:"#fff", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:40 }}>
        <div style={{ fontSize:64, marginBottom:24 }}>✈️</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:38, fontWeight:700 }}>Edafay<span style={{ color:"#4a9eff" }}>.</span></h1>
        <p style={{ fontSize:16, marginTop:12, maxWidth:320, textAlign:"center", lineHeight:1.5 }}>Welcome to Edafay Travel & Tours Admin Dashboard. Manage your platform seamlessly.</p>
      </div>

      {/* Right panel — login card */}
      <div style={{ flex:1, display:"flex", justifyContent:"center", alignItems:"center", background:"#f7f8fb", padding:40 }}>
        <div className="auth-card" style={{ width:"100%", maxWidth:400, background:"#fff", borderRadius:24, padding:"36px 40px", boxShadow:"0 32px 80px rgba(0,0,0,0.15)" }}>
          <h2 style={{ fontSize:22, fontWeight:700, color:"#1a1a2e", marginBottom:6 }}>Welcome Back</h2>
          <p style={{ fontSize:13, color:"#6b6880", marginBottom:28 }}>Use your Gmail account to login</p>

          {/* Google login */}
          <button onClick={handleGoogle} disabled={googleLoad} style={{
            width:"100%", padding:"12px 20px", border:"1.5px solid #e2e4ea", borderRadius:12,
            background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", gap:12,
            fontSize:14, fontWeight:600, color:"#1a1a2e", marginBottom:20, cursor:"pointer"
          }}>{googleLoad?"⏳ Connecting...":"Continue with Google"}</button>

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <div style={{ flex:1, height:1, background:"#e2e4ea" }} />
            <span style={{ fontSize:12, color:"#9ca3af", fontWeight:600 }}>OR</span>
            <div style={{ flex:1, height:1, background:"#e2e4ea" }} />
          </div>

          {/* Email */}
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#6b6880", marginBottom:6 }}>Email</label>
            <input className="auth-inp" type="email" placeholder="admin@edafay.com"
              value={email} onChange={e=>setEmail(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              style={{ width:"100%", padding:"13px 16px", border:"1.5px solid #e2e4ea", borderRadius:12, fontSize:14, color:"#1a1a2e", outline:"none", background:"#fff" }} />
          </div>

          {/* Password */}
          <div style={{ marginBottom:20 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:700, color:"#6b6880", marginBottom:6 }}>Password</label>
            <div style={{ position:"relative" }}>
              <input className="auth-inp" type={showPass?"text":"password"} placeholder="••••••••"
                value={password} onChange={e=>setPassword(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                style={{ width:"100%", padding:"13px 46px 13px 16px", border:"1.5px solid #e2e4ea", borderRadius:12, fontSize:14, color:"#1a1a2e", outline:"none", background:"#fff" }} />
              {/* Modern eye toggle */}
              <div className="password-toggle" onClick={()=>setShowPass(s=>!s)} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)" }}>
                {showPass ? 
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b6880" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-4.97 0-9.27-3-11-7a11 11 0 0 1 5.13-5.86M1 1l22 22"/></svg> :
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b6880" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4.5-8 11-8 11 8 11 8-4.5 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#dc2626", marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Login */}
          <button onClick={handleLogin} disabled={loading} style={{ width:"100%", padding:"14px", background:"#1a3c6e", color:"#fff", border:"none", borderRadius:12, fontWeight:700, fontSize:15, cursor:loading?"not-allowed":"pointer", opacity:loading?0.7:1 }}>
            {loading?"⏳ Signing in...":"Sign In →"}
          </button>
        </div>
      </div>
    </div>
  );
}