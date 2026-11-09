import { publications, research } from '../data/portfolio.js'

export default function Research() {
  return (
    <div className="page fade-in">
      <header className="page-head">
        <p className="eyebrow rise" style={{ animationDelay: '40ms' }}>
          02 - research
        </p>
        <h1 className="page__title rise" style={{ animationDelay: '110ms' }}>
          Research
        </h1>
      </header>

      <div className="rcards">
        {research.map((item, i) => (
          <article
            className="rcard rise"
            style={{ animationDelay: `${220 + i * 110}ms` }}
            key={item.slug}
          >
            <div className="rcard__meta">
              <span className="mono">{item.when}</span>
              <span className="rcard__sep" aria-hidden="true" />
              <span>{item.where}</span>
              {item.current && <span className="badge mono">Current</span>}
            </div>

            <h2 className="rcard__title">{item.title}</h2>
            <p className="rcard__role">
              {item.role} <span className="rcard__at">at</span> {item.org}
            </p>

            <p className="rcard__overview">{item.overview}</p>

            {item.result && (
              <p className="stat">
                <span className="stat__value">{item.result.value}</span>
                <span className="stat__label">{item.result.label}</span>
              </p>
            )}

            <div className="rcard__foot">
              <ul className="tags" aria-label="Main technologies">
                {item.tech.map((t) => (
                  <li className="tag" key={t}>
                    {t}
                  </li>
                ))}
              </ul>
              {item.link && (
                <a className="textlink mono" href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.linkLabel} -&gt;
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      <section className="block rise" style={{ animationDelay: '480ms' }} aria-labelledby="pubs">
        <div className="section-label">
          <h2 id="pubs" className="section-label__name">
            Publication
          </h2>
        </div>
        {publications.map((p) => (
          <a className="pub" key={p.link} href={p.link} target="_blank" rel="noopener noreferrer">
            <span className="pub__venue mono">{p.venue}</span>
            <span className="pub__title">“{p.title}”</span>
            <span className="pub__authors">{p.authors}</span>
            <span className="pub__link mono">{p.linkLabel} -&gt;</span>
          </a>
        ))}
      </section>
    </div>
  )
}
