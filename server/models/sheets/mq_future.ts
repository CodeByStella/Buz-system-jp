import mongoose, { Schema, InferSchemaType, Model } from 'mongoose'

const MQFutureSheetSchema = new Schema({})

export type MQFutureSheetDocument = InferSchemaType<typeof MQFutureSheetSchema> & { _id: mongoose.Types.ObjectId }
export const MQFutureSheet: Model<MQFutureSheetDocument> = mongoose.models.MQFutureSheet || mongoose.model<MQFutureSheetDocument>("MQFutureSheet", MQFutureSheetSchema, "mq_future_sheets")