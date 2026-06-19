import { useState } from 'react'

const SIZE_CLASS = {
  full: 'module--full',
  featured: 'module--featured',
  lg: 'module--lg',
  normal: 'module--normal',
  compact: 'module--compact',
  tall: 'module--tall',
  wide: 'module--wide',
}

export default function ProjectModule({ project, index, dimmed, onOpen, style }) {
  const p = project
  const [hovered, setHovered] = useState(false)
  const num = `P${String(index + 1).padStart(2, '0')}`

  return (
    <article
      className={[
        'module',
        'rise',
        SIZE_CLASS[p.layoutSize || p.size],
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
        aria-label={`${p.title} - open project`}
        onClick={() => onOpen(p.slug)}
      >
        <span className="module__top">
          <span className="module__index mono">{num}</span>
          <span className="module__cat mono">
            {p.category} - {p.year}
          </span>
        </span>

        <span className="module__heading">
          <span className="module__title">{p.title}</span>
          <span className="module__oneline">{p.oneLine}</span>
        </span>

        <span className="module__foot">
          <span className="module__stack mono">{p.stack.join(' / ')}</span>
          <span className="module__view mono">
            View project <span className="module__arrow">-&gt;</span>
          </span>
        </span>
      </button>
    </article>
  )
}
