import mongoose, { Schema, InferSchemaType, Model } from 'mongoose'

const ProgressResultInputSheetSchema = new Schema({})

export type ProgressResultInputSheetDocument = InferSchemaType<typeof ProgressResultInputSheetSchema> & { _id: mongoose.Types.ObjectId }
export const ProgressResultInputSheet: Model<ProgressResultInputSheetDocument> = mongoose.models.ProgressResultInputSheet || mongoose.model<ProgressResultInputSheetDocument>("ProgressResultInputSheet", ProgressResultInputSheetSchema, "progress_result_input_sheets")