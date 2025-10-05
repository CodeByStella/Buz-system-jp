import mongoose, { Schema, InferSchemaType, Model } from 'mongoose'

const BreakEvenPointSheetSchema = new Schema({})

export type BreakEvenPointSheetDocument = InferSchemaType<typeof BreakEvenPointSheetSchema> & { _id: mongoose.Types.ObjectId }
export const BreakEvenPointSheet: Model<BreakEvenPointSheetDocument> = mongoose.models.BreakEvenPointSheet || mongoose.model<BreakEvenPointSheetDocument>("BreakEvenPointSheet", BreakEvenPointSheetSchema, "break_even_point_sheets")