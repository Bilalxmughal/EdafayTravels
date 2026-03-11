import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Dashboard from './Dashboard.jsx'
import Contact from './Contact.jsx'
import About from './About.jsx'
import Destinations from './Destinations.jsx'

function Root() {
  const [page, setPage] = useState(window.location.hash)

  useEffect(() => {
    const handler = () => setPage(window.location.hash)
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  if (page === '#/admin')        return <Dashboard />
  if (page === '#/contact')      return <Contact />
  if (page === '#/about')        return <About />
  if (page === '#/destinations') return <Destinations />

  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)