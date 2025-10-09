import express from 'express'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth'

const router = express.Router()

// Apply authentication to all user routes
router.use(authenticateToken)

// Get user inputs
router.get('/inputs', async (req: AuthenticatedRequest, res) => {
  try {
   
  } catch (error) {
    console.error('Get inputs error:', error)
    res.status(500).json({ error: '入力データの取得に失敗しました' })
  }
})

// Save user input
router.post('/inputs', async (req: AuthenticatedRequest, res) => {
  try {
   
  } catch (error) {
    console.error('Save input error:', error)
    res.status(500).json({ error: '入力データの保存に失敗しました' })
  }
})

export default router
