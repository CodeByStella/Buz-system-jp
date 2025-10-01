import { UserInput } from '../models/user-input'

export const userInputRepository = {
  async listByUserAndOptionalSheet(userId: string, sheet?: string) {
    const filter: any = { userId }
    if (sheet) filter.sheet = sheet
    return UserInput.find(filter).sort({ cellKey: 1 }).lean()
  },

  async listByUserAndSheet(userId: string, sheet: string) {
    return UserInput.find({ userId, sheet }).lean()
  },

  async upsert(userId: string, sheet: string, cellKey: string, value: number) {
    return UserInput.findOneAndUpdate(
      { userId, sheet, cellKey },
      { $set: { value } },
      { new: true, upsert: true }
    ).lean()
  }
}


