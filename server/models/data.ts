import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

export interface DataType {
  sheet: string;
  cell: string;
  value?: number;
  formula?: string;
  user: string;
}

const DataSchema = new Schema<DataType & Document>(
  {
    sheet: { type: String, required: true },
    cell: { type: String, required: true },
    value: { type: Number, default: 0 },
    formula: { type: String, default: "" },
    user: { type: String, required: true },
  },
  { timestamps: true }
);

export type DataDocument = InferSchemaType<typeof DataSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Data = mongoose.models.Data || mongoose.model("Data", DataSchema, "data");
