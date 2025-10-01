export type AppConfig = {
  port: number
  frontendUrl: string
  jwtSecret: string
  mongoUri: string
}

function mustGet(name: string, fallback?: string): string {
  const val = process.env[name] ?? fallback
  if (!val) {
    throw new Error(`Missing required env var: ${name}`)
  }
  return val
}

export const config: AppConfig = {
  port: Number(process.env.PORT || 3001),
  frontendUrl: mustGet('FRONTEND_URL', 'http://localhost:3000'),
  jwtSecret: mustGet('JWT_SECRET', 'fallback-secret'),
  mongoUri: mustGet('MONGODB_URI')
}


