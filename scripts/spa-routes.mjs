// GitHub Pages only serves files that exist, so a direct visit to /projects
// returns HTTP 404 (404.html then bounces it back into the app). Link
// previews and crawlers stop at that 404. Writing the built index.html into a
// folder per route makes every page a real 200, with its own title,
// description, and canonical URL for link previews. The client router takes
// over from there. Run after `vite build`.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { featuredProjects, profile, routeMeta } from '../src/data/portfolio.js'

const SITE = 'https://pranavsen.dev'
const index = 'dist/index.html'
if (!existsSync(index)) {
  console.error('spa-routes: dist/index.html not found - run vite build first')
  process.exit(1)
}
const html = readFileSync(index, 'utf8')

const escape = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const routes = [
  ...Object.entries(routeMeta)
    .filter(([path]) => path !== '/')
    .map(([path, m]) => ({ path, ...m })),
  ...featuredProjects.map((p) => ({ path: `/projects/${p.slug}`, title: p.title, description: p.oneLine })),
]

function withMeta(page, { path, title, description }) {
  const fullTitle = escape(`${title} · ${profile.name}`)
  const desc = escape(description)
  const url = `${SITE}${path}`
  return page
    .replace(/<title>[^<]*<\/title>/, `<title>${fullTitle}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${desc}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${fullTitle}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${desc}$2`)
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${url}$2`)
}

for (const route of routes) {
  const dir = `dist${route.path}`
  mkdirSync(dir, { recursive: true })
  writeFileSync(`${dir}/index.html`, withMeta(html, route))
}
console.log(`spa-routes: wrote ${routes.length} route entry points`)
