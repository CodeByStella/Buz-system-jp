import mongoose, { Schema, InferSchemaType, Model } from 'mongoose'

const ProfitSheetSchema = new Schema({})

export type ProfitSheetDocument = InferSchemaType<typeof ProfitSheetSchema> & { _id: mongoose.Types.ObjectId }
export const ProfitSheet: Model<ProfitSheetDocument> = mongoose.models.ProfitSheet || mongoose.model<ProfitSheetDocument>("ProfitSheet", ProfitSheetSchema, "profit_sheets")