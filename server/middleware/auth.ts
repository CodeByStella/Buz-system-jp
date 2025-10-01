import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/user'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies['auth-token']

    if (!token) {
      return res.status(401).json({ error: '認証が必要です' })
    }

    const payload = jwt.verify(token, JWT_SECRET) as any

    const user = await User.findById(payload.id).select('email name role').lean()

    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' })
    }

    req.user = { id: String(user._id), email: user.email, role: user.role }
    next()
  } catch (error) {
    res.status(401).json({ error: '認証に失敗しました' })
  }
}

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: '管理者権限が必要です' })
  }
  next()
}
