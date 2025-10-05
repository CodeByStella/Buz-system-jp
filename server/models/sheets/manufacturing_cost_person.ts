import mongoose, { Schema, InferSchemaType, Model } from 'mongoose'

const ManufacturingCostPersonSheetSchema = new Schema({})

export type ManufacturingCostPersonSheetDocument = InferSchemaType<typeof ManufacturingCostPersonSheetSchema> & { _id: mongoose.Types.ObjectId }
export const ManufacturingCostPersonSheet: Model<ManufacturingCostPersonSheetDocument> = mongoose.models.ManufacturingCostPersonSheet || mongoose.model<ManufacturingCostPersonSheetDocument>("ManufacturingCostPersonSheet", ManufacturingCostPersonSheetSchema, "manufacturing_cost_person_sheets")