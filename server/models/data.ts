import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

export interface DataType {
  workbook: string;
  sheet: string;
  cell: string;
  value?: number | string;
  user: string;
}

const DataSchema = new Schema(
  {
    workbook: { type: String, required: true, default: "pdca", index: true },
    sheet: { type: String, required: true },
    cell: { type: String, required: true },
    value: { type: Schema.Types.Mixed, default: 0 },
    user: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

// Ensure uniqueness per user per workbook per cell
DataSchema.index({ user: 1, workbook: 1, sheet: 1, cell: 1 }, { unique: true });

export type DataDocument = InferSchemaType<typeof DataSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Data: Model<DataDocument> =
  mongoose.models.Data || mongoose.model("Data", DataSchema, "data");
