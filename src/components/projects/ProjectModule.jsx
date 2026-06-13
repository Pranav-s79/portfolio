// ============================================================
// A single collapsed project module. Shows every essential detail without
// interaction: number, title, category + year, one-line purpose, main
// technologies, and a View Project action. Clicking opens the centered
// project card (a modal overlay) — the module itself never expands inline.
//
// The whole surface is one semantic button (keyboard-operable).
// ============================================================

import { useState } from 'react'

const SIZE_CLASS = { lg: 'module--lg', tall: 'module--tall', wide: 'module--wide' }

export default function ProjectModule({ project, index, dimmed, onOpen, style }) {
  const p = project
  const [hovered, setHovered] = useState(false)
  const num = `P${String(index + 1).padStart(2, '0')}`

  return (
    <article
      className={[
        'module',
        'rise',
        SIZE_CLASS[p.size],
        hovered ? 'is-hovered' : '',
        dimmed ? 'is-dimmed' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        className="module__trigger"
        aria-haspopup="dialog"
        aria-label={`${p.title} — open project`}
        onClick={() => onOpen(p.slug)}
      >
        <span className="module__top">
          <span className="module__index mono">{num}</span>
          <span className="module__cat mono">
            {p.category} · {p.year}
          </span>
        </span>

        <span className="module__heading">
          <span className="module__title">{p.title}</span>
          <span className="module__oneline">{p.oneLine}</span>
        </span>

        <span className="module__foot">
          <span className="module__stack mono">{p.stack.join(' / ')}</span>
          <span className="module__view mono">
            View project <span className="module__arrow">↗</span>
          </span>
        </span>
      </button>
    </article>
  )
}
