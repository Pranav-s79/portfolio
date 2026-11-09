import { STATUS_LABEL, featuredProjects } from '../data/portfolio.js'
import { toHref } from '../routing.js'
import { DIAGRAMS } from '../components/diagrams/Diagrams.jsx'
import ProjectMedia from '../components/projects/ProjectMedia.jsx'
import StatusMark from '../components/projects/StatusMark.jsx'
import { IconExternal, IconGitHub } from '../components/icons.jsx'

const SECTIONS = [
  ['problem', 'Problem'],
  ['architecture', 'Architecture'],
  ['contribution', 'My contribution'],
  ['decisions', 'Decisions and tradeoffs'],
  ['verification', 'Verification'],
  ['results', 'Results'],
  ['status', 'Status and next steps'],
]

function Section({ id, title, children }) {
  return (
    <section className="case__section" id={id} aria-labelledby={`${id}-h`}>
      <h2 className="case__h2" id={`${id}-h`}>
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function ProjectDetail({ project: p, navigate }) {
  const cs = p.caseStudy
  const Diagram = p.diagram ? DIAGRAMS[p.diagram] : null
  const i = featuredProjects.indexOf(p)
  const prev = featuredProjects[i - 1]
  const next = featuredProjects[i + 1]

  const go = (to) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    navigate(to)
  }

  return (
    <article className="page case">
      <a className="case__back" href={toHref('/projects')} onClick={go('/projects')}>
        ← Projects
      </a>

      <header className="case__head">
        <p className="case__meta">
          <StatusMark status={p.status} withLabel />
          <span className="case__meta-sep" aria-hidden="true" />
          <span>{p.when}</span>
          <span className="case__meta-sep" aria-hidden="true" />
          <span>{p.role}</span>
        </p>
        <h1 className="case__title">{p.title}</h1>
        <p className="case__lead">{p.oneLine}</p>
        {(p.repo || p.demo) && (
          <p className="case__links">
            {p.repo && (
              <a className="btn btn--primary" href={p.repo} target="_blank" rel="noopener noreferrer">
                <IconGitHub size={16} /> Source on GitHub
              </a>
            )}
            {p.demo && (
              <a className="btn" href={p.demo} target="_blank" rel="noopener noreferrer">
                <IconExternal size={15} /> {p.demoLabel}
              </a>
            )}
          </p>
        )}
        <dl className="facts facts--head">
          {p.facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="case__layout">
        <nav className="case__toc" aria-label="On this page">
          <p className="case__toc-title">On this page</p>
          <ol>
            {SECTIONS.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`}>{label}</a>
              </li>
            ))}
          </ol>
          <p className="case__toc-stack">
            <span className="case__toc-title">Built with</span>
            {p.stack.join(' · ')}
          </p>
        </nav>

        <div className="case__content">
          <Section id="problem" title="Problem">
            <p className="case__p">{cs.problem}</p>
          </Section>

          <Section id="architecture" title="Architecture">
            {cs.architecture.map((t) => (
              <p className="case__p" key={t}>
                {t}
              </p>
            ))}
            {Diagram && (
              <figure className="case__figure">
                <Diagram />
                {cs.diagramCaption && <figcaption>{cs.diagramCaption}</figcaption>}
              </figure>
            )}
            {p.mediaGallery?.length > 0 && (
              <div className="case__figure">
                <ProjectMedia project={p} />
              </div>
            )}
          </Section>

          <Section id="contribution" title="My contribution">
            {cs.contribution.length === 1 ? (
              <p className="case__p">{cs.contribution[0]}</p>
            ) : (
              <ul className="case__list">
                {cs.contribution.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
          </Section>

          <Section id="decisions" title="Decisions and tradeoffs">
            <dl className="decisions">
              {cs.decisions.map((d) => (
                <div className="decision" key={d.title}>
                  <dt>{d.title}</dt>
                  <dd>{d.body}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section id="verification" title="Verification">
            {cs.verificationIntro && <p className="case__p">{cs.verificationIntro}</p>}
            <ul className="case__list">
              {cs.verification.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            {cs.output && (
              <figure className="case__figure">
                <pre className="term" tabIndex={0} aria-label={`Output: ${cs.output.label}`}>
                  {cs.output.lines.map((line, n) => (
                    <span
                      key={n}
                      className={
                        /\bFAIL\b|BREAKING/.test(line) && !/expect FAIL/.test(line)
                          ? 'term__line term__bad'
                          : /PASS|MET|PASSED/.test(line)
                            ? 'term__line term__ok'
                            : 'term__line'
                      }
                    >
                      {line || ' '}
                    </span>
                  ))}
                </pre>
                <figcaption>{cs.output.label}</figcaption>
              </figure>
            )}
          </Section>

          <Section id="results" title="Results">
            <p className="case__p">{cs.results.text}</p>
            {cs.results.table && (
              <table className="spec">
                <tbody>
                  {cs.results.table.map(([k, v]) => (
                    <tr key={k}>
                      <th scope="row">{k}</th>
                      <td>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {p.awards?.length > 0 && (
              <ul className="case__list">
                {p.awards.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            )}
          </Section>

          <Section id="status" title="Status and next steps">
            <p className="case__p">
              <strong className="case__state">{STATUS_LABEL[p.status]}.</strong> {cs.now}
            </p>
            {cs.next.length > 0 && (
              <ol className="case__list case__list--steps">
                {cs.next.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ol>
            )}
          </Section>
        </div>
      </div>

      <nav className="case__pager" aria-label="More projects">
        {prev ? (
          <a href={toHref(`/projects/${prev.slug}`)} onClick={go(`/projects/${prev.slug}`)}>
            <span className="case__pager-dir">← Previous</span>
            <span className="case__pager-title">{prev.title}</span>
          </a>
        ) : (
          <span />
        )}
        {next ? (
          <a className="case__pager-next" href={toHref(`/projects/${next.slug}`)} onClick={go(`/projects/${next.slug}`)}>
            <span className="case__pager-dir">Next →</span>
            <span className="case__pager-title">{next.title}</span>
          </a>
        ) : (
          <a className="case__pager-next" href={toHref('/projects#additional')} onClick={go('/projects#additional')}>
            <span className="case__pager-dir">More →</span>
            <span className="case__pager-title">Additional projects</span>
          </a>
        )}
      </nav>
    </article>
  )
}
