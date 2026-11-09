// Sword mark geometry, shared by the icon generator. Keep in sync with
// src/components/SiteMark.jsx (same paths, 32-unit grid).
export const MARK = `
  <path d="M16 1.5 L19 5.5 V19 H13 V5.5 Z"/>
  <rect x="8" y="19" width="16" height="2"/>
  <rect x="4" y="18" width="4" height="4"/>
  <rect x="24" y="18" width="4" height="4"/>
  <rect x="14" y="21" width="4" height="5"/>
  <path fill-rule="evenodd" d="M16 25.25 A3 3 0 1 1 16 31.25 A3 3 0 1 1 16 25.25 Z M16 27 A1.25 1.25 0 1 0 16 29.5 A1.25 1.25 0 1 0 16 27 Z"/>`

// Pixel-aligned 16 px version (16-unit grid, tile included). At this size
// the via hole and the half-pixel blade edges blur, so they are snapped.
export const MARK_16 = `
  <path d="M8 1 L9 2.5 V9 H7 V2.5 Z"/>
  <rect x="4" y="9" width="8" height="1"/>
  <rect x="2" y="8" width="2" height="3"/>
  <rect x="12" y="8" width="2" height="3"/>
  <rect x="7" y="10" width="2" height="2"/>
  <rect x="6" y="12" width="4" height="2"/>`

export const COLORS = {
  copperLight: '#987047', // on light grounds
  copperDark: '#C3A17D', // on dark grounds
  copperDeep: '#8C6640', // on the ivory tile
  charcoal: '#232323',
  graphite: '#191C1D',
  ivory: '#F2EEE7',
}

// Sword scaled into a 32-unit tile, centered on the blade axis.
export const inTile = (scale, fill) => {
  const tx = 16 - 16 * scale
  const ty = 16 - 16.375 * scale
  return `<g fill="${fill}" transform="translate(${tx.toFixed(3)} ${ty.toFixed(3)}) scale(${scale})">${MARK}</g>`
}
