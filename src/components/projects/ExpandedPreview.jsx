import { IconExternal, IconGitHub } from '../icons.jsx'
import ProjectMedia from './ProjectMedia.jsx'

// Body of the quick-look dialog used for additional (non-featured) projects.
export default function ExpandedPreview({ project: p }) {
  const hasMedia = p.mediaGallery?.length > 0

  return (
    <div className={hasMedia ? 'pdetail pdetail--media' : 'pdetail'}>
      {hasMedia && (
        <div className="pdetail__media">
          <ProjectMedia project={p} />
        </div>
      )}

      <div className="pdetail__body">
        <p className="pdetail__one">{p.overview}</p>

        {p.result && (
          <p className="stat">
            <span className="stat__value">{p.result.value}</span>
            <span className="stat__label">{p.result.label}</span>
          </p>
        )}

        <p className="pdetail__stack">
          <span className="pdetail__label">Built with</span>
          {p.stack.join(' · ')}
        </p>

        {(p.repo || p.demo) && (
          <div className="pdetail__actions">
            {p.repo && (
              <a className="btn btn--primary" href={p.repo} target="_blank" rel="noopener noreferrer">
                <IconGitHub size={15} /> Source on GitHub
              </a>
            )}
            {p.demo && (
              <a className="btn" href={p.demo} target="_blank" rel="noopener noreferrer">
                <IconExternal size={14} /> {p.demoLabel || 'Website'}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
