import { useEffect, useRef, useState } from 'react'
import SiteNav from './components/SiteNav.jsx'
import Home from './pages/Home.jsx'
import Experience from './pages/Experience.jsx'
import Research from './pages/Research.jsx'
import Projects from './pages/Projects.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import Skills from './pages/Skills.jsx'
import Resume from './pages/Resume.jsx'
import { toHref, normalizePath } from './routing.js'
import { profile, projectBySlug, routeMeta } from './data/portfolio.js'
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
    const [rawPath, hash] = next.split('#')
    const normalized = normalizePath(rawPath)
    if (normalized === path && !hash) return
    window.history.pushState({}, '', toHref(normalized) + (hash ? `#${hash}` : ''))
    setPath(normalized)
    if (!hash) window.scrollTo({ top: 0, behavior: 'auto' })
  }

  return { path, navigate }
}

// Resolve a logical path to { page, title, description }.
function resolve(path, navigate) {
  if (path === '/') return { page: <Home navigate={navigate} />, meta: routeMeta['/'], known: true }
  if (path.startsWith('/projects/')) {
    const project = projectBySlug(path.slice('/projects/'.length))
    if (project) {
      return {
        page: <ProjectDetail project={project} navigate={navigate} />,
        meta: { title: project.title, description: project.oneLine },
        known: true,
      }
    }
  }
  const pages = {
    '/experience': <Experience navigate={navigate} />,
    '/research': <Research />,
    '/projects': <Projects navigate={navigate} />,
    '/skills': <Skills />,
    '/resume': <Resume navigate={navigate} />,
  }
  if (pages[path]) return { page: pages[path], meta: routeMeta[path], known: true }
  return { page: <NotFound navigate={navigate} />, meta: { title: 'Not found' }, known: false }
}

function NotFound({ navigate }) {
  return (
    <div className="page notfound">
      <h1 className="page__title">Nothing here.</h1>
      <p className="page__lead">That page doesn’t exist or has moved.</p>
      <a
        className="textlink"
        href={toHref('/')}
        onClick={(e) => {
          e.preventDefault()
          navigate('/')
        }}
      >
        ← Back home
      </a>
    </div>
  )
}

export default function App() {
  const { path, navigate } = useRoute()
  const { page, meta, known } = resolve(path, navigate)
  const lastPath = useRef(null)

  // Per-route title and description; move focus to the new page's heading
  // so keyboard and screen-reader users land on the content. Tracking the
  // previous path (not a first-render flag) keeps this correct when React
  // runs effects twice in development.
  useEffect(() => {
    document.title = path === '/' ? profile.name : `${meta.title} · ${profile.name}`
    const desc = document.querySelector('meta[name="description"]')
    if (desc && meta.description) desc.setAttribute('content', meta.description)

    const initial = lastPath.current === null
    const changed = !initial && lastPath.current !== path
    lastPath.current = path
    if (initial) {
      // deep link with a hash: scroll once the section exists
      if (window.location.hash) {
        const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
        target?.scrollIntoView()
      }
      return
    }
    if (!changed) return
    const heading = document.querySelector('.route h1')
    if (heading) {
      heading.setAttribute('tabindex', '-1')
      heading.focus({ preventScroll: true })
    }
  }, [path, meta.title, meta.description])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="grid-bg" aria-hidden="true" />
      <SiteNav path={path} navigate={navigate} />

      {/* key forces a remount per route so the entrance fade replays */}
      <main className="route" id="main" key={path}>
        {page}
      </main>

      {known && path !== '/' && (
        <footer className="site-foot">
          <div className="site-foot__inner">
            <span>© {new Date().getFullYear()} {profile.name}</span>
            <span className="site-foot__links">
              <a href={profile.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a href={`mailto:${profile.email}`}>Email</a>
            </span>
          </div>
        </footer>
      )}
    </>
  )
}
