import { GlobalParameter } from '../models/global-parameter'

export const parameterRepository = {
  async listAllSorted() {
    return GlobalParameter.find({}).sort({ key: 1 }).lean()
  },

  async upsert(key: string, value: number, description?: string | null) {
    return GlobalParameter.findOneAndUpdate(
      { key },
      { $set: { value, description: description ?? undefined } },
      { new: true, upsert: true }
    ).lean()
  }
}


