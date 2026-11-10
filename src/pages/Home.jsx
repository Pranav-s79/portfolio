import { Suspense, lazy, useRef, useState } from 'react'
import RobotFallback from '../components/robot/RobotFallback.jsx'
import { IconFile, IconGitHub, IconLinkedIn } from '../components/icons.jsx'
import { profile, resumeDownloads, shelfItems } from '../data/portfolio.js'
import { toHref } from '../routing.js'

const RobotScene = lazy(() => import('../components/robot/RobotScene.jsx'))

const resumeHref = (href) => encodeURI(toHref(`/${href.replace(/^\/+/, '')}`))

const HOME_ARM_TARGETS = [
  { side: 'left', pose: 'experience' },
  { side: 'left', pose: 'research' },
  { side: 'left', pose: 'projects' },
  { side: 'right', pose: 'skills' },
]

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
    <section className={exiting ? 'home home--exiting' : 'home'} aria-labelledby="home-name">
      <div className="home__intro rise">
        <p className="home__eyebrow">[ {profile.focus} ]</p>
        <h1 className="home__name" id="home-name">
          Pranav
          <br />
          Senthilkumar
        </h1>
        <p className="home__meta">{profile.degree}</p>
        <p className="home__email">pranav.senthilkumar79[at]gmail.com</p>
        <div className="home__socials">
          <a className="social-link" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">
            <IconGitHub size={18} />
          </a>
          <a className="social-link" href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
            <IconLinkedIn size={18} />
          </a>
        </div>
        <div className="home__resumes">
          <p className="home__resumes-label">Resumes</p>
          <div className="home__resume-links">
            {resumeDownloads.map((resume) => (
              <a key={resume.label} className="home-resume" href={resumeHref(resume.href)} target="_blank" rel="noopener noreferrer">
                <span className="home-resume__icon" aria-hidden="true">
                  <IconFile size={15} />
                </span>
                <span className="home-resume__copy">
                  <strong>{resume.label.replace(' resume', '')}</strong>
                  <small>PDF document</small>
                </span>
                <span className="home-resume__arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
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
              <span className="rail-item__index" aria-hidden="true">
                0{i + 1}
              </span>
              <span className="rail-item__label">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <p className="model-credit">Robot model: Low Poly Humanoid Robot by Denys Almaral</p>
    </section>
  )
}
