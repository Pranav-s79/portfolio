import { useEffect, useRef, useState } from 'react'
import { profile, sections } from '../data/portfolio.js'
import { toHref } from '../routing.js'

const SECTION_OPTIONS = Object.entries(sections)

// Persistent nav: monogram + name return home; section after the slash.
// Hidden on the landing page.
export default function Breadcrumb({ path, navigate }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const close = (e) => {
      if (e.key === 'Escape') setOpen(false)
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
          <div className="crumb__menu" ref={menuRef}>
            <button
              type="button"
              className="crumb__menu-trigger"
              aria-label="Jump to section"
              aria-expanded={open}
              aria-haspopup="menu"
              onClick={() => setOpen((next) => !next)}
            >
              {here}
            </button>
            {open && (
              <div className="crumb__menu-list" role="menu">
                {SECTION_OPTIONS.map(([sectionPath, label]) => (
                  <button
                    key={sectionPath}
                    type="button"
                    className={sectionPath === path ? 'crumb__menu-item is-current' : 'crumb__menu-item'}
                    role="menuitem"
                    onClick={() => {
                      setOpen(false)
                      navigate(sectionPath)
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </nav>
  )
}
