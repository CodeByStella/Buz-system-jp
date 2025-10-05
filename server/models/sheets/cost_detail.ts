import mongoose, { Schema, InferSchemaType, Model } from 'mongoose'

const CostDetailSheetSchema = new Schema({})

export type CostDetailSheetDocument = InferSchemaType<typeof CostDetailSheetSchema> & { _id: mongoose.Types.ObjectId }
export const CostDetailSheet: Model<CostDetailSheetDocument> = mongoose.models.CostDetailSheet || mongoose.model<CostDetailSheetDocument>("CostDetailSheet", CostDetailSheetSchema, "cost_detail_sheets")