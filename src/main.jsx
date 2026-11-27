import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useLocation } from 'react-router-dom'
import './index.css'
import usePageMeta from './hooks/usePageMeta.js'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PageMeta />
      <App />
    </BrowserRouter>
  </StrictMode>,
)

function PageMeta() {
  const location = useLocation()
  let meta
  switch (location.pathname) {
    case '/':
      meta = { title: 'ArenaVault — Live Sports Streaming', ogTitle: 'ArenaVault — Live Sports Streaming', ogDescription: 'Live sports streams and scores across football, basketball, NFL, NHL and more.', ogUrl: location.pathname }
      break
    case '/live':
      meta = { title: 'ArenaVault — Live Now', ogTitle: 'ArenaVault — Live Now', ogDescription: 'Live sports streams and scores happening right now.', ogUrl: location.pathname }
      break
    case '/streams':
      meta = { title: 'ArenaVault — Streams', ogTitle: 'ArenaVault — Streams', ogDescription: 'Live and upcoming matches with embedded streams.', ogUrl: location.pathname }
      break
    case '/scores':
      meta = { title: 'ArenaVault — Scores', ogTitle: 'ArenaVault — Scores', ogDescription: 'Live scores and results across major leagues.', ogUrl: location.pathname }
      break
    case '/standings':
      meta = { title: 'ArenaVault — Standings', ogTitle: 'ArenaVault — Standings', ogDescription: 'League standings and tables.', ogUrl: location.pathname }
      break
    case '/privacy':
      meta = { title: 'ArenaVault — Privacy', ogTitle: 'ArenaVault — Privacy', ogDescription: 'Privacy policy for ArenaVault.', ogUrl: location.pathname }
      break
    default:
      meta = { title: 'ArenaVault — Live Sports Streaming', ogTitle: 'ArenaVault — Live Sports Streaming', ogDescription: 'Live sports streams and scores.', ogUrl: location.pathname }
  }
  usePageMeta(meta)
  return null
}
