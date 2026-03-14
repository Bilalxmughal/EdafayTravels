// ─── Blog.jsx — Edafay Blog Page ─────────────────────────────────────────────
import { useState, useEffect } from "react";
import theme from './theme.js';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { getPublished, incrementViews, BLOG_EV } from './blogStore.js';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
@keyframes blogFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
.blog-page { font-family:'DM Sans',sans-serif; }
.blog-list-item { transition:all 0.2s; cursor:pointer; }
.blog-list-item:hover { background:rgba(26,60,110,0.03) !important; }
.blog-list-item.active { background:rgba(26,60,110,0.07) !important; border-color:rgba(26,60,110,0.3) !important; }
.blog-content h2 { font-family:'Playfair Display',serif; font-size:22px; font-weight:700; color:#1a1a2e; margin:28px 0 12px; }
.blog-content h3 { font-family:'Playfair Display',serif; font-size:18px; font-weight:700; color:#1a1a2e; margin:22px 0 10px; }
.blog-content p  { font-size:15px; color:#374151; line-height:1.85; margin:0 0 16px; }
.blog-content ul,.blog-content ol { padding-left:22px; margin:0 0 16px; }
.blog-content li { font-size:15px; color:#374151; line-height:1.8; margin-bottom:6px; }
.blog-content strong { color:#1a1a2e; }
@media(max-width:960px){ .blog-layout{ grid-template-columns:1fr !important; } .blog-sidebar{ position:static !important; } }
@media(max-width:640px){ .blog-hero-title{ font-size:36px !important; } }
`;

const CAT_COLORS = {
  "Umrah":"#1a3c6e", "Visa":"#0369a1", "Travel Tips":"#16a34a",
  "Insurance":"#7c3aed", "Car Rental":"#dc2626", "General":"#6b6880",
};

function fmtDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" });
}

// ─── Article View ─────────────────────────────────────────────────────────────
function ArticleView({ post, onBack }) {
  useEffect(() => { incrementViews(post.id); window.scrollTo(0,0); }, [post.id]);
  const cc = CAT_COLORS[post.category] || "#6b6880";
  return (
    <div style={{ animation:"blogFadeUp 0.5s ease both" }}>
      {/* Back button */}
      <button onClick={onBack} style={{ display:"inline-flex", alignItems:"center", gap:7, background:"none", border:"1.5px solid rgba(0,0,0,0.1)", borderRadius:10, padding:"8px 16px", fontSize:13, fontWeight:600, color:theme.textMuted, cursor:"pointer", marginBottom:24, fontFamily:"'DM Sans',sans-serif", transition:"all 0.18s" }}
        onMouseEnter={e=>{ e.currentTarget.style.borderColor=theme.accent; e.currentTarget.style.color=theme.accent; }}
        onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(0,0,0,0.1)"; e.currentTarget.style.color=theme.textMuted; }}>
        ← All Articles
      </button>

      {/* Cover image */}
      {post.coverImage && (
        <div style={{ borderRadius:20, overflow:"hidden", height:380, marginBottom:32, position:"relative" }}>
          <img src={post.coverImage} alt={post.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)" }} />
        </div>
      )}

      {/* Meta */}
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        <span style={{ fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:20, background:`${cc}14`, color:cc, border:`1px solid ${cc}30` }}>{post.category}</span>
        {post.tags?.map(t => (
          <span key={t} style={{ fontSize:11, padding:"3px 10px", borderRadius:20, background:theme.bgCard, border:`1px solid ${theme.border}`, color:theme.textMuted }}>{t}</span>
        ))}
      </div>

      {/* Title */}
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,3.5vw,38px)", fontWeight:700, lineHeight:1.2, color:theme.text, marginBottom:16 }}>{post.title}</h1>

      {/* Author + meta */}
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28, paddingBottom:24, borderBottom:`1px solid ${theme.border}`, flexWrap:"wrap" }}>
        <div style={{ width:40, height:40, borderRadius:12, background:theme.accent, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13 }}>{post.authorAvatar||"EA"}</div>
        <div>
          <div style={{ fontWeight:700, fontSize:14, color:theme.text }}>{post.author}</div>
          <div style={{ fontSize:12, color:theme.textMuted }}>{fmtDate(post.publishedAt)} · {post.readTime}</div>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:12, alignItems:"center" }}>
          <span style={{ fontSize:12, color:theme.textMuted }}>👁 {post.views?.toLocaleString() || 0} views</span>
        </div>
      </div>

      {/* Content */}
      <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* Share CTA */}
      <div style={{ marginTop:48, padding:"28px 32px", background:`rgba(26,60,110,0.04)`, border:`1px solid rgba(26,60,110,0.15)`, borderRadius:18, textAlign:"center" }}>
        <div style={{ fontSize:13, fontWeight:600, color:theme.text, marginBottom:12 }}>Found this helpful? Share it.</div>
        <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
          {["Facebook","WhatsApp","Copy Link"].map(s => (
            <button key={s} style={{ padding:"8px 18px", borderRadius:10, border:`1px solid ${theme.border}`, background:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", color:theme.textMuted, transition:"all 0.18s" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=theme.accent; e.currentTarget.style.color=theme.accent; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=theme.border; e.currentTarget.style.color=theme.textMuted; }}>
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Blog Page ────────────────────────────────────────────────────────────────
export default function Blog() {
  const [posts,   setPosts]   = useState(() => getPublished());
  const [active,  setActive]  = useState(null);   // currently reading post
  const [search,  setSearch]  = useState("");
  const [catFilter,setCatFilter] = useState("All");

  useEffect(() => {
    const h = () => setPosts(getPublished());
    window.addEventListener(BLOG_EV, h);
    return () => window.removeEventListener(BLOG_EV, h);
  }, []);

  const cats = ["All", ...new Set(posts.map(p => p.category))];

  const filtered = posts.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    const matchCat = catFilter === "All" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const openPost = (post) => { setActive(post); window.scrollTo({ top:0, behavior:"smooth" }); };

  return (
    <>
      <style>{CSS}</style>
      <div className="blog-page" style={{ background:theme.bg, minHeight:"100vh" }}>
        <Navbar />

        {/* Hero */}
        <section style={{ padding:"130px 5% 70px", background:`radial-gradient(ellipse at 70% 30%, rgba(26,60,110,0.07) 0%, transparent 60%), ${theme.bg}`, textAlign:"center" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(26,60,110,0.08)", border:"1px solid rgba(26,60,110,0.2)", color:theme.accent, fontSize:12, fontWeight:700, padding:"6px 18px", borderRadius:50, letterSpacing:"1px", textTransform:"uppercase", marginBottom:20 }}>
            ✍️ Travel Blog
          </div>
          <h1 className="blog-hero-title serif" style={{ fontSize:"clamp(38px,5vw,62px)", fontWeight:700, lineHeight:1.1, letterSpacing:"-1px", marginBottom:16, color:theme.text }}>
            Travel <span className="gradient-text">Insights</span> & Guides
          </h1>
          <p style={{ color:theme.textMuted, fontSize:16, lineHeight:1.8, maxWidth:500, margin:"0 auto" }}>
            Expert advice on Umrah, visas, destinations, insurance, and everything you need to travel smarter.
          </p>
        </section>

        {/* Main Layout */}
        <section style={{ padding:"0 5% 100px", background:theme.bgCard }}>
          <div style={{ maxWidth:1160, margin:"0 auto", paddingTop:48 }}>

            {active ? (
              /* Article reading mode — full width */
              <div style={{ maxWidth:780, margin:"0 auto" }}>
                <ArticleView post={active} onBack={() => { setActive(null); window.scrollTo({ top:0, behavior:"smooth" }); }} />
              </div>
            ) : (
              /* List mode — sidebar + articles */
              <div className="blog-layout" style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:32, alignItems:"start" }}>

                {/* ── SIDEBAR ── */}
                <div className="blog-sidebar" style={{ position:"sticky", top:96 }}>
                  {/* Search */}
                  <div style={{ background:"#fff", borderRadius:16, border:`1px solid ${theme.border}`, padding:"18px 20px", marginBottom:16, boxShadow:"0 1px 8px rgba(0,0,0,0.04)" }}>
                    <div style={{ fontSize:13, fontWeight:700, color:theme.text, marginBottom:12 }}>🔍 Search Articles</div>
                    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by topic, keyword..."
                      style={{ width:"100%", padding:"10px 14px", border:"1.5px solid rgba(0,0,0,0.09)", borderRadius:10, fontSize:13, outline:"none", fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box", transition:"border 0.2s" }}
                      onFocus={e=>e.target.style.borderColor=theme.accent}
                      onBlur={e=>e.target.style.borderColor="rgba(0,0,0,0.09)"} />
                  </div>

                  {/* Categories */}
                  <div style={{ background:"#fff", borderRadius:16, border:`1px solid ${theme.border}`, padding:"18px 20px", marginBottom:16, boxShadow:"0 1px 8px rgba(0,0,0,0.04)" }}>
                    <div style={{ fontSize:13, fontWeight:700, color:theme.text, marginBottom:12 }}>📚 Categories</div>
                    {cats.map(cat => {
                      const count = cat === "All" ? posts.length : posts.filter(p=>p.category===cat).length;
                      const cc = CAT_COLORS[cat] || "#6b6880";
                      return (
                        <div key={cat} onClick={() => setCatFilter(cat)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 12px", borderRadius:10, cursor:"pointer", marginBottom:4, background:catFilter===cat?`${cc}10`:"transparent", border:`1px solid ${catFilter===cat?`${cc}30`:"transparent"}`, transition:"all 0.18s" }}>
                          <span style={{ fontSize:13, fontWeight:catFilter===cat?700:500, color:catFilter===cat?cc:theme.textMuted }}>{cat}</span>
                          <span style={{ fontSize:11, fontWeight:700, background:catFilter===cat?`${cc}20`:theme.bgCard, color:catFilter===cat?cc:theme.textMuted, padding:"2px 8px", borderRadius:20 }}>{count}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Popular posts */}
                  <div style={{ background:"#fff", borderRadius:16, border:`1px solid ${theme.border}`, padding:"18px 20px", boxShadow:"0 1px 8px rgba(0,0,0,0.04)" }}>
                    <div style={{ fontSize:13, fontWeight:700, color:theme.text, marginBottom:14 }}>🔥 Most Read</div>
                    {[...posts].sort((a,b)=>(b.views||0)-(a.views||0)).slice(0,4).map((p,i) => (
                      <div key={p.id} onClick={() => openPost(p)} style={{ display:"flex", gap:10, cursor:"pointer", padding:"8px 0", borderBottom: i<3 ? `1px solid ${theme.border}` : "none" }}
                        onMouseEnter={e=>e.currentTarget.style.opacity="0.75"}
                        onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                        <span style={{ fontSize:16, fontWeight:800, color:theme.accent, minWidth:22 }}>{i+1}</span>
                        <div>
                          <div style={{ fontSize:12, fontWeight:600, color:theme.text, lineHeight:1.5 }}>{p.title}</div>
                          <div style={{ fontSize:11, color:theme.textMuted, marginTop:2 }}>{p.views?.toLocaleString()} views</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── ARTICLES LIST ── */}
                <div>
                  {filtered.length === 0 ? (
                    <div style={{ textAlign:"center", padding:"60px 20px", color:theme.textMuted }}>
                      <div style={{ fontSize:52, marginBottom:14 }}>🔍</div>
                      <div style={{ fontSize:16, fontWeight:600 }}>No articles found.</div>
                      <div style={{ fontSize:14, marginTop:6 }}>Try a different search or category.</div>
                    </div>
                  ) : filtered.map((post, i) => {
                    const cc = CAT_COLORS[post.category] || "#6b6880";
                    return (
                      <div key={post.id} className="blog-list-item"
                        onClick={() => openPost(post)}
                        style={{ display:"flex", gap:20, background:"#fff", borderRadius:18, border:`1px solid ${theme.border}`, padding:"20px 22px", marginBottom:16, boxShadow:"0 1px 8px rgba(0,0,0,0.04)", animation:`blogFadeUp 0.5s ${i*0.05}s ease both`, alignItems:"flex-start" }}>
                        {/* Cover thumbnail */}
                        {post.coverImage && (
                          <div style={{ width:140, height:100, borderRadius:12, overflow:"hidden", flexShrink:0 }}>
                            <img src={post.coverImage} alt={post.title} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.3s" }} />
                          </div>
                        )}
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", gap:8, marginBottom:8, flexWrap:"wrap", alignItems:"center" }}>
                            <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, background:`${cc}12`, color:cc, border:`1px solid ${cc}30` }}>{post.category}</span>
                            <span style={{ fontSize:11, color:theme.textMuted }}>{post.readTime}</span>
                          </div>
                          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:theme.text, margin:"0 0 8px", lineHeight:1.35 }}>{post.title}</h3>
                          <p style={{ fontSize:13, color:theme.textMuted, lineHeight:1.65, margin:"0 0 10px" }}>{post.excerpt}</p>
                          <div style={{ display:"flex", gap:14, alignItems:"center" }}>
                            <span style={{ fontSize:12, color:theme.textMuted }}>{post.author} · {fmtDate(post.publishedAt)}</span>
                            <span style={{ fontSize:11, color:theme.textMuted }}>👁 {post.views?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}