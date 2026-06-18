/**
 * Button generik dipakai di seluruh app supaya gaya tombol konsisten
 * dan gak copy-paste className di setiap halaman.
 */
export default function Button({ variant = 'primary', block = false, className = '', children, ...rest }) {
  const variantClass = variant === 'ghost' ? 'btn-ghost' : 'btn-primary'
  const blockClass = block ? 'btn-block' : ''

  return (
    <button type="button" className={`btn ${variantClass} ${blockClass} ${className}`.trim()} {...rest}>
      {children}
    </button>
  )
}
