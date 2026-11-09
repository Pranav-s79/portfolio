// Generates every icon and the Open Graph image from the sword geometry in
// mark.mjs. Run: node scripts/brand/build-icons.mjs
// Needs the Playwright Chromium that `npm i` already installs; Pillow (Python)
// is used only to pack favicon.ico.
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { chromium } from 'playwright'
import { COLORS, MARK, MARK_16, inTile } from './mark.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const pub = (p) => resolve(root, 'public', p)
const tmp = resolve(root, 'node_modules/.cache/brand')
mkdirSync(tmp, { recursive: true })
mkdirSync(pub('brand'), { recursive: true })

// ---- SVG assets ---------------------------------------------------------
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <style>
    .tile { fill: ${COLORS.charcoal} }
    .mark { fill: ${COLORS.copperDark} }
    @media (prefers-color-scheme: dark) {
      .tile { fill: ${COLORS.ivory} }
      .mark { fill: ${COLORS.copperDeep} }
    }
  </style>
  <rect class="tile" width="32" height="32" rx="7"/>
  <g class="mark" transform="translate(3.52 3.228) scale(0.78)">${MARK}</g>
</svg>
`
writeFileSync(pub('favicon.svg'), favicon)

const standalone = (fill, label) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="${label}">
  <g fill="${fill}">${MARK}</g>
</svg>
`
writeFileSync(pub('brand/mark-light.svg'), standalone(COLORS.copperLight, 'Pranav Senthilkumar'))
writeFileSync(pub('brand/mark-dark.svg'), standalone(COLORS.copperDark, 'Pranav Senthilkumar'))

// ---- rasters -------------------------------------------------------------
const tileSvg = (size, { rounded = true, scale = 0.78 } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
    <rect width="32" height="32" rx="${rounded ? 7 : 0}" fill="${COLORS.charcoal}"/>
    ${inTile(scale, COLORS.copperDark)}
  </svg>`

const tile16 = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" shape-rendering="crispEdges">
  <rect width="16" height="16" rx="3.5" fill="${COLORS.charcoal}" shape-rendering="geometricPrecision"/>
  <g fill="${COLORS.copperDark}">${MARK_16}</g>
</svg>`

const browser = await chromium.launch()
const page = await browser.newPage({ deviceScaleFactor: 1 })

async function svgToPng(svg, size, out) {
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(
    `<html><body style="margin:0;background:transparent">${svg.replace(/width="\d+" height="\d+"/, `width="${size}" height="${size}"`)}</body></html>`,
  )
  await page.locator('svg').screenshot({ path: out, omitBackground: true })
}

await svgToPng(tile16, 16, `${tmp}/16.png`)
await svgToPng(tileSvg(32), 32, `${tmp}/32.png`)
await svgToPng(tileSvg(48), 48, `${tmp}/48.png`)
await svgToPng(tileSvg(32), 32, pub('favicon-32.png'))
// Platforms round these themselves, so they are full-bleed squares.
await svgToPng(tileSvg(180, { rounded: false, scale: 0.66 }), 180, pub('apple-touch-icon.png'))
await svgToPng(tileSvg(192, { rounded: false, scale: 0.62 }), 192, pub('icon-192.png'))
await svgToPng(tileSvg(512, { rounded: false, scale: 0.62 }), 512, pub('icon-512.png'))

// ---- Open Graph image ----------------------------------------------------
const og = readFileSync(resolve(root, 'scripts/brand/og.html'), 'utf8').replace('%MARK%', MARK)
await page.setViewportSize({ width: 1200, height: 630 })
await page.setContent(og, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: pub('og-image.png') })

await browser.close()

// ---- favicon.ico (16/32/48) ---------------------------------------------
execFileSync('python', [
  '-c',
  `from PIL import Image
imgs=[Image.open(r"${tmp}/%d.png" % s).convert("RGBA") for s in (16,32,48)]
imgs[2].save(r"${pub('favicon.ico')}", format="ICO", sizes=[(16,16),(32,32),(48,48)], append_images=imgs[:2])`,
])

console.log('icons: favicon.svg, favicon.ico, favicon-32.png, apple-touch-icon.png, icon-192/512.png, brand/*.svg, og-image.png')
