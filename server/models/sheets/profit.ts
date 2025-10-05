import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const ProfitSheetSchema = new Schema(
  {
    operatingProfit: { type: Number }, // 営業利益 (Operating Profit)
    nonOperatingIncome: { type: Number }, // 営業外収益 (Non-operating Income)
    nonOperatingExpenses: { type: Number }, // 営業外費用 (Non-operating Expenses)
    ordinaryProfit: { type: Number }, // 経常利益 (Ordinary Profit) - calculated field
    extraordinaryIncome: { type: Number }, // 特別利益 (Extraordinary Income)
    extraordinaryLosses: { type: Number }, // 特別損失 (Extraordinary Losses)
    profitBeforeTax: { type: Number }, // 税引前利益 (Profit Before Tax) - calculated field
    yearOnYearComparison: { type: Number }, // 前年対比 (Year-on-year comparison)
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
