import ProjectMedia from './ProjectMedia.jsx'

export default function ExpandedPreview({ project }) {
  const p = project
  return (
    <div className="preview">
      <div className="preview__visual">
        <ProjectMedia project={p} />
      </div>

      <div className="preview__body">
        <p className="preview__overview">{p.what}</p>

        <div className="preview__group">
          <p className="preview__label mono">Main skills</p>
          <p className="preview__line">{p.skills.join(' - ')}</p>
        </div>

        <div className="preview__group">
          <p className="preview__label mono">Tech stack</p>
          <p className="preview__line mono">{p.stack.join(' - ')}</p>
        </div>

        <div className="preview__actions">
          <a
            className="preview__action preview__action--primary mono"
            href={p.repo}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub -&gt;
          </a>
          {p.demo && (
            <a
              className="preview__action mono"
              href={p.demo}
              target="_blank"
              rel="noopener noreferrer"
            >
              {p.demoLabel || 'Website'} -&gt;
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
