# Project visuals

Drop one real image per project here. The expanded project view loads
`<base>/project-media/<slug>.jpg` and falls back to a clean neutral
placeholder until the file exists. No code change is needed once you add
the files.

> This folder is intentionally **not** named `projects/` — that would create a
> `dist/projects/` directory which shadows the `/projects` route on GitHub Pages.

Expected filenames (match `media` in `src/data/portfolio.js`):

- `haptic-portal.jpg`
- `gimbal-stabilizer.jpg`
- `pushup-analyzer.jpg`

Use a photo, CAD render, hardware shot, demo still, system diagram, or
interface screenshot. ~4:3 aspect works best; the frame uses `object-fit: cover`.
To use `.png` or `.webp` instead, update the `media` path in the data file.
