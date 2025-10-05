import mongoose, { Schema, InferSchemaType, Model } from 'mongoose'

const ExpensesSheetSchema = new Schema({})

export type ExpensesSheetDocument = InferSchemaType<typeof ExpensesSheetSchema> & { _id: mongoose.Types.ObjectId }
export const ExpensesSheet: Model<ExpensesSheetDocument> = mongoose.models.ExpensesSheet || mongoose.model<ExpensesSheetDocument>("ExpensesSheet", ExpensesSheetSchema, "expenses_sheets")