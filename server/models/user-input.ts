import mongoose, { Schema, InferSchemaType, Model } from 'mongoose'

const UserInputSchema = new Schema({
  userId: { type: String, required: true, index: true },
  sheet: { type: String, required: true, index: true },
  cellKey: { type: String, required: true },
  value: { type: Number, required: true }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

UserInputSchema.index({ userId: 1, sheet: 1, cellKey: 1 }, { unique: true })

export type UserInputDocument = InferSchemaType<typeof UserInputSchema> & { _id: mongoose.Types.ObjectId }
export const UserInput: Model<UserInputDocument> = mongoose.models.UserInput || mongoose.model('UserInput', UserInputSchema, 'user_inputs')


