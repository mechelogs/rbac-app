import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.routes'
import contentRoutes from './routes/content.routes'

dotenv.config()

const app = express()

// IMPORTANT: CORS BEFORE ROUTES
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
)

app.use(express.json())

app.get('/', (_req, res) => {
  res.send('API is running')
})

app.use('/api/auth', authRoutes)
app.use('/api/content', contentRoutes)

export default app