import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Deployed to GitHub Pages as the *project site* https://pranav-s79.github.io/portfolio/,
// so the base path is '/portfolio/'. All runtime paths (router, robot GLB,
// project media, SPA fallback) derive from this via import.meta.env.BASE_URL.
// For a user site (Pranav-s79.github.io) or a custom domain, set base to '/'
// and 404.html's pathSegmentsToKeep to 0.
export default defineConfig({
  base: '/portfolio/',
  plugins: [react()],
})
