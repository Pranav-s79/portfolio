import { useEffect, useState } from 'react'
import AmbientBackground from './components/AmbientBackground.jsx'
import Breadcrumb from './components/Breadcrumb.jsx'
import Home from './pages/Home.jsx'
import Experience from './pages/Experience.jsx'
import Research from './pages/Research.jsx'
import Projects from './pages/Projects.jsx'
import Skills from './pages/Skills.jsx'
import Resume from './pages/Resume.jsx'
import { toHref, normalizePath } from './routing.js'
import './App.css'

// Tiny history-based router. GitHub Pages serves a 404.html SPA fallback
// (see public/404.html + the decoder in index.html) so deep links work.
function useRoute() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname))

  useEffect(() => {
    const onPop = () => setPath(normalizePath(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = (next) => {
    const normalized = normalizePath(next)
    if (normalized === path) return
    window.history.pushState({}, '', toHref(normalized))
    setPath(normalized)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  return { path, navigate }
}

function NotFound({ navigate }) {
  return (
    <div className="page fade-in notfound">
      <h1 className="page__title">Nothing here.</h1>
      <a
        className="link mono"
        href={toHref('/')}
        onClick={(e) => {
          e.preventDefault()
          navigate('/')
        }}
      >
        ← back home
      </a>
    </div>
  )
}

export default function App() {
  const { path, navigate } = useRoute()

  let page
  if (path === '/') page = <Home navigate={navigate} />
  else if (path === '/experience') page = <Experience />
  else if (path === '/research') page = <Research />
  else if (path === '/projects') page = <Projects />
  else if (path === '/skills') page = <Skills />
  else if (path === '/resume') page = <Resume navigate={navigate} />
  else page = <NotFound navigate={navigate} />

  const isHome = path === '/'

  return (
    <>
      <AmbientBackground />
      <Breadcrumb path={path} navigate={navigate} />

      {/* key forces a remount per route so the cross-fade replays */}
      <div className="route" key={path}>
        {page}
        {!isHome && (
          <div className="home-return">
            <a
              href={toHref('/')}
              className="home-return__link"
              onClick={(e) => {
                e.preventDefault()
                navigate('/')
              }}
            >
              ← back to home
            </a>
          </div>
        )}
      </div>

    </>
  )
}
