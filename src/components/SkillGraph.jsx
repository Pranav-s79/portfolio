import { useEffect, useRef } from 'react'
import { skillEdges, skillNodes } from '../data/portfolio.js'

// Wide canvases get a 2x2 constellation; narrow ones stack the four domains in
// a single column so long labels have the full width to breathe.
const CLUSTERS = {
  Hardware: { x: 0.27, y: 0.3 },
  Embedded: { x: 0.73, y: 0.3 },
  Robotics: { x: 0.73, y: 0.72 },
  'Software / ML': { x: 0.27, y: 0.72 },
}

const CLUSTERS_NARROW = {
  Hardware: { x: 0.5, y: 0.13 },
  Embedded: { x: 0.5, y: 0.38 },
  Robotics: { x: 0.5, y: 0.63 },
  'Software / ML': { x: 0.5, y: 0.88 },
}

const INK = '#1c1c1e'
const LINE = '#cfcdc4'
const ACCENT = '#4a7fa5'
const COPPER = '#a8703d'
const MUTED = '#6f6e68'

const clamp = (v, lo, hi) => (hi < lo ? (lo + hi) / 2 : Math.min(Math.max(v, lo), hi))

export default function SkillGraph({ activeDomain = null }) {
  const canvasRef = useRef(null)
  const activeRef = useRef(activeDomain)

  useEffect(() => {
    activeRef.current = activeDomain
  }, [activeDomain])

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas.parentElement
    const ctx = canvas.getContext('2d')

    let w = 0
    let h = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const byDomain = {}
    skillNodes.forEach((n) => {
      ;(byDomain[n.domain] ||= []).push(n)
    })

    const nodes = {}
    Object.entries(byDomain).forEach(([domain, list]) => {
      list.forEach((n, i) => {
        const a = (i / list.length) * Math.PI * 2
        nodes[n.id] = {
          ...n,
          ringAngle: a,
          phase: Math.random() * Math.PI * 2,
          driftR: 6 + Math.random() * 6,
          x: 0,
          y: 0,
        }
      })
    })

    const resize = () => {
      w = parent.clientWidth
      h = parent.clientHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(parent)

    const start = performance.now()
    let frameId = 0

    const draw = () => {
      frameId = requestAnimationFrame(draw)
      const t = (performance.now() - start) / 1000
      const active = activeRef.current

      // Narrow canvases (phones) stack the clusters and use a wide, flat ring:
      // horizontal room is what long labels need, vertical room is what is scarce.
      const narrow = w < 620
      const clusters = narrow ? CLUSTERS_NARROW : CLUSTERS
      const fontSize = narrow ? 10 : 12
      const ringRx = narrow ? w * 0.23 : Math.min(w, h) * 0.16
      const ringRy = narrow ? h * 0.072 : Math.min(w, h) * 0.16
      const driftScale = narrow ? 0.45 : 1
      const labelLift = narrow ? 11 : 14
      const pad = 6

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`

      Object.values(nodes).forEach((n) => {
        const c = clusters[n.domain]
        if (!c) return
        const cx = c.x * w
        const cy = c.y * h
        const isActive = !active || n.domain === active
        const spread = active && n.domain === active ? 1.3 : 1
        const frozen = active && n.domain !== active
        const drift = frozen ? 0 : driftScale
        const x =
          cx +
          Math.cos(n.ringAngle) * ringRx * spread +
          Math.cos(t * 0.5 + n.phase) * n.driftR * drift
        const y =
          cy +
          Math.sin(n.ringAngle) * ringRy * spread +
          Math.sin(t * 0.4 + n.phase) * n.driftR * drift

        // labels sit above nodes in the top half of a ring and below in the
        // bottom half, which keeps same-cluster labels off each other
        n._below = narrow && Math.sin(n.ringAngle) > 0.3

        // keep the whole label inside the canvas, not just the node dot
        const half = ctx.measureText(n.label).width / 2
        n.x = clamp(x, half + pad, w - half - pad)
        n.y = clamp(y, labelLift + fontSize + pad, h - labelLift - fontSize - pad)
        n._active = isActive
      })

      ctx.clearRect(0, 0, w, h)

      skillEdges.forEach(([a, b]) => {
        const na = nodes[a]
        const nb = nodes[b]
        if (!na || !nb) return
        const bothActive = na._active && nb._active && active
        ctx.beginPath()
        ctx.moveTo(na.x, na.y)
        ctx.lineTo(nb.x, nb.y)
        if (bothActive) {
          ctx.strokeStyle = ACCENT
          ctx.globalAlpha = 0.48
          ctx.lineWidth = 1.4
        } else if (active) {
          ctx.strokeStyle = LINE
          ctx.globalAlpha = 0.08
          ctx.lineWidth = 1
        } else {
          ctx.strokeStyle = LINE
          ctx.globalAlpha = 0.46
          ctx.lineWidth = 1
        }
        ctx.stroke()
      })
      ctx.globalAlpha = 1

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      Object.values(nodes).forEach((n) => {
        const dim = active && !n._active
        const highlight = active && n._active
        const isLearning = n.level === 'learning'
        const nodeColor = isLearning ? COPPER : INK

        ctx.globalAlpha = dim ? 0.1 : 1
        ctx.beginPath()
        ctx.arc(n.x, n.y, highlight ? 5 : 4, 0, Math.PI * 2)
        ctx.fillStyle = highlight ? ACCENT : nodeColor
        ctx.fill()

        if (isLearning) {
          ctx.beginPath()
          ctx.arc(n.x, n.y, highlight ? 8 : 7, 0, Math.PI * 2)
          ctx.strokeStyle = COPPER
          ctx.globalAlpha = dim ? 0.08 : 0.58
          ctx.lineWidth = 1
          ctx.stroke()
        }

        ctx.fillStyle = highlight ? INK : MUTED
        ctx.globalAlpha = dim ? 0.1 : highlight ? 1 : 0.78
        ctx.fillText(n.label, n.x, n.y + (n._below ? labelLift + 2 : -labelLift))
      })
      ctx.globalAlpha = 1
    }
    draw()

    return () => {
      cancelAnimationFrame(frameId)
      ro.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" />
}
