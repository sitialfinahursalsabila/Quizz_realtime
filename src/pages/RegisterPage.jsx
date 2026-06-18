import { useState } from 'react'
import { authService } from '../services/AuthService'
import Card from '../components/common/Card'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

export default function RegisterPage({ onRegisterSuccess, onGoToLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak sama.')
      return
    }

    try {
      const user = authService.register(username, password)
      setError('')
      onRegisterSuccess(user)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="screen screen-center">
      <Card>
        <div className="brand">
          <span className="brand-mark">⚡</span>
          <span className="brand-name">QuizDash</span>
        </div>
        <p className="subtitle">Buat akun baru, riwayat kuismu akan tersimpan otomatis di akun ini.</p>

        <form onSubmit={handleSubmit} className="form">
          <Input
            label="Username"
            type="text"
            autoFocus
            placeholder="Minimal 3 karakter"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Minimal 4 karakter"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Input
            label="Konfirmasi Password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />

          {error && <p className="error-text">{error}</p>}

          <Button type="submit" block>
            Daftar
          </Button>
        </form>

        <p className="switch-text">
          Sudah punya akun?{' '}
          <button type="button" className="link-btn" onClick={onGoToLogin}>
            Masuk di sini
          </button>
        </p>
      </Card>
    </div>
  )
}
