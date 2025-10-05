import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const CostDetailSheetSchema = new Schema(
  {
    // 商品・サービス明細 (Product/Service Details)
    products: [
      {
        name: { type: String, required: true }, // 商品名 (Product Name)
        grossProfitAmount: { type: Number, default: 0 }, // 粗利益額 (Gross Profit Amount)
        grossProfitPerUnit: { type: Number, default: 0 }, // 1個あたり粗利益 (Gross Profit per Unit)
        quantity: { type: Number, default: 0 }, // 数量 (Quantity)
        unitPrice: { type: Number, default: 0 }, // 単価 (Unit Price)
        sales: { type: Number, default: 0 }, // 売上 (Sales)
        grossProfitMargin: { type: Number, default: 0 }, // 粗利益率 (Gross Profit Margin %)
        // category: { type: String, default: "" }, // 業種・種別 (Industry/Category)
      },
    ],

    // 実績 (Actual Results)
    actualResults: {
      grossProfitAmount: { type: Number, default: 0 }, // 粗利益額 (Gross Profit Amount)
      mUnits: { type: Number, default: 0 }, // M(個) (M(Units))
      totalQuantity: { type: Number, default: 0 }, // 数量(Q) (Quantity(Q))
      averageCustomerUnitPrice: { type: Number, default: 0 }, // 平均客単価 (Average Customer Unit Price)
      totalSales: { type: Number, default: 0 }, // 売上計 (Total Sales)
      averageGrossProfit: { type: Number, default: 0 }, // 平均粗利 (Average Gross Profit %)
    },

    // 修正・調整 (Corrections and Adjustments)
    corrections: {
      deficiencyAmount: { type: Number, default: 0 }, // 不足額 (Deficiency Amount)
      grossProfitMargin: { type: Number, default: 0 }, // 粗利益率(%) (Gross Profit Margin %)
      monthlyCustomers: { type: Number, default: 0 }, // 客数(月) (Number of Customers Monthly)
      customerUnitPrice: { type: Number, default: 0 }, // 客単価(円) (Customer Unit Price in Yen)
      workforce: { type: Number, default: 0 }, // 戦力(人) (Workforce in People)
    },

    // 計画との差 (Difference from Plan)
    planDifference: {
      grossProfitAmount: { type: Number, default: 0 }, // 粗利益額 (Gross Profit Amount)
      differenceFromPlan: { type: Number, default: 0 }, //計画との差 (Difference from Plan)
      profitabilityPerPerson: { type: Number, default: 0 }, // 戦力(1人当たりの利益力) (Workforce Profitability per Person)
      productivityPerPerson: { type: Number, default: 0 }, // 1人当たり生産性 (Productivity per Person)
      profitPerPerson: { type: Number, default: 0 }, // 1人あたりの利益 (Profit per Person)
      productivityTarget: { type: Number, default: 0 }, // 1人あたりの生産性 (Productivity per Person Target)
    },

    // その他群 (Other Group)
    otherGroup: {
      grossProfitAmount: { type: Number, default: 0 }, // 粗利益額 (Gross Profit Amount)
      sales: { type: Number, default: 0 }, // 売上 (Sales)
      quantity: { type: Number, default: 0 }, // 数量 (Quantity)
      unitPrice: { type: Number, default: 0 }, // 単価 (Unit Price)
      grossProfitMargin: { type: Number, default: 0 }, // 粗利益率 (Gross Profit Margin %)
    },

    // 全体合計 (Overall Totals)
    overallTotal: { type: Number, default: 0 }, // 総合計 (Total of all expenses in millions of yen)
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
