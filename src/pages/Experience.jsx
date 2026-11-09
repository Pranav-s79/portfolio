import { resume } from '../data/portfolio.js'
import NoteList from '../components/NoteList.jsx'

// Paid work and student-org roles read as different kinds of commitment, so
// they get separate timelines. Research lives on its own page.
const GROUPS = [
  { id: 'professional', label: 'Professional', categories: ['industry', 'teaching'] },
  { id: 'leadership', label: 'Leadership', categories: ['leadership'] },
]

export default function Experience() {
  const groups = GROUPS.map((g) => ({
    ...g,
    items: resume.experience.filter((item) => g.categories.includes(item.category)),
  })).filter((g) => g.items.length > 0)

  let delay = 180

  return (
    <div className="page fade-in">
      <header className="page-head">
        <p className="eyebrow rise" style={{ animationDelay: '40ms' }}>
          01 - experience
        </p>
        <h1 className="page__title rise" style={{ animationDelay: '110ms' }}>
          Experience
        </h1>
      </header>

      {groups.map((group) => (
        <section className="block" key={group.id} aria-labelledby={`exp-${group.id}`}>
          <div className="section-label rise" style={{ animationDelay: `${(delay += 60)}ms` }}>
            <h2 id={`exp-${group.id}`} className="section-label__name">
              {group.label}
            </h2>
            <span className="section-label__count mono">
              {String(group.items.length).padStart(2, '0')}
            </span>
          </div>

          <ol className="timeline">
            {group.items.map((item) => (
              <li
                className={`tl rise${item.current ? ' tl--current' : ''}`}
                style={{ animationDelay: `${(delay += 80)}ms` }}
                key={`${item.head}-${item.org}`}
              >
                <div className="tl__when">
                  <span className="tl__date mono">{item.when}</span>
                  {item.where && <span className="tl__where">{item.where}</span>}
                </div>
                <span className="tl__rail" aria-hidden="true">
                  <span className="tl__dot" />
                </span>
                <article className="tl__card">
                  <div className="tl__head">
                    <h3 className="tl__role">{item.head}</h3>
                    {item.current && <span className="badge mono">Current</span>}
                  </div>
                  <p className="tl__org">{item.org}</p>
                  <NoteList notes={item.notes} />
                </article>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}
