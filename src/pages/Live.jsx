import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchStreams, liveNow } from '../api/esportex.js'
import { fetchScoreboard } from '../api/espn.js'
import MatchCard from '../components/MatchCard.jsx'
import ErrorBox from '../components/ErrorBox.jsx'

export default function Live() {
  const [streams, setStreams] = useState(null)
  const [scores, setScores] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetchStreams(),
      fetchScoreboard('soccer', 'eng.1'),
      fetchScoreboard('basketball', 'nba'),
      fetchScoreboard('football', 'nfl'),
      fetchScoreboard('hockey', 'nhl'),
    ]).then(([s, ...sc]) => {
      if (cancelled) return
      setStreams(s || [])
      setScores(sc.flat())
    }).catch(() => {
      if (cancelled) return
      setError('Could not reach the sports data just now — please retry.')
    })
    return () => { cancelled = true }
  }, [])

  if (error) return <ErrorBox message={error} onRetry={() => window.location.reload()} />

  const liveStreams = streams ? liveNow(streams) : []
  const liveScores = scores.filter((e) => e.status === 'STATUS_IN_PROGRESS' || e.status === 'inprogress')

  return (
    <div className="search-page">
      <h1>Live Now</h1>
      <p className="muted">Live streams and scores updating in real time.</p>

      {liveStreams.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>Live Streams</h2></div>
          <div className="row">
            {liveStreams.map((m) => <MatchCard key={m.slug} match={m} />)}
          </div>
        </section>
      )}

      {liveScores.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>Live Scores</h2></div>
          <div className="score-grid">
            {liveScores.map((e) => (
              <div key={e.id} className="score-card">
                <div className="score-card-league">{e.home.short} vs {e.away.short}</div>
                <div className="score-card-teams">
                  <div className="score-team">
                    {e.home.logo && <img src={e.home.logo} alt="" className="score-logo" />}
                    <span>{e.home.name}</span>
                  </div>
                  <div className="score-value">{e.home.score} – {e.away.score}</div>
                  <div className="score-team">
                    {e.away.logo && <img src={e.away.logo} alt="" className="score-logo" />}
                    <span>{e.away.name}</span>
                  </div>
                </div>
                <div className="score-card-status">{e.statusDetail || e.clock || 'Live'}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {streams && liveStreams.length === 0 && liveScores.length === 0 && (
        <div className="page-center empty-state">
          <p className="muted">No live matches right now. Check back soon.</p>
          <Link className="btn-primary" to="/streams">Browse streams</Link>
        </div>
      )}
    </div>
  )
}
