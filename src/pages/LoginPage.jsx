import { useState } from 'react'
import { authService } from '../services/AuthService'
import Card from '../components/common/Card'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

export default function LoginPage({ onLoginSuccess, onGoToRegister }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    try {
      const user = authService.login(username, password)
      setError('')
      onLoginSuccess(user)
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
        <p className="subtitle">Masuk ke akunmu untuk mulai adu cepat & adu tepat.</p>

        <form onSubmit={handleSubmit} className="form">
          <Input
            label="Username"
            type="text"
            autoFocus
            placeholder="Contoh: siti_alfi"
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

          {error && <p className="error-text">{error}</p>}

          <Button type="submit" block>
            Masuk
          </Button>
        </form>

        <p className="switch-text">
          Belum punya akun?{' '}
          <button type="button" className="link-btn" onClick={onGoToRegister}>
            Daftar di sini
          </button>
        </p>
      </Card>
    </div>
  )
}
