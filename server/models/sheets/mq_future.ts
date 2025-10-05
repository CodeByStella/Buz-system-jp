import mongoose, { Schema, InferSchemaType, Model } from 'mongoose'

const MQFutureSheetSchema = new Schema({
  // PQ: 売上 (Sales)
  sales: {
    PQ: { type: Number }, // 売上合計 (Total Sales)
    pricePerUnit: { type: Number }, // 単価（P）
    quantity: { type: Number }, // 数量（Q）
  },

  // VQ: 変動費 (Variable Costs)
  variableCost: {
    VQ: { type: Number },
    variablePerUnit: { type: Number }, // V
    quantity: { type: Number }, // 数量（Q）
  },

  // M: 粗利 (Gross Margin)
  grossMargin: {
    M: { type: Number },
    percentage: { type: Number }, // M%
  },

  // F: 固定費 (Fixed Costs)
  fixedCost: {
    F: { type: Number },
    percentage: { type: Number }, // F%
  },

  // G: 利益 (Profit)
  profit: {
    G: { type: Number },
    percentage: { type: Number }, // G%
    targetValue: { type: Number }, // 目標値
  },

  memo: { type: String }, // メモ欄
}, { timestamps: true })

export type MQFutureSheetDocument = InferSchemaType<typeof MQFutureSheetSchema> & { _id: mongoose.Types.ObjectId }
export const MQFutureSheet: Model<MQFutureSheetDocument> = mongoose.models.MQFutureSheet || mongoose.model<MQFutureSheetDocument>("MQFutureSheet", MQFutureSheetSchema, "mq_future_sheets")