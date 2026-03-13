import { useState, useEffect } from 'react'
import './Dashboard.css'

// ─── Storage ─────────────────────────────────────────────────────────────────
const USERS_KEY   = 'edafay-users-v1'
const SESSION_KEY = 'edafay-session-v1'
const CONTENT_KEY = 'edafay-content-v1'

const DEFAULT_SUPER = {
  id: 1, name: 'Bilal Mughal', email: 'admin@edafay.com',
  password: 'Admin@123', role: 'super', pages: [], active: true,
  createdAt: new Date().toISOString(),
}

function getUsers() {
  try {
    const u = JSON.parse(localStorage.getItem(USERS_KEY))
    if (u?.length) return u
  } catch {}
  const d = [DEFAULT_SUPER]
  localStorage.setItem(USERS_KEY, JSON.stringify(d))
  return d
}
const saveUsers   = u  => localStorage.setItem(USERS_KEY,   JSON.stringify(u))
const getSession  = () => { try { return JSON.parse(localStorage.getItem(SESSION_KEY)) } catch { return null } }
const saveSession = s  => localStorage.setItem(SESSION_KEY, JSON.stringify(s))
const clearSession= () => localStorage.removeItem(SESSION_KEY)
const getContent  = () => { try { return JSON.parse(localStorage.getItem(CONTENT_KEY)) || {} } catch { return {} } }
const saveContent = c  => localStorage.setItem(CONTENT_KEY, JSON.stringify(c))

// ─── Config ───────────────────────────────────────────────────────────────────
const ALL_PAGES = [
  { id: 'home',      label: 'Home',           icon: '🏠', hash: ''             },
  { id: 'about',     label: 'About',          icon: '👥', hash: '#/about'      },
  { id: 'contact',   label: 'Contact',        icon: '📬', hash: '#/contact'    },
  { id: 'umrah',     label: 'Umrah Packages', icon: '🕌', hash: '#/umrah'      },
  { id: 'visas',     label: 'Visas',          icon: '📄', hash: '#/visas'      },
  { id: 'cars',      label: 'Car Rental',     icon: '🚗', hash: '#/cars'       },
  { id: 'insurance', label: 'Insurance',      icon: '🛡️',  hash: '#/insurance'  },
  { id: 'booknow',   label: 'Book Now',       icon: '✈️',  hash: '#/booknow'   },
]

// Default editable content per page
const DEFAULT_CONTENT = {
  home: {
    hero: { badge: 'Explore The Umrah Package', title: 'Discover Your Umrah Package', subtitle: 'Plan unforgettable journeys with our expert Umrah travel guides — your perfect Umrah trip awaits.', img: 'https://scontent.flhe3-2.fna.fbcdn.net/v/t39.30808-6/648106452_122114880333209329_4710445315082844352_n.png?_nc_cat=102&ccb=1-7&_nc_sid=2a1932&_nc_ohc=jTYChci6zIcQ7kNvwE9yl85&_nc_oc=Adkv4jV6vZpsOWfDhQdPv4fdTrExSj7SYVYaQP1p54PMkdBj7X8yt-HBFfClXc_SoyI&_nc_zt=23&_nc_ht=scontent.flhe3-2.fna&_nc_gid=2nCmH9BrzPt5eW4pCemgnA&_nc_ss=8&oh=00_Afyrm0_NbeWCRM1_XA1B2bZFu9pyTKmuQenH71yHYYdktQ&oe=69B4F9E2', stat1num: '10K+', stat1label: 'Happy Travelers', stat2num: '50+', stat2label: 'Destinations', stat3num: '5Yr', stat3label: 'Experience' },
    destinations: [
      { id: 1, name: 'Santorini',    country: 'Greece',    price: '$1,299', rating: '4.9', reviews: '2.4k', tag: 'Hot Deal',   days: '7 days',  img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80' },
      { id: 2, name: 'Kyoto',        country: 'Japan',     price: '$1,599', rating: '4.8', reviews: '1.8k', tag: 'Popular',    days: '10 days', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80' },
      { id: 3, name: 'Bali',         country: 'Indonesia', price: '$899',   rating: '4.7', reviews: '3.1k', tag: 'Best Value', days: '8 days',  img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
      { id: 4, name: 'Amalfi Coast', country: 'Italy',     price: '$1,799', rating: '5.0', reviews: '980',  tag: 'Luxury',     days: '6 days',  img: 'https://images.unsplash.com/photo-1533606688076-b6683a5f59f1?w=600&q=80' },
      { id: 5, name: 'Machu Picchu', country: 'Peru',      price: '$1,099', rating: '4.9', reviews: '1.5k', tag: 'Adventure',  days: '9 days',  img: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&q=80' },
      { id: 6, name: 'Maldives',     country: 'Maldives',  price: '$2,499', rating: '5.0', reviews: '750',  tag: 'Luxury',     days: '5 days',  img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80' },
    ],
    tours: [
      { id: 1, name: 'European Highlights', duration: '14 Days', price: '$2,899', rating: '4.9', img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=500&q=80' },
      { id: 2, name: 'South East Asia',     duration: '18 Days', price: '$1,799', rating: '4.8', img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=500&q=80' },
      { id: 3, name: 'African Safari',      duration: '10 Days', price: '$3,299', rating: '5.0', img: 'https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=500&q=80' },
    ],
  },
  umrah:     { hero: { badge: 'Sacred Journey', title: 'Umrah Packages', subtitle: 'Fulfil your spiritual journey with our all-inclusive Umrah packages.' }, packages: [] },
  visas:     { hero: { badge: 'Visa Services', title: 'Visa Assistance', subtitle: 'We handle all your visa needs — fast, easy, and reliable.' }, services: [] },
  cars:      { hero: { badge: 'Car Rental', title: 'Rent a Car', subtitle: 'Premium vehicles for every journey, every budget.' }, cars: [] },
  insurance: { hero: { badge: 'Travel Insurance', title: 'Stay Protected', subtitle: 'Comprehensive travel insurance for a worry-free trip.' }, plans: [] },
  booknow:   { hero: { badge: 'Book Now', title: 'Book Your Trip', subtitle: 'Reserve your dream vacation in minutes.' } },
  about:     { hero: { badge: 'About Us', title: 'We Are Edafay Travels', subtitle: 'Your trusted travel partner since 2019.' } },
  contact:   { hero: { badge: 'Get In Touch', title: "We'd Love To Hear From You", subtitle: 'Contact us to plan your dream trip.' } },
}

// ─── Colors (dark admin theme) ────────────────────────────────────────────────
const C = {
  bg:      '#0d0d14', bg2: '#12121c', bg3: '#1a1a2a',
  border:  'rgba(255,255,255,0.07)',
  text:    '#f0ede8', muted: '#8b8a96',
  accent:  '#1a3c6e', accentLight: '#2a5298', accentGlow: 'rgba(26,60,110,0.3)',
  gold:    '#e8c46a', goldLight: 'rgba(232,196,106,0.15)',
  green:   '#4caf7d', greenLight: 'rgba(76,175,125,0.15)',
  red:     '#ef4444', redLight: 'rgba(239,68,68,0.12)',
  yellow:  '#f59e0b',
}

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
const uid = () => Date.now() + Math.random().toString(36).slice(2)

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [])
  return (
    <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 9999, background: type === 'error' ? C.red : C.green, color: '#fff', padding: '12px 22px', borderRadius: 12, fontSize: 14, fontWeight: 600, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', animation: 'fadeUp .3s' }}>
      {type === 'error' ? '✕ ' : '✓ '}{msg}
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', rows, disabled }) {
  const shared = { value: value || '', onChange: e => onChange(e.target.value), disabled, style: { width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '9px 12px', color: C.text, fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' } }
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: 5 }}>{label}</label>
      {type === 'textarea' ? <textarea rows={rows || 3} {...shared} /> : <input type={type} {...shared} />}
    </div>
  )
}

function Card({ children, style }) {
  return <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, ...style }}>{children}</div>
}

function Btn({ children, onClick, variant = 'primary', size = 'md', disabled, style: s }) {
  const base = { cursor: 'pointer', border: 'none', borderRadius: 8, fontFamily: 'inherit', fontWeight: 600, transition: 'all .2s', display: 'inline-flex', alignItems: 'center', gap: 6, ...(disabled ? { opacity: .5, cursor: 'not-allowed' } : {}) }
  const sizes = { sm: { padding: '6px 14px', fontSize: 12 }, md: { padding: '10px 20px', fontSize: 13 }, lg: { padding: '13px 28px', fontSize: 15 } }
  const variants = {
    primary: { background: C.accent,  color: '#fff'    },
    gold:    { background: C.gold,    color: '#0d0d14' },
    ghost:   { background: C.bg3,     color: C.text    },
    danger:  { background: C.red,     color: '#fff'    },
    outline: { background: 'transparent', color: C.text, border: `1px solid ${C.border}` },
  }
  return <button onClick={disabled ? undefined : onClick} style={{ ...base, ...sizes[size], ...variants[variant], ...s }}>{children}</button>
}

function Badge({ children, color }) {
  const colors = { green: { bg: C.greenLight, color: C.green }, red: { bg: C.redLight, color: C.red }, gold: { bg: C.goldLight, color: C.gold }, blue: { bg: C.accentGlow, color: '#6ca0e8' } }
  const c = colors[color] || colors.blue
  return <span style={{ background: c.bg, color: c.color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.3px' }}>{children}</span>
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail]   = useState('')
  const [pass,  setPass]    = useState('')
  const [err,   setErr]     = useState('')
  const [loading, setLoading] = useState(false)

  const handle = () => {
    setErr('')
    if (!email || !pass) return setErr('Please fill all fields.')
    setLoading(true)
    setTimeout(() => {
      const users = getUsers()
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass && u.active)
      if (user) { saveSession({ userId: user.id, loginAt: Date.now() }); onLogin(user) }
      else setErr('Invalid email or password.')
      setLoading(false)
    }, 600)
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans',sans-serif", padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 16px' }}>✈</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: C.text, margin: '0 0 6px' }}>Edafay Admin</h1>
          <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>Sign in to manage your website</p>
        </div>

        <Card>
          {err && <div style={{ background: C.redLight, border: `1px solid ${C.red}`, color: C.red, padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{err}</div>}
          <Field label="Email Address" value={email} onChange={setEmail} type="email" />
          <Field label="Password"      value={pass}  onChange={setPass}  type="password" />
          <Btn onClick={handle} variant="primary" size="lg" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
            {loading ? '⏳ Signing in...' : '🔐 Sign In'}
          </Btn>
        </Card>

        <p style={{ textAlign: 'center', color: C.muted, fontSize: 12, marginTop: 20 }}>
          Default: admin@edafay.com / Admin@123
        </p>
        <p style={{ textAlign: 'center', marginTop: 12 }}>
          <a onClick={() => window.location.hash = ''} style={{ color: C.muted, fontSize: 13, cursor: 'pointer', textDecoration: 'none' }}>← Back to website</a>
        </p>
      </div>
    </div>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive, user, onLogout, sideOpen, setSideOpen }) {
  const navItems = [
    { id: 'overview',  label: 'Overview',  icon: '📊' },
    ...(user.role === 'super' ? [{ id: 'users', label: 'Users', icon: '👥' }] : []),
    { id: '_divider', label: 'Pages', icon: null },
    ...ALL_PAGES.filter(p => user.role === 'super' || user.pages.includes(p.id)).map(p => ({ id: `page_${p.id}`, label: p.label, icon: p.icon })),
    { id: '_divider2', label: 'Account', icon: null },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {sideOpen && <div onClick={() => setSideOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }} />}
      <aside style={{
        width: 240, background: C.bg2, borderRight: `1px solid ${C.border}`,
        display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 50,
        transition: 'transform .3s', transform: sideOpen ? 'translateX(0)' : undefined,
        fontFamily: "'DM Sans',sans-serif",
      }} className={`db-sidebar ${sideOpen ? 'db-sidebar-open' : ''}`}>

        {/* Header */}
        <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>✈</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 700, color: C.text }}>Edafay<span style={{ color: C.gold }}>.</span></div>
            <div style={{ fontSize: 10, color: C.muted, letterSpacing: '0.5px' }}>ADMIN PANEL</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 12px' }}>
          {navItems.map((item, i) => {
            if (item.id.startsWith('_divider')) return (
              <div key={i} style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', padding: '16px 8px 6px' }}>{item.label}</div>
            )
            const isActive = active === item.id
            return (
              <div key={item.id} onClick={() => { setActive(item.id); setSideOpen(false) }} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, marginBottom: 2,
                background: isActive ? C.accentGlow : 'transparent',
                border: isActive ? `1px solid ${C.accent}` : '1px solid transparent',
                color: isActive ? '#6ca0e8' : C.muted, cursor: 'pointer', fontSize: 13, fontWeight: isActive ? 600 : 400,
                transition: 'all .15s',
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = C.bg3 }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ fontSize: 15 }}>{item.icon}</span> {item.label}
              </div>
            )
          })}
        </nav>

        {/* User */}
        <div style={{ padding: 16, borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: C.accentGlow, border: `1px solid ${C.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#6ca0e8', flexShrink: 0 }}>
              {user.name[0].toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <Badge color={user.role === 'super' ? 'gold' : 'blue'}>{user.role === 'super' ? '⭐ Super Admin' : 'Page Admin'}</Badge>
            </div>
          </div>
          <Btn onClick={onLogout} variant="ghost" size="sm" style={{ width: '100%', justifyContent: 'center', color: C.red }}>🚪 Logout</Btn>
        </div>
      </aside>
    </>
  )
}

// ─── Overview ─────────────────────────────────────────────────────────────────
function OverviewPage({ user }) {
  const users = getUsers()
  const content = getContent()
  const stats = [
    { label: 'Total Users',    value: users.length,                        icon: '👥', color: C.accent },
    { label: 'Active Users',   value: users.filter(u => u.active).length,  icon: '✅', color: C.green  },
    { label: 'Pages Managed',  value: ALL_PAGES.length,                    icon: '📄', color: C.gold   },
    { label: 'Your Role',      value: user.role === 'super' ? 'Super Admin' : 'Page Admin', icon: '🔐', color: '#a78bfa' },
  ]
  return (
    <div>
      <h2 style={{ color: C.text, fontFamily: "'Playfair Display',serif", fontSize: 26, marginBottom: 6 }}>Welcome back, {user.name.split(' ')[0]} 👋</h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 32 }}>Here's what's happening with your website today.</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }} className="db-stats-grid">
        {stats.map(s => (
          <Card key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: s.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.text, fontFamily: "'Syne',sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {ALL_PAGES.filter(p => user.role === 'super' || user.pages.includes(p.id)).map(p => (
            <a key={p.id} href={p.hash || '/'} target="_blank" rel="noreferrer" style={{ background: C.bg3, border: `1px solid ${C.border}`, color: C.text, padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = '#6ca0e8' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text }}
            >{p.icon} View {p.label} ↗</a>
          ))}
        </div>
      </Card>

      {/* Recent Users (super only) */}
      {user.role === 'super' && (
        <Card>
          <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Recent Users</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {['Name', 'Email', 'Role', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', color: C.muted, fontWeight: 600, padding: '8px 12px', fontSize: 11, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 5).map(u => (
                <tr key={u.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '12px 12px', color: C.text, fontWeight: 500 }}>{u.name}</td>
                  <td style={{ padding: '12px 12px', color: C.muted }}>{u.email}</td>
                  <td style={{ padding: '12px 12px' }}><Badge color={u.role === 'super' ? 'gold' : 'blue'}>{u.role === 'super' ? 'Super Admin' : 'Page Admin'}</Badge></td>
                  <td style={{ padding: '12px 12px' }}><Badge color={u.active ? 'green' : 'red'}>{u.active ? 'Active' : 'Inactive'}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}

// ─── Users Page ───────────────────────────────────────────────────────────────
function UsersPage({ currentUser, showToast }) {
  const [users, setUsers]   = useState(getUsers())
  const [modal, setModal]   = useState(null)  // null | 'create' | user object
  const [confirm, setConfirm] = useState(null)
  const [form, setForm]     = useState({ name: '', email: '', password: '', role: 'page', pages: [], active: true })
  const [search, setSearch] = useState('')

  const updateUsers = u => { setUsers(u); saveUsers(u) }
  const f = k => v => setForm(prev => ({ ...prev, [k]: v }))

  const openCreate = () => {
    setForm({ name: '', email: '', password: '', role: 'page', pages: [], active: true })
    setModal('create')
  }
  const openEdit = user => {
    setForm({ name: user.name, email: user.email, password: user.password, role: user.role, pages: user.pages || [], active: user.active })
    setModal(user)
  }

  const togglePage = pid => {
    setForm(prev => {
      const pages = prev.pages.includes(pid) ? prev.pages.filter(p => p !== pid) : [...prev.pages, pid]
      return { ...prev, pages }
    })
  }

  const save = () => {
    if (!form.name || !form.email || !form.password) return showToast('Please fill all required fields.', 'error')
    const all = getUsers()
    if (modal === 'create') {
      if (all.find(u => u.email.toLowerCase() === form.email.toLowerCase())) return showToast('Email already exists.', 'error')
      const newUser = { ...form, id: uid(), createdAt: new Date().toISOString() }
      updateUsers([...all, newUser])
    } else {
      updateUsers(all.map(u => u.id === modal.id ? { ...u, ...form } : u))
    }
    setModal(null)
    showToast(modal === 'create' ? 'User created!' : 'User updated!')
  }

  const deleteUser = id => {
    if (id === currentUser.id) return showToast('Cannot delete yourself.', 'error')
    updateUsers(getUsers().filter(u => u.id !== id))
    setConfirm(null)
    showToast('User deleted.')
  }

  const toggleActive = id => {
    if (id === currentUser.id) return showToast('Cannot deactivate yourself.', 'error')
    updateUsers(getUsers().map(u => u.id === id ? { ...u, active: !u.active } : u))
    showToast('User status updated.')
  }

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ color: C.text, fontFamily: "'Playfair Display',serif", fontSize: 24, margin: '0 0 4px' }}>User Management</h2>
          <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>{users.length} total users</p>
        </div>
        <Btn onClick={openCreate} variant="primary">+ Create User</Btn>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search by name or email..." style={{ width: '100%', background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 16px', color: C.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}`, background: C.bg3 }}>
              {['User', 'Role', 'Page Access', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', color: C.muted, fontWeight: 600, padding: '12px 16px', fontSize: 11, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: C.accentGlow, border: `1px solid ${C.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6ca0e8', fontWeight: 700, flexShrink: 0 }}>{u.name[0].toUpperCase()}</div>
                    <div>
                      <div style={{ fontWeight: 600, color: C.text }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}><Badge color={u.role === 'super' ? 'gold' : 'blue'}>{u.role === 'super' ? '⭐ Super Admin' : 'Page Admin'}</Badge></td>
                <td style={{ padding: '14px 16px', color: C.muted, fontSize: 12 }}>
                  {u.role === 'super' ? <Badge color="gold">All Pages</Badge>
                    : u.pages?.length ? u.pages.map(pid => {
                      const p = ALL_PAGES.find(x => x.id === pid); return p ? (
                        <span key={pid} style={{ background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 6, padding: '2px 7px', fontSize: 11, marginRight: 4, color: C.text }}>{p.icon} {p.label}</span>
                      ) : null
                    }) : <span style={{ color: C.muted }}>No access</span>}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Badge color={u.active ? 'green' : 'red'}>{u.active ? 'Active' : 'Inactive'}</Badge>
                    {u.id !== currentUser.id && (
                      <button onClick={() => toggleActive(u.id)} style={{ background: 'none', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, padding: '2px 8px', fontSize: 10, cursor: 'pointer' }}>Toggle</button>
                    )}
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Btn onClick={() => openEdit(u)} variant="ghost" size="sm">✏️ Edit</Btn>
                    {u.id !== currentUser.id && <Btn onClick={() => setConfirm(u)} variant="danger" size="sm">Delete</Btn>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>No users found.</div>}
      </Card>

      {/* Create/Edit Modal */}
      {modal !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 20, padding: 32, width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ color: C.text, fontSize: 20, fontWeight: 700, marginBottom: 24 }}>{modal === 'create' ? '+ Create User' : '✏️ Edit User'}</h3>

            <Field label="Full Name *"     value={form.name}     onChange={f('name')} />
            <Field label="Email Address *" value={form.email}    onChange={f('email')} type="email" />
            <Field label="Password *"      value={form.password} onChange={f('password')} type="password" />

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Role</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {[['super', '⭐ Super Admin'], ['page', '🔒 Page Admin']].map(([val, lbl]) => (
                  <div key={val} onClick={() => f('role')(val)} style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: `2px solid ${form.role === val ? C.accent : C.border}`, background: form.role === val ? C.accentGlow : C.bg, cursor: 'pointer', textAlign: 'center', color: form.role === val ? '#6ca0e8' : C.muted, fontSize: 13, fontWeight: 500, transition: 'all .2s' }}>{lbl}</div>
                ))}
              </div>
            </div>

            {form.role === 'page' && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>Page Access</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {ALL_PAGES.map(p => {
                    const checked = form.pages.includes(p.id)
                    return (
                      <div key={p.id} onClick={() => togglePage(p.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, border: `1px solid ${checked ? C.accent : C.border}`, background: checked ? C.accentGlow : C.bg, cursor: 'pointer', transition: 'all .2s' }}>
                        <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${checked ? C.accent : C.border}`, background: checked ? C.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', flexShrink: 0 }}>{checked ? '✓' : ''}</div>
                        <span style={{ fontSize: 13, color: checked ? '#6ca0e8' : C.muted }}>{p.icon} {p.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Btn onClick={() => setModal(null)} variant="ghost">Cancel</Btn>
              <Btn onClick={save} variant="primary">{modal === 'create' ? 'Create User' : 'Save Changes'}</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {confirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <Card style={{ maxWidth: 380, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ color: C.text, marginBottom: 8 }}>Delete User?</h3>
            <p style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>Are you sure you want to delete <strong style={{ color: C.text }}>{confirm.name}</strong>? This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <Btn onClick={() => setConfirm(null)} variant="ghost">Cancel</Btn>
              <Btn onClick={() => deleteUser(confirm.id)} variant="danger">Yes, Delete</Btn>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

// ─── Page Editor ──────────────────────────────────────────────────────────────
function PageEditor({ pageId, showToast }) {
  const page = ALL_PAGES.find(p => p.id === pageId)
  const allContent  = getContent()
  const defaults    = DEFAULT_CONTENT[pageId] || {}
  const [data, setData] = useState({ ...defaults, ...(allContent[pageId] || {}) })
  const [section, setSection] = useState('hero')
  const [saved, setSaved]     = useState(false)

  const save = () => {
    const all = getContent()
    saveContent({ ...all, [pageId]: data })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    showToast(`${page.label} page saved!`)
  }

  const updateHero = (k, v) => setData(prev => ({ ...prev, hero: { ...prev.hero, [k]: v } }))

  const updateListItem = (listKey, id, field, value) => {
    setData(prev => ({
      ...prev,
      [listKey]: (prev[listKey] || []).map(item => item.id === id ? { ...item, [field]: value } : item)
    }))
  }

  const addListItem = (listKey, template) => {
    setData(prev => ({ ...prev, [listKey]: [...(prev[listKey] || []), { ...template, id: uid() }] }))
  }

  const removeListItem = (listKey, id) => {
    setData(prev => ({ ...prev, [listKey]: (prev[listKey] || []).filter(i => i.id !== id) }))
  }

  // Section tabs per page
  const sections = {
    home:      [{ id: 'hero', label: '🦸 Hero' }, { id: 'destinations', label: '🌍 Destinations' }, { id: 'tours', label: '🧳 Tours' }],
    umrah:     [{ id: 'hero', label: '🦸 Hero' }, { id: 'packages', label: '📦 Packages' }],
    visas:     [{ id: 'hero', label: '🦸 Hero' }, { id: 'services', label: '📋 Services' }],
    cars:      [{ id: 'hero', label: '🦸 Hero' }, { id: 'cars', label: '🚗 Cars' }],
    insurance: [{ id: 'hero', label: '🦸 Hero' }, { id: 'plans', label: '📑 Plans' }],
    booknow:   [{ id: 'hero', label: '🦸 Hero' }],
    about:     [{ id: 'hero', label: '🦸 Hero' }],
    contact:   [{ id: 'hero', label: '🦸 Hero' }],
  }
  const tabs = sections[pageId] || [{ id: 'hero', label: '🦸 Hero' }]

  // Generic list editor
  const renderList = (listKey, fields, addTemplate, addLabel) => {
    const items = data[listKey] || []
    return (
      <div>
        {items.map((item, idx) => (
          <Card key={item.id} style={{ marginBottom: 16, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ color: C.muted, fontSize: 12, fontWeight: 600 }}>#{idx + 1}</span>
              <Btn onClick={() => removeListItem(listKey, item.id)} variant="danger" size="sm">Remove</Btn>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              {fields.map(f => (
                <div key={f.key} style={{ gridColumn: f.full ? '1/-1' : undefined }}>
                  <Field label={f.label} value={item[f.key] || ''} onChange={v => updateListItem(listKey, item.id, f.key, v)} type={f.type || 'text'} />
                </div>
              ))}
            </div>
            {/* Image Preview */}
            {item.img && (
              <div style={{ marginTop: 8 }}>
                <img src={item.img} alt="" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }} onError={e => e.target.style.display = 'none'} />
              </div>
            )}
          </Card>
        ))}
        <Btn onClick={() => addListItem(listKey, addTemplate)} variant="outline" style={{ width: '100%', justifyContent: 'center' }}>+ Add {addLabel}</Btn>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ color: C.text, fontFamily: "'Playfair Display',serif", fontSize: 24, margin: '0 0 4px' }}>{page.icon} {page.label}</h2>
          <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>Edit page content • Changes saved to local storage</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href={page.hash || '/'} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            <Btn variant="ghost">↗ Preview</Btn>
          </a>
          <Btn onClick={save} variant="primary">{saved ? '✓ Saved!' : '💾 Save Changes'}</Btn>
        </div>
      </div>

      {/* Section Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setSection(t.id)} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${section === t.id ? C.accent : C.border}`, background: section === t.id ? C.accentGlow : C.bg2, color: section === t.id ? '#6ca0e8' : C.muted, fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all .2s' }}>{t.label}</button>
        ))}
      </div>

      {/* Hero Editor */}
      {section === 'hero' && (
        <Card>
          <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Hero Section</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
            <Field label="Badge Text"    value={data.hero?.badge}    onChange={v => updateHero('badge', v)} />
            <Field label="Main Title"    value={data.hero?.title}    onChange={v => updateHero('title', v)} />
            <div style={{ gridColumn: '1/-1' }}>
              <Field label="Subtitle / Description" value={data.hero?.subtitle} onChange={v => updateHero('subtitle', v)} type="textarea" />
            </div>
            {pageId === 'home' && (
              <>
                <div style={{ gridColumn: '1/-1' }}>
                  <Field label="Hero Image URL" value={data.hero?.img} onChange={v => updateHero('img', v)} />
                  {data.hero?.img && <img src={data.hero.img} alt="" style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 10, marginTop: 6 }} onError={e => e.target.style.display='none'} />}
                </div>
                <Field label="Stat 1 Number" value={data.hero?.stat1num}   onChange={v => updateHero('stat1num', v)} />
                <Field label="Stat 1 Label"  value={data.hero?.stat1label} onChange={v => updateHero('stat1label', v)} />
                <Field label="Stat 2 Number" value={data.hero?.stat2num}   onChange={v => updateHero('stat2num', v)} />
                <Field label="Stat 2 Label"  value={data.hero?.stat2label} onChange={v => updateHero('stat2label', v)} />
                <Field label="Stat 3 Number" value={data.hero?.stat3num}   onChange={v => updateHero('stat3num', v)} />
                <Field label="Stat 3 Label"  value={data.hero?.stat3label} onChange={v => updateHero('stat3label', v)} />
              </>
            )}
          </div>
        </Card>
      )}

      {/* Destinations */}
      {section === 'destinations' && pageId === 'home' && renderList('destinations',
        [
          { key: 'name',    label: 'Destination Name' },
          { key: 'country', label: 'Country'          },
          { key: 'price',   label: 'Price'            },
          { key: 'rating',  label: 'Rating (0-5)'     },
          { key: 'reviews', label: 'Review Count'     },
          { key: 'tag',     label: 'Tag (Hot Deal…)'  },
          { key: 'days',    label: 'Duration'         },
          { key: 'img',     label: 'Image URL', full: true },
        ],
        { name: '', country: '', price: '$0', rating: '4.5', reviews: '0', tag: 'New', days: '7 days', img: '' },
        'Destination'
      )}

      {/* Tours */}
      {section === 'tours' && pageId === 'home' && renderList('tours',
        [
          { key: 'name',     label: 'Tour Name'    },
          { key: 'duration', label: 'Duration'     },
          { key: 'price',    label: 'Price'        },
          { key: 'rating',   label: 'Rating (0-5)' },
          { key: 'img',      label: 'Image URL', full: true },
        ],
        { name: '', duration: '7 Days', price: '$0', rating: '4.5', img: '' },
        'Tour'
      )}

      {/* Packages (Umrah) */}
      {section === 'packages' && pageId === 'umrah' && renderList('packages',
        [
          { key: 'name',  label: 'Package Name' },
          { key: 'price', label: 'Price'        },
          { key: 'days',  label: 'Days'         },
          { key: 'tag',   label: 'Tag'          },
          { key: 'desc',  label: 'Description', full: true },
          { key: 'img',   label: 'Image URL',   full: true },
        ],
        { name: '', price: '$0', days: '15 Days', tag: 'Economy', desc: '', img: '' },
        'Package'
      )}

      {/* Services (Visas) */}
      {section === 'services' && pageId === 'visas' && renderList('services',
        [
          { key: 'country', label: 'Country'    },
          { key: 'type',    label: 'Visa Type'  },
          { key: 'price',   label: 'Price'      },
          { key: 'days',    label: 'Processing' },
          { key: 'img',     label: 'Image URL', full: true },
        ],
        { country: '', type: 'Tourist', price: '$0', days: '5-7 days', img: '' },
        'Visa'
      )}

      {/* Cars */}
      {section === 'cars' && pageId === 'cars' && renderList('cars',
        [
          { key: 'name',     label: 'Car Name'    },
          { key: 'category', label: 'Category'    },
          { key: 'price',    label: 'Price/Day'   },
          { key: 'seats',    label: 'Seats'       },
          { key: 'img',      label: 'Image URL', full: true },
        ],
        { name: '', category: 'Sedan', price: '$0/day', seats: '4', img: '' },
        'Car'
      )}

      {/* Plans (Insurance) */}
      {section === 'plans' && pageId === 'insurance' && renderList('plans',
        [
          { key: 'name',    label: 'Plan Name'   },
          { key: 'price',   label: 'Price'       },
          { key: 'coverage',label: 'Coverage'    },
          { key: 'desc',    label: 'Description', full: true },
        ],
        { name: '', price: '$0', coverage: '$0', desc: '' },
        'Plan'
      )}
    </div>
  )
}

// ─── Settings Page ────────────────────────────────────────────────────────────
function SettingsPage({ user, showToast, onUserUpdate }) {
  const [form, setForm] = useState({ name: user.name, email: user.email, current: '', newPass: '', confirm: '' })
  const f = k => v => setForm(prev => ({ ...prev, [k]: v }))

  const saveProfile = () => {
    if (!form.name || !form.email) return showToast('Name and email required.', 'error')
    const users = getUsers()
    const updated = users.map(u => u.id === user.id ? { ...u, name: form.name, email: form.email } : u)
    saveUsers(updated)
    const updatedUser = updated.find(u => u.id === user.id)
    saveSession({ userId: user.id, loginAt: Date.now() })
    onUserUpdate(updatedUser)
    showToast('Profile updated!')
  }

  const changePassword = () => {
    if (!form.current || !form.newPass || !form.confirm) return showToast('All fields required.', 'error')
    const users = getUsers(); const me = users.find(u => u.id === user.id)
    if (me.password !== form.current) return showToast('Current password incorrect.', 'error')
    if (form.newPass !== form.confirm) return showToast('New passwords do not match.', 'error')
    if (form.newPass.length < 6) return showToast('Password must be at least 6 characters.', 'error')
    saveUsers(users.map(u => u.id === user.id ? { ...u, password: form.newPass } : u))
    setForm(prev => ({ ...prev, current: '', newPass: '', confirm: '' }))
    showToast('Password changed!')
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <h2 style={{ color: C.text, fontFamily: "'Playfair Display',serif", fontSize: 24, marginBottom: 24 }}>⚙️ Settings</h2>

      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Profile Information</h3>
        <Field label="Full Name"     value={form.name}  onChange={f('name')} />
        <Field label="Email Address" value={form.email} onChange={f('email')} type="email" />
        <div style={{ marginTop: 4 }}>
          <Badge color={user.role === 'super' ? 'gold' : 'blue'}>{user.role === 'super' ? '⭐ Super Admin' : '🔒 Page Admin'}</Badge>
        </div>
        <Btn onClick={saveProfile} variant="primary" style={{ marginTop: 20 }}>Save Profile</Btn>
      </Card>

      <Card>
        <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Change Password</h3>
        <Field label="Current Password" value={form.current} onChange={f('current')} type="password" />
        <Field label="New Password"     value={form.newPass} onChange={f('newPass')} type="password" />
        <Field label="Confirm New Password" value={form.confirm} onChange={f('confirm')} type="password" />
        <Btn onClick={changePassword} variant="primary">Update Password</Btn>
      </Card>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function EdafayDashboard() {
  const [user,     setUser]     = useState(null)
  const [active,   setActive]   = useState('overview')
  const [toast,    setToast]    = useState(null)
  const [sideOpen, setSideOpen] = useState(false)

  // Check session on mount
  useEffect(() => {
    const session = getSession()
    if (session) {
      const users = getUsers()
      const u = users.find(u => u.id === session.userId && u.active)
      if (u) setUser(u)
    }
  }, [])

  const showToast = (msg, type = 'success') => setToast({ msg, type })
  const logout    = () => { clearSession(); setUser(null) }

  if (!user) return <LoginScreen onLogin={u => setUser(u)} />

  const renderPage = () => {
    if (active === 'overview') return <OverviewPage user={user} />
    if (active === 'users'   ) return <UsersPage currentUser={user} showToast={showToast} />
    if (active === 'settings') return <SettingsPage user={user} showToast={showToast} onUserUpdate={setUser} />
    if (active.startsWith('page_')) {
      const pid = active.replace('page_', '')
      return <PageEditor pageId={pid} showToast={showToast} />
    }
    return <OverviewPage user={user} />
  }

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: "'DM Sans',sans-serif", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&family=Syne:wght@700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
        .db-sidebar { display:flex !important; }
        @media(max-width:768px){
          .db-sidebar { transform:translateX(-100%) !important; }
          .db-sidebar.db-sidebar-open { transform:translateX(0) !important; }
          .db-main { margin-left:0 !important; }
          .db-stats-grid { grid-template-columns:1fr 1fr !important; }
        }
        @media(max-width:480px){
          .db-stats-grid { grid-template-columns:1fr !important; }
        }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:6px } ::-webkit-scrollbar-track { background:transparent } ::-webkit-scrollbar-thumb { background:${C.border}; border-radius:3px }
      `}</style>

      <Sidebar active={active} setActive={setActive} user={user} onLogout={logout} sideOpen={sideOpen} setSideOpen={setSideOpen} />

      {/* Main Content */}
      <div className="db-main" style={{ marginLeft: 240, minHeight: '100vh' }}>
        {/* Top Bar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 30, background: C.bg2, borderBottom: `1px solid ${C.border}`, padding: '0 28px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Hamburger (mobile) */}
            <button onClick={() => setSideOpen(true)} className="db-hamburger" style={{ background: 'none', border: `1px solid ${C.border}`, color: C.text, fontSize: 18, cursor: 'pointer', padding: '5px 10px', borderRadius: 8, display: 'none' }}>☰</button>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
                {active === 'overview' ? 'Dashboard Overview'
                  : active === 'users' ? 'User Management'
                  : active === 'settings' ? 'Settings'
                  : active.startsWith('page_') ? `${ALL_PAGES.find(p => p.id === active.replace('page_', ''))?.icon} Edit ${ALL_PAGES.find(p => p.id === active.replace('page_', ''))?.label}`
                  : ''}
              </div>
              <div style={{ fontSize: 11, color: C.muted }}>{new Date().toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <a href="/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <Btn variant="ghost" size="sm">↗ View Site</Btn>
            </a>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: C.accentGlow, border: `1px solid ${C.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6ca0e8', fontWeight: 700 }}>{user.name[0]}</div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: '32px 28px', maxWidth: 1100 }}>
          {renderPage()}
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <style>{`
        @media(max-width:768px){
          .db-hamburger { display:flex !important; }
        }
      `}</style>
    </div>
  )
}