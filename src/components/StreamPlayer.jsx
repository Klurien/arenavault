import { useState } from 'react'

export default function StreamPlayer({ match }) {
  const servers = Array.isArray(match?.iframes) ? match.iframes : []
  const [active, setActive] = useState(0)
  const src = servers[active]?.url || ''

  if (!servers.length) {
    return (
      <div className="player-empty">
        <p className="muted">No stream available for this match.</p>
      </div>
    )
  }

  return (
    <div className="stream-player">
      <div className="player-embed-wrap">
        <iframe
          key={src}
          src={src}
          className="player-embed"
          title={match?.title || 'Stream'}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          referrerPolicy="origin"
          allowFullScreen
        />
      </div>
      {servers.length > 1 && (
        <div className="server-picker">
          <span className="server-picker-label">Server</span>
          <div className="server-chips" role="group" aria-label="Stream server">
            {servers.map((s, i) => (
              <button
                key={i}
                className={`server-chip ${i === active ? 'server-chip-active' : ''}`}
                onClick={() => setActive(i)}
                aria-pressed={i === active}
              >
                <span className="server-chip-name">{s.server || `Server ${i + 1}`}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="embed-actions">
        <a className="btn-primary btn-small" href={src} target="_blank" rel="noopener noreferrer">
          Open player in new tab
        </a>
      </div>
      <p className="player-trust">
        Streams are provided by independent third-party sources and may carry their own ads.
      </p>
    </div>
  )
}
