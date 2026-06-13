import { useState } from 'react'

export default function ProjectMedia({ project }) {
  const gallery = project.mediaGallery || []
  const [active, setActive] = useState(0)
  const [failed, setFailed] = useState(false)
  const src = project.media ? import.meta.env.BASE_URL + project.media : null
  const activeItem = gallery[active]

  if (gallery.length > 0 && activeItem) {
    return (
      <figure className="media media--gallery">
        <img
          className="media__img"
          src={import.meta.env.BASE_URL + activeItem.src}
          alt={`${project.title} - ${activeItem.label}`}
          loading="lazy"
        />
        <figcaption className="media__caption mono">{activeItem.label}</figcaption>
        <div className="media__thumbs" aria-label={`${project.title} images`}>
          {gallery.map((item, i) => (
            <button
              key={item.src}
              type="button"
              className={i === active ? 'media__thumb is-active' : 'media__thumb'}
              onClick={() => setActive(i)}
              aria-label={`Show ${item.label}`}
              aria-pressed={i === active}
            >
              <img src={import.meta.env.BASE_URL + item.src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      </figure>
    )
  }

  const showImg = src && !failed

  return (
    <figure className="media">
      {showImg ? (
        <img
          className="media__img"
          src={src}
          alt={`${project.title} - project visual`}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="media__placeholder" role="img" aria-label={`${project.title} visual work in progress`}>
          <span className="media__placeholder-cat mono">{project.category}</span>
          <span className="media__placeholder-title">{project.title}</span>
          <span className="media__placeholder-status mono">visual work in progress</span>
        </div>
      )}
    </figure>
  )
}
