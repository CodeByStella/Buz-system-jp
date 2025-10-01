import mongoose, { Schema, InferSchemaType, Model } from 'mongoose'

const GlobalParameterSchema = new Schema({
  key: { type: String, required: true, unique: true, index: true },
  value: { type: Number, required: true },
  description: { type: String }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

export type GlobalParameterDocument = InferSchemaType<typeof GlobalParameterSchema> & { _id: mongoose.Types.ObjectId }
export const GlobalParameter: Model<GlobalParameterDocument> = mongoose.models.GlobalParameter || mongoose.model('GlobalParameter', GlobalParameterSchema, 'global_parameters')


