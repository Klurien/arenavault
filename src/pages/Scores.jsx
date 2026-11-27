import { useEffect, useState } from 'react'
import { fetchScoreboard, LEAGUES } from '../api/espn.js'
import ErrorBox from '../components/ErrorBox.jsx'

export default function Scores() {
  const [league, setLeague] = useState('premier-league')
  const [date, setDate] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  })
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const lg = LEAGUES.find((l) => l.id === league) || LEAGUES[0]

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchScoreboard(lg.sport, lg.league, date).then((e) => {
      if (cancelled) return
      setEvents(e || [])
      setLoading(false)
    }).catch(() => {
      if (cancelled) return
      setError('Could not reach the sports data just now — please retry.')
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [league, date])

  return (
    <div className="search-page">
      <h1>Scores</h1>
      <div className="filter-bar">
        <select className="sort-select" value={league} onChange={(e) => setLeague(e.target.value)} aria-label="League">
          {LEAGUES.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
        <input
          className="sort-select"
          type="date"
          value={`${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`}
          onChange={(e) => {
            const v = e.target.value.replace(/-/g, '')
            if (v.length === 8) setDate(v)
          }}
          aria-label="Date"
        />
      </div>

      {error && <ErrorBox message={error} onRetry={() => window.location.reload()} />}
      {loading && <div className="page-center"><p className="muted">Loading…</p></div>}

      {!loading && events.length === 0 && !error && (
        <div className="page-center empty-state">
          <p className="muted">No matches found for this date.</p>
        </div>
      )}

      <div className="score-grid" style={{ marginTop: 16 }}>
        {events.map((e) => (
          <div key={e.id} className="score-card">
            <div className="score-card-league">{e.home.short || e.home.name} vs {e.away.short || e.away.name}</div>
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
            <div className="score-card-status">{e.statusDetail || e.status}</div>
            {e.venue && <div className="muted" style={{ fontSize: '0.75rem', marginTop: 4 }}>{e.venue}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
