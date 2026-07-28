# Pranav Senthilkumar — Portfolio

A minimal, warm-light engineering portfolio. React 18 + Vite, with a
`@react-three/fiber` robot on the landing page and an interactive,
filterable projects page.

## Live site

Deployed on **GitHub Pages**, served at the domain root via a `CNAME` file
(base path `/`). The router, robot model, project media, and SPA fallback all
derive from `import.meta.env.BASE_URL`, so the app also works under a subpath
if `VITE_BASE_PATH` is set (see [Deploying elsewhere](#deploying-elsewhere)).

The contact form and its API (`api/contact.js`) are not currently wired up —
Pages is static-only and can't run serverless functions. That code is kept in
the repo for reference; see [Deployment (Vercel)](#deployment-vercel-contact-api-only)
if reviving it.

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

## Deployment (GitHub Pages)

- **Workflow:** [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)
  builds with `npm run build` and publishes `dist/` on every push to `main`.
- **CI gate:** [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs tests
  and a build on every push and PR, independent of the deploy workflow.
- **Custom domain:** [`public/CNAME`](public/CNAME) pins the Pages site to
  `pranavsen.dev`. Enable **Settings → Pages → Enforce HTTPS** in the repo once
  DNS has propagated, and point the domain's DNS at GitHub Pages (an `ALIAS`/`ANAME`
  or `A` records for the apex, plus a `CNAME` record for `www`).

### Deployment (Vercel, contact API only)

The contact form's backend (`api/contact.js`) is Vercel-shaped serverless code,
kept in the repo but not currently deployed. To use it, host it on Vercel
separately and point the frontend at it via `VITE_CONTACT_API_URL`.

- **Config:** [`vercel.json`](vercel.json) — build settings, SPA rewrite
  (excluding `/api/*`), security headers, and immutable caching for hashed assets.

### One-time setup

1. Import the repo at [vercel.com/new](https://vercel.com/new). The framework
   (Vite), build command, and output directory are picked up from `vercel.json`.
2. Add the environment variables below under **Settings → Environment Variables**.
3. Redeploy so the new variables take effect.

### Contact form

The form posts to the same-origin `/api/contact`. Requests pass through five
defense layers before an email is sent:

| Layer | Mechanism | Behavior if unconfigured |
| --- | --- | --- |
| Origin allowlist | `CONTACT_ALLOWED_ORIGIN` (comma-separated) | Any origin allowed |
| Honeypot | Hidden `website` field | Always active |
| Validation | Length, email format, control-char stripping, mail-header-injection guard, spam heuristics | Always active |
| CAPTCHA | Cloudflare Turnstile | Skipped |
| Rate limit | Upstash Redis, **3/hour and 10/day per IP** | Skipped (fails open) |

Honeypot and spam hits return `200 OK` so bots cannot probe the filter. Rate-limited
requests return `429` with a `Retry-After` header. The rate limiter fails *open*
if Redis is unreachable (a real message is never dropped over infrastructure
trouble); Turnstile fails *closed*, since an unverifiable token is exactly what
CAPTCHA defends against.

**Required environment variables** (see [`.env.example`](.env.example)):

```bash
# Secret — server side only
RESEND_API_KEY=re_...                      # resend.com/api-keys
CONTACT_TO_EMAIL=you@example.com
CONTACT_FROM_EMAIL="Portfolio Contact <contact@yourdomain.com>"
CONTACT_ALLOWED_ORIGIN=https://your-domain.com
TURNSTILE_SECRET_KEY=...                   # dash.cloudflare.com → Turnstile
UPSTASH_REDIS_REST_URL=...                 # console.upstash.com
UPSTASH_REDIS_REST_TOKEN=...

# Public — inlined into the client bundle
VITE_TURNSTILE_SITE_KEY=...
```

Until a domain is verified in Resend, the sandbox sender
`onboarding@resend.dev` works but only delivers to your own Resend account
email. Verify a domain to receive mail from arbitrary visitors.

### Deploying elsewhere

For a GitHub Pages *project site* under `/portfolio/` instead of a custom
domain, remove `public/CNAME`, build with `VITE_BASE_PATH=/portfolio/`, and set
`pathSegmentsToKeep = 1` in [`public/404.html`](public/404.html). Pages is
static-only, so the contact API must be hosted separately and pointed at via
`VITE_CONTACT_API_URL`.

### Project visuals

The expanded project card loads a real image from
[`public/project-media/`](public/project-media/) (`<slug>.jpg`) and falls back to a clean
neutral placeholder until the file exists. See that folder's README for
expected filenames.

### Custom domain

[`public/CNAME`](public/CNAME) already pins Pages to `pranavsen.dev`. Changing
domains means editing that file and updating DNS to point at GitHub Pages
instead. The base path stays `/`.
