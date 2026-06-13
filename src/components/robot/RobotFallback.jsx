// Lightweight placeholder while the GLB loads (or if WebGL is
// unavailable). A soft pulsing silhouette — no spinner, no text.
export default function RobotFallback({ failed = false }) {
  return (
    <div
      className={failed ? 'robot-fallback robot-fallback--static' : 'robot-fallback'}
      aria-hidden="true"
    >
      <div className="robot-fallback__figure">
        <span className="robot-fallback__head" />
        <span className="robot-fallback__torso" />
      </div>
    </div>
  )
}
