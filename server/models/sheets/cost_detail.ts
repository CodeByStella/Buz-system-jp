import mongoose, { Schema, InferSchemaType, Model } from "mongoose";
import { NumberInputSchema } from "./numberInputSchema";

const CostDetailSheetSchema = new Schema(
  {
    // 商品・サービス明細 (Product/Service Details)
    products: [
      {
        name: { type: String, required: true }, // 商品名 (Product Name)
        grossProfitAmount: NumberInputSchema, // 粗利益額 (Gross Profit Amount)
        grossProfitPerUnit: NumberInputSchema, // 1個あたり粗利益 (Gross Profit per Unit)
        quantity: NumberInputSchema, // 数量 (Quantity)
        unitPrice: NumberInputSchema, // 単価 (Unit Price)
        sales: NumberInputSchema, // 売上 (Sales)
        grossProfitMargin: NumberInputSchema, // 粗利益率 (Gross Profit Margin %)
        // category: { type: String, default: "" }, // 業種・種別 (Industry/Category)
      },
    ],

    // 実績 (Actual Results)
    actualResults: {
      grossProfitAmount: NumberInputSchema, // 粗利益額 (Gross Profit Amount)
      mUnits: NumberInputSchema, // M(個) (M(Units))
      totalQuantity: NumberInputSchema, // 数量(Q) (Quantity(Q))
      averageCustomerUnitPrice: NumberInputSchema, // 平均客単価 (Average Customer Unit Price)
      totalSales: NumberInputSchema, // 売上計 (Total Sales)
      averageGrossProfit: NumberInputSchema, // 平均粗利 (Average Gross Profit %)
    },

    // 修正・調整 (Corrections and Adjustments)
    corrections: {
      deficiencyAmount: NumberInputSchema, // 不足額 (Deficiency Amount)
      grossProfitMargin: NumberInputSchema, // 粗利益率(%) (Gross Profit Margin %)
      monthlyCustomers: NumberInputSchema, // 客数(月) (Number of Customers Monthly)
      customerUnitPrice: NumberInputSchema, // 客単価(円) (Customer Unit Price in Yen)
      workforce: NumberInputSchema, // 戦力(人) (Workforce in People)
    },

    // 計画との差 (Difference from Plan)
    planDifference: {
      grossProfitAmount: NumberInputSchema, // 粗利益額 (Gross Profit Amount)
      differenceFromPlan: NumberInputSchema, //計画との差 (Difference from Plan)
      profitabilityPerPerson: NumberInputSchema, // 戦力(1人当たりの利益力) (Workforce Profitability per Person)
      productivityPerPerson: NumberInputSchema, // 1人当たり生産性 (Productivity per Person)
      profitPerPerson: NumberInputSchema, // 1人あたりの利益 (Profit per Person)
      productivityTarget: NumberInputSchema, // 1人あたりの生産性 (Productivity per Person Target)
    },

    // その他群 (Other Group)
    otherGroup: {
      grossProfitAmount: NumberInputSchema, // 粗利益額 (Gross Profit Amount)
      sales: NumberInputSchema, // 売上 (Sales)
      quantity: NumberInputSchema, // 数量 (Quantity)
      unitPrice: NumberInputSchema, // 単価 (Unit Price)
      grossProfitMargin: NumberInputSchema, // 粗利益率 (Gross Profit Margin %)
    },

    // 全体合計 (Overall Totals)
    overallTotal: NumberInputSchema, // 総合計 (Total of all expenses in millions of yen)
  },
  {
    timestamps: true, // 作成日時・更新日時 (Created/Updated timestamps)
  }
);

export type CostDetailSheetDocument = InferSchemaType<
  typeof CostDetailSheetSchema
> & { _id: mongoose.Types.ObjectId };

export const CostDetailSheet: Model<CostDetailSheetDocument> =
  mongoose.models.CostDetailSheet ||
  mongoose.model<CostDetailSheetDocument>(
    "CostDetailSheet",
    CostDetailSheetSchema,
    "cost_detail_sheets"
  );
