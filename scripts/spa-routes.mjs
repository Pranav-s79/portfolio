// GitHub Pages only serves files that exist, so a direct visit to /projects
// returns HTTP 404 (404.html then bounces it back into the app). Link
// previews and crawlers stop at that 404. Copying the built index.html into a
// folder per route makes every section a real 200 page; the client router
// takes over from there. Run after `vite build`.
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { sections } from '../src/data/portfolio.js'

const index = 'dist/index.html'
if (!existsSync(index)) {
  console.error('spa-routes: dist/index.html not found - run vite build first')
  process.exit(1)
}

for (const route of Object.keys(sections)) {
  const dir = `dist${route}`
  mkdirSync(dir, { recursive: true })
  copyFileSync(index, `${dir}/index.html`)
}
console.log(`spa-routes: wrote ${Object.keys(sections).length} route entry points`)
