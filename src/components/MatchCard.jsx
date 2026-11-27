import { Link } from 'react-router-dom'
import { proxyImg } from '../utils/img.js'

export default function MatchCard({ match, to }) {
  const title = match.title || 'Match'
  const sport = match.sportLabel || match.sport || ''
  const league = match.league || ''
  const kickoff = match.kickoffDate ? match.kickoffDate.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : (match.kickoff || '')
  const hasStream = Array.isArray(match.iframes) && match.iframes.length > 0
  const status = match.status || 'upcoming'
  const isLive = status === 'live'
  const link = to || (hasStream ? `/watch/${match.slug}` : `/match/${match.slug}`)

  return (
    <Link to={link} className="match-card">
      <div
        className="match-card-poster"
        style={match.poster ? { backgroundImage: `url(${proxyImg(match.poster)})` } : undefined}
      >
        <div className="match-card-shade" />
        {isLive && <span className="match-card-live">LIVE</span>}
        {hasStream && <span className="match-card-stream">STREAM</span>}
      </div>
      <div className="match-card-info">
        <div className="match-card-sport">{sport}{league ? ` · ${league}` : ''}</div>
        <div className="match-card-title">{title}</div>
        <div className="match-card-meta">{kickoff}</div>
      </div>
    </Link>
  )
}
