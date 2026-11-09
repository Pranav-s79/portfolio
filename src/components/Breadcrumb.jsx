import { useEffect, useRef, useState } from 'react'
import { IconGitHub, IconLinkedIn, IconMail } from './icons.jsx'
import { profile, sections } from '../data/portfolio.js'
import { toHref } from '../routing.js'

const SECTION_OPTIONS = Object.entries(sections)

// Persistent nav: monogram + name return home; section after the slash.
// Hidden on the landing page.
export default function Breadcrumb({ path, navigate }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const close = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    const closeFromPointer = (e) => {
      if (!menuRef.current?.contains(e.target)) setOpen(false)
    }
    window.addEventListener('keydown', close)
    window.addEventListener('pointerdown', closeFromPointer)
    return () => {
      window.removeEventListener('keydown', close)
      window.removeEventListener('pointerdown', closeFromPointer)
    }
  }, [open])

  if (path === '/') return null
  const here = sections[path]

  // Plain clicks route in-app; modified clicks (new tab, copy link) behave like normal links.
  const go = (e, to) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    setOpen(false)
    navigate(to)
  }
  const goHome = (e) => go(e, '/')

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
          <div className="crumb__menu" ref={menuRef}>
            <button
              type="button"
              className="crumb__menu-trigger"
              aria-label="Jump to section"
              aria-expanded={open}
              ref={triggerRef}
              onClick={() => setOpen((next) => !next)}
            >
              {here}
            </button>
            {open && (
              <div className="crumb__menu-list">
                {SECTION_OPTIONS.map(([sectionPath, label]) => (
                  <a
                    key={sectionPath}
                    href={toHref(sectionPath)}
                    className={sectionPath === path ? 'crumb__menu-item is-current' : 'crumb__menu-item'}
                    aria-current={sectionPath === path ? 'page' : undefined}
                    onClick={(e) => go(e, sectionPath)}
                  >
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <div className="crumb__actions">
        {path !== '/resume' && (
          <a className="crumb__resume" href={toHref('/resume')} onClick={(e) => go(e, '/resume')}>
            Resume
          </a>
        )}
        <a className="crumb__icon" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <IconGitHub size={17} />
        </a>
        <a className="crumb__icon" href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <IconLinkedIn size={17} />
        </a>
        <a className="crumb__icon" href={`mailto:${profile.email}`} aria-label={`Email ${profile.email}`}>
          <IconMail size={17} />
        </a>
      </div>
    </nav>
  )
}
