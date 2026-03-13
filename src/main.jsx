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

function Root() {
  const [page, setPage] = useState(window.location.hash)

  useEffect(() => {
    const handler = () => setPage(window.location.hash)
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  if (page === '#/admin')   return <Dashboard />
  if (page === '#/contact') return <Contact />
  if (page === '#/about')   return <About />
  if (page === '#/umrah')   return <UmrahPackages />
  if (page === '#/visas')   return <Visas />
  if (page === '#/cars')    return <CarRental />

  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)