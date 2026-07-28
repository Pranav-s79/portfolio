import { resume } from '../data/portfolio.js'

export default function Experience() {
  const experience = resume.experience.filter((item) => item.category !== 'research')

  return (
    <div className="page fade-in">
      <header className="page-head">
        <p className="eyebrow rise" style={{ animationDelay: '40ms' }}>
          01 - experience
        </p>
        <h1 className="page__title rise" style={{ animationDelay: '110ms' }}>
          Experience
        </h1>
        <p className="page__lead rise" style={{ animationDelay: '180ms' }}>
          Teaching and mentoring outside the classroom.
        </p>
      </header>

      <div className="trace">
        <div className="trace__line" aria-hidden="true" />
        <div className="trace__track">
          {experience.map((item, i) => (
            <article
              className="trace__item rise"
              style={{ animationDelay: `${260 + i * 120}ms` }}
              key={item.head}
              tabIndex={0}
            >
              <span className="trace__tick" aria-hidden="true" />
              <div className="trace__card pane">
                <div className="pane__top">
                  <span className="pane__index">E0{i + 1}</span>
                  <span className="trace__year">{item.when}</span>
                </div>
                <h2 className="trace__title">{item.head}</h2>
                <p className="trace__org">{item.org}</p>
                <div className="trace__more">
                  <div className="trace__more-inner">
                    <p className="trace__detail">{item.note}</p>
                  </div>
                </div>
                <div className="chips">
                  {item.tags.map((t) => (
                    <span className="chip" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
