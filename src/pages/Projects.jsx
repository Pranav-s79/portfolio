import { useMemo, useState } from 'react'
import { projects, projectCategories } from '../data/portfolio.js'
import ProjectFilters from '../components/projects/ProjectFilters.jsx'
import ProjectModule from '../components/projects/ProjectModule.jsx'
import ProjectModal from '../components/projects/ProjectModal.jsx'

const FILTERS = ['All', ...projectCategories]
const LAYOUTS = {
  1: ['full'],
  2: ['lg', 'tall'],
  3: ['lg', 'tall', 'full'],
  4: ['lg', 'tall', 'wide', 'wide'],
  5: ['lg', 'tall', 'wide', 'wide', 'full'],
}

function layoutSizeFor(count, index, preferred) {
  const preset = LAYOUTS[count]
  if (preset) return preset[index]
  const repeating = ['lg', 'tall', 'wide', 'wide', 'tall', 'lg']
  return repeating[index % repeating.length] || preferred || 'wide'
}

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const [openSlug, setOpenSlug] = useState(null)
  const [hoverNum, setHoverNum] = useState(null)

  const indexed = useMemo(() => projects.map((p, i) => ({ ...p, _index: i })), [])

  const matches = (p) => filter === 'All' || p.categories.includes(filter)
  const visible = indexed.filter(matches)
  const open = indexed.find((p) => p.slug === openSlug) || null
  const openVisibleIndex = open ? visible.findIndex((p) => p.slug === open.slug) : -1

  const onOpen = (slug) => setOpenSlug(slug)
  const close = () => setOpenSlug(null)
  const stepProject = (step) => {
    if (openVisibleIndex < 0 || visible.length < 2) return
    const next = visible[openVisibleIndex + step]
    if (next) setOpenSlug(next.slug)
  }

  return (
    <div className="page projects-page fade-in">
      <header className="page-head">
        <p className="eyebrow rise" style={{ animationDelay: '40ms' }}>
          02 - projects
        </p>
        <h1 className="page__title rise" style={{ animationDelay: '110ms' }}>
          Projects
        </h1>
        <p className="page__lead rise" style={{ animationDelay: '180ms' }}>
          Hardware and software builds with clear inputs, logic, and output.
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
          {visible.map((p, i) => {
            return (
              <ProjectModule
                key={p.slug}
                project={{ ...p, layoutSize: layoutSizeFor(visible.length, i, p.size) }}
                index={p._index}
                dimmed={false}
                onOpen={onOpen}
                style={{
                  animationDelay: `${300 + i * 90}ms`,
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
          hasPrev={openVisibleIndex > 0}
          hasNext={openVisibleIndex >= 0 && openVisibleIndex < visible.length - 1}
        />
      )}
    </div>
  )
}
