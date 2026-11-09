import { publications, research } from '../data/portfolio.js'

// Each study reads as a spread: the numbers on one side, the story on the other.
export default function Research() {
  return (
    <div className="page page--wide">
      <header className="page-head">
        <h1 className="page__title">Research</h1>
      </header>

      <div className="studies">
        {research.map((r, i) => (
          <article className="study" key={r.slug}>
            <div className="study__index" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </div>

            <div className="study__main">
              <p className="study__meta">
                <span>{r.org}</span>
                <span className="case__meta-sep" aria-hidden="true" />
                <span>{r.when}</span>
                {r.current && <span className="tl__now">Current</span>}
              </p>
              <h2 className="study__title">{r.title}</h2>
              <p className="study__role">{r.role}</p>
              <p className="study__summary">{r.summary}</p>

              <ul className="study__work">
                {r.work.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>

              <p className="study__foot">
                <span>{r.tech.join(' · ')}</span>
                {r.link && (
                  <a className="textlink" href={r.link} target="_blank" rel="noopener noreferrer">
                    {r.linkLabel} →
                  </a>
                )}
              </p>
            </div>

            <dl className="study__metrics">
              {r.metrics.map((m) => (
                <div key={m.label}>
                  <dt>{m.label}</dt>
                  <dd>{m.value}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>

      <section className="paper" aria-labelledby="pubs">
        <h2 className="paper__kicker" id="pubs">
          Publication
        </h2>
        {publications.map((p) => (
          <a className="paper__card" key={p.link} href={p.link} target="_blank" rel="noopener noreferrer">
            <span className="paper__title">{p.title}</span>
            <span className="paper__by">{p.authors}</span>
            <span className="paper__venue">
              {p.venue} <span aria-hidden="true">·</span> {p.linkLabel} →
            </span>
          </a>
        ))}
      </section>
    </div>
  )
}
