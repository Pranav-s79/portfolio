import { useState } from 'react'
import { resume } from '../data/portfolio.js'
import { toHref } from '../routing.js'

function Section({ name, open, onToggle, children }) {
  return (
    <section className="ds-section">
      <button className="ds-section__head" onClick={onToggle} aria-expanded={open}>
        <span className="ds-section__toggle">{open ? '[-]' : '[+]'}</span>
        <span className="ds-section__name">{name}</span>
      </button>
      <div className={open ? 'ds-section__body' : 'ds-section__body ds-section__body--closed'}>
        <div className="ds-section__inner">{children}</div>
      </div>
    </section>
  )
}

function Entry({ head, org, when, note, tags }) {
  return (
    <div className="ds-entry">
      <div className="ds-entry__row">
        <span className="ds-entry__head">{head}</span>
        <span className="ds-entry__when">{when}</span>
      </div>
      <p className="ds-entry__org">{org}</p>
      <p className="ds-entry__note">{note}</p>
      {tags && (
        <div className="chips">
          {tags.map((t) => (
            <span className="chip" key={t}>
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

const resumeHref = (href) => {
  if (/^https?:\/\//.test(href)) return href
  return toHref(`/${href.replace(/^\/+/, '')}`)
}

export default function Resume({ navigate }) {
  const [open, setOpen] = useState({
    education: true,
    experience: true,
    awards: true,
    projects: true,
    skills: true,
  })
  const toggle = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }))

  const goto = (e, path) => {
    e.preventDefault()
    navigate(path)
  }

  return (
    <div className="page fade-in">
      <header className="page-head">
        <p className="eyebrow rise" style={{ animationDelay: '40ms' }}>
          04 - resume
        </p>
        <div className="datasheet__top rise" style={{ animationDelay: '110ms' }}>
          <h1 className="page__title">Resume</h1>
          <div className="downloads">
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
        </div>
        <p className="page__lead rise" style={{ animationDelay: '180ms' }}>
          Pick the version that matches the role.
        </p>
      </header>

      <div className="rise" style={{ animationDelay: '260ms' }}>
        <Section name="Education" open={open.education} onToggle={() => toggle('education')}>
          {resume.education.map((e) => (
            <Entry key={e.head} {...e} />
          ))}
        </Section>

        <Section name="Experience" open={open.experience} onToggle={() => toggle('experience')}>
          {resume.experience.map((e) => (
            <Entry key={e.head} {...e} />
          ))}
        </Section>

        <Section name="Awards" open={open.awards} onToggle={() => toggle('awards')}>
          {resume.awards.map((e) => (
            <Entry key={`${e.head}-${e.when}`} {...e} />
          ))}
        </Section>

        <Section name="Projects" open={open.projects} onToggle={() => toggle('projects')}>
          <div className="ds-entry">
            <p className="ds-entry__note">
              Haptic Portal, ThermGuard, a 2DOF gimbal stabilizer, and a webcam push-up form
              analyzer. Full write-ups on the{' '}
              <a className="ds-inline-link" href={toHref('/projects')} onClick={(e) => goto(e, '/projects')}>
                projects page
              </a>
              .
            </p>
          </div>
        </Section>

        <Section name="Skills" open={open.skills} onToggle={() => toggle('skills')}>
          <div className="ds-entry">
            <p className="ds-entry__note">
              Embedded control, robotics, hardware design tools, and ML software. The focused graph
              is on the{' '}
              <a className="ds-inline-link" href={toHref('/skills')} onClick={(e) => goto(e, '/skills')}>
                skills page
              </a>
              .
            </p>
          </div>
        </Section>
      </div>
    </div>
  )
}
