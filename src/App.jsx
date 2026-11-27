import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import RouteErrorBoundary from './components/RouteErrorBoundary.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const Live = lazy(() => import('./pages/Live.jsx'))
const Streams = lazy(() => import('./pages/Streams.jsx'))
const Match = lazy(() => import('./pages/Match.jsx'))
const Watch = lazy(() => import('./pages/Watch.jsx'))
const Scores = lazy(() => import('./pages/Scores.jsx'))
const Standings = lazy(() => import('./pages/Standings.jsx'))
const Privacy = lazy(() => import('./pages/Privacy.jsx'))

const NotFound = () => (
  <div className="page-center">
    <h1>404</h1>
    <p>That page drifted into the void.</p>
    <a className="btn-primary" href="/">Go home</a>
  </div>
)

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main">
        <ScrollToTop />
        <RouteErrorBoundary>
          <Suspense fallback={<div className="page-center">Loading…</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/live" element={<Live />} />
              <Route path="/streams" element={<Streams />} />
              <Route path="/match/:slug" element={<Match />} />
              <Route path="/watch/:slug" element={<Watch />} />
              <Route path="/scores" element={<Scores />} />
              <Route path="/standings" element={<Standings />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </RouteErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}
