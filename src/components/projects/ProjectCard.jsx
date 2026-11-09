import { IconExternal, IconGitHub } from '../icons.jsx'

// The whole card opens the detail view (the title button's ::after stretches
// over the card); the GitHub / demo links sit above that layer so a recruiter
// can jump straight to source without opening anything.
export default function ProjectCard({ project: p, onOpen, style }) {
  const award = !p.status && p.awards?.length > 0

  return (
    <article className="pcard rise" style={style}>
      <div className="pcard__top">
        <span className="pcard__when mono">{p.when}</span>
        {p.status && <span className="badge mono">{p.status}</span>}
        {award && <span className="badge badge--award mono">Award winner</span>}
      </div>

      <h3 className="pcard__title">
        <button
          type="button"
          className="pcard__open"
          aria-haspopup="dialog"
          onClick={() => onOpen(p.slug)}
        >
          {p.title}
        </button>
      </h3>
      <p className="pcard__one">{p.oneLine}</p>

      <div className="pcard__foot">
        <ul className="tags" aria-label="Main technologies">
          {p.stack.map((s) => (
            <li className="tag" key={s}>
              {s}
            </li>
          ))}
        </ul>
        <span className="pcard__links">
          {p.repo && (
            <a
              className="iconlink"
              href={p.repo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${p.title} source on GitHub`}
              title="Source on GitHub"
            >
              <IconGitHub />
            </a>
          )}
          {p.demo && (
            <a
              className="iconlink"
              href={p.demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${p.title} ${p.demoLabel || 'website'}`}
              title={p.demoLabel || 'Website'}
            >
              <IconExternal />
            </a>
          )}
          <span className="pcard__arrow mono" aria-hidden="true">
            -&gt;
          </span>
        </span>
      </div>
    </article>
  )
}
