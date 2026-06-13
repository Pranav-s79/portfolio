import { useEffect, useRef } from 'react'
import { skillNodes, skillEdges } from '../data/portfolio.js'

// Canvas netlist. Nodes grouped by domain in four clusters, gently
// drifting. When a domain is active, its nodes brighten and spread,
// their edges thicken, and everything else dims and freezes.
// The graph encodes relationship, not self-assessed rank.

const CLUSTERS = {
  Silicon: { x: 0.27, y: 0.3 },
  Embedded: { x: 0.73, y: 0.3 },
  Robotics: { x: 0.73, y: 0.72 },
  'ML / Software': { x: 0.27, y: 0.72 },
}

const INK = '#1c1c1e'
const LINE = '#cfcdc4'
const ACCENT = '#4a7fa5'
const MUTED = '#6f6e68'

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

    // group nodes by domain and lay them out in a ring per cluster
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
      const ringR = Math.min(w, h) * 0.16

      // position nodes
      Object.values(nodes).forEach((n) => {
        const c = CLUSTERS[n.domain]
        const cx = c.x * w
        const cy = c.y * h
        const isActive = !active || n.domain === active
        const spread = active && n.domain === active ? 1.3 : 1
        const frozen = active && n.domain !== active
        const drift = frozen ? 0 : 1
        n.x =
          cx +
          Math.cos(n.ringAngle) * ringR * spread +
          Math.cos(t * 0.5 + n.phase) * n.driftR * drift
        n.y =
          cy +
          Math.sin(n.ringAngle) * ringR * spread +
          Math.sin(t * 0.4 + n.phase) * n.driftR * drift
        n._active = isActive
      })

      ctx.clearRect(0, 0, w, h)

      // edges
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
          ctx.globalAlpha = 0.5
          ctx.lineWidth = 1.4
        } else if (active) {
          ctx.strokeStyle = LINE
          ctx.globalAlpha = 0.08
          ctx.lineWidth = 1
        } else {
          ctx.strokeStyle = LINE
          ctx.globalAlpha = 0.5
          ctx.lineWidth = 1
        }
        ctx.stroke()
      })
      ctx.globalAlpha = 1

      // nodes + labels
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = '12px "JetBrains Mono", monospace'
      Object.values(nodes).forEach((n) => {
        const dim = active && !n._active
        const highlight = active && n._active

        ctx.globalAlpha = dim ? 0.1 : 1
        ctx.beginPath()
        ctx.arc(n.x, n.y, highlight ? 4.5 : 3.5, 0, Math.PI * 2)
        ctx.fillStyle = highlight ? ACCENT : INK
        ctx.fill()

        // label
        ctx.fillStyle = highlight ? INK : MUTED
        ctx.globalAlpha = dim ? 0.1 : highlight ? 1 : 0.75
        ctx.fillText(n.label, n.x, n.y - 13)
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
