// ============================================================
// Light / dark theme store.
//
// index.html sets <html data-theme> before first paint (no flash). This
// module keeps it in sync afterwards:
//   - an explicit choice is saved to localStorage and wins from then on
//   - with no saved choice, the OS preference is followed live
// ============================================================
import { useSyncExternalStore } from 'react'

const KEY = 'theme'
const META_COLORS = { light: '#F5F2EC', dark: '#191C1D' }
const listeners = new Set()

const media = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null

function readSaved() {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}

function systemTheme() {
  return media?.matches ? 'dark' : 'light'
}

export function getTheme() {
  if (typeof document === 'undefined') return 'light'
  const attr = document.documentElement.dataset.theme
  return attr === 'dark' || attr === 'light' ? attr : systemTheme()
}

function apply(theme, animate) {
  const root = document.documentElement
  // A short, opt-in color transition so the switch reads as one change,
  // not a flash. Skipped for reduced motion and for OS-driven changes.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (animate && !reduce) {
    root.classList.add('theme-switching')
    window.setTimeout(() => root.classList.remove('theme-switching'), 260)
  }
  root.dataset.theme = theme
  root.style.colorScheme = theme
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', META_COLORS[theme]))
  listeners.forEach((fn) => fn())
}

export function setTheme(theme) {
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    /* storage blocked: the choice still applies for this visit */
  }
  apply(theme, true)
}

export function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark')
}

// Follow the OS only while the visitor has not chosen explicitly.
media?.addEventListener('change', () => {
  if (!readSaved()) apply(systemTheme(), false)
})

function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useTheme() {
  return useSyncExternalStore(subscribe, getTheme, () => 'light')
}
