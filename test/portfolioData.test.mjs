import assert from 'node:assert/strict'
import test from 'node:test'

import {
  STATUS_LABEL,
  additionalProjects,
  experience,
  featuredProjects,
  projectBySlug,
  projects,
  routeMeta,
  sections,
} from '../src/data/portfolio.js'

test('featured set is the selected projects, in order, with POLITE held back', () => {
  assert.deepEqual(
    featuredProjects.map((p) => p.title),
    [
      'RV32I RISC-V Processor',
      'CrossLayer',
      'Regdrift',
      'Haptic Portal',
      'MCU Data Logger PCB',
    ],
  )
})

test('project slugs are unique and URL-safe', () => {
  const slugs = projects.map((p) => p.slug)
  assert.equal(new Set(slugs).size, slugs.length)
  for (const s of slugs) assert.match(s, /^[a-z0-9-]+$/)
})

test('every project has a known status', () => {
  for (const p of projects) assert.ok(STATUS_LABEL[p.status], `${p.slug} status "${p.status}"`)
})

test('every featured project has a complete case study', () => {
  for (const p of featuredProjects) {
    const cs = p.caseStudy
    assert.ok(cs, p.slug)
    assert.ok(cs.problem.length > 40, `${p.slug} problem`)
    assert.ok(cs.architecture.length > 0, `${p.slug} architecture`)
    assert.ok(cs.contribution.length > 0, `${p.slug} contribution`)
    assert.ok(cs.decisions.length > 0, `${p.slug} decisions`)
    assert.ok(cs.verification.length > 0, `${p.slug} verification`)
    assert.ok(cs.results?.text, `${p.slug} results`)
    assert.ok(cs.now, `${p.slug} status now`)
    assert.ok(Array.isArray(cs.next), `${p.slug} next steps`)
    assert.ok(p.facts?.length >= 2, `${p.slug} needs at least two key facts`)
    assert.ok(p.statusNote, `${p.slug} status note`)
  }
})

test('POLITE stays in the data but is never shown or routed', () => {
  const polite = projects.find((p) => p.slug === 'polite-accelerator')
  assert.ok(polite?.hidden)
  assert.equal(projectBySlug('polite-accelerator'), null)
  assert.ok(!additionalProjects.includes(polite))
})

test('only featured projects resolve to a case-study route', () => {
  for (const p of featuredProjects) assert.equal(projectBySlug(p.slug), p)
  for (const p of additionalProjects) assert.equal(projectBySlug(p.slug), null)
  assert.equal(projectBySlug('nope'), null)
})

test('external links are https', () => {
  for (const p of projects) {
    for (const url of [p.repo, p.demo].filter(Boolean)) assert.match(url, /^https:\/\//, `${p.slug}: ${url}`)
  }
})

test('every section route has metadata', () => {
  for (const path of Object.keys(sections)) {
    assert.ok(routeMeta[path]?.title, path)
    assert.ok(routeMeta[path]?.description, path)
  }
})

test('experience roles are worded as agreed', () => {
  const byId = Object.fromEntries(experience.map((e) => [e.id, e]))
  assert.equal(byId['aggies-create-consultancy'].role, 'Consultancy Team Member')
  assert.equal(byId['aggies-create-consultancy'].org, 'Aggies Create')
  assert.equal(byId['aggies-create-consultancy'].client, 'Shallow Sports Boats')
  assert.doesNotMatch(JSON.stringify(byId['aggies-create-consultancy']), /intern/i)
  assert.equal(byId['rev-silicon'].role, 'Treasurer & Architecture Team Member')
  assert.deepEqual(
    byId['rev-silicon'].groups.map((g) => g.label),
    ['Treasurer', 'Architecture'],
  )
  assert.doesNotMatch(JSON.stringify(byId['rev-silicon']), /tape-?out|led the|fabricated/i)
})
