import { publications, research } from '../data/portfolio.js'

// One study per band: the headline number does the talking.
export default function Research() {
  const paper = publications[0]
  return (
    <div className="page page--wide">
      <header className="page-head rx-head">
        <h1 className="page__title">Research</h1>
        <span className="rx-head__count">{String(research.length).padStart(2, '0')}</span>
      </header>

      {research.map((r, i) => {
        const [hero, ...rest] = r.metrics
        return (
          <article className="rx" key={r.slug}>
            <p className="rx__meta">
              <span className="rx__no">{String(i + 1).padStart(2, '0')}</span>
              <span className="rx__rule" aria-hidden="true" />
              <span>{r.org}</span>
              <span className="rx__when">
                {r.current && <span className="rx__live" aria-label="ongoing" />}
                {r.when}
              </span>
            </p>

            <div className="rx__body">
              <div>
                <h2 className="rx__title">{r.title}</h2>
                <p className="rx__line">{r.line}</p>
              </div>
              <p className="rx__hero">
                <span className="rx__big">{hero.value}</span>
                <span className="rx__big-label">{hero.label}</span>
              </p>
            </div>

            <dl className="rx__rest">
              {rest.map((m) => (
                <div key={m.label}>
                  <dt>{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>

            <p className="rx__foot">
              <span>{r.role}</span>
              <span>{r.tech.join(' · ')}</span>
              {r.link && (
                <a className="rx__link" href={r.link} target="_blank" rel="noopener noreferrer">
                  {r.linkLabel} ↗
                </a>
              )}
            </p>
          </article>
        )
      })}

      {paper && (
        <a className="rx-paper" href={paper.link} target="_blank" rel="noopener noreferrer">
          <span className="rx-paper__venue">{paper.venue}</span>
          <span className="rx-paper__title">{paper.title}</span>
        </a>
      )}
    </div>
  )
}
