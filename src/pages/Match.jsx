import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchStreams, findBySlug } from '../api/esportex.js'
import StreamPlayer from '../components/StreamPlayer.jsx'
import MatchCard from '../components/MatchCard.jsx'
import ErrorBox from '../components/ErrorBox.jsx'

export default function Match() {
  const { slug } = useParams()
  const [match, setMatch] = useState(null)
  const [all, setAll] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchStreams().then((s) => {
      if (cancelled) return
      setAll(s || [])
      const m = findBySlug(s || [], slug)
      if (!m) setError('Match not found.')
      else setMatch(m)
    }).catch(() => {
      if (cancelled) return
      setError('Could not reach the stream data just now — please retry.')
    })
    return () => { cancelled = true }
  }, [slug])

  if (error) return <ErrorBox message={error} onRetry={() => window.location.reload()} />
  if (!match) return <div className="page-center"><p className="muted">Loading…</p></div>

  const related = all.filter((m) => m.sport === match.sport && m.slug !== match.slug).slice(0, 8)

  return (
    <div className="detail">
      <div className="detail-banner-hero" style={match.poster ? { backgroundImage: `url(${match.poster})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
        <div className="detail-banner-hero-gradient" />
        <div className="detail-banner-hero-content">
          <div className="detail-banner-hero-format">{match.sportLabel}</div>
          <h1 className="detail-banner-hero-title">{match.title}</h1>
          <div className="detail-banner-hero-meta">
            {match.league && <span className="detail-banner-hero-year">· {match.league}</span>}
            {match.kickoff && <span className="detail-banner-hero-year">· {match.kickoff}</span>}
          </div>
        </div>
      </div>

      <div className="detail-body">
        <div className="detail-info">
          <StreamPlayer match={match} />
          <div className="detail-meta" style={{ marginTop: 16 }}>
            <span className="meta-pill">{match.sportLabel}</span>
            {match.league && <span className="meta-pill">{match.league}</span>}
            <span className="meta-pill">{match.kickoff}</span>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>More {match.sportLabel}</h2></div>
          <div className="row">
            {related.map((m) => (
              <MatchCard key={m.slug} match={m} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
