import { toggleTheme, useTheme } from '../theme.js'
import { IconMoon, IconSun } from './icons.jsx'

// Sun/moon switch. The label names the action, and aria-pressed reports
// whether dark mode is on, so screen readers get both.
export default function ThemeToggle() {
  const theme = useTheme()
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Dark theme"
      aria-pressed={dark}
      title={dark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {dark ? <IconSun /> : <IconMoon />}
    </button>
  )
}
