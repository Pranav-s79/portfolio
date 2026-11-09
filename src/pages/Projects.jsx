import { useRef, useState } from 'react'
import { projects, projectThemes } from '../data/portfolio.js'
import ProjectCard from '../components/projects/ProjectCard.jsx'
import ProjectModal from '../components/projects/ProjectModal.jsx'

const TABS = [{ id: 'all', label: 'All' }, ...projectThemes]

const inTheme = (id) => projects.filter((p) => p.theme === id)

export default function Projects() {
  const [tab, setTab] = useState('all')
  const [openSlug, setOpenSlug] = useState(null)
  const tabRefs = useRef({})

  const themes = tab === 'all' ? projectThemes : projectThemes.filter((t) => t.id === tab)
  // modal prev/next walks the projects in the order they are shown
  const visible = themes.flatMap((t) => inTheme(t.id))
  const open = visible.find((p) => p.slug === openSlug) || null
  const openIndex = open ? visible.indexOf(open) : -1
  const step = (d) => {
    const next = visible[openIndex + d]
    if (next) setOpenSlug(next.slug)
  }

  const count = (id) => (id === 'all' ? projects.length : inTheme(id).length)

  const onTabKey = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const i = TABS.findIndex((t) => t.id === tab)
    const next = TABS[(i + (e.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length]
    setTab(next.id)
    tabRefs.current[next.id]?.focus()
  }

  let delay = 260

  return (
    <div className="page fade-in">
      <header className="page-head">
        <p className="eyebrow rise" style={{ animationDelay: '40ms' }}>
          03 - projects
        </p>
        <h1 className="page__title rise" style={{ animationDelay: '110ms' }}>
          Projects
        </h1>
      </header>

      <div
        className="seg rise"
        style={{ animationDelay: '180ms' }}
        role="tablist"
        aria-label="Project theme"
        onKeyDown={onTabKey}
      >
        {TABS.map((t) => {
          const selected = t.id === tab
          return (
            <button
              key={t.id}
              ref={(n) => (tabRefs.current[t.id] = n)}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={selected}
              aria-controls="project-panel"
              tabIndex={selected ? 0 : -1}
              className="seg__tab"
              onClick={() => setTab(t.id)}
            >
              <span className="seg__label">{t.label}</span>
              {t.short && (
                <span className="seg__short" aria-hidden="true">
                  {t.short}
                </span>
              )}
              <span className="seg__count">{count(t.id)}</span>
            </button>
          )
        })}
      </div>

      {/* keyed on the tab so the entrance animation replays on switch */}
      <div id="project-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} key={tab}>
        {themes.map((theme) => (
          <section className="block" key={theme.id} aria-labelledby={`theme-${theme.id}`}>
            <div className="section-label">
              <h2 id={`theme-${theme.id}`} className="section-label__name">
                {theme.label}
              </h2>
              <span className="section-label__count mono">{theme.blurb}</span>
            </div>
            <div className="pgrid">
              {inTheme(theme.id).map((p) => (
                <ProjectCard
                  key={p.slug}
                  project={p}
                  onOpen={setOpenSlug}
                  style={{ animationDelay: `${(delay += 60)}ms` }}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {open && (
        <ProjectModal
          project={open}
          onClose={() => setOpenSlug(null)}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          hasPrev={openIndex > 0}
          hasNext={openIndex >= 0 && openIndex < visible.length - 1}
        />
      )}
    </div>
  )
}
