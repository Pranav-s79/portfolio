export function clampUnit(value, fallback = 0) {
  const n = Number.isFinite(value) ? value : fallback
  return Math.max(-1, Math.min(1, n))
}

export function clampArmTarget(target = {}) {
  return {
    x: clampUnit(target.x, 0),
    y: clampUnit(target.y, 0),
  }
}

export function createPeakTracker(peak = 0.6) {
  let previous = 0
  let fired = false

  return {
    reset() {
      previous = 0
      fired = false
    },
    update(current, onPeak) {
      const progress = Math.max(0, Math.min(1, Number.isFinite(current) ? current : 0))
      if (!fired && previous < peak && progress >= peak) {
        fired = true
        onPeak?.()
      }
      previous = progress
      return fired
    },
    hasFired() {
      return fired
    },
  }
}

export function createThrowLock() {
  let active = false

  return {
    start() {
      if (active) return false
      active = true
      return true
    },
    finish() {
      active = false
    },
    isActive() {
      return active
    },
  }
}

export function safeInvoke(callback, onError) {
  if (!callback) return
  try {
    callback()
  } catch (error) {
    onError?.(error)
  }
}
