import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectToDatabase } from './lib/mongo'

// Import routes
import authRoutes from './routes/auth'
import adminRoutes from './routes/admin'
import userRoutes from './routes/user'
// import pdfRoutes from './routes/pdf'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: true, // Allow all origins (reflects the requesting origin)
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/user', userRoutes)
// app.use('/api/pdf', pdfRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'サーバーエラーが発生しました' })
})

// Start server after DB connection
connectToDatabase()
  .then(() => {
    console.log('✅ Connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`🚀 Express server running on port ${PORT}`)
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
    })
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB', err)
    process.exit(1)
  })
