import { userInputRepository } from '../repositories/user-input-repo'

export const inputService = {
  async list(userId: string, sheet?: string) {
    return userInputRepository.listByUserAndOptionalSheet(userId, sheet)
  },

  async listForSheet(userId: string, sheet: string) {
    return userInputRepository.listByUserAndSheet(userId, sheet)
  },

  async upsert(userId: string, sheet: string, cellKey: string, value: number) {
    return userInputRepository.upsert(userId, sheet, cellKey, value)
  }
}


