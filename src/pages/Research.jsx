import { research } from '../data/portfolio.js'

export default function Research() {
  return (
    <div className="page fade-in">
      <header className="page-head">
        <p className="eyebrow rise" style={{ animationDelay: '40ms' }}>
          01 — research
        </p>
        <h1 className="page__title rise" style={{ animationDelay: '110ms' }}>
          Research
        </h1>
        <p className="page__lead rise" style={{ animationDelay: '180ms' }}>
          What was done, where, when, and what it produced.
        </p>
      </header>

      <div className="trace">
        <div className="trace__line" aria-hidden="true" />
        <div className="trace__track">
          {research.map((item, i) => (
            <article
              className="trace__item rise"
              style={{ animationDelay: `${260 + i * 120}ms` }}
              key={item.title}
              tabIndex={0}
            >
              <span className="trace__tick" aria-hidden="true" />
              <div className="trace__card pane">
                <div className="pane__top">
                  <span className="pane__index">R0{i + 1}</span>
                  <span className="trace__year">
                    {item.year} · {item.when}
                  </span>
                </div>
                <h2 className="trace__title">{item.title}</h2>
                <p className="trace__org">{item.org}</p>
                <div className="trace__more">
                  <div className="trace__more-inner">
                    <p className="trace__detail">{item.detail}</p>
                    <p className="trace__result">{item.result}</p>
                  </div>
                </div>
                <div className="chips">
                  {item.tags.map((t) => (
                    <span className="chip" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
                {item.link && (
                  <a
                    className="pane__link"
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.linkLabel} ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
