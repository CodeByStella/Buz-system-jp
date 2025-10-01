import express from 'express'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth'
import { inputService } from '../services/input-service'

const router = express.Router()

// Apply authentication to all user routes
router.use(authenticateToken)

// Get user inputs
router.get('/inputs', async (req: AuthenticatedRequest, res) => {
  try {
    const { sheet } = req.query

    const inputs = await inputService.list(req.user!.id, sheet as string | undefined)

    res.json({ inputs })
  } catch (error) {
    console.error('Get inputs error:', error)
    res.status(500).json({ error: '入力データの取得に失敗しました' })
  }
})

// Save user input
router.post('/inputs', async (req: AuthenticatedRequest, res) => {
  try {
    const { sheet, cellKey, value } = req.body

    if (!sheet || !cellKey || value === undefined) {
      return res.status(400).json({ error: 'シート、セルキー、値が必要です' })
    }

    const input = await inputService.upsert(req.user!.id, sheet, cellKey, value)

    res.json({ input })
  } catch (error) {
    console.error('Save input error:', error)
    res.status(500).json({ error: '入力データの保存に失敗しました' })
  }
})

export default router
