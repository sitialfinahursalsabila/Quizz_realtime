export default function Input({ label, hint, error, className = '', ...rest }) {
  return (
    <label className="field">
      {label && <span className="field-label">{label}</span>}
      <input className={`input ${className}`.trim()} {...rest} />
      {hint && !error && <span className="hint-text">{hint}</span>}
      {error && <p className="error-text">{error}</p>}
    </label>
  )
}
