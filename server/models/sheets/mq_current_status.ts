import mongoose, { Schema, InferSchemaType, Model } from 'mongoose'

const MqCurrentStatusSheetSchema = new Schema({})

export type MqCurrentStatusSheetDocument = InferSchemaType<typeof MqCurrentStatusSheetSchema> & { _id: mongoose.Types.ObjectId }
export const MqCurrentStatusSheet: Model<MqCurrentStatusSheetDocument> = mongoose.models.MqCurrentStatusSheet || mongoose.model<MqCurrentStatusSheetDocument>("MqCurrentStatusSheet", MqCurrentStatusSheetSchema, "mq_current_status_sheets")