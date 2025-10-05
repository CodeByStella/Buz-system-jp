import mongoose, { Schema, InferSchemaType, Model } from 'mongoose'

const BreakEvenPointSheetSchema = new Schema({
  // 来期 (Next Period) - Future scenario data
  nextPeriod: {
    salesRevenue: { type: Number, default: 0 }, // 売上高 (Sales Revenue)
    variableCosts: { type: Number, default: 0 }, // 変動費 (Variable Costs)
    fixedCosts: { type: Number, default: 0 }, // 固定費 (Fixed Costs)
    variableCostRatio: { type: Number, default: 0 }, // 変動率（変動費÷売上高） (Variable Cost Ratio)
    breakEvenPoint: { type: Number, default: 0 }, // 損益分岐点　固定費÷(1-変動率) (Break-even Point)
  },

  // 現状 (Current Situation) - Current scenario data
  currentSituation: {
    salesRevenue: { type: Number, default: 0 }, // 売上高 (Sales Revenue)
    variableCosts: { type: Number, default: 0 }, // 変動費 (Variable Costs)
    fixedCosts: { type: Number, default: 0 }, // 固定費 (Fixed Costs)
    variableCostRatio: { type: Number, default: 0 }, // 変動率（変動費÷売上高） (Variable Cost Ratio)
    breakEvenPoint: { type: Number, default: 0 }, // 損益分岐点　固定費÷(1-変動率) (Break-even Point)
  }
}, {
  timestamps: true // 作成日時・更新日時 (Created/Updated timestamps)
})

export type BreakEvenPointSheetDocument = InferSchemaType<typeof BreakEvenPointSheetSchema> & { _id: mongoose.Types.ObjectId }
export const BreakEvenPointSheet: Model<BreakEvenPointSheetDocument> = mongoose.models.BreakEvenPointSheet || mongoose.model<BreakEvenPointSheetDocument>("BreakEvenPointSheet", BreakEvenPointSheetSchema, "break_even_point_sheets")