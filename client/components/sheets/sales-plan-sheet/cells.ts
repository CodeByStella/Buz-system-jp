// Sales Plan Sheet Cell Definitions
// This file contains the cell structure for the sales plan sheet

// Month names for headers - must be declared first
export const monthNames = [
  "9月",
  "10月",
  "11月",
  "12月",
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
];

export interface SalesPlanRowDataType {
  id: string;
  label: string;
  salesTargetCumulative: string;
  salesTargetMonthly: string;
  monthlyData: {
    cumulative: string;
    monthly: string;
  }[];
  summaryData: {
    cumulative: string;
    monthly: string;
  }[];
  bgcolor?: string;
  type?: "total" | "category";
  rowType?: "target" | "actual";
  rowspan?: number;
  isSpanned?: boolean;
}

// Helper function to create monthly data structure
const createMonthlyData = (categoryId: string) => 
  monthNames.map((_, i) => ({
    cumulative: `${categoryId}_month_${i}_cumulative`,
    monthly: `${categoryId}_month_${i}_monthly`
  }));

// Helper function to create summary data structure  
const createSummaryData = (categoryId: string) => 
  Array.from({ length: 3 }, (_, i) => ({
    cumulative: `${categoryId}_summary_${i}_cumulative`,
    monthly: `${categoryId}_summary_${i}_monthly`
  }));

// Main sales plan data structure
export const salesPlanRows: SalesPlanRowDataType[] = [
  // Category rows - each category has 2 separate rows (目標 and 実績)
  {
    id: "painting_target",
    label: "塗装工事",
    salesTargetCumulative: "painting_target_cumulative",
    salesTargetMonthly: "painting_target_monthly",
    monthlyData: createMonthlyData("painting_target"),
    summaryData: createSummaryData("painting_target"),
    bgcolor: "bg-blue-100",
    type: "category",
    rowType: "target" as const
  },
  {
    id: "painting_actual",
    label: "",
    salesTargetCumulative: "painting_actual_cumulative",
    salesTargetMonthly: "painting_actual_monthly",
    monthlyData: createMonthlyData("painting_actual"),
    summaryData: createSummaryData("painting_actual"),
    bgcolor: "bg-blue-100",
    type: "category",
    rowType: "actual" as const,
    isSpanned: true
  },
  
  {
    id: "renovation_target",
    label: "リフォーム工事",
    salesTargetCumulative: "renovation_target_cumulative",
    salesTargetMonthly: "renovation_target_monthly",
    monthlyData: createMonthlyData("renovation_target"),
    summaryData: createSummaryData("renovation_target"),
    bgcolor: "bg-blue-100",
    type: "category",
    rowType: "target" as const
  },
  {
    id: "renovation_actual",
    label: "",
    salesTargetCumulative: "renovation_actual_cumulative",
    salesTargetMonthly: "renovation_actual_monthly",
    monthlyData: createMonthlyData("renovation_actual"),
    summaryData: createSummaryData("renovation_actual"),
    bgcolor: "bg-blue-100",
    type: "category",
    rowType: "actual" as const,
    isSpanned: true
  },
  
  {
    id: "minor_work_target",
    label: "小工事",
    salesTargetCumulative: "minor_work_target_cumulative",
    salesTargetMonthly: "minor_work_target_monthly",
    monthlyData: createMonthlyData("minor_work_target"),
    summaryData: createSummaryData("minor_work_target"),
    bgcolor: "bg-blue-100",
    type: "category",
    rowType: "target" as const
  },
  {
    id: "minor_work_actual",
    label: "",
    salesTargetCumulative: "minor_work_actual_cumulative",
    salesTargetMonthly: "minor_work_actual_monthly",
    monthlyData: createMonthlyData("minor_work_actual"),
    summaryData: createSummaryData("minor_work_actual"),
    bgcolor: "bg-blue-100",
    type: "category",
    rowType: "actual" as const,
    isSpanned: true
  },
  
  {
    id: "sheet_metal_target",
    label: "板金工事",
    salesTargetCumulative: "sheet_metal_target_cumulative",
    salesTargetMonthly: "sheet_metal_target_monthly",
    monthlyData: createMonthlyData("sheet_metal_target"),
    summaryData: createSummaryData("sheet_metal_target"),
    bgcolor: "bg-blue-100",
    type: "category",
    rowType: "target" as const
  },
  {
    id: "sheet_metal_actual",
    label: "",
    salesTargetCumulative: "sheet_metal_actual_cumulative",
    salesTargetMonthly: "sheet_metal_actual_monthly",
    monthlyData: createMonthlyData("sheet_metal_actual"),
    summaryData: createSummaryData("sheet_metal_actual"),
    bgcolor: "bg-blue-100",
    type: "category",
    rowType: "actual" as const,
    isSpanned: true
  },
  
  // Placeholder categories (15 categories, each with 2 rows)
  ...Array.from({ length: 15 }, (_, i) => [
    {
      id: `placeholder_${i + 1}_target`,
      label: "〇〇",
      salesTargetCumulative: `placeholder_${i + 1}_target_cumulative`,
      salesTargetMonthly: `placeholder_${i + 1}_target_monthly`,
      monthlyData: createMonthlyData(`placeholder_${i + 1}_target`),
      summaryData: createSummaryData(`placeholder_${i + 1}_target`),
      bgcolor: i % 2 === 0 ? "bg-blue-100" : "bg-white",
      type: "category" as const,
      rowType: "target" as const
    },
    {
      id: `placeholder_${i + 1}_actual`,
      label: "",
      salesTargetCumulative: `placeholder_${i + 1}_actual_cumulative`,
      salesTargetMonthly: `placeholder_${i + 1}_actual_monthly`,
      monthlyData: createMonthlyData(`placeholder_${i + 1}_actual`),
      summaryData: createSummaryData(`placeholder_${i + 1}_actual`),
      bgcolor: i % 2 === 0 ? "bg-blue-100" : "bg-white",
      type: "category" as const,
      rowType: "actual" as const,
      isSpanned: true
    }
  ]).flat(),
  
  // Other details
  {
    id: "other_target",
    label: "その他詳",
    salesTargetCumulative: "other_target_cumulative",
    salesTargetMonthly: "other_target_monthly",
    monthlyData: createMonthlyData("other_target"),
    summaryData: createSummaryData("other_target"),
    bgcolor: "bg-blue-100",
    type: "category",
    rowType: "target" as const
  },
  {
    id: "other_actual",
    label: "",
    salesTargetCumulative: "other_actual_cumulative",
    salesTargetMonthly: "other_actual_monthly",
    monthlyData: createMonthlyData("other_actual"),
    summaryData: createSummaryData("other_actual"),
    bgcolor: "bg-blue-100",
    type: "category",
    rowType: "actual" as const,
    isSpanned: true
  }
];
