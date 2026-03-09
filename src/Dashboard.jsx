import { useState, useEffect, useRef } from "react";

/* ─── PERSISTENT STORAGE HELPERS ─────────────────────────────────────── */
const STORAGE_KEY = "tourm-images-v1";

async function loadImages() {
  try {
    const res = await window.storage.get(STORAGE_KEY);
    return res ? JSON.parse(res.value) : null;
  } catch { return null; }
}

async function saveImages(data) {
  try {
    await window.storage.set(STORAGE_KEY, JSON.stringify(data));
  } catch (e) { console.error("Save failed", e); }
}

/* ─── DEFAULT IMAGE DATA ──────────────────────────────────────────────── */
const DEFAULT_IMAGES = {
  hero: {
    label: "Hero Background",
    section: "Hero Section",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85",
    description: "Main hero background on homepage",
  },
  dest1: { label: "Santorini", section: "Destinations", url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80", description: "Santorini, Greece destination card" },
  dest2: { label: "Kyoto", section: "Destinations", url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80", description: "Kyoto, Japan destination card" },
  dest3: { label: "Bali", section: "Destinations", url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80", description: "Bali, Indonesia destination card" },
  dest4: { label: "Amalfi Coast", section: "Destinations", url: "https://images.unsplash.com/photo-1533606688076-b6683a5f59f1?w=600&q=80", description: "Amalfi Coast, Italy destination card" },
  dest5: { label: "Machu Picchu", section: "Destinations", url: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&q=80", description: "Machu Picchu, Peru destination card" },
  dest6: { label: "Maldives", section: "Destinations", url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80", description: "Maldives destination card" },
  feat1: { label: "Feature Photo 1", section: "Features", url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80", description: "Features section grid image 1" },
  feat2: { label: "Feature Photo 2", section: "Features", url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80", description: "Features section grid image 2" },
  feat3: { label: "Feature Photo 3", section: "Features", url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80", description: "Features section grid image 3" },
  feat4: { label: "Feature Photo 4", section: "Features", url: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=400&q=80", description: "Features section grid image 4" },
  tour1: { label: "European Highlights", section: "Popular Tours", url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=500&q=80", description: "European Highlights tour card" },
  tour2: { label: "South East Asia", section: "Popular Tours", url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=500&q=80", description: "South East Asia tour card" },
  tour3: { label: "African Safari", section: "Popular Tours", url: "https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=500&q=80", description: "African Safari tour card" },
};

const SECTIONS = ["All", "Hero Section", "Destinations", "Features", "Popular Tours"];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0c0c14; color: #f0ede8; font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0c0c14; }
  ::-webkit-scrollbar-thumb { background: #e8c46a; border-radius: 10px; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
  @keyframes slideIn { from{transform:translateX(100%);opacity:0;} to{transform:translateX(0);opacity:1;} }
  @keyframes slideOut { from{transform:translateX(0);opacity:1;} to{transform:translateX(100%);opacity:0;} }

  .fade-up { animation: fadeUp 0.5s ease both; }

  .sidebar-link {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 16px; border-radius: 12px;
    color: rgba(240,237,232,0.6); font-size: 14px;
    cursor: pointer; transition: all 0.2s;
    border: 1px solid transparent; font-weight: 500;
    user-select: none;
  }
  .sidebar-link:hover { background: rgba(255,255,255,0.05); color: #f0ede8; }
  .sidebar-link.active { background: rgba(232,196,106,0.12); color: #e8c46a; border-color: rgba(232,196,106,0.2); }

  .card {
    background: #13131e; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; overflow: hidden;
    transition: all 0.25s; cursor: pointer;
  }
  .card:hover { border-color: rgba(232,196,106,0.3); transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,0.4); }
  .card.selected { border-color: #e8c46a; box-shadow: 0 0 0 2px rgba(232,196,106,0.2); }

  .btn { border: none; cursor: pointer; font-family: 'DM Sans',sans-serif; font-weight: 600; font-size: 13px; transition: all 0.2s; }
  .btn-gold { background: #e8c46a; color: #0c0c14; padding: 10px 22px; border-radius: 10px; }
  .btn-gold:hover { background: #f5d98b; transform: translateY(-1px); }
  .btn-ghost { background: rgba(255,255,255,0.05); color: #f0ede8; padding: 10px 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); }
  .btn-ghost:hover { background: rgba(255,255,255,0.09); }
  .btn-danger { background: rgba(239,68,68,0.12); color: #f87171; padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(239,68,68,0.2); }
  .btn-danger:hover { background: rgba(239,68,68,0.2); }
  .btn-sm { padding: 7px 14px !important; font-size: 12px !important; }

  .input {
    background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.09);
    border-radius: 10px; color: #f0ede8; font-family: 'DM Sans',sans-serif;
    font-size: 14px; padding: 11px 14px; width: 100%; outline: none; transition: border-color 0.2s;
  }
  .input:focus { border-color: #e8c46a; }
  .input::placeholder { color: rgba(240,237,232,0.3); }

  .tag {
    display: inline-block; font-size: 11px; font-weight: 600;
    padding: 3px 10px; border-radius: 20px;
    background: rgba(232,196,106,0.1); color: #e8c46a;
    border: 1px solid rgba(232,196,106,0.2);
  }

  .modal-bg {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.75); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.2s ease;
  }
  .modal {
    background: #13131e; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 22px; padding: 32px; width: 90%; max-width: 520px;
    animation: fadeUp 0.3s ease;
  }

  .toast {
    position: fixed; bottom: 28px; right: 28px; z-index: 999;
    background: #13131e; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px; padding: 16px 22px;
    display: flex; align-items: center; gap: 12px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    animation: slideIn 0.3s ease;
    min-width: 260px;
  }

  .upload-zone {
    border: 2px dashed rgba(232,196,106,0.3); border-radius: 14px;
    padding: 32px; text-align: center; cursor: pointer;
    transition: all 0.2s; background: rgba(232,196,106,0.03);
  }
  .upload-zone:hover, .upload-zone.drag { border-color: #e8c46a; background: rgba(232,196,106,0.07); }

  .preview-img {
    width: 100%; height: 160px; object-fit: cover;
    transition: transform 0.4s;
  }
  .card:hover .preview-img { transform: scale(1.04); }

  .stat { background: #13131e; border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 20px 24px; }

  .section-pill {
    font-size: 11px; font-weight: 700; letter-spacing: 0.5px;
    padding: 3px 10px; border-radius: 20px; text-transform: uppercase;
  }

  .spinner { animation: spin 0.8s linear infinite; }
  .pulse { animation: pulse 1.5s ease infinite; }

  @media(max-width:768px) {
    .sidebar { display: none !important; }
    .main-content { margin-left: 0 !important; }
  }
`;

const sectionColors = {
  "Hero Section": { bg: "rgba(99,102,241,0.12)", color: "#818cf8" },
  "Destinations": { bg: "rgba(232,196,106,0.12)", color: "#e8c46a" },
  "Features": { bg: "rgba(76,175,125,0.12)", color: "#4caf7d" },
  "Popular Tours": { bg: "rgba(239,68,68,0.1)", color: "#f87171" },
};

/* ─── Toast ─────────────────────────────────────────────────────────────── */
function Toast({ toast }) {
  if (!toast) return null;
  const icons = { success: "✅", error: "❌", info: "ℹ️" };
  return (
    <div className="toast">
      <span style={{ fontSize: 20 }}>{icons[toast.type] || "ℹ️"}</span>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{toast.title}</div>
        {toast.msg && <div style={{ fontSize: 12, color: "rgba(240,237,232,0.6)", marginTop: 2 }}>{toast.msg}</div>}
      </div>
    </div>
  );
}

/* ─── Edit Modal ─────────────────────────────────────────────────────────── */
function EditModal({ item, itemKey, onSave, onClose }) {
  const [url, setUrl] = useState(item.url);
  const [preview, setPreview] = useState(item.url);
  const [uploading, setUploading] = useState(false);
  const [drag, setDrag] = useState(false);
  const [tab, setTab] = useState("url"); // "url" | "upload"
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setUrl(e.target.result);
      setPreview(e.target.result);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700 }}>Edit Image</h3>
            <p style={{ fontSize: 13, color: "rgba(240,237,232,0.5)", marginTop: 4 }}>{item.label} • {item.section}</p>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#f0ede8", width: 34, height: 34, borderRadius: 10, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        {/* Current preview */}
        <div style={{ borderRadius: 12, overflow: "hidden", height: 160, marginBottom: 20, position: "relative" }}>
          {preview ? (
            <img src={preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={() => setPreview(null)} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(240,237,232,0.3)", fontSize: 13 }}>
              Invalid image URL
            </div>
          )}
          <div style={{ position: "absolute", top: 10, left: 10 }}>
            <span className="tag">Preview</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["url", "upload"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
              background: tab === t ? "#e8c46a" : "rgba(255,255,255,0.05)",
              color: tab === t ? "#0c0c14" : "rgba(240,237,232,0.6)",
              border: "none", transition: "all 0.2s",
            }}>{t === "url" ? "🔗 URL se" : "📁 File Upload"}</button>
          ))}
        </div>

        {tab === "url" ? (
          <div>
            <label style={{ fontSize: 12, color: "rgba(240,237,232,0.5)", display: "block", marginBottom: 8 }}>Image URL paste karo</label>
            <input
              className="input"
              value={url}
              onChange={e => { setUrl(e.target.value); setPreview(e.target.value); }}
              placeholder="https://example.com/image.jpg"
            />
            <p style={{ fontSize: 11, color: "rgba(240,237,232,0.35)", marginTop: 8 }}>
              Unsplash, Imgur, ya kisi bhi direct image URL
            </p>
          </div>
        ) : (
          <div
            className={`upload-zone ${drag ? "drag" : ""}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
          >
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => handleFile(e.target.files[0])} />
            {uploading ? (
              <div style={{ fontSize: 24, animation: "spin 1s linear infinite" }}>⏳</div>
            ) : (
              <>
                <div style={{ fontSize: 36, marginBottom: 10 }}>📂</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Click karo ya drag & drop</div>
                <div style={{ fontSize: 12, color: "rgba(240,237,232,0.4)" }}>PNG, JPG, GIF, WebP — max 5MB</div>
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-gold" onClick={() => onSave(itemKey, url)}>
            💾 Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────────────────── */
export default function Dashboard() {
  const [images, setImages] = useState(DEFAULT_IMAGES);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("All");
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [activePage, setActivePage] = useState("images");

  // Load from storage
  useEffect(() => {
    loadImages().then(saved => {
      if (saved) setImages(saved);
      setLoading(false);
    });
  }, []);

  const showToast = (type, title, msg) => {
    setToast({ type, title, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (key, newUrl) => {
    const updated = { ...images, [key]: { ...images[key], url: newUrl } };
    setImages(updated);
    await saveImages(updated);
    setEditItem(null);
    showToast("success", "Image Updated!", `${images[key].label} successfully save ho gai`);
  };

  const handleReset = async (key) => {
    const updated = { ...images, [key]: { ...images[key], url: DEFAULT_IMAGES[key].url } };
    setImages(updated);
    await saveImages(updated);
    showToast("info", "Reset Ho Gai", `${images[key].label} default par wapas aa gayi`);
  };

  const handleResetAll = async () => {
    setImages(DEFAULT_IMAGES);
    await saveImages(DEFAULT_IMAGES);
    showToast("info", "Sab Reset!", "Tamam images default ho gayi hain");
  };

  const filtered = Object.entries(images).filter(([k, v]) => {
    const matchSection = activeSection === "All" || v.section === activeSection;
    const matchSearch = v.label.toLowerCase().includes(search.toLowerCase()) ||
      v.section.toLowerCase().includes(search.toLowerCase());
    return matchSection && matchSearch;
  });

  const stats = SECTIONS.slice(1).map(s => ({
    name: s, count: Object.values(images).filter(v => v.section === s).length,
    ...sectionColors[s],
  }));

  const navItems = [
    { id: "images", icon: "🖼️", label: "Image Manager" },
    { id: "stats", icon: "📊", label: "Overview" },
    { id: "export", icon: "📤", label: "Export Code" },
    <button onClick={() => window.location.hash = ''}>
  ← Website
</button>
  ];

  if (loading) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0c0c14", flexDirection: "column", gap: 16 }}>
      <div style={{ width: 40, height: 40, border: "3px solid rgba(232,196,106,0.2)", borderTopColor: "#e8c46a", borderRadius: "50%" }} className="spinner" />
      <p style={{ color: "rgba(240,237,232,0.5)", fontSize: 14 }}>Dashboard load ho raha hai...</p>
    </div>
  );

  return (
    <>
      <style>{css}</style>

      {/* Sidebar */}
      <div className="sidebar" style={{
        position: "fixed", left: 0, top: 0, bottom: 0, width: 240,
        background: "#0e0e18", borderRight: "1px solid rgba(255,255,255,0.06)",
        padding: "28px 16px", display: "flex", flexDirection: "column", zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 36 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#e8c46a,#c8943a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✈</div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, letterSpacing: "-0.5px" }}>
              Tour<span style={{ color: "#e8c46a" }}>m</span>
            </div>
            <div style={{ fontSize: 10, color: "rgba(240,237,232,0.4)", fontWeight: 500 }}>ADMIN PANEL</div>
          </div>
        </div>

        <div style={{ fontSize: 10, color: "rgba(240,237,232,0.3)", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", padding: "0 8px", marginBottom: 8 }}>Menu</div>
        {navItems.map(n => (
          <div key={n.id} className={`sidebar-link ${activePage === n.id ? "active" : ""}`}
            onClick={() => setActivePage(n.id)}>
            <span style={{ fontSize: 16 }}>{n.icon}</span>
            {n.label}
          </div>
        ))}

        <div style={{ flex: 1 }} />

        <div style={{ fontSize: 10, color: "rgba(240,237,232,0.3)", fontWeight: 700, letterSpacing: 1.5, padding: "0 8px", marginBottom: 8, textTransform: "uppercase" }}>Sections</div>
        {stats.map(s => (
          <div key={s.name} onClick={() => { setActivePage("images"); setActiveSection(s.name); }}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 2, transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <span style={{ fontSize: 13, color: "rgba(240,237,232,0.55)" }}>{s.name}</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: s.bg, color: s.color }}>{s.count}</span>
          </div>
        ))}

        <div style={{ marginTop: 16, padding: "14px", background: "rgba(232,196,106,0.06)", borderRadius: 14, border: "1px solid rgba(232,196,106,0.12)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#e8c46a", marginBottom: 4 }}>💡 Tip</div>
          <div style={{ fontSize: 11, color: "rgba(240,237,232,0.45)", lineHeight: 1.6 }}>Images save hoti hain storage mein — page reload par bhi rehti hain!</div>
        </div>
      </div>

      {/* Main */}
      <div className="main-content" style={{ marginLeft: 240, minHeight: "100vh", background: "#0c0c14" }}>

        {/* Top bar */}
        <div style={{ padding: "20px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0e0e18", position: "sticky", top: 0, zIndex: 40 }}>
          <div>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800 }}>
              {activePage === "images" ? "Image Manager" : activePage === "stats" ? "Overview" : "Export Code"}
            </h1>
            <p style={{ fontSize: 12, color: "rgba(240,237,232,0.4)", marginTop: 2 }}>
              {activePage === "images" ? `${filtered.length} images • ${activeSection}` : "Tourm Dashboard"}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="btn btn-danger btn-sm" onClick={handleResetAll}>↺ Reset All</button>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#e8c46a,#c8943a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>
          </div>
        </div>

        <div style={{ padding: "32px" }}>

          {/* ── Images Page ── */}
          {activePage === "images" && (
            <>
              {/* Search + Filter */}
              <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
                <input className="input" placeholder="🔍  Image search karo..."
                  style={{ flex: 1, minWidth: 200 }}
                  value={search} onChange={e => setSearch(e.target.value)} />
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {SECTIONS.map(s => (
                    <button key={s} onClick={() => setActiveSection(s)} style={{
                      padding: "9px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                      cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s",
                      background: activeSection === s ? "#e8c46a" : "rgba(255,255,255,0.05)",
                      color: activeSection === s ? "#0c0c14" : "rgba(240,237,232,0.6)",
                      border: activeSection === s ? "none" : "1px solid rgba(255,255,255,0.08)",
                    }}>{s}</button>
                  ))}
                </div>
              </div>

              {/* Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
                {filtered.map(([key, val], i) => {
                  const sc = sectionColors[val.section] || {};
                  return (
                    <div key={key} className="card fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                      {/* Image */}
                      <div style={{ position: "relative", height: 160, overflow: "hidden", background: "rgba(255,255,255,0.03)" }}>
                        <img
                          src={val.url}
                          alt={val.label}
                          className="preview-img"
                          onError={e => { e.target.style.display = "none"; }}
                        />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,12,20,0.5) 0%, transparent 50%)" }} />
                        <div style={{ position: "absolute", top: 10, left: 10 }}>
                          <span className="section-pill" style={{ background: sc.bg, color: sc.color }}>{val.section}</span>
                        </div>
                      </div>

                      {/* Info */}
                      <div style={{ padding: "16px" }}>
                        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{val.label}</div>
                        <div style={{ fontSize: 12, color: "rgba(240,237,232,0.4)", marginBottom: 14, lineHeight: 1.5 }}>{val.description}</div>

                        {/* URL preview */}
                        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "8px 10px", marginBottom: 14 }}>
                          <p style={{ fontSize: 11, color: "rgba(240,237,232,0.35)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {val.url}
                          </p>
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                          <button className="btn btn-gold btn-sm" style={{ flex: 1 }}
                            onClick={() => setEditItem({ key, val })}>
                            ✏️ Edit
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleReset(key)}>↺</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => { navigator.clipboard?.writeText(val.url); showToast("success", "Copied!", "URL clipboard mein copy ho gai"); }}>📋</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(240,237,232,0.3)" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>Koi image nahi mili</div>
                  <div style={{ fontSize: 13, marginTop: 8 }}>Search ya filter change karo</div>
                </div>
              )}
            </>
          )}

          {/* ── Overview Page ── */}
          {activePage === "stats" && (
            <div className="fade-up">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16, marginBottom: 32 }}>
                <div className="stat">
                  <div style={{ fontSize: 32, fontWeight: 800, color: "#e8c46a", fontFamily: "'Syne',sans-serif" }}>{Object.keys(images).length}</div>
                  <div style={{ fontSize: 13, color: "rgba(240,237,232,0.5)", marginTop: 6 }}>Total Images</div>
                </div>
                {stats.map(s => (
                  <div key={s.name} className="stat">
                    <div style={{ fontSize: 32, fontWeight: 800, color: s.color, fontFamily: "'Syne',sans-serif" }}>{s.count}</div>
                    <div style={{ fontSize: 13, color: "rgba(240,237,232,0.5)", marginTop: 6 }}>{s.name}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#13131e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 28 }}>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, marginBottom: 20 }}>All Images Overview</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {Object.entries(images).map(([k, v]) => {
                    const sc = sectionColors[v.section] || {};
                    const isDefault = v.url === DEFAULT_IMAGES[k].url;
                    return (
                      <div key={k} style={{ display: "flex", gap: 14, alignItems: "center", padding: "12px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                        <img src={v.url} alt="" style={{ width: 52, height: 40, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} onError={e => e.target.style.display = "none"} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{v.label}</div>
                          <div style={{ fontSize: 11, color: "rgba(240,237,232,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.url}</div>
                        </div>
                        <span className="section-pill" style={{ background: sc.bg, color: sc.color, flexShrink: 0 }}>{v.section}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: isDefault ? "rgba(76,175,125,0.1)" : "rgba(239,68,68,0.1)", color: isDefault ? "#4caf7d" : "#f87171", flexShrink: 0 }}>
                          {isDefault ? "Default" : "Custom"}
                        </span>
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditItem({ key: k, val: v })}>✏️</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── Export Page ── */}
          {activePage === "export" && (
            <div className="fade-up">
              <div style={{ background: "#13131e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 28, marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, marginBottom: 8 }}>📋 Export Image URLs</h3>
                <p style={{ fontSize: 13, color: "rgba(240,237,232,0.45)", marginBottom: 20, lineHeight: 1.6 }}>
                  Yeh updated URLs apne <code style={{ color: "#e8c46a", background: "rgba(232,196,106,0.1)", padding: "2px 6px", borderRadius: 4 }}>TourmApp.jsx</code> mein paste karo taake website update ho jaye.
                </p>
                <div style={{ background: "#08080f", borderRadius: 12, padding: 20, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 16, maxHeight: 400, overflow: "auto" }}>
                  <pre style={{ fontFamily: "monospace", fontSize: 12, color: "rgba(240,237,232,0.7)", lineHeight: 1.8, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                    {`// ── Updated Image URLs ──────────────────────\n// TourmApp.jsx mein replace karo\n\n`}
                    {`const destinations = [\n`}
                    {["dest1","dest2","dest3","dest4","dest5","dest6"].map((k,i) => `  { id: ${i+1}, img: "${images[k]?.url}", ... },\n`).join("")}
                    {`];\n\n`}
                    {`// Hero image:\n// src="${images.hero?.url}"\n\n`}
                    {`// Feature images:\n`}
                    {["feat1","feat2","feat3","feat4"].map((k,i) => `// feat${i+1}: "${images[k]?.url}"\n`).join("")}
                    {`\n// Tour images:\n`}
                    {["tour1","tour2","tour3"].map((k,i) => `// tour${i+1}: "${images[k]?.url}"\n`).join("")}
                  </pre>
                </div>
                <button className="btn btn-gold" onClick={() => {
                  const text = Object.entries(images).map(([k,v]) => `${k}: ${v.url}`).join("\n");
                  navigator.clipboard?.writeText(text);
                  showToast("success", "Copied!", "Sab URLs clipboard mein copy ho gayi");
                }}>📋 Copy All URLs</button>
              </div>

              <div style={{ background: "#13131e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 28 }}>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, marginBottom: 16 }}>🔗 Integration Guide</h3>
                {[
                  { step: "1", title: "Dashboard mein image edit karo", desc: "Image Manager mein jaake kisi bhi image ka URL ya file upload karo" },
                  { step: "2", title: "Export karo", desc: "Export page se URLs copy karo" },
                  { step: "3", title: "TourmApp.jsx update karo", desc: "Copied URLs ko apne main website file mein paste karo" },
                ].map(s => (
                  <div key={s.step} style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "start" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(232,196,106,0.12)", border: "1px solid rgba(232,196,106,0.2)", color: "#e8c46a", fontWeight: 800, fontFamily: "'Syne',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.step}</div>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{s.title}</div>
                      <div style={{ fontSize: 13, color: "rgba(240,237,232,0.45)", lineHeight: 1.6 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editItem && (
        <EditModal
          item={editItem.val}
          itemKey={editItem.key}
          onSave={handleSave}
          onClose={() => setEditItem(null)}
        />
      )}

      {/* Toast */}
      <Toast toast={toast} />
    </>
  );
}
