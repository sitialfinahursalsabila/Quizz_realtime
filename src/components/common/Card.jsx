export default function Card({ size = 'narrow', className = '', children }) {
  const sizeClass = size === 'wide' ? 'card-wide' : 'card-narrow'
  return <div className={`card ${sizeClass} ${className}`.trim()}>{children}</div>
}
