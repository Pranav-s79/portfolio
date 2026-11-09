import { Suspense, lazy, useRef, useState } from 'react'
import RobotFallback from '../components/robot/RobotFallback.jsx'
import { IconFile, IconGitHub, IconLinkedIn, IconMail } from '../components/icons.jsx'
import { STATUS_LABEL, featuredProjects, profile, shelfItems } from '../data/portfolio.js'
import { toHref } from '../routing.js'

const RobotScene = lazy(() => import('../components/robot/RobotScene.jsx'))

const HOME_ARM_TARGETS = [
  { side: 'left', pose: 'experience' },
  { side: 'left', pose: 'research' },
  { side: 'left', pose: 'projects' },
  { side: 'right', pose: 'skills' },
  { side: 'right', pose: 'resume' },
]

// The three projects that best show the direction: architecture, silicon, verification.
const CURRENT = featuredProjects.slice(0, 3)

export default function Home({ navigate }) {
  const robotRef = useRef(null)
  const activeArm = useRef(null)
  const [hovered, setHovered] = useState(null)
  const [slamming, setSlamming] = useState(null)
  const [exiting, setExiting] = useState(false)
  const navigating = useRef(false)

  const aim = (i) => () => {
    setHovered(i)
    const target = HOME_ARM_TARGETS[i]
    if (!target) return
    if (activeArm.current && activeArm.current !== target.side) {
      robotRef.current?.clearArmAim(activeArm.current)
    }
    activeArm.current = target.side
    robotRef.current?.aimArm(target.side, target)
  }

  const unaim = () => {
    setHovered(null)
    if (activeArm.current) {
      robotRef.current?.clearArmAim(activeArm.current)
      activeArm.current = null
    }
  }

  const go = (path, i) => () => {
    if (navigating.current) return
    navigating.current = true
    const target = HOME_ARM_TARGETS[i]
    if (!target) {
      navigate(path)
      return
    }
    activeArm.current = target.side
    setHovered(i)
    setSlamming(i)
    robotRef.current?.aimArm(target.side, target)
    const result = robotRef.current?.slamArm(target.side, target, {
      onImpact: () => setExiting(true),
      onComplete: () => navigate(path),
    })
    if (!result?.ok) {
      setExiting(true)
      window.setTimeout(() => navigate(path), 220)
    }
  }

  const link = (to) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    navigate(to)
  }

  return (
    <section className={exiting ? 'home home--exiting' : 'home'} aria-labelledby="home-name">
      <div className="home__intro rise">
        <p className="home__focus">{profile.focus}</p>
        <h1 className="home__name" id="home-name">
          Pranav
          <br />
          Senthilkumar
        </h1>
        <p className="home__tagline">{profile.tagline}</p>
        <p className="home__text">{profile.intro}</p>
        <p className="home__meta">{profile.degree}</p>
        <ul className="home__links" aria-label="Links">
          <li>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              <IconGitHub size={16} /> GitHub
            </a>
          </li>
          <li>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              <IconLinkedIn size={16} /> LinkedIn
            </a>
          </li>
          <li>
            <a href={toHref('/resume')} onClick={link('/resume')}>
              <IconFile size={16} /> Resume
            </a>
          </li>
          <li>
            <a href={`mailto:${profile.email}`} aria-label={`Email ${profile.email}`}>
              <IconMail size={16} /> Email
            </a>
          </li>
        </ul>
      </div>

      <aside className="home__now rise" aria-labelledby="now-title">
        <h2 className="home__now-title" id="now-title">
          Current work
        </h2>
        <ol className="home__now-list">
          {CURRENT.map((p) => (
            <li key={p.slug}>
              <a href={toHref(`/projects/${p.slug}`)} onClick={link(`/projects/${p.slug}`)}>
                <span className="home__now-name">{p.title}</span>
                <span className="home__now-note">{p.statusNote || STATUS_LABEL[p.status]}</span>
              </a>
            </li>
          ))}
        </ol>
        <a className="home__now-all" href={toHref('/projects')} onClick={link('/projects')}>
          All projects →
        </a>
      </aside>

      <div className="home__robot">
        <Suspense fallback={<RobotFallback />}>
          <RobotScene ref={robotRef} variant="hero" />
        </Suspense>
      </div>

      <nav className="home__rail" aria-label="Sections">
        {shelfItems.map((item, i) => {
          const cls = [
            'rail-item',
            hovered === i ? 'rail-item--active' : '',
            slamming === i ? 'rail-item--slamming' : '',
            hovered != null && hovered !== i ? 'rail-item--dim' : '',
          ]
            .filter(Boolean)
            .join(' ')
          return (
            <button
              key={item.path}
              type="button"
              className={cls}
              onMouseEnter={aim(i)}
              onMouseLeave={unaim}
              onFocus={aim(i)}
              onBlur={unaim}
              onClick={go(item.path, i)}
            >
              {item.label}
            </button>
          )
        })}
      </nav>

      <p className="model-credit">Robot model: Low Poly Humanoid Robot by Denys Almaral</p>
    </section>
  )
}
