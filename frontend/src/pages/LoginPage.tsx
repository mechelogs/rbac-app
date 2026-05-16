import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import api from '../services/api'
import { useAuthStore } from '../store/auth.store'

export default function LoginPage() {
  const navigate = useNavigate()

  const setToken = useAuthStore((state) => state.setToken)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    try {
      setError('')
      const response = await api.post('/auth/login', {
        email,
        password
      })

      setToken(response.data.token)

      navigate('/content')
    } catch (error) {
      console.error(error)
      setError('Invalid credentials. Please try again.')
    }
  }

  const fillViewerCredentials = () => {
    setEmail('viewer@example.com')
    setPassword('password123')
  }

  const fillEditorCredentials = () => {
    setEmail('editor@example.com')
    setPassword('password123')
  }

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '80px auto',
        padding: 24,
        border: '1px solid #ddd',
        borderRadius: 10
      }}
    >
      <h1 style={{ marginBottom: 20 }}>
        RBAC Login
      </h1>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: 10
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: 10
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            padding: 12,
            cursor: 'pointer'
          }}
        >
          Login
        </button>

        {error && (
          <p style={{ color: 'red', marginTop: 12 }}>{error}</p>
        )}
      </div>

      <div
        style={{
          marginTop: 30
        }}
      >
        <h3>Sample Accounts</h3>

        <div
          style={{
            border: '1px solid #eee',
            padding: 12,
            borderRadius: 8,
            marginBottom: 12
          }}
        >
          <strong>Viewer Role</strong>

          <p>Email: viewer@example.com</p>
          <p>Password: password123</p>

          <button onClick={fillViewerCredentials}>
            Use Viewer Account
          </button>
        </div>

        <div
          style={{
            border: '1px solid #eee',
            padding: 12,
            borderRadius: 8
          }}
        >
          <strong>Editor Role</strong>

          <p>Email: editor@example.com</p>
          <p>Password: password123</p>

          <button onClick={fillEditorCredentials}>
            Use Editor Account
          </button>
        </div>
      </div>
    </div>
  )
}