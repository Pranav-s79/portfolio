import { profile, publications, research, resume } from '../data/portfolio.js'
import { toHref } from '../routing.js'
import NoteList from '../components/NoteList.jsx'

// encodeURI so filenames containing spaces/commas resolve on every host
const resumeHref = (href) => {
  if (/^https?:\/\//.test(href)) return href
  return encodeURI(toHref(`/${href.replace(/^\/+/, '')}`))
}

function Section({ name, children }) {
  return (
    <section className="rsec">
      <h2 className="section-label section-label__name">{name}</h2>
      {children}
    </section>
  )
}

function Entry({ head, org, when, where, notes, children }) {
  return (
    <article className="rentry">
      <div className="rentry__when">
        <span className="mono">{when}</span>
        {where && <span className="rentry__where">{where}</span>}
      </div>
      <div className="rentry__main">
        <h3 className="rentry__head">{head}</h3>
        {org && <p className="rentry__org">{org}</p>}
        <NoteList notes={notes} />
        {children}
      </div>
    </article>
  )
}

export default function Resume({ navigate }) {
  const inCategories = (...cats) => resume.experience.filter((e) => cats.includes(e.category))
  const work = inCategories('industry', 'teaching')
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
        <p className="rcontact rise" style={{ animationDelay: '220ms' }}>
          <a className="textlink" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <span aria-hidden="true">·</span>
          <a className="textlink" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <span aria-hidden="true">·</span>
          <a className="textlink" href={profile.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </p>
      </header>

      <div className="rise" style={{ animationDelay: '250ms' }}>
        <Section name="Education">
          {resume.education.map((e) => (
            <Entry key={e.head} {...e}>
              {e.coursework?.length > 0 && (
                <p className="rentry__course">
                  <span className="rentry__course-label mono">Coursework</span>
                  {e.coursework.join(' · ')}
                </p>
              )}
            </Entry>
          ))}
        </Section>

        <Section name="Experience">
          {work.map((e) => (
            <Entry key={`${e.head}-${e.org}`} {...e} />
          ))}
        </Section>

        <Section name="Research">
          {research.map((r) => (
            <Entry key={r.slug} head={r.role} org={r.org} when={r.when} where={r.where} notes={[r.overview]} />
          ))}
        </Section>

        <Section name="Publication">
          {publications.map((p) => (
            <Entry key={p.link} head={p.venue} when="2024">
              <p className="rentry__pub">
                {p.authors} “{p.title}.”{' '}
                <a className="textlink mono" href={p.link} target="_blank" rel="noopener noreferrer">
                  {p.linkLabel}
                </a>
              </p>
            </Entry>
          ))}
        </Section>

        <Section name="Leadership">
          {leadership.map((e) => (
            <Entry key={`${e.head}-${e.org}`} {...e} />
          ))}
        </Section>

        <Section name="Technical skills">
          {resume.skills.map((g) => (
            <article className="rentry rentry--tight" key={g.group}>
              <div className="rentry__when">
                <span className="mono">{g.group}</span>
              </div>
              <p className="rentry__skills">{g.items.join(' · ')}</p>
            </article>
          ))}
        </Section>

        <Section name="Awards">
          {resume.awards.map((e) => (
            <Entry key={`${e.head}-${e.when}`} {...e} />
          ))}
        </Section>

        <nav className="rlinks" aria-label="More detail">
          <a className="rlink" href={toHref('/projects')} onClick={(e) => goto(e, '/projects')}>
            <span className="rlink__label">Projects -&gt;</span>
            <span className="rlink__note">Hardware and software builds, with source</span>
          </a>
          <a className="rlink" href={toHref('/skills')} onClick={(e) => goto(e, '/skills')}>
            <span className="rlink__label">Skills -&gt;</span>
            <span className="rlink__note">The stack, mapped by domain</span>
          </a>
        </nav>
      </div>
    </div>
  )
}
