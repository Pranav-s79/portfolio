import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
//
// Base path is deploy-target dependent, so it is resolved from the environment:
//   - Vercel (production): served at the domain root -> '/'
//   - GitHub Pages project site: served under /portfolio/ -> set
//     VITE_BASE_PATH=/portfolio/ (and 404.html pathSegmentsToKeep to 1).
//
// All runtime paths (router, robot GLB, project media, SPA fallback) derive
// from this via import.meta.env.BASE_URL, so nothing else needs to change.
export default defineConfig(() => {
  const base = process.env.VITE_BASE_PATH || '/'

  return {
    base,
    plugins: [react()],
    build: {
      outDir: 'dist',
      sourcemap: false,
      // Three.js is large and changes rarely; splitting it keeps the app
      // chunk small so content edits don't bust the whole cache.
      rollupOptions: {
        output: {
          manualChunks: {
            three: ['three', '@react-three/fiber', '@react-three/drei'],
          },
        },
      },
    },
  }
})
