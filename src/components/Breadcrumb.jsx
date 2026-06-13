import { profile, sections } from '../data/portfolio.js'
import { toHref } from '../routing.js'

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
          <span className="crumb__here">{here}</span>
        </>
      )}
    </nav>
  )
}
