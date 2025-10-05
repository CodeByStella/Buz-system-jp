import mongoose, { Schema, InferSchemaType, Model } from 'mongoose'

const ManufacturingExpensesSheetSchema = new Schema({})

export type ManufacturingExpensesSheetDocument = InferSchemaType<typeof ManufacturingExpensesSheetSchema> & { _id: mongoose.Types.ObjectId }
export const ManufacturingExpensesSheet: Model<ManufacturingExpensesSheetDocument> = mongoose.models.ManufacturingExpensesSheet || mongoose.model<ManufacturingExpensesSheetDocument>("ManufacturingExpensesSheet", ManufacturingExpensesSheetSchema, "manufacturing_expenses_sheets")