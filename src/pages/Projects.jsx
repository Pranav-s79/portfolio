import { useMemo, useState } from 'react'
import { projects, projectCategories } from '../data/portfolio.js'
import ProjectFilters from '../components/projects/ProjectFilters.jsx'
import ProjectModule from '../components/projects/ProjectModule.jsx'
import ProjectModal from '../components/projects/ProjectModal.jsx'

const FILTERS = ['All', ...projectCategories]

// keep the page recognizable: same 02 — PROJECTS eyebrow + heading, same
// background atmosphere, same three projects — presented as an asymmetric
// editorial set of modules. Clicking a module opens a centered project card.
export default function Projects() {
  const [filter, setFilter] = useState('All')
  const [openSlug, setOpenSlug] = useState(null) // project shown in the modal
  const [hoverNum, setHoverNum] = useState(null) // for the index rail

  // stable index per project (P01..P03) regardless of filtering
  const indexed = useMemo(() => projects.map((p, i) => ({ ...p, _index: i })), [])

  const matches = (p) => filter === 'All' || p.categories.includes(filter)
  const visible = indexed.filter(matches)
  const open = indexed.find((p) => p.slug === openSlug) || null
  const openVisibleIndex = open ? visible.findIndex((p) => p.slug === open.slug) : -1

  const onOpen = (slug) => setOpenSlug(slug)
  const close = () => setOpenSlug(null)
  const stepProject = (step) => {
    if (openVisibleIndex < 0 || visible.length < 2) return
    const next = visible[(openVisibleIndex + step + visible.length) % visible.length]
    setOpenSlug(next.slug)
  }

  return (
    <div className="page projects-page fade-in">
      <header className="page-head">
        <p className="eyebrow rise" style={{ animationDelay: '40ms' }}>
          02 — projects
        </p>
        <h1 className="page__title rise" style={{ animationDelay: '110ms' }}>
          Projects
        </h1>
        <p className="page__lead rise" style={{ animationDelay: '180ms' }}>
          Three builds, one signal path: sense, process, act.
        </p>
      </header>

      <div className="rise" style={{ animationDelay: '230ms' }}>
        <ProjectFilters
          filters={FILTERS}
          active={filter}
          onChange={setFilter}
          count={visible.length}
        />
      </div>

      <div className="projects-stage">
        {/* compact vertical index rail — secondary, hidden on small screens */}
        <nav className="index-rail" aria-label="Project index">
          {indexed.map((p) => {
            const shown = matches(p)
            const isActive = openSlug === p.slug || hoverNum === p.slug
            return (
              <button
                key={p.slug}
                type="button"
                className={`index-rail__num mono${isActive ? ' is-active' : ''}${
                  shown ? '' : ' is-off'
                }`}
                disabled={!shown}
                aria-label={`Focus ${p.title}`}
                onMouseEnter={() => setHoverNum(p.slug)}
                onMouseLeave={() => setHoverNum(null)}
                onClick={() => shown && onOpen(p.slug)}
              >
                {String(p._index + 1).padStart(2, '0')}
                <span className="index-rail__mark" aria-hidden="true" />
              </button>
            )
          })}
        </nav>

        <div className="modules" data-count={visible.length}>
          {indexed.map((p, i) => {
            const shown = matches(p)
            return (
              <ProjectModule
                key={p.slug}
                project={p}
                index={p._index}
                dimmed={false}
                onOpen={onOpen}
                style={{
                  animationDelay: `${300 + i * 90}ms`,
                  // filtered-out modules collapse out of flow
                  display: shown ? undefined : 'none',
                }}
              />
            )
          })}
        </div>
      </div>

      {open && (
        <ProjectModal
          project={open}
          index={open._index}
          onClose={close}
          onPrev={() => stepProject(-1)}
          onNext={() => stepProject(1)}
          hasNavigation={visible.length > 1}
        />
      )}
    </div>
  )
}
