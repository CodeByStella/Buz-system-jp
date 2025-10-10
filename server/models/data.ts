import mongoose, { Schema, InferSchemaType } from "mongoose";

export interface DataType {
  sheet: string;
  cell: string;
  value?: number|string;
  user: string;
}

const DataSchema = new Schema<DataType & Document>(
  {
    sheet: { type: String, required: true },
    cell: { type: String, required: true },
    value: { type: Schema.Types.Mixed, default: 0 },
    user: { type: String, default: "" },
  },
  { timestamps: true }
);

export type DataDocument = InferSchemaType<typeof DataSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Data =
  mongoose.models.Data || mongoose.model("Data", DataSchema, "data");
