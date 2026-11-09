import { useState } from 'react'
import SkillGraph from '../components/SkillGraph.jsx'
import { skillDomains, skillLevels, skillNodes } from '../data/portfolio.js'

export default function Skills() {
  const [active, setActive] = useState(null)

  return (
    <div className="page page--wide">
      <header className="page-head">
        <h1 className="page__title">Skills</h1>
        <p className="page__lead">Hover or tap a domain to see how the tools connect.</p>
      </header>

      <div className="skills-stage">
        <div className="skills-side">
          <div className="domains">
            {skillDomains.map((d) => {
              const cls = [
                'domain',
                active === d ? 'domain--active' : '',
                active && active !== d ? 'domain--dim' : '',
              ]
                .filter(Boolean)
                .join(' ')
              return (
                <button
                  key={d}
                  type="button"
                  className={cls}
                  aria-pressed={active === d}
                  onMouseEnter={() => setActive(d)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(d)}
                  onBlur={() => setActive(null)}
                  // touch has no hover: tapping pins a domain, tapping again clears it
                  onClick={() => setActive((cur) => (cur === d ? null : d))}
                >
                  <span className="domain__label">{d}</span>
                </button>
              )
            })}
          </div>

          <div className="skill-legend">
            {skillLevels.map((level) => (
              <div className={`skill-legend__item skill-legend__item--${level.id}`} key={level.id}>
                <span className="skill-legend__mark" aria-hidden="true" />
                <div>
                  <p className="skill-legend__label">{level.label}</p>
                  <p className="skill-legend__note">{level.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="skill-graph">
          <SkillGraph activeDomain={active} />
        </div>

        {/* the canvas is decorative to assistive tech; this is its text version */}
        <ul className="sr-only">
          {skillDomains.map((d) => (
            <li key={d}>
              {d}:{' '}
              {skillNodes
                .filter((n) => n.domain === d)
                .map((n) => `${n.label} (${n.level})`)
                .join(', ')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
