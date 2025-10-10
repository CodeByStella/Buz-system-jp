export interface ProductRowDataType {
  product_name: string; // This is the cell reference for the product name
  gross_profit_amount: string;
  gross_profit_per_item: string;
  quantity: string;
  unit_price: string;
  sales: string;
  gross_profit_rate: string;
  type: 0 | 1 | 2; // 0 disabled, 1 editable, 2 readonly
}

export interface SummaryRowDataType {
  label: string;
  value: string;
  type: 0 | 1 | 2; // 0 disabled, 1 editable, 2 readonly
  bgcolor?: string;
}

export interface AdjustmentRowDataType {
  label: string;
  value: string;
  type: 0 | 1 | 2; // 0 disabled, 1 editable, 2 readonly
  bgcolor?: string;
}

export interface PlanDifferenceRowDataType {
  label: string;
  value: string;
  type: 0 | 1 | 2; // 0 disabled, 1 editable, 2 readonly
  bgcolor?: string;
}

export interface GrossProfitRowDataType {
  label: string;
  value: string;
  type: 0 | 1 | 2; // 0 disabled, 1 editable, 2 readonly
  bgcolor?: string;
}

const colors = {
  yellow: "bg-yellow-400",
  red: "bg-red-700",
  gray: "bg-gray-400",
  lightCyan: "bg-cyan-100",
  lightBlue: "bg-blue-200",
  orange: "bg-orange-500",
  teal: "bg-teal-400",
  purple: "bg-purple-300",
  beige: "bg-yellow-100",
  gold: "bg-yellow-300",
  orangeAccent: "bg-orange-400",
  brightRed: "bg-red-500",
  lightGray: "bg-gray-200",
  peach: "bg-orange-200",
  silver: "bg-slate-200",
  blue: "bg-blue-400",
};

// Main Product Table - Based on the image data
export const manufacturingIncomeProducts: ProductRowDataType[] = [
  {
    product_name: "塗装工事",
    gross_profit_amount: "B8", // 129,500,000
    gross_profit_per_item: "C8", // 370,000
    quantity: "D8", // 350
    unit_price: "E8", // 1,000,000
    sales: "F8", // 350,000,000
    gross_profit_rate: "G8", // 37.0%
    type: 1 as const,
  },
  {
    product_name: "リフォーム工事",
    gross_profit_amount: "B9", // 17,400,000
    gross_profit_per_item: "C9", // 120,000
    quantity: "D9", // 149
    unit_price: "E9", // 340,000
    sales: "F9", // 49,300,000
    gross_profit_rate: "G9", // 35.3%
    type: 1 as const,
  },
  {
    product_name: "小工事",
    gross_profit_amount: "B10", // 2,509,990
    gross_profit_per_item: "C10", // 21,826
    quantity: "D10", // 115
    unit_price: "E10", // 50,000
    sales: "F10", // 5,750,000
    gross_profit_rate: "G10", // 43.7%
    type: 1 as const,
  },
  {
    product_name: "板金工事",
    gross_profit_amount: "B11", // 26,985,500
    gross_profit_per_item: "C11", // 174,100
    quantity: "D11", // 155
    unit_price: "E11", // 290,000
    sales: "F11", // 44,950,000
    gross_profit_rate: "G11", // 60.0%
    type: 1 as const,
  },
  // Empty rows with placeholder data
  ...Array(16)
    .fill(null)
    .map((_, i) => ({
      product_name: `A${12 + i}`,
      gross_profit_amount: `B${12 + i}`, // Calculated field
      gross_profit_per_item: `C${12 + i}`,
      quantity: `D${12 + i}`,
      unit_price: `E${12 + i}`,
      sales: `F${12 + i}`, // Calculated field
      gross_profit_rate: `G${12 + i}`, // Calculated field
      type: 1 as const,
    })),
  {
    product_name: "その他群",
    gross_profit_amount: "B29", // Calculated field
    gross_profit_per_item: "C29",
    quantity: "D29",
    unit_price: "E29",
    sales: "F29", // Calculated field
    gross_profit_rate: "G29", // Calculated field
    type: 1 as const,
  },
  {
    product_name: "",
    gross_profit_amount: "M(計)", // Calculated field
    gross_profit_per_item: "M(個)",
    quantity: "数量(Q)",
    unit_price: "平均客単価",
    sales: "売上 計", // Calculated field
    gross_profit_rate: "平均粗利", // Calculated field
    type: 2 as const,
  },
  {
    product_name: "実績",
    gross_profit_amount: "B31", // Calculated field
    gross_profit_per_item: "C31",
    quantity: "D31",
    unit_price: "E31",
    sales: "F31", // Calculated field
    gross_profit_rate: "G31", // Calculated field
    type: 2 as const,
  },
];

// Summary Section (実績) - Based on image values
export const manufacturingIncomeSummary: SummaryRowDataType[] = [
  {
    label: "M(計)",
    value: "B28", // 176,395,490
    type: 2 as const,
    bgcolor: colors.lightGray,
  },
  {
    label: "M(個)",
    value: "C28", // 137,185
    type: 2 as const,
    bgcolor: colors.lightGray,
  },
  {
    label: "数量(Q)",
    value: "D28", // 765
    type: 2 as const,
    bgcolor: colors.lightGray,
  },
  {
    label: "平均客単価",
    value: "E28", // 588,235
    type: 2 as const,
    bgcolor: colors.lightGray,
  },
  {
    label: "売上計",
    value: "F28", // 450,000,000
    type: 2 as const,
    bgcolor: colors.lightGray,
  },
  {
    label: "平均粗利",
    value: "G28", // 44.0%
    type: 2 as const,
    bgcolor: colors.lightGray,
  },
];

// Adjustment Section (〇になるまで修正) - Based on image values
export const manufacturingIncomeAdjustment: AdjustmentRowDataType[] = [
  {
    label: "粗利益率(%)",
    value: "B30", // 39.20%
    type: 1 as const,
    bgcolor: colors.yellow,
  },
  {
    label: "戦力(人)",
    value: "B31", // 25名
    type: 1 as const,
    bgcolor: colors.yellow,
  },
  {
    label: "客数(月)",
    value: "B32", // Empty in image
    type: 1 as const,
    bgcolor: colors.yellow,
  },
  {
    label: "客単価(円)",
    value: "B33", // Empty in image
    type: 1 as const,
    bgcolor: colors.yellow,
  },
  {
    label: "└→不足額",
    value: "B34", // -5
    type: 2 as const,
    bgcolor: colors.lightGray,
  },
  {
    label: "1人あたりの利益",
    value: "B35", // 7,055,819.6
    type: 2 as const,
    bgcolor: colors.lightGray,
  },
  {
    label: "1人あたり生産性",
    value: "B36", // 18,000,000
    type: 2 as const,
    bgcolor: colors.lightGray,
  },
];

// Plan Difference Section (計画との差) - Based on image values
export const manufacturingIncomePlanDifference: PlanDifferenceRowDataType[] = [
  {
    label: "戦力(1人当たりの利益力)",
    value: "B38", // Empty in image
    type: 2 as const,
    bgcolor: colors.lightGray,
  },
  {
    label: "1人当たり生産性",
    value: "B39", // Empty in image
    type: 2 as const,
    bgcolor: colors.lightGray,
  },
];

// Gross Profit Amounts Section (粗利益額) - Based on image values
export const manufacturingIncomeGrossProfit: GrossProfitRowDataType[] = [
  {
    label: "粗利益額",
    value: "B41", // 176,395,490.0
    type: 2 as const,
    bgcolor: colors.lightGray,
  },
  {
    label: "計画との差",
    value: "B42", // 0.0
    type: 2 as const,
    bgcolor: colors.lightGray,
  },
  {
    label: "1人当たり生産性",
    value: "B43", // 0.0
    type: 2 as const,
    bgcolor: colors.lightGray,
  },
];
