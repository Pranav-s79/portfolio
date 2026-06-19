import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { CARD_SIZES, layoutRowsFor, projectLayoutWeight } from '../src/projectLayout.js'

const hapticProject = {
  slug: 'haptic-portal',
  categories: ['Vision', 'Hardware', 'Embedded', 'Software'],
  mediaGallery: [{ src: 'prototype.png' }, { src: 'pipeline.png' }],
  oneLine: 'A complete hardware and software project with visual artifacts.',
  skills: ['Depth sensing', 'Hand tracking', 'Embedded output'],
  stack: ['Python', 'C++', 'DepthAI', 'MediaPipe', 'RPi Pico', 'Servo array'],
  what:
    'Designed software that maps camera depth and hand tracking into motor commands for a wearable haptic array, helping users feel nearby 3D space through touch.',
  repo: 'https://example.com/repo',
}

const thermalProject = {
  slug: 'thermguard',
  categories: ['Hardware', 'AI/ML'],
  media: null,
  oneLine:
    'A research project exploring calibrated ML-based thermal scheduling for many-core processors.',
  skills: ['Python', 'Machine Learning', 'Computer Architecture', 'Thermal Modeling'],
  stack: ['Python', 'scikit-learn', 'NumPy', 'Pandas', 'Matplotlib'],
  what:
    'Currently building a simulation framework that models heat propagation in multicore chips and trains machine learning models to predict future thermal risk from sparse sensor observations. The system compares traditional schedulers against calibrated uncertainty-aware scheduling policies under both normal and distribution-shifted workloads.',
  repo: 'https://github.com/Pranav-s79/HeadRoom',
}

const normalProject = {
  slug: 'normal',
  categories: ['Software'],
  oneLine: 'A verified RV32I-style ALU with directed and randomized tests.',
  skills: ['Verilog', 'RISC-V', 'Python'],
  stack: ['Verilog', 'Python', 'Icarus Verilog', 'GTKWave'],
  what:
    'Built a 32-bit combinational ALU and branch comparator for core RV32I operations, then verified edge cases with self-checking Verilog tests and Python-generated randomized reference vectors.',
  repo: 'https://example.com/normal',
}

const compactProject = {
  slug: 'compact',
  categories: ['Software'],
  oneLine: 'Small utility.',
  skills: ['C++'],
  stack: ['C++'],
  what: 'Built a concise utility.',
  repo: null,
}

function rowSlugs(row) {
  return row.map((item) => item.project.slug)
}

function rowSizes(row) {
  return row.map((item) => item.size)
}

describe('projectLayoutWeight', () => {
  it('uses project priority and metadata to emphasize current work', () => {
    assert.ok(projectLayoutWeight(thermalProject) > projectLayoutWeight(hapticProject))
    assert.ok(projectLayoutWeight(hapticProject) > projectLayoutWeight(normalProject))
    assert.ok(projectLayoutWeight(normalProject) > projectLayoutWeight(compactProject))
  })
})

describe('layoutRowsFor', () => {
  it('returns no rows for an empty filter result', () => {
    assert.deepEqual(layoutRowsFor([]), [])
  })

  it('makes a single filtered project full width', () => {
    const rows = layoutRowsFor([thermalProject])

    assert.deepEqual(rowSlugs(rows[0]), ['thermguard'])
    assert.deepEqual(rowSizes(rows[0]), ['full'])
  })

  it('keeps the pinned projects together while emphasizing ThermGuard', () => {
    const rows = layoutRowsFor([
      hapticProject,
      thermalProject,
      normalProject,
      compactProject,
      { ...compactProject, slug: 'compact-2' },
      { ...normalProject, slug: 'normal-2' },
    ])

    assert.deepEqual(rowSlugs(rows[0]), ['haptic-portal', 'thermguard'])
    assert.deepEqual(rowSizes(rows[0]), ['wide', 'featured'])
    assert.ok(CARD_SIZES.featured.flex > CARD_SIZES.wide.flex)
  })

  it('creates dynamic fully stretching row groups for odd counts', () => {
    const rows = layoutRowsFor([
      normalProject,
      compactProject,
      { ...compactProject, slug: 'compact-2' },
      { ...normalProject, slug: 'normal-2' },
      { ...compactProject, slug: 'compact-3' },
    ])

    assert.deepEqual(rows.map(rowSlugs), [
      ['normal', 'compact', 'compact-2'],
      ['normal-2', 'compact-3'],
    ])
    assert.deepEqual(rowSizes(rows[0]), ['normal', 'compact', 'compact'])
    assert.ok(rows.every((row) => row.every((item) => item.flex > 0)))
  })

  it('does not depend on the old static size field', () => {
    const projectWithStaticSize = { ...compactProject, slug: 'static-size', size: 'full' }
    const rows = layoutRowsFor([normalProject, projectWithStaticSize])

    assert.deepEqual(rowSizes(rows[0]), ['normal', 'normal'])
  })
})
