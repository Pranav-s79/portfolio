// ============================================================
// Centered project card shown when a module is clicked. A modal dialog over
// a dimmed backdrop holding the same expanded content (visual, summary, main
// skills, tech stack, links) plus the title/category/year header and an X to
// close back to the grid. Closes on X, backdrop click, or Escape; locks body
// scroll, traps focus lightly, and restores focus to the opener on close.
// ============================================================

import { useEffect, useRef } from 'react'
import ExpandedPreview from './ExpandedPreview.jsx'

export default function ProjectModal({ project, index, onClose }) {
  const p = project
  const cardRef = useRef(null)
  const closeRef = useRef(null)
  const num = `P${String(index + 1).padStart(2, '0')}`

  useEffect(() => {
    const opener = document.activeElement
    closeRef.current?.focus()

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
      if (e.key === 'Tab') {
        // keep focus within the card
        const f = cardRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )
        if (!f || f.length === 0) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey, true)

    return () => {
      document.removeEventListener('keydown', onKey, true)
      document.body.style.overflow = prevOverflow
      if (opener instanceof HTMLElement) opener.focus()
    }
  }, [onClose])

  return (
    <div
      className="project-modal"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="project-modal__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        ref={cardRef}
      >
        <div className="module__expanded-head">
          <div className="module__expanded-titles">
            <h2 id="project-modal-title" className="module__title module__title--expanded">
              {p.title}
            </h2>
            <span className="module__cat mono">
              <span className="module__index mono">{num}</span> · {p.category} · {p.year}
            </span>
          </div>
          <button
            type="button"
            className="project-modal__close"
            aria-label="Close project"
            onClick={onClose}
            ref={closeRef}
          >
            ✕
          </button>
        </div>

        <ExpandedPreview project={p} />
      </div>
    </div>
  )
}
