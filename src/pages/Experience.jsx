import { experience } from '../data/portfolio.js'

const GROUPS = [
  { id: 'professional', label: 'Professional', items: experience.filter((e) => e.category === 'professional') },
  { id: 'leadership', label: 'Leadership', items: experience.filter((e) => e.category === 'leadership') },
]

function Notes({ notes }) {
  if (!notes?.length) return null
  return (
    <ul className="tl__notes">
      {notes.map((n) => (
        <li key={n}>{n}</li>
      ))}
    </ul>
  )
}

export default function Experience() {
  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page__title">Experience</h1>
      </header>

      {GROUPS.map((group) => (
        <section className="tl-group" key={group.id} aria-labelledby={`exp-${group.id}`}>
          <div className="tl-group__head">
            <h2 id={`exp-${group.id}`}>{group.label}</h2>
            <span>{String(group.items.length).padStart(2, '0')}</span>
          </div>

          <ol className="timeline">
            {group.items.map((item) => (
              <li className={item.current ? 'tl tl--current' : 'tl'} key={item.id}>
                <div className="tl__when">
                  <span className="tl__date">{item.when}</span>
                  {item.where && <span className="tl__where">{item.where}</span>}
                </div>
                <span className="tl__rail" aria-hidden="true">
                  <span className="tl__dot" />
                </span>
                <article className="tl__card">
                  <div className="tl__head">
                    <h3 className="tl__role">{item.role}</h3>
                    {item.current && <span className="tl__now">Current</span>}
                  </div>
                  <p className="tl__org">
                    {item.org}
                    {item.client && <span className="tl__client"> · {item.client}</span>}
                  </p>
                  {item.summary && <p className="tl__summary">{item.summary}</p>}
                  <Notes notes={item.notes} />
                  {item.groups?.map((g) => (
                    <div className="tl__sub" key={g.label}>
                      <h4>{g.label}</h4>
                      <Notes notes={g.notes} />
                    </div>
                  ))}
                  {item.tech?.length > 0 && <p className="tl__tech">{item.tech.join(' · ')}</p>}
                </article>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}
