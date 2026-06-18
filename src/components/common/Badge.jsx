export default function Badge({ outline = false, children }) {
  return <span className={`badge ${outline ? 'badge-outline' : ''}`.trim()}>{children}</span>
}
