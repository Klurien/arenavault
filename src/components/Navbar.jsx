import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [burgerOpen, setBurgerOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setBurgerOpen(false)
  }, [location.pathname])

  const links = (
    <>
      <Link to="/" onClick={() => setBurgerOpen(false)}>Home</Link>
      <Link to="/live" onClick={() => setBurgerOpen(false)}>Live</Link>
      <Link to="/streams" onClick={() => setBurgerOpen(false)}>Streams</Link>
      <Link to="/scores" onClick={() => setBurgerOpen(false)}>Scores</Link>
      <Link to="/standings" onClick={() => setBurgerOpen(false)}>Standings</Link>
    </>
  )

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="brand">
        <svg width="22" height="22" viewBox="0 0 64 64" aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#e8e8e8" />
          <path d="M20 16v32l28-16z" fill="#0b0d12" />
        </svg>
        <span>ArenaVault</span>
      </Link>

      <button
        type="button"
        className="nav-burger"
        aria-label="Menu"
        aria-expanded={burgerOpen}
        onClick={() => setBurgerOpen((v) => !v)}
      >
        {burgerOpen ? '✕' : '☰'}
      </button>
      {burgerOpen && (
        <nav className="nav-mobile-menu" aria-label="Primary">
          {links}
        </nav>
      )}

      <nav className="nav-links">{links}</nav>
    </header>
  )
}
