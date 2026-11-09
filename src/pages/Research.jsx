import { publications, research } from '../data/portfolio.js'

export default function Research() {
  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page__title">Research</h1>
      </header>

      <div className="rcards">
        {research.map((item) => (
          <article className="rcard" key={item.slug}>
            <p className="rcard__meta">
              <span>{item.when}</span>
              <span className="case__meta-sep" aria-hidden="true" />
              <span>{item.where}</span>
              {item.current && <span className="xp__current">Current</span>}
            </p>

            <h2 className="rcard__title">{item.title}</h2>
            <p className="rcard__role">
              {item.role} <span className="rcard__at">·</span> {item.org}
            </p>

            <p className="rcard__overview">{item.overview}</p>

            {item.result && (
              <p className="stat">
                <span className="stat__value">{item.result.value}</span>
                <span className="stat__label">{item.result.label}</span>
              </p>
            )}

            <p className="rcard__foot">
              <span className="rcard__tech">{item.tech.join(' · ')}</span>
              {item.link && (
                <a className="textlink" href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.linkLabel} →
                </a>
              )}
            </p>
          </article>
        ))}
      </div>

      <section className="rsec" aria-labelledby="pubs">
        <h2 className="section-title" id="pubs">
          Publication
        </h2>
        {publications.map((p) => (
          <a className="pub" key={p.link} href={p.link} target="_blank" rel="noopener noreferrer">
            <span className="pub__venue">{p.venue}</span>
            <span className="pub__title">“{p.title}”</span>
            <span className="pub__authors">{p.authors}</span>
            <span className="pub__link">{p.linkLabel} →</span>
          </a>
        ))}
      </section>
    </div>
  )
}
