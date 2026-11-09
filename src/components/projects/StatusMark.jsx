import { STATUS_LABEL } from '../../data/portfolio.js'

// One status signal used everywhere: a small mark plus text.
// filled = complete, copper = in progress, hollow = design stage.
export default function StatusMark({ status, withLabel = false }) {
  if (!status) return null
  return (
    <span className={`status status--${status}`}>
      <span className="status__dot" aria-hidden="true" />
      <span className={withLabel ? 'status__label' : 'sr-only'}>{STATUS_LABEL[status]}</span>
    </span>
  )
}
