import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { authService } from '../services/auth-service'

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'メールアドレスとパスワードが必要です' })
    }

    const result = await authService.login(email, password)
    if (!result) {
      return res.status(401).json({ error: 'ユーザーが見つかりません' })
    }
    const { token, user } = result

    // Set HTTP-only cookie
    res.cookie('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    res.json({ user })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'ログインに失敗しました' })
  }
})

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('auth-token')
  res.json({ message: 'ログアウトしました' })
})

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies['auth-token']

    if (!token) {
      return res.status(401).json({ error: '認証が必要です' })
    }

    const payload = jwt.verify(token, JWT_SECRET) as any

    const user = await authService.me(payload.id)

    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' })
    }

    res.json({ user })
  } catch (error) {
    res.status(401).json({ error: '認証に失敗しました' })
  }
})

export default router
