import bcrypt from 'bcryptjs'

export async function hashPassword(plainTextPassword: string): Promise<string> {
  const saltRounds = 10
  return await bcrypt.hash(plainTextPassword, saltRounds)
}

export async function verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hashedPassword)
}


