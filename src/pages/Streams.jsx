import { useEffect, useState, useMemo } from 'react'
import { fetchStreams, groupBySport, SPORT_LABEL } from '../api/esportex.js'
import MatchCard from '../components/MatchCard.jsx'
import ErrorBox from '../components/ErrorBox.jsx'

export default function Streams() {
  const [streams, setStreams] = useState(null)
  const [error, setError] = useState(null)
  const [sport, setSport] = useState('all')

  useEffect(() => {
    let cancelled = false
    fetchStreams().then((s) => {
      if (cancelled) return
      setStreams(s || [])
    }).catch(() => {
      if (cancelled) return
      setError('Could not reach the stream data just now — please retry.')
    })
    return () => { cancelled = true }
  }, [])

  if (error) return <ErrorBox message={error} onRetry={() => window.location.reload()} />

  const grouped = streams ? groupBySport(streams) : {}
  const sports = Object.keys(grouped).sort()
  const filtered = sport === 'all' ? streams || [] : (grouped[sport] || [])

  return (
    <div className="search-page">
      <h1>Streams</h1>
      <p className="muted">Live and upcoming matches with embedded streams.</p>

      <div className="filter-bar">
        <select className="sort-select" value={sport} onChange={(e) => setSport(e.target.value)} aria-label="Sport">
          <option value="all">All sports</option>
          {sports.map((s) => (
            <option key={s} value={s}>{SPORT_LABEL(s)}</option>
          ))}
        </select>
        <span className="filter-count">{filtered.length} matches</span>
      </div>

      {streams === null ? (
        <div className="page-center"><p className="muted">Loading…</p></div>
      ) : filtered.length === 0 ? (
        <div className="page-center empty-state">
          <p className="muted">No streams found.</p>
        </div>
      ) : (
        <div className="grid">
          {filtered.map((m) => (
            <MatchCard key={m.slug} match={m} />
          ))}
        </div>
      )}
    </div>
  )
}
