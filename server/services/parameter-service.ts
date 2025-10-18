import { parameterRepository } from '../repositories/parameter-repo'

export const parameterService = {
  async listAllAsMap() {
    const params = await parameterRepository.listAllSorted()
    return params.reduce((acc: Record<string, number>, p: any) => {
      acc[p.key] = p.value
      return acc
    }, {})
  },

  async listAll() {
    return parameterRepository.listAllSorted()
  },

  async upsert(key: string, value: number, description?: string) {
    return parameterRepository.upsert(key, value, description)
  }
}


