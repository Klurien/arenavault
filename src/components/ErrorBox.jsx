export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="spinner-wrap">
      <div className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  )
}

export default function ErrorBox({ message, onRetry }) {
  return (
    <div className="error-box">
      <p className="error-title">Something went wrong</p>
      <p className="error-msg">{message || 'Unknown error'}</p>
      {onRetry && (
        <button className="btn-primary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
