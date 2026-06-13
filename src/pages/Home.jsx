import { Suspense, lazy, useRef, useState } from 'react'
import RobotFallback from '../components/robot/RobotFallback.jsx'
import { profile, shelfItems } from '../data/portfolio.js'

const RobotScene = lazy(() => import('../components/robot/RobotScene.jsx'))

const HOME_ARM_TARGETS = [
  { side: 'left', pose: 'research' },
  { side: 'left', pose: 'projects' },
  { side: 'right', pose: 'skills' },
  { side: 'right', pose: 'resume' },
  { side: 'right', pose: 'contact' },
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
