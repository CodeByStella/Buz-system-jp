import mongoose, { Schema, InferSchemaType, Model } from 'mongoose'

const SalarySheetSchema = new Schema({})

export type SalarySheetDocument = InferSchemaType<typeof SalarySheetSchema> & { _id: mongoose.Types.ObjectId }
export const SalarySheet: Model<SalarySheetDocument> = mongoose.models.SalarySheet || mongoose.model<SalarySheetDocument>("SalarySheet", SalarySheetSchema, "salary_sheets")