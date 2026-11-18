import { useEffect } from 'react'
import { HashRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { PARTS, PART_ORDER } from './content/shared'
import Debug from './pages/Debug'
import End from './pages/End'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Parts from './pages/Parts'
import PartIntro from './pages/PartIntro'
import ScenarioPage from './pages/ScenarioPage'
import { SCENARIOS } from './content/scenarios'
import { logEvent } from './lib/log'

function currentPart(pathname) {
  const s = pathname.match(/^\/s\/(\w+)/)
  if (s) return SCENARIOS.find((x) => x.id === s[1])?.part
  const p = pathname.match(/^\/part\/(\w+)/)
  return p ? p[1] : null
}

function Shell({ children }) {
  const { pathname } = useLocation()
  useEffect(() => {
    logEvent('page_view', { path: pathname })
    window.scrollTo(0, 0)
  }, [pathname])
  const active = currentPart(pathname)
  const isHome = pathname === '/'
  return (
    <div data-part={active ?? undefined}>
      <div className="fx-grid" aria-hidden="true" />
      <div className="fx-scanline" aria-hidden="true" />
      {!isHome && (
      <header className="site-header">
        <Link to="/" className="brand">
          BEHIND THE <span>JOB</span>
        </Link>
        <ol className="parts-nav" aria-label="Progress">
          {PART_ORDER.map((id) => (
            <li key={id} className={active === id ? 'is-active' : ''} aria-current={active === id ? 'step' : undefined}>
              {PARTS[id].number}. {PARTS[id].name}
            </li>
          ))}
        </ol>
      </header>
      )}
      {children}
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/parts" element={<Parts />} />
          <Route path="/part/:part" element={<PartIntro />} />
          <Route path="/s/:id" element={<ScenarioPage />} />
          <Route path="/end" element={<End />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/debug" element={<Debug />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Shell>
    </HashRouter>
  )
}
