import mongoose, { Schema, InferSchemaType, Model } from "mongoose";
import { NumberInputSchema } from "./numberInputSchema";

const MQFutureSheetSchema = new Schema(
  {
    // PQ: 売上 (Sales)
    sales: {
      PQ: NumberInputSchema, // 売上合計 (Total Sales)
      pricePerUnit: NumberInputSchema, // 単価（P）
      quantity: NumberInputSchema, // 数量（Q）
    },

    // VQ: 変動費 (Variable Costs)
    variableCost: {
      VQ: NumberInputSchema,
      variablePerUnit: NumberInputSchema, // V
      quantity: NumberInputSchema, // 数量（Q）
    },

    // M: 粗利 (Gross Margin)
    grossMargin: {
      M: NumberInputSchema,
      percentage: NumberInputSchema, // M%
    },

    // F: 固定費 (Fixed Costs)
    fixedCost: {
      F: NumberInputSchema,
      percentage: NumberInputSchema, // F%
    },

    // G: 利益 (Profit)
    profit: {
      G: NumberInputSchema,
      percentage: NumberInputSchema, // G%
      targetValue: NumberInputSchema, // 目標値
    },

    memo: { type: String }, // メモ欄
  },
  { timestamps: true }
);

export type MQFutureSheetDocument = InferSchemaType<
  typeof MQFutureSheetSchema
> & { _id: mongoose.Types.ObjectId };
export const MQFutureSheet: Model<MQFutureSheetDocument> =
  mongoose.models.MQFutureSheet ||
  mongoose.model<MQFutureSheetDocument>(
    "MQFutureSheet",
    MQFutureSheetSchema,
    "mq_future_sheets"
  );
