import { useState } from 'react'

// Image gallery for projects that have real visuals. Projects without images
// render no media at all rather than a placeholder box.
export default function ProjectMedia({ project }) {
  const gallery = project.mediaGallery || []
  const [active, setActive] = useState(0)
  const activeItem = gallery[active]
  if (!activeItem) return null

  return (
    <figure className="media">
      <img
        className={activeItem.fit === 'contain' ? 'media__img media__img--contain' : 'media__img'}
        src={import.meta.env.BASE_URL + activeItem.src}
        alt={`${project.title} - ${activeItem.label}`}
        loading="lazy"
      />
      <figcaption className="media__caption mono">{activeItem.label}</figcaption>
      {gallery.length > 1 && (
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
      )}
    </figure>
  )
}
