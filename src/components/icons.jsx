// Small stroke icons, shared across the nav, hero, and project pages.
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Svg({ size, children }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

export function IconGitHub({ size = 16 }) {
  return (
    <Svg size={size}>
      <path
        {...stroke}
        d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"
      />
    </Svg>
  )
}

export function IconLinkedIn({ size = 16 }) {
  return (
    <Svg size={size}>
      <rect {...stroke} x="3" y="3" width="18" height="18" rx="2" />
      <path {...stroke} d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4M11 10v7" />
    </Svg>
  )
}

export function IconMail({ size = 16 }) {
  return (
    <Svg size={size}>
      <rect {...stroke} x="3" y="5" width="18" height="14" rx="2" />
      <path {...stroke} d="m4 7 8 6 8-6" />
    </Svg>
  )
}

export function IconFile({ size = 16 }) {
  return (
    <Svg size={size}>
      <path {...stroke} d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path {...stroke} d="M14 3v5h5M9 13h6M9 17h6" />
    </Svg>
  )
}

export function IconExternal({ size = 15 }) {
  return (
    <Svg size={size}>
      <path {...stroke} d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
    </Svg>
  )
}

export function IconSun({ size = 17 }) {
  return (
    <Svg size={size}>
      <circle {...stroke} cx="12" cy="12" r="4" />
      <path {...stroke} d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
    </Svg>
  )
}

export function IconMoon({ size = 17 }) {
  return (
    <Svg size={size}>
      <path {...stroke} d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
    </Svg>
  )
}

export function IconMenu({ size = 18 }) {
  return (
    <Svg size={size}>
      <path {...stroke} d="M4 7h16M4 12h16M4 17h16" />
    </Svg>
  )
}

export function IconClose({ size = 18 }) {
  return (
    <Svg size={size}>
      <path {...stroke} d="M6 6l12 12M18 6 6 18" />
    </Svg>
  )
}
