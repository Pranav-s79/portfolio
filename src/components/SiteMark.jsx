// Site mark: a straight-bladed sword whose crossguard is drawn as a PCB
// trace between two solder pads, with a via for a pommel. Fills with
// currentColor so it follows the theme. Same geometry as public/favicon.svg.
export const MARK_PATHS = (
  <>
    <path d="M16 1.5 L19 5.5 V19 H13 V5.5 Z" />
    <rect x="8" y="19" width="16" height="2" />
    <rect x="4" y="18" width="4" height="4" />
    <rect x="24" y="18" width="4" height="4" />
    <rect x="14" y="21" width="4" height="5" />
    <path
      fillRule="evenodd"
      d="M16 25.25 A3 3 0 1 1 16 31.25 A3 3 0 1 1 16 25.25 Z M16 27 A1.25 1.25 0 1 0 16 29.5 A1.25 1.25 0 1 0 16 27 Z"
    />
  </>
)

export default function SiteMark({ size = 22, className = 'site-mark' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {MARK_PATHS}
    </svg>
  )
}
