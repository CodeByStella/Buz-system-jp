import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const MqCurrentStatusSheetSchema = new Schema({
  // PQ: 売上
  sales: {
    PQ: { type: Number }, // 売上合計
    pricePerUnit: { type: Number }, // 単価（P）
    quantity: { type: Number }, // 数量（Q）
  },

  // VQ: 変動費
  variableCost: {
    VQ: { type: Number },
    variablePerUnit: { type: Number }, // V
    quantity: { type: Number }, // 数量（Q）
  },

  // M: 粗利, F: 固定費, G: 利益
  profitStructure: {
    grossMargin: { type: Number }, // M
    fixedFee: { type: Number }, // F
    profit: { type: Number }, // G
  }
}, { timestamps: true });

export type MqCurrentStatusSheetDocument = InferSchemaType<
  typeof MqCurrentStatusSheetSchema
> & { _id: mongoose.Types.ObjectId };

export const MqCurrentStatusSheet: Model<MqCurrentStatusSheetDocument> =
  mongoose.models.MqCurrentStatusSheet ||
  mongoose.model<MqCurrentStatusSheetDocument>(
    "MqCurrentStatusSheet",
    MqCurrentStatusSheetSchema,
    "mq_current_status_sheets"
  );
