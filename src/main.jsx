import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Dashboard from './Dashboard.jsx'
import Contact from './Contact.jsx'
import About from './About.jsx'
import UmrahPackages from './UmrahPackages.jsx'
import Visas from './Visas.jsx'
import CarRental from './Carrental.jsx'
import Insurance from './Insurance.jsx'
import BookNow from './BookNow.jsx'
import Auth, { getAuth, clearAuth } from "./Auth.jsx";
import Careers from "./Careers.jsx";
import Blog from "./Blog.jsx";



function Root() {
  const [page,      setPage]      = useState(window.location.hash);
  const [authUser,  setAuthUser]  = useState(() => getAuth());
 
  useEffect(() => {
    const h = () => setPage(window.location.hash);
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
 
  const handleLogin  = (user) => { setAuth(user); setAuthUser(user); };
  const handleLogout = () => { clearAuth(); setAuthUser(null); window.location.hash = ""; setPage(""); };
 
  // ── Admin route ──────────────────────────────────────────────────────────
  if (page === "#/admin") {
    if (!authUser) return <Auth onLogin={handleLogin} />;
    return <Dashboard auth={authUser} onLogout={handleLogout} />;
  }
 

  if (page === '#/admin')   return <Dashboard />
  if (page === '#/contact') return <Contact />
  if (page === '#/about')   return <About />
  if (page === '#/umrah')   return <UmrahPackages />
  if (page === '#/visas')   return <Visas />
  if (page === '#/cars')    return <CarRental />
  if (page === '#/insurance') return <Insurance />;
  if (page === '#/booknow') return <BookNow />;
  if (page === "#/careers")   return <Careers />;
  if (page === "#/blog")      return <Blog />;

  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)