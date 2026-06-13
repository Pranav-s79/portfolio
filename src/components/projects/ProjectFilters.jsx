// ============================================================
// Minimal category filter row. Plain monospace labels (no pill buttons);
// the active filter is marked by a thin tan underline that slides between
// labels. A live project count sits at the end and updates with the filter.
// Filters are real <button>s in a tablist for keyboard + screen-reader use.
// ============================================================

import { useLayoutEffect, useRef, useState } from 'react'

export default function ProjectFilters({ filters, active, onChange, count }) {
  const rowRef = useRef(null)
  const btnRefs = useRef({})
  const [marker, setMarker] = useState({ left: 0, width: 0 })

  // position the sliding tan marker under the active label
  useLayoutEffect(() => {
    const el = btnRefs.current[active]
    const row = rowRef.current
    if (!el || !row) return
    const er = el.getBoundingClientRect()
    const rr = row.getBoundingClientRect()
    setMarker({ left: er.left - rr.left, width: er.width })
  }, [active, filters])

  const onKeyNav = (e) => {
    const idx = filters.indexOf(active)
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const dir = e.key === 'ArrowRight' ? 1 : -1
      const next = filters[(idx + dir + filters.length) % filters.length]
      onChange(next)
      btnRefs.current[next]?.focus()
    }
  }

  return (
    <div className="filters">
      <div
        className="filters__row"
        ref={rowRef}
        role="tablist"
        aria-label="Filter projects by discipline"
        onKeyDown={onKeyNav}
      >
        {filters.map((f) => {
          const isActive = f === active
          return (
            <button
              key={f}
              type="button"
              ref={(n) => (btnRefs.current[f] = n)}
              className={`filters__btn${isActive ? ' is-active' : ''}`}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(f)}
            >
              {f}
            </button>
          )
        })}
        <span
          className="filters__marker"
          aria-hidden="true"
          style={{ transform: `translateX(${marker.left}px)`, width: marker.width }}
        />
      </div>
      <p className="filters__count" aria-live="polite">
        {String(count).padStart(2, '0')} {count === 1 ? 'PROJECT' : 'PROJECTS'}
      </p>
    </div>
  )
}
