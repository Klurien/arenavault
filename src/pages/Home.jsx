import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchStreams, liveNow, upcoming } from '../api/esportex.js'
import { fetchScoreboard, LEAGUES } from '../api/espn.js'
import MatchCard from '../components/MatchCard.jsx'
import StreamPlayer from '../components/StreamPlayer.jsx'
import ErrorBox from '../components/ErrorBox.jsx'

export default function Home() {
  const [streams, setStreams] = useState(null)
  const [scores, setScores] = useState([])
  const [error, setError] = useState(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let cancelled = false
    setError(null)
    setDone(false)
    Promise.all([
      fetchStreams(),
      fetchScoreboard('soccer', 'eng.1'),
      fetchScoreboard('basketball', 'nba'),
      fetchScoreboard('football', 'nfl'),
    ]).then(([s, epl, nba, nfl]) => {
      if (cancelled) return
      setStreams(s || [])
      setScores([...(epl || []), ...(nba || []), ...(nfl || [])])
      setDone(true)
    }).catch((e) => {
      if (cancelled) return
      setError('Could not reach the sports data just now — please retry.')
      setDone(true)
    })
    return () => { cancelled = true }
  }, [])

  if (error) return <ErrorBox message={error} onRetry={() => window.location.reload()} />

  const PRIORITY = { football: 0, basketball: 1, amfootball: 2, hockey: 3, baseball: 4, tennis: 5, fight: 6, race: 7, cricket: 8, volleyball: 9, badminton: 10, rugby: 11, other: 99 }
  const live = streams ? [...liveNow(streams)].sort((a, b) => (PRIORITY[a.sport] ?? 50) - (PRIORITY[b.sport] ?? 50)) : []
  const up = streams ? upcoming(streams).slice(0, 12) : []
  const heroMatch = live[0] || up[0] || null
  const liveScores = scores.filter((e) => e.status === 'STATUS_IN_PROGRESS' || e.status === 'inprogress').slice(0, 12)
  const recentScores = scores.filter((e) => e.status === 'STATUS_FINAL' || e.status === 'finished').slice(0, 6)

  return (
    <div className="home">
      {heroMatch ? (
        <section className="hero">
          <div className="hero-bg" style={heroMatch.poster ? { backgroundImage: `url(${heroMatch.poster})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined} />
          <div className="hero-shade" />
          <div className="hero-content">
            <div className="hero-tag">FEATURED MATCH</div>
            <h1 className="hero-title">{heroMatch.title}</h1>
            <div className="hero-meta">
              <span>{heroMatch.sportLabel}</span>
              {heroMatch.league && <span>· {heroMatch.league}</span>}
              {heroMatch.kickoff && <span>· {heroMatch.kickoff}</span>}
            </div>
            <div className="hero-cta-row">
              <Link className="marquee-play" to={`/watch/${heroMatch.slug}`}>
                ▶ Watch
              </Link>
              <Link className="marquee-details" to={`/match/${heroMatch.slug}`}>
                Details
              </Link>
            </div>
          </div>
        </section>
      ) : done ? null : (
        <div className="skel skel-marquee" />
      )}

      {live.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Live Now</h2>
            <Link className="btn-ghost btn-small" to="/live">All live</Link>
          </div>
          <div className="row">
            {live.slice(0, 12).map((m) => (
              <MatchCard key={m.slug} match={m} />
            ))}
          </div>
        </section>
      )}

      {up.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Upcoming</h2>
            <Link className="btn-ghost btn-small" to="/streams">All streams</Link>
          </div>
          <div className="row">
            {up.map((m) => (
              <MatchCard key={m.slug} match={m} />
            ))}
          </div>
        </section>
      )}

      {liveScores.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Live Scores</h2>
            <Link className="btn-ghost btn-small" to="/scores">All scores</Link>
          </div>
          <div className="score-grid">
            {liveScores.map((e) => (
              <ScoreCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}

      {recentScores.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Recent Results</h2>
          </div>
          <div className="score-grid">
            {recentScores.map((e) => (
              <ScoreCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}

      {!done && (
        <div className="page-center">
          <p className="muted">Loading sports data…</p>
        </div>
      )}
    </div>
  )
}

function ScoreCard({ event }) {
  return (
    <div className="score-card">
      <div className="score-card-league">{event.home.short || event.home.name} vs {event.away.short || event.away.name}</div>
      <div className="score-card-teams">
        <div className="score-team">
          {event.home.logo && <img src={event.home.logo} alt="" className="score-logo" />}
          <span>{event.home.name}</span>
        </div>
        <div className="score-value">{event.home.score} – {event.away.score}</div>
        <div className="score-team">
          {event.away.logo && <img src={event.away.logo} alt="" className="score-logo" />}
          <span>{event.away.name}</span>
        </div>
      </div>
      <div className="score-card-status">{event.statusDetail || event.status}</div>
    </div>
  )
}
