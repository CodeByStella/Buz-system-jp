import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../index'

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'メールアドレスとパスワードが必要です' })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({ error: 'ユーザーが見つかりません' })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(401).json({ error: 'パスワードが正しくありません' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Set HTTP-only cookie
    res.cookie('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
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

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' })
    }

    res.json({ user })
  } catch (error) {
    res.status(401).json({ error: '認証に失敗しました' })
  }
})

export default router
