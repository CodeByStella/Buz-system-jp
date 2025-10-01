import { User } from '../models/user'

export const userRepository = {
  async findByEmail(email: string) {
    return User.findOne({ email }).lean()
  },

  async findById(id: string) {
    return User.findById(id).lean()
  }
}


