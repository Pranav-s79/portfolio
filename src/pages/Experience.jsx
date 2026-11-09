import { experience, research } from '../data/portfolio.js'
import { toHref } from '../routing.js'

// Three kinds of commitment, kept visibly separate: paid work, research,
// and student engineering organizations.
const researchEntries = research.map((r) => ({
  id: r.slug,
  role: r.role,
  org: r.org,
  when: r.when,
  where: r.where,
  current: r.current,
  summary: r.overview,
  notes: [],
}))

const GROUPS = [
  { id: 'employment', label: 'Employment', items: experience.filter((e) => e.category === 'employment') },
  { id: 'research', label: 'Research', items: researchEntries },
  {
    id: 'organizations',
    label: 'Student engineering organizations',
    items: experience.filter((e) => e.category === 'organization'),
  },
]

function Notes({ notes }) {
  if (!notes?.length) return null
  return (
    <ul className="xp__notes">
      {notes.map((n) => (
        <li key={n}>{n}</li>
      ))}
    </ul>
  )
}

function Entry({ item }) {
  return (
    <li className="xp">
      <div className="xp__when">
        <span className="xp__date">{item.when}</span>
        {item.current && <span className="xp__current">Current</span>}
      </div>
      <div className="xp__body">
        <h3 className="xp__role">{item.role}</h3>
        <p className="xp__org">
          {item.org}
          {item.client && <span className="xp__client"> · for {item.client}</span>}
          {item.where && <span className="xp__where"> · {item.where}</span>}
        </p>
        <p className="xp__summary">{item.summary}</p>
        <Notes notes={item.notes} />
        {item.groups && (
          <div className="xp__groups">
            {item.groups.map((g) => (
              <div className="xp__group" key={g.label}>
                <h4 className="xp__group-label">{g.label}</h4>
                <Notes notes={g.notes} />
              </div>
            ))}
          </div>
        )}
      </div>
    </li>
  )
}

export default function Experience({ navigate }) {
  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page__title">Experience</h1>
      </header>

      {GROUPS.map((group) => (
        <section className="xp-group" key={group.id} aria-labelledby={`xp-${group.id}`}>
          <h2 className="section-title" id={`xp-${group.id}`}>
            {group.label}
          </h2>
          <ol className="xp-list">
            {group.items.map((item) => (
              <Entry key={item.id} item={item} />
            ))}
          </ol>
          {group.id === 'research' && (
            <a
              className="textlink xp-group__more"
              href={toHref('/research')}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
                e.preventDefault()
                navigate('/research')
              }}
            >
              Research details and publication →
            </a>
          )}
        </section>
      ))}
    </div>
  )
}
