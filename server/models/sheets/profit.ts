import mongoose, { Schema, InferSchemaType, Model } from "mongoose";
import { NumberInputSchema } from "./numberInputSchema";

const ProfitSheetSchema = new Schema(
  {
    operatingProfit: NumberInputSchema, // 営業利益 (Operating Profit)
    nonOperatingIncome: NumberInputSchema, // 営業外収益 (Non-operating Income)
    nonOperatingExpenses: NumberInputSchema, // 営業外費用 (Non-operating Expenses)
    ordinaryProfit: NumberInputSchema, // 経常利益 (Ordinary Profit) - calculated field
    extraordinaryIncome: NumberInputSchema, // 特別利益 (Extraordinary Income)
    extraordinaryLosses: NumberInputSchema, // 特別損失 (Extraordinary Losses)
    profitBeforeTax: NumberInputSchema, // 税引前利益 (Profit Before Tax) - calculated field
    yearOnYearComparison: NumberInputSchema, // 前年対比 (Year-on-year comparison)
  },
  {
    timestamps: true,
  }
);

export type ProfitSheetDocument = InferSchemaType<typeof ProfitSheetSchema> & {
  _id: mongoose.Types.ObjectId;
};
export const ProfitSheet: Model<ProfitSheetDocument> =
  mongoose.models.ProfitSheet ||
  mongoose.model<ProfitSheetDocument>(
    "ProfitSheet",
    ProfitSheetSchema,
    "profit_sheets"
  );
