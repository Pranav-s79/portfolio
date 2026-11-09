import NoteList from '../NoteList.jsx'
import { IconExternal, IconGitHub } from '../icons.jsx'
import ProjectMedia from './ProjectMedia.jsx'

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
          <p className="stat stat--lg">
            <span className="stat__value">{p.result.value}</span>
            <span className="stat__label">{p.result.label}</span>
          </p>
        )}

        {p.awards?.length > 0 && (
          <div className="pdetail__group">
            <p className="pdetail__label mono">Awards</p>
            <NoteList notes={p.awards} />
          </div>
        )}

        <div className="pdetail__group">
          <p className="pdetail__label mono">Built with</p>
          <ul className="tags">
            {p.stack.map((s) => (
              <li className="tag" key={s}>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {(p.repo || p.demo) && (
          <div className="pdetail__actions">
            {p.repo && (
              <a className="btn btn--primary" href={p.repo} target="_blank" rel="noopener noreferrer">
                <IconGitHub size={15} /> View source
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
