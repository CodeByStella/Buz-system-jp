import mongoose, { Schema, InferSchemaType, Model } from "mongoose";
import { NumberInputSchema } from "./numberInputSchema";

const MqCurrentStatusSheetSchema = new Schema(
  {
    // PQ: 売上
    sales: {
      PQ: NumberInputSchema, // 売上合計
      pricePerUnit: NumberInputSchema, // 単価（P）
      quantity: NumberInputSchema, // 数量（Q）
    },

    // VQ: 変動費
    variableCost: {
      VQ: NumberInputSchema,
      variablePerUnit: NumberInputSchema, // V
      quantity: NumberInputSchema, // 数量（Q）
    },

    // M: 粗利, F: 固定費, G: 利益
    profitStructure: {
      grossMargin: NumberInputSchema, // M
      fixedFee: NumberInputSchema, // F
      profit: NumberInputSchema, // G
    },

    memo: { type: String }, // メモ欄
  },
  { timestamps: true }
);

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
