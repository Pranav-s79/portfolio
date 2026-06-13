import { useState } from 'react'
import SkillGraph from '../components/SkillGraph.jsx'
import { skillDomains, skillLevels } from '../data/portfolio.js'

export default function Skills() {
  const [active, setActive] = useState(null)

  return (
    <div className="page fade-in">
      <header className="page-head">
        <p className="eyebrow rise" style={{ animationDelay: '40ms' }}>
          03 - skills
        </p>
        <h1 className="page__title rise" style={{ animationDelay: '110ms' }}>
          Skills
        </h1>
        <p className="page__lead rise" style={{ animationDelay: '180ms' }}>
          Focused tools across embedded control, robotics, hardware, and ML software.
        </p>
      </header>

      <div className="skills-stage">
        <div className="skills-side">
          <div className="domains" role="list">
            {skillDomains.map((d, i) => {
              const cls = [
                'domain',
                'rise',
                active === d ? 'domain--active' : '',
                active && active !== d ? 'domain--dim' : '',
              ]
                .filter(Boolean)
                .join(' ')
              return (
                <button
                  key={d}
                  className={cls}
                  style={{ animationDelay: `${260 + i * 80}ms` }}
                  onMouseEnter={() => setActive(d)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(d)}
                  onBlur={() => setActive(null)}
                >
                  <span className="domain__index">D0{i + 1}</span>
                  <span className="domain__label">{d}</span>
                </button>
              )
            })}
          </div>

          <div className="skill-legend rise" style={{ animationDelay: '620ms' }}>
            {skillLevels.map((level) => (
              <div className={`skill-legend__item skill-legend__item--${level.id}`} key={level.id}>
                <span className="skill-legend__mark" aria-hidden="true" />
                <div>
                  <p className="skill-legend__label mono">{level.label}</p>
                  <p className="skill-legend__note">{level.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="skill-graph rise" style={{ animationDelay: '340ms' }}>
          <SkillGraph activeDomain={active} />
        </div>
      </div>
    </div>
  )
}
