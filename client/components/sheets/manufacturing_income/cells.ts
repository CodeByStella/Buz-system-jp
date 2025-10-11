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

export type CellType = {
  value: string;
  type: 0 | 1 | 2; // 0 disabled, 1 editable, 2 readonly
  prefix?: string;
  suffix?: string;
  bgcolor?: string;
  tip?: string;
};

export interface SummaryRowDataType {
  a: CellType;
  b: CellType;
  c: CellType;
  d: CellType;
  e: CellType;
  f: CellType;
}

export interface TotalValueType {
  label: string;
  value: string;
}

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
    type: 1 as const,
  },
];

// Summary Section (実績) - Based on image values
export const manufacturingIncomeSummary: SummaryRowDataType[] = [
  {
    a: {
      value: "不足額",
      type: 2 as const,
    },
    b: {
      value: "粗利益率(%)",
      type: 2 as const,
    },
    c: {
      value: "客数(月)",
      type: 2 as const,
    },
    d: {
      value: "客単価(円)",
      type: 2 as const,
    },
    e: {
      value: "戦力（人）",
      type: 2 as const,
    },
    f: {
      value: "",
      type: 2 as const,
    },
  },
  {
    a: {
      value: "B34",
      type: 2 as const,
    },
    b: {
      value: "C34",
      type: 2 as const,
    },
    c: {
      value: "D34",
      type: 1 as const,
    },
    d: {
      value: "E34",
      type: 1 as const,
    },
    e: {
      value: "G33",
      type: 2 as const,
    },
    f: {
      value: "",
      type: 2 as const,
    },
  },
  {
    a: {
      value: "粗利益額",
      type: 2 as const,
    },
    b: {
      value: "計画との差",
      type: 2 as const,
    },
    c: {
      value: "戦力(1人当たりの利益力)",
      type: 2 as const,
    },
    d: {
      value: "1人当たり生産性",
      type: 2 as const,
    },
    e: {
      value: "1人あたりの利益",
      type: 2 as const,
    },
    f: {
      value: "１人あたりの生産性",
      type: 2 as const,
    },
  },
  {
    a: {
      value: "B36",
      type: 2 as const,
    },
    b: {
      value: "C36",
      type: 1 as const,
    },
    c: {
      value: "D36",
      type: 1 as const,
    },
    d: {
      value: "E36",
      type: 1 as const,
    },
    e: {
      value: "F36",
      type: 2 as const,
    },
    f: {
      value: "G36",
      type: 2 as const,
    },
  },
];

// Grand Total
export const grandTotalRow: TotalValueType = {
  label: "合計",
  value: "G2",
};
