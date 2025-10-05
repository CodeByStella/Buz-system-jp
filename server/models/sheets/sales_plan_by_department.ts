import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

// Helper schema for each month (September to August)
const MonthDataSchema = new Schema(
  {
    currentMonth: { type: Number }, // 当月 (Current Month)
    cumulative: { type: Number }, // 累計 (Cumulative)
  },
  { _id: false }
);

const SalesPlanByDepartmentSheetSchema = new Schema(
  {
    // 基本情報 (Basic Information)
    basicInfo: {
      fiscalYear: { type: String }, // 会計年度 (Fiscal Year) - e.g., "2024年度"
      totalSalesTarget: { type: Number }, // 総売上目標 (Total Sales Target) - 450,000,000 from image
    },

    // 商品・サービスカテゴリ (Product/Service Categories)
    categories: [
      {
        name: { type: String, required: true }, // 商品名 (Product/Service Name)
        salesTarget: { type: Number, default: 0 }, // 売上目標 (Sales Target for the category)

        // 月別データ (Monthly Data) - September (9月) to August (8月)
        monthlyData: {
          january: MonthDataSchema, // 1月 (January)
          february: MonthDataSchema, // 2月 (February)
          march: MonthDataSchema, // 3月 (March)
          april: MonthDataSchema, // 4月 (April)
          may: MonthDataSchema, // 5月 (May)
          june: MonthDataSchema, // 6月 (June)
          july: MonthDataSchema, // 7月 (July)
          august: MonthDataSchema, // 8月 (August)
          september: MonthDataSchema, // 9月 (September)
          october: MonthDataSchema, // 10月 (October)
          november: MonthDataSchema, // 11月 (November)
          december: MonthDataSchema, // 12月 (December)
        },
        annualTotals: {
          totalTarget: { type: Number, default: 0 },
          totalActual: { type: Number, default: 0 },
          totalCurrentMonth: { type: Number, default: 0 },
          totalCumulative: { type: Number, default: 0 },
        },
      },
    ],

    // その他詳細 (Other Details)
    otherDetails: {
      salesTarget: { type: Number, default: 0 }, // 売上目標 (Sales Target)
      monthlyData: {
        september: MonthDataSchema,
        october: MonthDataSchema,
        november: MonthDataSchema,
        december: MonthDataSchema,
        january: MonthDataSchema,
        february: MonthDataSchema,
        march: MonthDataSchema,
        april: MonthDataSchema,
        may: MonthDataSchema,
        june: MonthDataSchema,
        july: MonthDataSchema,
        august: MonthDataSchema,
      },
      annualTotals: {
        totalTarget: { type: Number, default: 0 },
        totalActual: { type: Number, default: 0 },
        totalCurrentMonth: { type: Number, default: 0 },
        totalCumulative: { type: Number, default: 0 },
      },
    },
  },
  {
    timestamps: true, // 作成日時・更新日時 (Created/Updated timestamps)
  }
);

export type SalesPlanByDepartmentSheetDocument = InferSchemaType<
  typeof SalesPlanByDepartmentSheetSchema
> & {
  _id: mongoose.Types.ObjectId;
};

export const SalesPlanByDepartmentSheet: Model<SalesPlanByDepartmentSheetDocument> =
  mongoose.models.SalesPlanByDepartmentSheet ||
  mongoose.model<SalesPlanByDepartmentSheetDocument>(
    "SalesPlanByDepartmentSheet",
    SalesPlanByDepartmentSheetSchema,
    "sales_plan_by_department_sheets"
  );
