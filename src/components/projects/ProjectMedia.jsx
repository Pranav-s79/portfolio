import { useState } from 'react'

// Image gallery for projects that have real photos or renders. Projects
// without images render nothing rather than a placeholder. Width/height are
// set so the browser reserves space before the image loads (no layout shift).
export default function ProjectMedia({ project }) {
  const gallery = project.mediaGallery || []
  const [active, setActive] = useState(0)
  const activeItem = gallery[active]
  if (!activeItem) return null

  return (
    <figure className="media">
      <div className="media__frame">
        <img
          key={activeItem.src}
          className={activeItem.fit === 'contain' ? 'media__img media__img--contain' : 'media__img'}
          src={import.meta.env.BASE_URL + activeItem.src}
          alt={`${project.title}: ${activeItem.label}`}
          width={activeItem.w}
          height={activeItem.h}
          loading="lazy"
          decoding="async"
        />
      </div>
      <figcaption className="media__caption">{activeItem.label}</figcaption>
      {gallery.length > 1 && (
        <div className="media__thumbs" role="group" aria-label={`${project.title} images`}>
          {gallery.map((item, i) => (
            <button
              key={item.src}
              type="button"
              className={i === active ? 'media__thumb is-active' : 'media__thumb'}
              onClick={() => setActive(i)}
              aria-label={`Show ${item.label}`}
              aria-pressed={i === active}
            >
              <img
                src={import.meta.env.BASE_URL + item.src}
                alt=""
                width={item.w}
                height={item.h}
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}
    </figure>
  )
}
