import mongoose, { Schema, InferSchemaType, Model } from 'mongoose'

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'USER'], default: 'USER', index: true }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

export type UserDocument = InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId }
export const User: Model<UserDocument> = mongoose.models.User || mongoose.model('User', UserSchema, 'users')


