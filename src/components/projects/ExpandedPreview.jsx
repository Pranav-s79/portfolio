// ============================================================
// Inline expanded state for a selected project. Clean two-column layout:
// left = one real project visual; right = summary, main skills, tech stack,
// and links. No metadata dashboard, no decorative graphics, no repeated
// project number — the title/category/year live in the module header above.
// ============================================================

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
          <p className="preview__line">{p.skills.join(' · ')}</p>
        </div>

        <div className="preview__group">
          <p className="preview__label mono">Tech stack</p>
          <p className="preview__line mono">{p.stack.join(' · ')}</p>
        </div>

        <div className="preview__actions">
          <a
            className="preview__action preview__action--primary mono"
            href={p.repo}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </a>
          {p.demo && (
            <a
              className="preview__action mono"
              href={p.demo}
              target="_blank"
              rel="noopener noreferrer"
            >
              View case study ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
