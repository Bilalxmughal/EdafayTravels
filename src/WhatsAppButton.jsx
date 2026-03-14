// ─── WhatsAppButton.jsx — Floating WhatsApp Chat Widget ──────────────────────
import { useState, useEffect } from "react";

const PHONE   = "923454449433";   // ← apna number yahan daalo (country code + number, no +)
const MESSAGE = "Hello! I'm interested in your travel services. Can you help me?";

export default function WhatsAppButton() {
  const [visible,  setVisible]  = useState(false);
  const [tooltip,  setTooltip]  = useState(true);
  const [pulse,    setPulse]    = useState(true);

  // Show after 1.5s, hide tooltip after 5s
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
          {/* WhatsApp SVG icon */}
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
            <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.828 6.5L4 29l7.7-1.8A11.94 11.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/>
            <path d="M16 5.5c-5.247 0-9.5 4.253-9.5 9.5 0 2.073.666 3.994 1.797 5.563L7.25 24.75l4.35-1.04A9.46 9.46 0 0016 24.5c5.247 0 9.5-4.253 9.5-9.5S21.247 5.5 16 5.5z" fill="#25d366"/>
            <path d="M12.5 10.5c-.3-.7-.6-.7-.9-.7-.2 0-.5 0-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.4 1 2.9.8 3.4.7.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.1.1-1.3-.1-.1-.4-.2-.8-.4-.4-.2-2.4-1.2-2.8-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.2-.4.2-.8 0-.4-.2-1.7-.6-3.2-2-.7-.6-1.1-1.3-1.3-1.7-.2-.4 0-.6.1-.8.2-.2.4-.4.5-.6.2-.2.2-.4.3-.6.1-.2 0-.4-.1-.6-.1-.1-.9-2.1-1.2-2.9z" fill="#fff"/>
          </svg>
          <span className="wa-label">Edafay</span>
        </button>
      </div>
    </>
  );
}