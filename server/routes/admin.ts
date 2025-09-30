import express from 'express'
import { prisma } from '../index'
import { authenticateToken, requireAdmin } from '../middleware/auth'

const router = express.Router()

// Apply authentication to all admin routes
router.use(authenticateToken, requireAdmin)

// Get global parameters
router.get('/parameters', async (req, res) => {
  try {
    const parameters = await prisma.globalParameter.findMany({
      orderBy: { key: 'asc' }
    })

    res.json({ parameters })
  } catch (error) {
    console.error('Get parameters error:', error)
    res.status(500).json({ error: 'パラメータの取得に失敗しました' })
  }
})

// Create or update global parameter
router.post('/parameters', async (req, res) => {
  try {
    const { key, value, description } = req.body

    if (!key || value === undefined) {
      return res.status(400).json({ error: 'キーと値が必要です' })
    }

    const parameter = await prisma.globalParameter.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description }
    })

    res.json({ parameter })
  } catch (error) {
    console.error('Save parameter error:', error)
    res.status(500).json({ error: 'パラメータの保存に失敗しました' })
  }
})

export default router
