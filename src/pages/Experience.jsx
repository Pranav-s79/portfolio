import { resume } from '../data/portfolio.js'

// Research lives on its own page; everything else splits into paid work and
// student-org roles so the two read as different kinds of commitment.
const GROUPS = [
  { id: 'professional', label: 'Professional', prefix: 'E', categories: ['industry', 'teaching'] },
  { id: 'leadership', label: 'Leadership', prefix: 'L', categories: ['leadership'] },
]

export default function Experience() {
  const groups = GROUPS.map((g) => ({
    ...g,
    items: resume.experience.filter((item) => g.categories.includes(item.category)),
  })).filter((g) => g.items.length > 0)

  let delay = 200

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
        <section className="trace-group" key={group.id}>
          <div className="group-head rise" style={{ animationDelay: `${(delay += 70)}ms` }}>
            <h2 className="group-head__name">{group.label}</h2>
            <span className="group-head__count mono">
              {String(group.items.length).padStart(2, '0')}{' '}
              {group.items.length === 1 ? 'role' : 'roles'}
            </span>
          </div>

          <div className="trace">
            <div className="trace__line" aria-hidden="true" />
            <div className="trace__track">
              {group.items.map((item, i) => (
                <article
                  className="trace__item rise"
                  style={{ animationDelay: `${(delay += 90)}ms` }}
                  key={item.head}
                >
                  <span className="trace__tick" aria-hidden="true" />
                  <div className="trace__card pane">
                    <div className="pane__top">
                      <span className="pane__index">
                        {group.prefix}0{i + 1}
                      </span>
                      <span className="trace__year">{item.when}</span>
                    </div>
                    <h3 className="trace__title">{item.head}</h3>
                    <p className="trace__org">{item.org}</p>
                    <ul className="notelist">
                      {item.notes.map((n) => (
                        <li className="notelist__item" key={n}>
                          {n}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
