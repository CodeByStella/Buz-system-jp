import mongoose, { Schema, InferSchemaType, Model } from 'mongoose'

const ProfitPlaningTableSheetSchema = new Schema({})

export type ProfitPlaningTableSheetDocument = InferSchemaType<typeof ProfitPlaningTableSheetSchema> & { _id: mongoose.Types.ObjectId }
export const ProfitPlaningTableSheet: Model<ProfitPlaningTableSheetDocument> = mongoose.models.ProfitPlaningTableSheet || mongoose.model<ProfitPlaningTableSheetDocument>("ProfitPlaningTableSheet", ProfitPlaningTableSheetSchema, "profit_planing_table_sheets")