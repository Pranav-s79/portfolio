export const CARD_SIZES = {
  featured: { className: 'module--featured', flex: 1.55 },
  wide: { className: 'module--wide', flex: 1.25 },
  normal: { className: 'module--normal', flex: 1 },
  compact: { className: 'module--compact', flex: 0.78 },
  full: { className: 'module--full', flex: 1 },
}

const PROJECT_PRIORITY = {
  thermguard: 4,
  'haptic-portal': 3,
}

function textLength(value) {
  return typeof value === 'string' ? value.trim().length : 0
}

function listLength(value) {
  return Array.isArray(value) ? value.length : 0
}

function hasAnyMedia(project) {
  return Boolean(project.media) || listLength(project.mediaGallery) > 0
}

function priorityFor(project) {
  return PROJECT_PRIORITY[project.slug] || 0
}

export function projectLayoutWeight(project) {
  if (!project || typeof project !== 'object') {
    throw new TypeError('projectLayoutWeight requires a project object.')
  }

  const priorityWeight = priorityFor(project) * 4
  const mediaWeight = listLength(project.mediaGallery) > 0 ? 4 : project.media ? 3 : 0
  const categoryCount = listLength(project.categories)
  const categoryWeight = categoryCount >= 4 ? 2 : categoryCount >= 2 ? 1 : 0
  const detailWeight = textLength(project.what) >= 260 ? 2 : textLength(project.what) >= 160 ? 1 : 0
  const summaryWeight = textLength(project.oneLine) >= 72 ? 1 : 0
  const stackWeight = listLength(project.stack) >= 5 ? 1 : 0
  const skillWeight = listLength(project.skills) >= 4 ? 1 : 0
  const linkWeight = project.repo || project.demo ? 1 : 0

  return (
    priorityWeight +
    mediaWeight +
    categoryWeight +
    detailWeight +
    summaryWeight +
    stackWeight +
    skillWeight +
    linkWeight
  )
}

function sizeFor(project, rowLength) {
  const priority = priorityFor(project)

  if (rowLength === 1) return 'full'
  if (priority >= 4) return 'featured'
  if (priority >= 3 || hasAnyMedia(project) || projectLayoutWeight(project) >= 8) return 'wide'
  if (rowLength >= 3 && projectLayoutWeight(project) <= 1) return 'compact'
  return 'normal'
}

function nextRowLength(visibleProjects, index) {
  const remaining = visibleProjects.length - index
  if (remaining <= 1) return 1
  if (remaining === 2) return 2
  if (remaining === 4) return 2

  const first = visibleProjects[index]
  const second = visibleProjects[index + 1]
  const hasPinnedPair = priorityFor(first) >= 3 && priorityFor(second) >= 3

  if (hasPinnedPair) return 2
  return 3
}

function createLayoutItem(project, rowLength) {
  const size = sizeFor(project, rowLength)
  return {
    project,
    size,
    className: CARD_SIZES[size].className,
    flex: CARD_SIZES[size].flex,
  }
}

export function layoutRowsFor(visibleProjects) {
  if (!Array.isArray(visibleProjects)) {
    throw new TypeError('layoutRowsFor requires the visible project list.')
  }
  if (visibleProjects.length === 0) return []

  const rows = []
  for (let index = 0; index < visibleProjects.length;) {
    const rowLength = nextRowLength(visibleProjects, index)
    const rowProjects = visibleProjects.slice(index, index + rowLength)
    rows.push(rowProjects.map((project) => createLayoutItem(project, rowProjects.length)))
    index += rowProjects.length
  }

  return rows
}
