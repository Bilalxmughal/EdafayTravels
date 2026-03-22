// ─── Footer.jsx ────────────────────────────────
import theme from './theme.js';
import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const cols = [
  { title: "Company",  links: [
    { label:"About Us",       href:"/about"          },
    { label:"Our Team",       href:"/aboutteam"      },
    { label:"Careers",        href:"/careers"        },
    { label:"Blog",           href:"/blog"           },
  ]},
  { title: "Services", links: [
    { label:"Umrah Packages", href:"/umrah"          },
    { label:"Travel Insurance",href:"/insurance"     },
    { label:"Visa Assistance",href:"/visas"          },
    { label:"Car Rental",     href:"/cars"           },
  ]},
  { title: "Support",  links: [
    { label:"Contact Us",     href:"/contact"        },
    { label:"Book Now",       href:"/booknow"        },
    { label:"Privacy Policy", href:"/privacy"        },
    { label:"Terms of Service",href:"/terms"         },
  ]},
];

const socials = [
  { icon: <FaFacebookF />, label:"Facebook", url:"https://facebook.com/edafaytravels" },
  { icon: <FaLinkedinIn />, label:"LinkedIn", url:"https://linkedin.com/company/edafaytravels" },
  { icon: <FaInstagram />, label:"Instagram", url:"https://instagram.com/edafaytravels" },
];

export default function Footer() {
  const navigate = (hash) => {
    if (hash.includes("#team")) {
      window.location.href = "/about";
      setTimeout(() => {
        const el = document.getElementById("team-section");
        if (el) el.scrollIntoView({ behavior:"smooth" });
      }, 300);
    } else {
      window.location.href = href;
    }
  };

  return (
    <footer style={{ padding:"80px 5% 40px", background:theme.bgFooter, borderTop:`1px solid ${theme.border}` }}>
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:48, marginBottom:60 }} className="footer-grid">
        <style>{`@media(max-width:768px){ .footer-grid{ grid-template-columns:1fr 1fr !important; } }`}</style>

        {/* Brand */}
        <div>
          <div onClick={()=>window.location.href=""} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20, cursor:"pointer" }}>
            <img src="/logo.png" alt="logo" style={{ height:60 }} />
          </div>
          <p style={{ color:theme.textMuted, lineHeight:1.75, fontSize:14, maxWidth:280, marginBottom:24 }}>
            Your trusted travel partner since 2019. Making dreams come true, one journey at a time.
          </p>
          <div style={{ display:"flex", gap:10 }}>
            {socials.map(({ icon, label, url }) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer" title={label}
                style={{ width:38, height:38, borderRadius:10, background:"rgba(0,0,0,0.04)", border:`1px solid ${theme.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, cursor:"pointer", transition:"all 0.2s", color:theme.textMuted, textDecoration:"none" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=theme.accent; e.currentTarget.style.color=theme.accent; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=theme.border; e.currentTarget.style.color=theme.textMuted; }}>
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {cols.map(col => (
          <div key={col.title}>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:20, letterSpacing:"0.5px", color:theme.text }}>{col.title}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {col.links.map(l => (
                <span key={l.label} onClick={()=>navigate(l.hash)}
                  style={{ fontSize:13, color:theme.textMuted, textDecoration:"none", cursor:"pointer", transition:"color 0.2s" }}
                  onMouseEnter={e=>e.currentTarget.style.color=theme.accent}
                  onMouseLeave={e=>e.currentTarget.style.color=theme.textMuted}>
                  {l.label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ height:1, background:`linear-gradient(to right, transparent, ${theme.border}, transparent)`, marginBottom:28 }} />

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
        <span style={{ color:theme.textMuted, fontSize:13 }}>© 2026 Edafay Travels. All rights reserved. Made with ❤️ for explorers.</span>
        <div style={{ display:"flex", gap:6 }}>
          {["🇵🇰 PK","PKR"].map(label => (
            <div key={label} style={{ background:"rgba(0,0,0,0.04)", border:`1px solid ${theme.border}`, borderRadius:8, padding:"5px 12px", fontSize:12, color:theme.textMuted, cursor:"pointer" }}>{label}</div>
          ))}
        </div>
      </div>
    </footer>
  );
}