// ─── WhatsAppButton.jsx — Floating WhatsApp Chat Widget ──────────────────────
import { useState, useEffect } from "react";

const PHONE   = "923454449433";   // ← apna number yahan daalo (country code + number, no +)
const MESSAGE = "Hello! I'm interested in your travel services. Can you help me?";

export default function WhatsAppButton() {
  const [visible,  setVisible]  = useState(false);
  const [tooltip,  setTooltip]  = useState(true);
  const [pulse,    setPulse]    = useState(true);

  // Show after 1.5s, hide tooltip after 10s
  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 1500);
    const t2 = setTimeout(() => setTooltip(false), 6000);
    const t3 = setInterval(() => setPulse(p => !p), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(t3); };
  }, []);

  const openWhatsApp = () => {
    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setTooltip(false);
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes waBounceIn {
          0%   { opacity:0; transform:scale(0.4) translateY(20px); }
          70%  { transform:scale(1.08) translateY(-4px); }
          100% { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes waPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(37,211,102,0.5), 0 8px 32px rgba(37,211,102,0.35); }
          50%      { box-shadow: 0 0 0 12px rgba(37,211,102,0), 0 8px 32px rgba(37,211,102,0.35); }
        }
        @keyframes waTooltipIn {
          from { opacity:0; transform:translateX(12px); }
          to   { opacity:1; transform:translateX(0); }
        }
        .wa-btn {
          width: 58px; height: 58px;
          border-radius: 50%;
          background: #25d366;
          border: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 3px;
          animation: waBounceIn 0.6s cubic-bezier(.34,1.56,.64,1) both;
          transition: transform 0.2s;
          position: relative;
        }
        .wa-btn:hover { transform: scale(1.1); }
        .wa-btn.pulse { animation: waBounceIn 0.6s cubic-bezier(.34,1.56,.64,1) both, waPulse 2.5s 2s infinite; }
        .wa-label {
          font-size: 10px;
          font-weight: 700;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.3px;
          line-height: 1;
          white-space: nowrap;
        }
        .wa-tooltip {
          position: absolute;
          right: calc(100% + 14px);
          bottom: 0;
          background: #fff;
          border-radius: 16px 16px 4px 16px;
          padding: 12px 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.14);
          white-space: nowrap;
          animation: waTooltipIn 0.35s ease both;
          pointer-events: none;
          border: 1px solid rgba(0,0,0,0.07);
        }
        .wa-tooltip::after {
          content: '';
          position: absolute;
          right: -7px;
          bottom: 14px;
          border: 7px solid transparent;
          border-left-color: #fff;
          border-right: 0;
        }
        .wa-close {
          position: absolute;
          top: -6px; right: -6px;
          width: 20px; height: 20px;
          border-radius: 50%;
          background: rgba(0,0,0,0.25);
          border: none;
          color: #fff;
          font-size: 11px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          line-height: 1;
          transition: background 0.18s;
        }
        .wa-close:hover { background: rgba(0,0,0,0.5); }
      `}</style>

      <div style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 9990,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 10,
      }}>
        {/* Tooltip bubble */}
        {tooltip && (
          <div style={{ position:"relative", alignSelf:"flex-end" }}>
            <div className="wa-tooltip">
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                {/* Mini avatar */}
                <div style={{ width:36, height:36, borderRadius:12, background:"#25d366", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                  🕌
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#1a1a2e", lineHeight:1.3 }}>Edafay Travel</div>
                  <div style={{ fontSize:11, color:"#25d366", fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
                    <span style={{ width:6, height:6, borderRadius:"50%", background:"#25d366", display:"inline-block" }} />
                    Online — reply in minutes
                  </div>
                </div>
              </div>
              <div style={{ marginTop:10, fontSize:12, color:"#374151", lineHeight:1.6 }}>
                👋 Hi there! Have a question about<br />
                Umrah, Visa, or Travel packages?
              </div>
              <div style={{ marginTop:8, fontSize:11, color:"#9ca3af" }}>
                Tap the button to chat on WhatsApp
              </div>
            </div>
            {/* Close tooltip */}
            <button className="wa-close" onClick={e => { e.stopPropagation(); setTooltip(false); }}>✕</button>
          </div>
        )}

        {/* Main WhatsApp button */}
        <button className={`wa-btn${pulse ? " pulse" : ""}`} onClick={openWhatsApp} title="Chat with us on WhatsApp" aria-label="WhatsApp Chat">
          {/* Official WhatsApp icon */}
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M24 4C12.954 4 4 12.954 4 24c0 3.594.94 6.97 2.587 9.89L4 44l10.418-2.545A19.916 19.916 0 0024 44c11.046 0 20-8.954 20-20S35.046 4 24 4z" fill="#fff"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M24 7.2C14.71 7.2 7.2 14.71 7.2 24c0 3.178.862 6.155 2.367 8.71L7.2 40.8l8.272-2.324A16.716 16.716 0 0024 40.8c9.29 0 16.8-7.51 16.8-16.8S33.29 7.2 24 7.2z" fill="#25D366"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M19.04 15.68c-.384-.864-.79-.88-1.152-.896-.299-.012-.64-.012-.982-.012-.341 0-.896.128-1.365.64-.47.512-1.792 1.75-1.792 4.267s1.835 4.95 2.09 5.293c.256.341 3.541 5.675 8.746 7.722 4.331 1.707 5.206 1.368 6.144 1.28.939-.086 3.03-1.237 3.456-2.432.427-1.194.427-2.219.299-2.432-.128-.213-.47-.341-.982-.597-.512-.256-3.03-1.494-3.499-1.664-.47-.17-.81-.256-1.152.256-.341.512-1.323 1.664-1.621 2.006-.299.341-.597.384-1.11.128-.512-.256-2.16-.795-4.114-2.538-1.52-1.354-2.547-3.027-2.846-3.539-.299-.512-.032-.789.225-1.044.23-.23.512-.597.768-.896.256-.298.341-.512.512-.853.17-.341.085-.64-.043-.896-.128-.256-1.11-2.773-1.58-3.79z" fill="#fff"/>
          </svg>
        </button>
      </div>
    </>
  );
}