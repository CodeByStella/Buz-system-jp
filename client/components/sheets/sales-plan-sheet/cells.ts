// Sales Plan Sheet Cell Definitions
// This file contains the cell structure for the sales plan sheet

export interface SalesPlanRowDataType {
  id: string;
  label: string;
  salesTarget: string;
  monthlyTargets: string[];
  monthlyActuals: string[];
  cumulativeTargets: string[];
  cumulativeActuals: string[];
  bgcolor?: string;
  type?: "target" | "actual" | "category";
  colspan?: number;
  rowspan?: number;
  isSpanned?: boolean; // For cells that are covered by rowspan/colspan
}

// Main sales plan data structure
export const salesPlanRows: SalesPlanRowDataType[] = [
  // Grand total row
  {
    id: "grand_total",
    label: "合計",
    salesTarget: "grand_total_target",
    monthlyTargets: [],
    monthlyActuals: [],
    cumulativeTargets: [],
    cumulativeActuals: [],
    bgcolor: "bg-yellow-200",
    type: "category",
  },

  // Category rows with target/actual sub-rows
  {
    id: "painting_target",
    label: "塗装工事",
    salesTarget: "painting_sales_target",
    monthlyTargets: Array.from(
      { length: 12 },
      (_, i) => `painting_monthly_target_${i}`
    ),
    monthlyActuals: Array.from(
      { length: 12 },
      (_, i) => `painting_monthly_actual_${i}`
    ),
    cumulativeTargets: Array.from(
      { length: 12 },
      (_, i) => `painting_cumulative_target_${i}`
    ),
    cumulativeActuals: Array.from(
      { length: 12 },
      (_, i) => `painting_cumulative_actual_${i}`
    ),
    bgcolor: "bg-blue-100",
    type: "target",
    rowspan: 2,
  },
  {
    id: "painting_actual",
    label: "",
    salesTarget: "",
    monthlyTargets: [],
    monthlyActuals: [],
    cumulativeTargets: [],
    cumulativeActuals: [],
    bgcolor: "bg-blue-50",
    type: "actual",
    isSpanned: true,
  },

  {
    id: "renovation_target",
    label: "リフォーム工事",
    salesTarget: "renovation_sales_target",
    monthlyTargets: Array.from(
      { length: 12 },
      (_, i) => `renovation_monthly_target_${i}`
    ),
    monthlyActuals: Array.from(
      { length: 12 },
      (_, i) => `renovation_monthly_actual_${i}`
    ),
    cumulativeTargets: Array.from(
      { length: 12 },
      (_, i) => `renovation_cumulative_target_${i}`
    ),
    cumulativeActuals: Array.from(
      { length: 12 },
      (_, i) => `renovation_cumulative_actual_${i}`
    ),
    bgcolor: "bg-blue-100",
    type: "target",
    rowspan: 2,
  },
  {
    id: "renovation_actual",
    label: "",
    salesTarget: "",
    monthlyTargets: [],
    monthlyActuals: [],
    cumulativeTargets: [],
    cumulativeActuals: [],
    bgcolor: "bg-blue-50",
    type: "actual",
    isSpanned: true,
  },

  {
    id: "minor_work_target",
    label: "小工事",
    salesTarget: "minor_work_sales_target",
    monthlyTargets: Array.from(
      { length: 12 },
      (_, i) => `minor_work_monthly_target_${i}`
    ),
    monthlyActuals: Array.from(
      { length: 12 },
      (_, i) => `minor_work_monthly_actual_${i}`
    ),
    cumulativeTargets: Array.from(
      { length: 12 },
      (_, i) => `minor_work_cumulative_target_${i}`
    ),
    cumulativeActuals: Array.from(
      { length: 12 },
      (_, i) => `minor_work_cumulative_actual_${i}`
    ),
    bgcolor: "bg-blue-100",
    type: "target",
    rowspan: 2,
  },
  {
    id: "minor_work_actual",
    label: "",
    salesTarget: "",
    monthlyTargets: [],
    monthlyActuals: [],
    cumulativeTargets: [],
    cumulativeActuals: [],
    bgcolor: "bg-blue-50",
    type: "actual",
    isSpanned: true,
  },

  {
    id: "sheet_metal_target",
    label: "板金工事",
    salesTarget: "sheet_metal_sales_target",
    monthlyTargets: Array.from(
      { length: 12 },
      (_, i) => `sheet_metal_monthly_target_${i}`
    ),
    monthlyActuals: Array.from(
      { length: 12 },
      (_, i) => `sheet_metal_monthly_actual_${i}`
    ),
    cumulativeTargets: Array.from(
      { length: 12 },
      (_, i) => `sheet_metal_cumulative_target_${i}`
    ),
    cumulativeActuals: Array.from(
      { length: 12 },
      (_, i) => `sheet_metal_cumulative_actual_${i}`
    ),
    bgcolor: "bg-blue-100",
    type: "target",
    rowspan: 2,
  },
  {
    id: "sheet_metal_actual",
    label: "",
    salesTarget: "",
    monthlyTargets: [],
    monthlyActuals: [],
    cumulativeTargets: [],
    cumulativeActuals: [],
    bgcolor: "bg-blue-50",
    type: "actual",
    isSpanned: true,
  },

  // Placeholder categories (15 rows)
  ...Array.from({ length: 15 }, (_, i) => [
    {
      id: `placeholder_${i + 1}_target`,
      label: "〇〇",
      salesTarget: `placeholder_${i + 1}_sales_target`,
      monthlyTargets: Array.from(
        { length: 12 },
        (_, j) => `placeholder_${i + 1}_monthly_target_${j}`
      ),
      monthlyActuals: Array.from(
        { length: 12 },
        (_, j) => `placeholder_${i + 1}_monthly_actual_${j}`
      ),
      cumulativeTargets: Array.from(
        { length: 12 },
        (_, j) => `placeholder_${i + 1}_cumulative_target_${j}`
      ),
      cumulativeActuals: Array.from(
        { length: 12 },
        (_, j) => `placeholder_${i + 1}_cumulative_actual_${j}`
      ),
      bgcolor: i % 2 === 0 ? "bg-blue-100" : "bg-white",
      type: "target" as const,
      rowspan: 2,
    },
    {
      id: `placeholder_${i + 1}_actual`,
      label: "",
      salesTarget: "",
      monthlyTargets: [],
      monthlyActuals: [],
      cumulativeTargets: [],
      cumulativeActuals: [],
      bgcolor: i % 2 === 0 ? "bg-blue-50" : "bg-white",
      type: "actual" as const,
      isSpanned: true,
    },
  ]).flat(),

  // Other details row
  {
    id: "other_target",
    label: "その他詳",
    salesTarget: "other_sales_target",
    monthlyTargets: Array.from(
      { length: 12 },
      (_, i) => `other_monthly_target_${i}`
    ),
    monthlyActuals: Array.from(
      { length: 12 },
      (_, i) => `other_monthly_actual_${i}`
    ),
    cumulativeTargets: Array.from(
      { length: 12 },
      (_, i) => `other_cumulative_target_${i}`
    ),
    cumulativeActuals: Array.from(
      { length: 12 },
      (_, i) => `other_cumulative_actual_${i}`
    ),
    bgcolor: "bg-blue-100",
    type: "target",
    rowspan: 2,
  },
  {
    id: "other_actual",
    label: "",
    salesTarget: "",
    monthlyTargets: [],
    monthlyActuals: [],
    cumulativeTargets: [],
    cumulativeActuals: [],
    bgcolor: "bg-blue-50",
    type: "actual",
    isSpanned: true,
  },
];

// Month names for headers
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
