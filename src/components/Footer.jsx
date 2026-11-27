import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer-trust">Built for the fans.</p>
      <p className="footer-honest">
        <Link to="/privacy" className="footer-link">Privacy</Link>
      </p>
      <p className="footer-tmdb">
        Scores provided by ESPN. Streams provided by independent third-party sources.
      </p>
    </footer>
  )
}
