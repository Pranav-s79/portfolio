# Pranav Senthilkumar — Portfolio

A minimal, warm-light engineering portfolio. React 18 + Vite, with a
`@react-three/fiber` robot on the landing page and an interactive,
filterable projects page.

## Live site

**https://pranav-s79.github.io/portfolio/**

(GitHub Pages *project site* — served under `/portfolio/`, so the Vite base
path is `/portfolio/`. Router, robot model, project media, and the SPA
fallback all derive from `import.meta.env.BASE_URL`.)

## Develop

```bash
npm install
npm run dev        # local dev server
npm test           # node --test unit tests
npm run build      # production build → dist/
npm run preview    # serve the production build locally
```

There is no separate lint or type-check step (plain JS, no ESLint/TS config);
`npm run build` is the type/integration gate.

## Deployment (GitHub Pages via GitHub Actions)

- **Workflow:** [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)
- **Trigger:** push to `main`, or manual *Run workflow* (workflow_dispatch)
- **Build command:** `npm run build`
- **Output folder:** `dist`
- **Package manager:** npm (uses `package-lock.json` via `npm ci`)

The workflow installs with `npm ci`, builds, uploads `dist/` as a Pages
artifact, and deploys with the official `actions/deploy-pages`.

### One-time repository setup

In the GitHub repository:

**Settings → Pages → Build and deployment → Source → GitHub Actions**

This must be set once, manually — it cannot be enabled from CI. After that,
every push to `main` deploys automatically.

### Client-side routing on Pages

The app uses clean URLs (`/portfolio/projects`, `/portfolio/skills`, …) with a
small base-aware history router. GitHub Pages has no server to rewrite unknown
paths, so a refresh or direct hit on `/portfolio/projects` would 404. This is
handled with the standard SPA fallback (`pathSegmentsToKeep = 1` keeps the
`/portfolio` base segment):

- [`public/404.html`](public/404.html) encodes the requested path into a query
  string and redirects to the app root.
- An inline decoder in [`index.html`](index.html) restores the real path before
  React mounts, so the router resolves the route normally.

No server-side functionality is used; the site is fully static.

### Project visuals

The expanded project card loads a real image from
[`public/project-media/`](public/project-media/) (`<slug>.jpg`) and falls back to a clean
neutral placeholder until the file exists. See that folder's README for
expected filenames.

### Custom domain (optional)

To use a custom domain, add a `CNAME` file in `public/` containing the domain,
configure DNS, and set it under Settings → Pages. The base path stays `/`.
