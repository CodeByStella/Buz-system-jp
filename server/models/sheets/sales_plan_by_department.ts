import mongoose, { Schema, InferSchemaType, Model } from 'mongoose'

const SalesPlanByDepartmentSheetSchema = new Schema({})

export type SalesPlanByDepartmentSheetDocument = InferSchemaType<typeof SalesPlanByDepartmentSheetSchema> & { _id: mongoose.Types.ObjectId }
export const SalesPlanByDepartmentSheet: Model<SalesPlanByDepartmentSheetDocument> = mongoose.models.SalesPlanByDepartmentSheet || mongoose.model<SalesPlanByDepartmentSheetDocument>("SalesPlanByDepartmentSheet", SalesPlanByDepartmentSheetSchema, "sales_plan_by_department_sheets")