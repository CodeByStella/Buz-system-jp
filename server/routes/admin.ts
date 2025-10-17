import express from 'express'
import { authenticateToken, requireAdmin } from '../middleware/auth'
import { userRepository } from '../repositories/user-repo'
import { authService } from '../services/auth-service'
import { Data } from '../models/data'

const router = express.Router()

// Apply authentication to all admin routes
router.use(authenticateToken, requireAdmin)

// Get all users with pagination
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    
    const result = await userRepository.findAll(page, limit)
    res.json(result)
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ error: 'ユーザーの取得に失敗しました' })
  }
})

// Create new user
router.post('/users', async (req, res) => {
  try {
    const { email, password, name, description } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ error: 'メールアドレスとパスワードは必須です' })
    }
    
    const user = await authService.createUserByAdmin({
      email,
      password,
      name,
      description
    })
    
    res.status(201).json(user)
  } catch (error) {
    console.error('Create user error:', error)
    if (error instanceof Error && error.message.includes('既に使用されています')) {
      res.status(409).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'ユーザーの作成に失敗しました' })
    }
  }
})

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, subscriptionStartAt, subscriptionEndAt } = req.body
    
    const user = await userRepository.updateById(id, { 
      name, 
      description,
      subscriptionStartAt: subscriptionStartAt ? new Date(subscriptionStartAt) : undefined,
      subscriptionEndAt: subscriptionEndAt ? new Date(subscriptionEndAt) : undefined,
    })
    
    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' })
    }
    
    res.json(user)
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({ error: 'ユーザーの更新に失敗しました' })
  }
})

// Update user status (pause/resume)
router.patch('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    
    if (!status || !['ACTIVE', 'PAUSED'].includes(status)) {
      return res.status(400).json({ error: '有効な状態を指定してください' })
    }
    
    const user = await userRepository.updateStatusById(id, status)
    
    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' })
    }
    
    res.json(user)
  } catch (error) {
    console.error('Update user status error:', error)
    res.status(500).json({ error: 'ユーザー状態の更新に失敗しました' })
  }
})

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    // Check if user exists
    const user = await userRepository.findById(id)
    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' })
    }
    
    // Delete all user data
    await Data.deleteMany({ userId: id })
    
    // Delete user
    await userRepository.deleteById(id)
    
    res.json({ message: 'ユーザーと関連データを削除しました' })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({ error: 'ユーザーの削除に失敗しました' })
  }
})

export default router
