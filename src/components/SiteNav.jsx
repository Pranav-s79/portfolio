import { useEffect, useRef, useState } from 'react'
import SiteMark from './SiteMark.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import { IconClose, IconGitHub, IconLinkedIn, IconMail, IconMenu } from './icons.jsx'
import { profile, sections } from '../data/portfolio.js'
import { toHref } from '../routing.js'

const LINKS = Object.entries(sections)

// One nav for every page. On the landing page it shrinks to the mark and the
// theme switch, since the hero carries the name, links, and section rail.
export default function SiteNav({ path, navigate }) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const buttonRef = useRef(null)
  const isHome = path === '/'
  const section = path.startsWith('/projects') ? '/projects' : path

  useEffect(() => setOpen(false), [path])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    const onPointer = (e) => {
      if (!panelRef.current?.contains(e.target) && !buttonRef.current?.contains(e.target)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  // Plain clicks route in-app; modified clicks (new tab, copy link) stay normal links.
  const go = (e, to) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    setOpen(false)
    navigate(to)
  }

  const sectionLinks = (cls) =>
    LINKS.map(([to, label]) => (
      <a
        key={to}
        href={toHref(to)}
        className={cls}
        aria-current={section === to ? 'page' : undefined}
        onClick={(e) => go(e, to)}
      >
        {label}
      </a>
    ))

  return (
    <header className={isHome ? 'nav nav--home' : 'nav'}>
      <nav className="nav__inner" aria-label="Main">
        <a className="nav__brand" href={toHref('/')} onClick={(e) => go(e, '/')} aria-label={`${profile.name}, home`}>
          <SiteMark size={24} />
          {!isHome && <span className="nav__name">{profile.name}</span>}
        </a>

        {!isHome && <div className="nav__links">{sectionLinks('nav__link')}</div>}

        <div className="nav__actions">
          {!isHome && (
            <span className="nav__social">
              <a className="icon-btn" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <IconGitHub size={17} />
              </a>
              <a
                className="icon-btn"
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <IconLinkedIn size={17} />
              </a>
              <a className="icon-btn" href={`mailto:${profile.email}`} aria-label={`Email ${profile.email}`}>
                <IconMail size={17} />
              </a>
            </span>
          )}
          <ThemeToggle />
          {!isHome && (
            <button
              type="button"
              className="icon-btn nav__menu-btn"
              aria-expanded={open}
              aria-controls="nav-panel"
              aria-label={open ? 'Close menu' : 'Open menu'}
              ref={buttonRef}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <IconClose /> : <IconMenu />}
            </button>
          )}
        </div>
      </nav>

      {!isHome && open && (
        <div className="nav__panel" id="nav-panel" ref={panelRef}>
          {sectionLinks('nav__panel-link')}
          <div className="nav__panel-ext">
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href={`mailto:${profile.email}`}>Email</a>
          </div>
        </div>
      )}
    </header>
  )
}
