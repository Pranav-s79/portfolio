import { resume } from '../data/portfolio.js'
import { toHref } from '../routing.js'

// encodeURI so filenames containing spaces/commas resolve on every host
const resumeHref = (href) => {
  if (/^https?:\/\//.test(href)) return href
  return encodeURI(toHref(`/${href.replace(/^\/+/, '')}`))
}

function Section({ name, children }) {
  return (
    <section className="rsec">
      <h2 className="rsec__name mono">{name}</h2>
      {children}
    </section>
  )
}

function Entry({ head, org, when, notes = [] }) {
  return (
    <article className="rentry">
      <p className="rentry__when mono">{when}</p>
      <div className="rentry__main">
        <h3 className="rentry__head">{head}</h3>
        <p className="rentry__org">{org}</p>
        {notes.length > 0 && (
          <ul className="notelist">
            {notes.map((n) => (
              <li className="notelist__item" key={n}>
                {n}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

export default function Resume({ navigate }) {
  const inCategories = (...cats) => resume.experience.filter((e) => cats.includes(e.category))
  const work = inCategories('industry', 'teaching')
  const research = inCategories('research')
  const leadership = inCategories('leadership')

  const goto = (e, path) => {
    e.preventDefault()
    navigate(path)
  }

  return (
    <div className="page fade-in">
      <header className="page-head">
        <p className="eyebrow rise" style={{ animationDelay: '40ms' }}>
          05 - resume
        </p>
        <h1 className="page__title rise" style={{ animationDelay: '110ms' }}>
          Resume
        </h1>
        <div className="downloads rise" style={{ animationDelay: '180ms' }}>
          {resume.downloads.map((d) => (
            <a
              key={d.label}
              className="download"
              href={resumeHref(d.href)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {d.label}
            </a>
          ))}
        </div>
      </header>

      <div className="rise" style={{ animationDelay: '250ms' }}>
        <Section name="Education">
          {resume.education.map((e) => (
            <Entry key={e.head} {...e} />
          ))}
        </Section>

        <Section name="Experience">
          {work.map((e) => (
            <Entry key={e.head} {...e} />
          ))}
        </Section>

        <Section name="Research">
          {research.map((e) => (
            <Entry key={e.head} {...e} />
          ))}
        </Section>

        <Section name="Leadership">
          {leadership.map((e) => (
            <Entry key={e.head} {...e} />
          ))}
        </Section>

        <Section name="Awards">
          {resume.awards.map((e) => (
            <Entry key={`${e.head}-${e.when}`} {...e} />
          ))}
        </Section>

        <nav className="rlinks" aria-label="More detail">
          <a
            className="rlink"
            href={toHref('/projects')}
            onClick={(e) => goto(e, '/projects')}
          >
            <span className="rlink__label">Projects</span>
            <span className="rlink__note">Eight builds, written up in full</span>
          </a>
          <a className="rlink" href={toHref('/skills')} onClick={(e) => goto(e, '/skills')}>
            <span className="rlink__label">Skills</span>
            <span className="rlink__note">The stack, mapped by domain</span>
          </a>
        </nav>
      </div>
    </div>
  )
}
