// ============================================================
// One real project visual inside a simple rectangular frame.
// Expects an image at <BASE_URL><project.media> (e.g. public/projects/
// haptic-portal.jpg). Until a real file exists — or if it fails to load —
// a clean neutral placeholder is shown: just the project label, no abstract
// shapes or decorative overlays. A subtle masked fade is the only motion.
// ============================================================

import { useState } from 'react'

export default function ProjectMedia({ project }) {
  const [failed, setFailed] = useState(false)
  const src = project.media ? import.meta.env.BASE_URL + project.media : null
  const showImg = src && !failed

  return (
    <figure className="media">
      {showImg ? (
        <img
          className="media__img"
          src={src}
          alt={`${project.title} — project visual`}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="media__placeholder" role="img" aria-label={`${project.title} — visual coming soon`}>
          <span className="media__placeholder-cat mono">{project.category}</span>
          <span className="media__placeholder-title">{project.title}</span>
        </div>
      )}
    </figure>
  )
}
