import { useEffect, useState } from 'react'
import { fetchStandings, LEAGUES } from '../api/espn.js'
import ErrorBox from '../components/ErrorBox.jsx'

export default function Standings() {
  const [league, setLeague] = useState('premier-league')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const lg = LEAGUES.find((l) => l.id === league) || LEAGUES[0]

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchStandings(lg.sport, lg.league).then((r) => {
      if (cancelled) return
      setRows(r || [])
      setLoading(false)
    }).catch(() => {
      if (cancelled) return
      setError('Could not reach the sports data just now — please retry.')
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [league])

  return (
    <div className="search-page">
      <h1>Standings</h1>
      <div className="filter-bar">
        <select className="sort-select" value={league} onChange={(e) => setLeague(e.target.value)} aria-label="League">
          {LEAGUES.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>

      {error && <ErrorBox message={error} onRetry={() => window.location.reload()} />}
      {loading && <div className="page-center"><p className="muted">Loading…</p></div>}

      {!loading && rows.length === 0 && !error && (
        <div className="page-center empty-state">
          <p className="muted">No standings available for this league.</p>
        </div>
      )}

      {rows.length > 0 && (
        <div className="standings-wrap">
          <table className="standings-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Team</th>
                <th>P</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>GF</th>
                <th>GA</th>
                <th>GD</th>
                <th>Pts</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.short + i}>
                  <td>{r.rank || i + 1}</td>
                  <td className="standings-team">
                    {r.logo && <img src={r.logo} alt="" className="score-logo" />}
                    <span>{r.team}</span>
                  </td>
                  <td>{r.played}</td>
                  <td>{r.won}</td>
                  <td>{r.drawn}</td>
                  <td>{r.lost}</td>
                  <td>{r.gf}</td>
                  <td>{r.ga}</td>
                  <td>{r.gd}</td>
                  <td className="standings-pts">{r.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
