import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import api from '../services/api'
import { useAuthStore } from '../store/auth.store'

interface ContentItem {
  id: number
  title: string
  body: string
}

export default function ContentPage() {
  const navigate = useNavigate()
  const clearToken = useAuthStore((state) => state.clearToken)

  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/')
      return
    }

    const fetchContent = async () => {
      try {
        setLoading(true)

        const response = await api.get('/content')

        setContent(response.data)
      } catch (err) {
        console.error(err)
        setError('Failed to load content')
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [navigate])

  const handleLogout = () => {
    clearToken()
    navigate('/')
  }

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Loading content...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h2>{error}</h2>
      </div>
    )
  }

  return (
    <div
      style={{
        maxWidth: 800,
        margin: '40px auto',
        padding: 20
      }}
    >
      <div
  style={{
    position: 'sticky',
    top: 0,
    paddingBottom: 16,
    marginBottom: 24,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #eee'
  }}
>
  <h1
    style={{
      margin: 0
    }}
  >
    Content Dashboard
  </h1>

  <button
    onClick={handleLogout}
    style={{
      padding: '10px 16px',
      border: 'none',
      borderRadius: 6,
      cursor: 'pointer',
      backgroundColor: '#111',
      color: '#fff'
    }}
  >
    Logout
  </button>
</div>

      {content.length === 0 ? (
        <p>No content found.</p>
      ) : (
        content.map((item) => (
          <div
            key={item.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 16,
              marginBottom: 16
            }}
          >
            <h3>{item.title}</h3>

            <p>{item.body}</p>
          </div>
        ))
      )}
    </div>
  )
}