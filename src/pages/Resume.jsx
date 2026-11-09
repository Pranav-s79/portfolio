import { experience, profile, publications, research, resume } from '../data/portfolio.js'
import { toHref } from '../routing.js'
import NoteList from '../components/NoteList.jsx'
import { IconFile } from '../components/icons.jsx'

// encodeURI so filenames containing spaces/commas resolve on every host
const resumeHref = (href) => {
  if (/^https?:\/\//.test(href)) return href
  return encodeURI(toHref(`/${href.replace(/^\/+/, '')}`))
}

function Section({ name, children }) {
  return (
    <section className="rsec">
      <h2 className="section-title">{name}</h2>
      {children}
    </section>
  )
}

function Entry({ head, org, when, where, notes, children }) {
  return (
    <article className="rentry">
      <div className="rentry__when">
        <span>{when}</span>
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

// Flatten an experience item into resume lines: summary first, then notes.
// Grouped notes keep their label ("In progress: …", "Treasurer: …") so
// ongoing work never reads as finished; "Done" needs no prefix.
const linesFor = (e) =>
  [
    e.summary,
    ...(e.notes || []),
    ...(e.groups || []).flatMap((g) => g.notes.map((n) => (g.label === 'Done' ? n : `${g.label}: ${n}`))),
  ].filter(Boolean)
const orgFor = (e) => (e.client ? `${e.org} · for ${e.client}` : e.org)

export default function Resume({ navigate }) {
  const work = experience.filter((e) => e.category === 'professional')
  const orgs = experience.filter((e) => e.category === 'leadership')

  const goto = (path) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    navigate(path)
  }

  return (
    <div className="page">
      <header className="page-head">
        <h1 className="page__title">Resume</h1>
        <div className="downloads">
          {resume.downloads.map((d) => (
            <a key={d.label} className="btn" href={resumeHref(d.href)} target="_blank" rel="noopener noreferrer">
              <IconFile size={16} /> {d.label} <span className="btn__note">PDF</span>
            </a>
          ))}
        </div>
        <p className="rcontact">
          <a className="textlink" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <a className="textlink" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a className="textlink" href={profile.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </p>
      </header>

      <Section name="Education">
        {resume.education.map((e) => (
          <Entry key={e.head} {...e}>
            {e.coursework?.length > 0 && (
              <p className="rentry__course">
                <span className="rentry__course-label">Coursework</span>
                {e.coursework.join(' · ')}
              </p>
            )}
          </Entry>
        ))}
      </Section>

      <Section name="Experience">
        {work.map((e) => (
          <Entry key={e.id} head={e.role} org={orgFor(e)} when={e.when} where={e.where} notes={linesFor(e)} />
        ))}
      </Section>

      <Section name="Research">
        {research.map((r) => (
          <Entry key={r.slug} head={r.role} org={r.org} when={r.when} where={r.where} notes={[r.summary, ...r.work]} />
        ))}
      </Section>

      <Section name="Publication">
        {publications.map((p) => (
          <Entry key={p.link} head={p.venue} when={p.year}>
            <p className="rentry__pub">
              {p.authors} “{p.title}.”{' '}
              <a className="textlink" href={p.link} target="_blank" rel="noopener noreferrer">
                {p.linkLabel}
              </a>
            </p>
          </Entry>
        ))}
      </Section>

      <Section name="Leadership">
        {orgs.map((e) => (
          <Entry key={e.id} head={e.role} org={orgFor(e)} when={e.when} where={e.where} notes={linesFor(e)} />
        ))}
      </Section>

      <Section name="Technical skills">
        {resume.skills.map((g) => (
          <article className="rentry rentry--tight" key={g.group}>
            <div className="rentry__when">
              <span>{g.group}</span>
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
        <a className="rlink" href={toHref('/projects')} onClick={goto('/projects')}>
          <span className="rlink__label">Projects →</span>
          <span className="rlink__note">Case studies with diagrams and verification output</span>
        </a>
        <a className="rlink" href={toHref('/skills')} onClick={goto('/skills')}>
          <span className="rlink__label">Skills →</span>
          <span className="rlink__note">The stack, mapped by domain</span>
        </a>
      </nav>
    </div>
  )
}
