import { useState } from 'react'

export default function Login({ onLogin }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = name.trim()
    if (trimmed.length < 3) {
      setError('Nama minimal 3 karakter ya.')
      return
    }
    setError('')
    onLogin(trimmed)
  }

  return (
    <div className="screen screen-center">
      <div className="card card-narrow login-card">
        <div className="brand">
          <span className="brand-mark">⚡</span>
          <span className="brand-name">QuizDash</span>
        </div>
        <p className="subtitle">Masuk dulu sebelum mulai adu cepat & adu tepat.</p>

        <form onSubmit={handleSubmit} className="form">
          <label className="field">
            <span className="field-label">Nama Peserta</span>
            <input
              className="input"
              type="text"
              autoFocus
              placeholder="Contoh: Siti Alfinahur"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn btn-primary btn-block">
            Masuk
          </button>
        </form>
      </div>
    </div>
  )
}
