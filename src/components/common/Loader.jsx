export default function Loader({ message = 'Memuat…' }) {
  return (
    <div className="screen screen-center">
      <div className="loader">
        <span className="loader-spinner" aria-hidden="true" />
        <p>{message}</p>
      </div>
    </div>
  )
}
