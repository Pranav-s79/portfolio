import { Suspense, lazy, useRef, useState } from 'react'
import RobotFallback from '../components/robot/RobotFallback.jsx'
import { profile, shelfItems } from '../data/portfolio.js'

const RobotScene = lazy(() => import('../components/robot/RobotScene.jsx'))

function IconGitHub() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4M11 10v7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconEmail() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true" focusable="false">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const HOME_ARM_TARGETS = [
  { side: 'left', pose: 'experience' },
  { side: 'left', pose: 'research' },
  { side: 'left', pose: 'projects' },
  { side: 'right', pose: 'skills' },
  { side: 'right', pose: 'resume' },
]

// x in [-1,1] left to right, y in [-1,1] bottom to top.
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

  return (
    <section className={exiting ? 'home home--exiting' : 'home'}>
      <div className="home__intro">
        <p className="home__eyebrow rise" style={{ animationDelay: '60ms' }}>
          [ {profile.line3} ]
        </p>
        <h1 className="home__name rise" style={{ animationDelay: '140ms' }}>
          Pranav
          <br />
          Senthilkumar
        </h1>
        <p className="home__meta rise" style={{ animationDelay: '240ms' }}>
          {profile.line2}
        </p>
        <div className="home__socials rise" style={{ animationDelay: '300ms' }}>
          <a
            className="social-link"
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="GitHub"
          >
            <IconGitHub />
          </a>
          <a
            className="social-link"
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <IconLinkedIn />
          </a>
          <a
            className="social-link"
            href={`mailto:${profile.email}`}
            aria-label={`Email ${profile.email}`}
            title="Email"
          >
            <IconEmail />
          </a>
        </div>
      </div>

      <div className="home__robot">
        <Suspense fallback={<RobotFallback />}>
          <RobotScene ref={robotRef} variant="hero" />
        </Suspense>
      </div>

      <nav className="home__rail" aria-label="Sections">
        {shelfItems.map((item, i) => {
          const cls = [
            'rail-item',
            'rise',
            hovered === i ? 'rail-item--active' : '',
            slamming === i ? 'rail-item--slamming' : '',
            hovered != null && hovered !== i ? 'rail-item--dim' : '',
          ]
            .filter(Boolean)
            .join(' ')
          return (
            <button
              key={item.path}
              className={cls}
              style={{ animationDelay: `${380 + i * 90}ms` }}
              onMouseEnter={aim(i)}
              onMouseLeave={unaim}
              onFocus={aim(i)}
              onBlur={unaim}
              onClick={go(item.path, i)}
            >
              <span className="rail-item__index">0{i + 1}</span>
              <span className="rail-item__label">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <p className="model-credit rise" style={{ animationDelay: '980ms' }}>
        Robot model: Low Poly Humanoid Robot by Denys Almaral
      </p>
    </section>
  )
}
