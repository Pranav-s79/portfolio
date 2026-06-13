// ============================================================
// Base-path-aware routing helpers. The app routes in *logical* paths
// ('/', '/projects', …); the deployment base (e.g. '/portfolio/' on GitHub
// Pages, '/' elsewhere) is stripped when reading location and prepended when
// writing hrefs / pushState, so the rest of the app ignores the subpath.
// ============================================================

const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '') // '/portfolio' or ''

// logical path → full href the browser sees (with base)
export function toHref(path) {
  if (path === '/') return BASE ? `${BASE}/` : '/'
  return `${BASE}${path}`
}

// browser pathname → logical path (base + trailing slashes removed)
export function normalizePath(pathname) {
  let path = pathname
  if (BASE && (path === BASE || path.startsWith(`${BASE}/`))) {
    path = path.slice(BASE.length)
  }
  path = path.replace(/\/+$/, '')
  return path || '/'
}
