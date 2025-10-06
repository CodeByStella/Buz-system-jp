import mongoose, { Schema, InferSchemaType, Model } from 'mongoose'

// Helper schema for financial metrics in each scenario
const FinancialMetricsSchema = new Schema({
  grossProfitMargin: { type: Number, default: 0 }, // 粗利率 (%) (Gross Profit Margin %)
  sales: { type: Number, default: 0 }, // 売上 (Sales)
  variableCosts: { type: Number, default: 0 }, // 変動費 (Variable Costs)
  grossProfit: { type: Number, default: 0 }, // 粗利 (Gross Profit)
  fixedCosts: { type: Number, default: 0 }, // 固定費 (Fixed Costs)
  operatingIncome: { type: Number, default: 0 }, // 営業利益 (Operating Income)
  profitMargin: { type: Number, default: 0 } // 益率 (Profit Margin %)
}, { _id: false })

const ProfitPlaningTableSheetSchema = new Schema({
  // 基本情報 (Basic Information)
  basicInfo: {
    fiscalYear: { type: String, required: true }, // 会計年度 (Fiscal Year) - e.g., "2024年度"
  },

  // 現状 (Current Status) - Baseline financial data
  currentStatus: {
    grossProfitMargin: { type: Number, default: 0 }, // 粗利率 (%) (Gross Profit Margin %)
    sales: { type: Number, default: 450000000 }, // 売上 (Sales) - 450,000,000 from image
    variableCosts: { type: Number, default: 273600000 }, // 変動費 (Variable Costs) - 273,600,000 from image
    grossProfit: { type: Number, default: 176400000 }, // 粗利 (Gross Profit) - 176,400,000 from image
    fixedCosts: { type: Number, default: 130400000 }, // 固定費 (Fixed Costs) - 130,400,000 from image
    operatingIncome: { type: Number, default: 46000000 }, // 営業利益 (Operating Income) - 46,000,000 from image
    profitMargin: { type: Number, default: 10.2 } // 益率 (Profit Margin %) - 10.2% from image
  },

  // 粗利UPシナリオ (Gross Profit UP Scenarios) - 1% to 10% increase scenarios
  grossProfitUpScenarios: {
    scenario1Percent: FinancialMetricsSchema, // 粗利 1% UP (Gross Profit 1% UP)
    scenario2Percent: FinancialMetricsSchema, // 粗利 2% UP (Gross Profit 2% UP)
    scenario3Percent: FinancialMetricsSchema, // 粗利 3% UP (Gross Profit 3% UP)
    scenario4Percent: FinancialMetricsSchema, // 粗利 4% UP (Gross Profit 4% UP)
    scenario5Percent: FinancialMetricsSchema, // 粗利 5% UP (Gross Profit 5% UP)
    scenario6Percent: FinancialMetricsSchema, // 粗利 6% UP (Gross Profit 6% UP)
    scenario7Percent: FinancialMetricsSchema, // 粗利 7% UP (Gross Profit 7% UP)
    scenario8Percent: FinancialMetricsSchema, // 粗利 8% UP (Gross Profit 8% UP)
    scenario9Percent: FinancialMetricsSchema, // 粗利 9% UP (Gross Profit 9% UP)
    scenario10Percent: FinancialMetricsSchema // 粗利 10% UP (Gross Profit 10% UP)
  },

  // 粗利DOWNシナリオ (Gross Profit DOWN Scenarios) - 1% to 10% decrease scenarios
  grossProfitDownScenarios: {
    scenario1Percent: FinancialMetricsSchema, // 粗利 1% DOWN (Gross Profit 1% DOWN)
    scenario2Percent: FinancialMetricsSchema, // 粗利 2% DOWN (Gross Profit 2% DOWN)
    scenario3Percent: FinancialMetricsSchema, // 粗利 3% DOWN (Gross Profit 3% DOWN)
    scenario4Percent: FinancialMetricsSchema, // 粗利 4% DOWN (Gross Profit 4% DOWN)
    scenario5Percent: FinancialMetricsSchema, // 粗利 5% DOWN (Gross Profit 5% DOWN)
    scenario6Percent: FinancialMetricsSchema, // 粗利 6% DOWN (Gross Profit 6% DOWN)
    scenario7Percent: FinancialMetricsSchema, // 粗利 7% DOWN (Gross Profit 7% DOWN)
    scenario8Percent: FinancialMetricsSchema, // 粗利 8% DOWN (Gross Profit 8% DOWN)
    scenario9Percent: FinancialMetricsSchema, // 粗利 9% DOWN (Gross Profit 9% DOWN)
    scenario10Percent: FinancialMetricsSchema // 粗利 10% DOWN (Gross Profit 10% DOWN)
  },

  // メモ (Memo) - Additional insights and notes
  memo: {type:String, default: "" },
}, {
  timestamps: true, // 作成日時・更新日時 (Created/Updated timestamps)
})

export type ProfitPlaningTableSheetDocument = InferSchemaType<typeof ProfitPlaningTableSheetSchema> & { 
  _id: mongoose.Types.ObjectId 
}

export const ProfitPlaningTableSheet: Model<ProfitPlaningTableSheetDocument> = 
  mongoose.models.ProfitPlaningTableSheet || 
  mongoose.model<ProfitPlaningTableSheetDocument>(
    "ProfitPlaningTableSheet", 
    ProfitPlaningTableSheetSchema, 
    "profit_planing_table_sheets"
  )