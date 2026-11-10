import { publications, research } from '../data/portfolio.js'

export default function Research() {
  const paper = publications[0]
  return (
    <div className="page page--wide">
      <header className="page-head research-head">
        <h1 className="page__title">Research</h1>
        <p className="research-head__intro">
          Machine learning work on physical systems and human judgment, with an emphasis on what was measured and how.
        </p>
      </header>

      {research.map((r, i) => {
        return (
          <article className="research-entry" key={r.slug}>
            <header className="research-entry__head">
              <p className="research-entry__index">Study {String(i + 1).padStart(2, '0')}</p>
              <div>
                <h2 className="research-entry__title">{r.title}</h2>
                <p className="research-entry__line">{r.line}</p>
              </div>
              <p className="research-entry__meta">
                <span>{r.role}</span>
                <span>{r.org}</span>
                <span className="research-entry__period">
                  {r.current && <span className="research-entry__live" aria-label="ongoing" />}
                  {r.period}
                </span>
              </p>
            </header>

            <div className="research-entry__body">
              <section aria-labelledby={`${r.slug}-question`}>
                <h3 className="research-entry__label" id={`${r.slug}-question`}>
                  Research question
                </h3>
                <p className="research-entry__about">{r.about}</p>
              </section>
              <section aria-labelledby={`${r.slug}-work`}>
                <h3 className="research-entry__label" id={`${r.slug}-work`}>
                  What I worked on
                </h3>
                <ul className="research-entry__work">
                {r.how.map((h, n) => (
                  <li key={h}>
                    <span aria-hidden="true">{String(n + 1).padStart(2, '0')}</span>
                    {h}
                  </li>
                ))}
                </ul>
              </section>
            </div>

            <dl className="research-entry__evidence" aria-label="Results">
              {r.metrics.map((m) => (
                <div key={m.label}>
                  <dd>{m.value}</dd>
                  <dt>{m.label}</dt>
                </div>
              ))}
            </dl>

            <footer className="research-entry__foot">
              <p>{r.tech.join(' · ')}</p>
              {r.link && (
                <a className="research-entry__link" href={r.link} target="_blank" rel="noopener noreferrer">
                  {r.linkLabel} ↗
                </a>
              )}
            </footer>
          </article>
        )
      })}

      {paper && (
        <section className="research-publication" aria-labelledby="publication-title">
          <h2 className="section-title" id="publication-title">
            Publication
          </h2>
          <a className="research-publication__paper" href={paper.link} target="_blank" rel="noopener noreferrer">
            <span className="research-publication__title">{paper.title}</span>
            <span className="research-publication__meta">
              {paper.authors} · {paper.venue} · {paper.year} ↗
            </span>
          </a>
        </section>
      )}
    </div>
  )
}
