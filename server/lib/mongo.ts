import mongoose from 'mongoose'

let isConnected = false

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (isConnected) {
    return mongoose
  }

  const mongoUri = process.env.MONGODB_URI || ''
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set')
  }

  mongoose.set('strictQuery', true)

  await mongoose.connect(mongoUri)
  isConnected = true
  return mongoose
}


