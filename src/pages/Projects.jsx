import { useEffect, useRef, useState } from 'react'
import { additionalProjects, featuredProjects } from '../data/portfolio.js'
import { toHref } from '../routing.js'
import ProjectModal from '../components/projects/ProjectModal.jsx'
import StatusMark from '../components/projects/StatusMark.jsx'
import { DatapathGlyph, PeArrayGlyph } from '../components/diagrams/Diagrams.jsx'
import { IconExternal, IconGitHub } from '../components/icons.jsx'

const VISUALS = {
  'polite-accelerator': <PeArrayGlyph />,
  'riscv-processor': <DatapathGlyph />,
  crosslayer: (
    <pre className="term term--card" aria-hidden="true">
      <span className="term__dim">$ crosslayer suite reference</span>
      {'\n'}  MET  baseline     PASS
      {'\n'}  MET  silent_drop  FAIL
      {'\n'}  MET  reorder      FAIL
      {'\n'}<span className="term__ok">result    PASSED</span>
    </pre>
  ),
}

function useLink(navigate) {
  return (to) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    navigate(to)
  }
}

function Facts({ facts, className }) {
  if (!facts?.length) return null
  return (
    <dl className={className}>
      {facts.map((f) => (
        <div key={f.label}>
          <dt>{f.label}</dt>
          <dd>{f.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function Feature({ project: p, lead, onLink }) {
  const href = `/projects/${p.slug}`
  return (
    <article className={lead ? 'feature feature--lead' : 'feature'}>
      <div className="feature__visual">{VISUALS[p.slug]}</div>
      <div className="feature__body">
        <p className="feature__meta">
          <StatusMark status={p.status} />
          <span>{p.statusNote}</span>
        </p>
        <h3 className="feature__title">
          <a href={toHref(href)} onClick={onLink(href)} className="stretch">
            {p.title}
          </a>
        </h3>
        <p className="feature__one">{p.oneLine}</p>
        <Facts facts={lead ? p.facts : p.facts.slice(0, 2)} className="facts" />
        <p className="feature__foot">
          <span className="feature__stack">{p.stack.join(' · ')}</span>
          <span className="feature__when">{p.when}</span>
        </p>
      </div>
    </article>
  )
}

function Compact({ project: p, onLink }) {
  const href = `/projects/${p.slug}`
  return (
    <article className="compact">
      <p className="feature__meta">
        <StatusMark status={p.status} />
        <span>{p.statusNote}</span>
      </p>
      <h3 className="compact__title">
        <a href={toHref(href)} onClick={onLink(href)} className="stretch">
          {p.title}
        </a>
      </h3>
      <p className="compact__one">{p.oneLine}</p>
      <p className="compact__fact">
        <span className="compact__value">{p.facts[0].value}</span> {p.facts[0].label}
      </p>
      <p className="feature__foot">
        <span className="feature__stack">{p.stack.slice(0, 2).join(' · ')}</span>
        <span className="feature__when">{p.when}</span>
      </p>
    </article>
  )
}

export default function Projects({ navigate }) {
  const onLink = useLink(navigate)
  const [showMore, setShowMore] = useState(() => window.location.hash === '#additional')
  const [openSlug, setOpenSlug] = useState(null)
  const moreHeading = useRef(null)
  const justOpened = useRef(false)

  const primary = featuredProjects.slice(0, 3)
  const secondary = featuredProjects.slice(3)

  const open = additionalProjects.find((p) => p.slug === openSlug) || null
  const openIndex = open ? additionalProjects.indexOf(open) : -1
  const step = (d) => {
    const next = additionalProjects[openIndex + d]
    if (next) setOpenSlug(next.slug)
  }

  const toggleMore = () => {
    const next = !showMore
    setShowMore(next)
    justOpened.current = next
    // keep the state in the URL so the expanded list survives a refresh
    window.history.replaceState(window.history.state, '', next ? '#additional' : window.location.pathname)
  }

  // arriving at /projects#additional (e.g. from a case study's "More" link)
  useEffect(() => {
    if (window.location.hash === '#additional') moreHeading.current?.scrollIntoView({ block: 'start' })
  }, [])

  useEffect(() => {
    if (showMore && justOpened.current) {
      justOpened.current = false
      moreHeading.current?.focus({ preventScroll: true })
      moreHeading.current?.scrollIntoView({ block: 'start' })
    }
  }, [showMore])

  return (
    <div className="page page--wide">
      <header className="page-head">
        <h1 className="page__title">Projects</h1>
        <p className="page__lead">
          Processors and accelerators, the tools that check them, and the boards and firmware underneath.
        </p>
      </header>

      <section className="featured" aria-labelledby="featured-title">
        <h2 className="section-title" id="featured-title">
          Featured
        </h2>

        <div className="featured__primary">
          {primary.map((p, i) => (
            <Feature key={p.slug} project={p} lead={i === 0} onLink={onLink} />
          ))}
        </div>

        <div className="featured__secondary">
          {secondary.map((p) => (
            <Compact key={p.slug} project={p} onLink={onLink} />
          ))}
        </div>

        <div className="featured__more">
          <button
            type="button"
            className="more-btn"
            aria-expanded={showMore}
            aria-controls="additional"
            onClick={toggleMore}
          >
            {showMore ? 'Hide additional projects' : 'Additional projects'}
            <span className="more-btn__arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </section>

      <section className="additional" id="additional" hidden={!showMore} aria-labelledby="additional-title">
        <h2 className="section-title" id="additional-title" tabIndex={-1} ref={moreHeading}>
          Additional projects
        </h2>
        <ul className="plist">
          {additionalProjects.map((p) => (
            <li className="plist__row" key={p.slug}>
              <span className="plist__when">{p.when}</span>
              <div className="plist__main">
                <h3 className="plist__title">
                  <button type="button" className="stretch" aria-haspopup="dialog" onClick={() => setOpenSlug(p.slug)}>
                    {p.title}
                  </button>
                </h3>
                <p className="plist__one">{p.oneLine}</p>
              </div>
              <span className="plist__links">
                {p.status === 'in-progress' && <StatusMark status={p.status} withLabel />}
                {p.repo && (
                  <a
                    className="icon-btn"
                    href={p.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${p.title} source on GitHub`}
                  >
                    <IconGitHub size={16} />
                  </a>
                )}
                {p.demo && (
                  <a className="icon-btn" href={p.demo} target="_blank" rel="noopener noreferrer" aria-label={`${p.title} website`}>
                    <IconExternal size={15} />
                  </a>
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {open && (
        <ProjectModal
          project={open}
          onClose={() => setOpenSlug(null)}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          hasPrev={openIndex > 0}
          hasNext={openIndex >= 0 && openIndex < additionalProjects.length - 1}
        />
      )}
    </div>
  )
}
