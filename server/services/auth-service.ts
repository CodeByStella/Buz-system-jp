import jwt from 'jsonwebtoken'
import { userRepository } from '../repositories/user-repo'
import { verifyPassword } from '../lib/auth'
import { config } from '../config/env'

export const authService = {
  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email)
    if (!user) return null
    const ok = await verifyPassword(password, user.password)
    if (!ok) return null
    const token = jwt.sign({ id: String(user._id), email: user.email, role: user.role }, config.jwtSecret, { expiresIn: '7d' })
    return { token, user: { id: String(user._id), email: user.email, name: user.name, role: user.role } }
  },

  async me(id: string) {
    const user = await userRepository.findById(id)
    if (!user) return null
    return { id: String(user._id), email: user.email, name: user.name, role: user.role }
  }
}


