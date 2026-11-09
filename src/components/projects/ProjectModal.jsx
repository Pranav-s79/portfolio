import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { projectThemes } from '../../data/portfolio.js'
import ExpandedPreview from './ExpandedPreview.jsx'

export default function ProjectModal({ project, onClose, onPrev, onNext, hasPrev = false, hasNext = false }) {
  const p = project
  const cardRef = useRef(null)
  const closeRef = useRef(null)
  const theme = projectThemes.find((t) => t.id === p.theme)
  const hasMedia = p.mediaGallery?.length > 0

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
      if (hasPrev && e.key === 'ArrowLeft') {
        e.preventDefault()
        onPrev?.()
      }
      if (hasNext && e.key === 'ArrowRight') {
        e.preventDefault()
        onNext?.()
      }
      if (e.key === 'Tab') {
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
  }, [hasNext, hasPrev, onClose, onNext, onPrev])

  // Portal to <body>: .route creates a stacking context that would otherwise
  // keep the modal underneath the fixed breadcrumb bar.
  return createPortal(
    <div
      className="project-modal"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={hasMedia ? 'project-modal__card' : 'project-modal__card project-modal__card--narrow'}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        ref={cardRef}
      >
        {hasPrev && (
          <button
            type="button"
            className="project-modal__nav project-modal__nav--prev"
            aria-label="Previous project"
            onClick={onPrev}
          >
            &larr;
          </button>
        )}
        {hasNext && (
          <button
            type="button"
            className="project-modal__nav project-modal__nav--next"
            aria-label="Next project"
            onClick={onNext}
          >
            &rarr;
          </button>
        )}
        <div className="pmodal__head">
          <div>
            <p className="pmodal__meta">
              <span className="mono">{theme?.label}</span>
              <span className="rcard__sep" aria-hidden="true" />
              <span className="mono">{p.when}</span>
              {p.status && <span className="badge mono">{p.status}</span>}
            </p>
            <h2 id="project-modal-title" className="pmodal__title">
              {p.title}
            </h2>
          </div>
          <button
            type="button"
            className="project-modal__close"
            aria-label="Close project"
            onClick={onClose}
            ref={closeRef}
          >
            x
          </button>
        </div>

        <ExpandedPreview project={p} />
      </div>
    </div>,
    document.body,
  )
}
