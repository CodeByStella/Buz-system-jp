import mongoose, { Schema, Document } from "mongoose";

interface SheetRow {
  key: string;
  label: string;
}

interface SheetCol {
  key: string;
  label: string;
}

interface SheetCell {
  value: string | number | null;
  computedValue: string | number | null;
  formula?: string | null;
  permision_level: "admin" | "user" | "system";
  style?: {
    bgColor?: string;
    textColor?: string;
    bold?: boolean;
  };
  dependencies?: string[];
}

export interface SheetDocument extends Document {
  workbookId?: string;
  name: string;
  rows: SheetRow[];
  cols: SheetCol[];
  cells: Record<string, SheetCell>; // "rowKey:colKey" → cell data
}

const CellSchema = new Schema<SheetCell>(
  {
    value: { type: Schema.Types.Mixed, default: null },
    computedValue: { type: Schema.Types.Mixed, default: null },
    formula: { type: String, default: null },
    permision_level: { type: String, default: "system" },
    style: {
      bgColor: String,
      textColor: String,
      bold: Boolean,
    },
    dependencies: [{ type: String }],
  },
  { _id: false }
);

const RowSchema = new Schema<SheetRow>(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false }
);

const ColSchema = new Schema<SheetCol>(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false }
);

const SheetSchema = new Schema<SheetDocument>({
  workbookId: { type: String },
  name: { type: String, required: true },
  rows: [RowSchema],
  cols: [ColSchema],
  cells: {
    type: Map,
    of: CellSchema, // "rowKey:colKey" => Cell data
  },
});

export const SheetModel = mongoose.model<SheetDocument>(
  "Sheet",
  SheetSchema
);
