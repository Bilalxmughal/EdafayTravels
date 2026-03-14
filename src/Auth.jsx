return (
<div style={{
  minHeight:"100vh",
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  background:"radial-gradient(circle at 20% 20%, #1a3c6e, #050d1f)",
  fontFamily:"'DM Sans', sans-serif",
  padding:20
}}>

<style>{`

@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

@keyframes float {
0%{transform:translateY(0)}
50%{transform:translateY(-8px)}
100%{transform:translateY(0)}
}

.auth-card{
backdrop-filter:blur(18px);
background:rgba(255,255,255,0.08);
border:1px solid rgba(255,255,255,0.15);
border-radius:22px;
padding:40px;
width:420px;
box-shadow:0 40px 80px rgba(0,0,0,0.6);
animation:float 6s ease-in-out infinite;
}

.auth-input{
width:100%;
padding:14px 16px;
border-radius:10px;
border:1px solid rgba(255,255,255,0.15);
background:rgba(255,255,255,0.05);
color:#fff;
outline:none;
font-size:14px;
margin-top:6px;
}

.auth-input::placeholder{
color:#b8c2d8;
}

.auth-input:focus{
border:1px solid #4a9eff;
box-shadow:0 0 0 3px rgba(74,158,255,0.2);
}

.auth-btn{
width:100%;
margin-top:18px;
padding:14px;
border:none;
border-radius:10px;
font-weight:600;
font-size:15px;
cursor:pointer;
background:linear-gradient(90deg,#4a9eff,#1a3c6e);
color:white;
transition:0.25s;
}

.auth-btn:hover{
transform:translateY(-2px);
box-shadow:0 12px 35px rgba(74,158,255,0.45);
}

.logo{
font-size:34px;
margin-bottom:12px;
}

.subtitle{
font-size:13px;
color:#c6d1ea;
margin-bottom:30px;
}

.label{
font-size:11px;
letter-spacing:1px;
text-transform:uppercase;
color:#aeb8cf;
}

`}</style>


<div className="auth-card">

<div style={{textAlign:"center"}}>

<div className="logo">✈️</div>

<h2 style={{
fontSize:24,
fontWeight:700,
color:"#fff",
marginBottom:4
}}>
Edafay Admin
</h2>

<div className="subtitle">
Secure dashboard login
</div>

</div>


{/* Email */}

<div>

<div className="label">Email</div>

<input
className="auth-input"
value={email}
onChange={e=>setEmail(e.target.value)}
placeholder="admin@edafay.com"
/>

</div>


{/* Password */}

<div style={{marginTop:14}}>

<div className="label">Password</div>

<input
className="auth-input"
type={showPass ? "text":"password"}
value={password}
onChange={e=>setPassword(e.target.value)}
placeholder="••••••"
/>

</div>


{/* Error */}

{error && (
<div style={{
marginTop:14,
background:"rgba(255,0,0,0.1)",
border:"1px solid rgba(255,0,0,0.3)",
padding:"10px",
borderRadius:8,
fontSize:13,
color:"#ff9b9b"
}}>
{error}
</div>
)}


{/* Login */}

<button
className="auth-btn"
onClick={handleLogin}
disabled={loading}
>
{loading ? "Signing in..." : "Login to Dashboard"}
</button>


<div style={{
marginTop:20,
fontSize:12,
textAlign:"center",
color:"#8fa3c9"
}}>
Edafay Travel & Tours
</div>


</div>

</div>
)