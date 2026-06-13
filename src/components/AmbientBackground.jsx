import { useEffect, useRef } from 'react'

// Full-viewport ambient layer behind everything:
//  - slow-drifting dust motes (canvas 2D) with pointer parallax
//  - two very slow blurred color blobs (CSS)
// Tinted ink / copper / steel-blue so the background never reads flat white.

const TINTS = [
  [40, 52, 78], // ink-blue
  [74, 110, 165], // steel blue
  [60, 70, 92], // slate
  [120, 150, 190], // pale blue
  [168, 112, 61], // copper (rare)
]

export default function AmbientBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    let w = 0
    let h = 0
    let dpr = 1

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const COUNT = Math.min(520, Math.floor((w * h) / 3600))
    const motes = Array.from({ length: COUNT }, () => {
      const depth = 0.25 + Math.random() * 0.75
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: (0.5 + Math.random() * 1.8) * depth,
        depth,
        speed: (4 + Math.random() * 9) * depth, // px per second, upward
        phase: Math.random() * Math.PI * 2,
        wobble: 8 + Math.random() * 18,
        tint: TINTS[Math.floor(Math.random() * TINTS.length)],
        alpha: 0.06 + Math.random() * 0.16,
      }
    })

    // slow-drifting horizontal "scan" lines — faint atmospheric structure
    const LINE_COUNT = Math.min(7, Math.max(4, Math.floor(h / 160)))
    const lines = Array.from({ length: LINE_COUNT }, () => ({
      y: Math.random() * h,
      speed: (3 + Math.random() * 7) * (Math.random() < 0.5 ? 1 : -1),
      len: 0.3 + Math.random() * 0.45, // fraction of width
      xphase: Math.random() * Math.PI * 2,
      alpha: 0.04 + Math.random() * 0.06,
      tilt: (Math.random() - 0.5) * 26,
    }))

    // pointer parallax — deeper motes shift more
    let px = 0.5
    let py = 0.5
    let sx = 0.5
    let sy = 0.5
    const onPointer = (e) => {
      px = e.clientX / w
      py = e.clientY / h
    }
    window.addEventListener('pointermove', onPointer)

    let frameId = 0
    let last = performance.now()

    const draw = (now) => {
      frameId = requestAnimationFrame(draw)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const t = now / 1000

      sx += (px - sx) * 0.04
      sy += (py - sy) * 0.04

      ctx.clearRect(0, 0, w, h)

      // drifting lines (behind the motes)
      lines.forEach((ln) => {
        if (!reduced) {
          ln.y += ln.speed * dt
          if (ln.y < -20) ln.y = h + 20
          if (ln.y > h + 20) ln.y = -20
        }
        const cx = (0.5 + Math.sin(t * 0.15 + ln.xphase) * 0.16) * w
        const half = (ln.len * w) / 2
        const yoff = (sy - 0.5) * 12
        const x0 = cx - half
        const x1 = cx + half
        const grad = ctx.createLinearGradient(x0, 0, x1, 0)
        grad.addColorStop(0, 'rgba(120,150,190,0)')
        grad.addColorStop(0.5, `rgba(120,150,190,${ln.alpha})`)
        grad.addColorStop(1, 'rgba(120,150,190,0)')
        ctx.strokeStyle = grad
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x0, ln.y + yoff)
        ctx.lineTo(x1, ln.y + yoff + ln.tilt)
        ctx.stroke()
      })

      motes.forEach((m) => {
        if (!reduced) {
          m.y -= m.speed * dt
          if (m.y < -8) {
            m.y = h + 8
            m.x = Math.random() * w
          }
        }
        const wob = Math.sin(t * 0.4 + m.phase) * m.wobble
        const ox = (sx - 0.5) * 30 * m.depth
        const oy = (sy - 0.5) * 18 * m.depth
        const [r, g, b] = m.tint
        ctx.beginPath()
        ctx.arc(m.x + wob + ox, m.y + oy, m.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${m.alpha})`
        ctx.fill()
      })
    }
    frameId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient__blob ambient__blob--a" />
      <div className="ambient__blob ambient__blob--b" />
      <canvas ref={canvasRef} className="ambient__motes" />
    </div>
  )
}
