import assert from 'node:assert/strict'
import fs from 'node:fs'
import { describe, it } from 'node:test'
import {
  clampArmTarget,
  createPeakTracker,
  createThrowLock,
  safeInvoke,
} from '../src/components/robot/robotLogic.js'

describe('robot logic', () => {
  it('keeps a fallback component for loading or WebGL failure', () => {
    const source = fs.readFileSync('src/components/robot/RobotFallback.jsx', 'utf8')
    assert.match(source, /robot-fallback/)
    assert.match(source, /robot-fallback__figure/)
  })

  it('clamps arm targets to normalized screen coordinates', () => {
    assert.deepEqual(clampArmTarget({ x: 4, y: -9 }), { x: 1, y: -1 })
    assert.deepEqual(clampArmTarget({ x: Number.NaN, y: undefined }), { x: 0, y: 0 })
  })

  it('fires peak exactly once when progress crosses 60 percent', () => {
    const tracker = createPeakTracker(0.6)
    let count = 0
    tracker.update(0.2, () => { count += 1 })
    tracker.update(0.59, () => { count += 1 })
    tracker.update(0.61, () => { count += 1 })
    tracker.update(0.9, () => { count += 1 })
    assert.equal(count, 1)
    assert.equal(tracker.hasFired(), true)
  })

  it('resets peak tracking for the next throw', () => {
    const tracker = createPeakTracker(0.6)
    let count = 0
    tracker.update(0.8, () => { count += 1 })
    tracker.reset()
    tracker.update(0.7, () => { count += 1 })
    assert.equal(count, 2)
  })

  it('prevents overlapping throw starts until finished', () => {
    const lock = createThrowLock()
    assert.equal(lock.start(), true)
    assert.equal(lock.start(), false)
    assert.equal(lock.isActive(), true)
    lock.finish()
    assert.equal(lock.start(), true)
  })

  it('captures callback errors without throwing through animation code', () => {
    let caught = null
    safeInvoke(
      () => {
        throw new Error('callback failed')
      },
      (error) => {
        caught = error
      }
    )
    assert.equal(caught.message, 'callback failed')
  })
})
