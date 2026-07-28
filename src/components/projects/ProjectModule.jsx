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

      {p.repo && (
        <a
          className="module__repo mono"
          href={p.repo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${p.title} source on GitHub`}
          title="View source on GitHub"
          onClick={(e) => e.stopPropagation()}
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true" focusable="false">
            <path
              d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      )}
    </article>
  )
}
