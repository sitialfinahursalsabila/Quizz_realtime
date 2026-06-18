export default function Select({ label, hint, options, className = '', ...rest }) {
  return (
    <label className="field">
      {label && <span className="field-label">{label}</span>}
      <select className={`input ${className}`.trim()} {...rest}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && <span className="hint-text">{hint}</span>}
    </label>
  )
}
