import { profile, sections } from '../data/portfolio.js'
import { toHref } from '../routing.js'

const SECTION_OPTIONS = Object.entries(sections)

// Persistent nav: monogram + name return home; section after the slash.
// Hidden on the landing page.
export default function Breadcrumb({ path, navigate }) {
  if (path === '/') return null
  const here = sections[path]

  const goHome = (e) => {
    e.preventDefault()
    navigate('/')
  }

  return (
    <nav className="crumb" aria-label="Breadcrumb">
      <a className="crumb__mono" href={toHref('/')} onClick={goHome} aria-label="Home">
        PS
      </a>
      <a className="crumb__home" href={toHref('/')} onClick={goHome}>
        {profile.name.split(' ')[0]}
      </a>
      {here && (
        <>
          <span className="crumb__sep">/</span>
          <label className="crumb__select-wrap">
            <span className="sr-only">Jump to section</span>
            <select
              className="crumb__select"
              value={path}
              onChange={(e) => navigate(e.target.value)}
              aria-label="Jump to section"
            >
              {SECTION_OPTIONS.map(([sectionPath, label]) => (
                <option key={sectionPath} value={sectionPath}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </>
      )}
    </nav>
  )
}
