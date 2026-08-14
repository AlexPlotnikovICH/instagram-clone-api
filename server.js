import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'

import authRoutes from './routes/authRoutes.js'
import postRoutes from './routes/postRoutes.js'
import userRoutes from './routes/userRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import aiRoutes from './routes/aiRoutes.js'

const app = express()
connectDB()
const PORT = process.env.PORT || 3333

// Trust reverse proxy (Render)
app.set('trust proxy', 1)

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  })
)

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/ai', aiRoutes)

app.get('/', (req, res) => {
  res.send('ICHGRAM API is alive!')
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`)
})