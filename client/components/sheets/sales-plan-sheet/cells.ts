// Sales Plan Sheet Cell Definitions
// This file contains the cell structure for the sales plan sheet

// Month names for headers - must be declared first
export const monthNames = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
];

export interface SalesPlanRowDataType {
  label: string;
  salesTarget: string;
  salesActual: string;
  monthlyData: {
    current: string;
    total: string;
  }[];
  rowType: "target" | "actual";
}

// Function to convert number to Excel column letter (A, B, C, ..., Z, AA, AB, etc.)
function numberToExcelColumn(num: number): string {
  let result = "";
  while (num > 0) {
    num--; // Adjust for 0-based indexing
    result = String.fromCharCode(65 + (num % 26)) + result;
    num = Math.floor(num / 26);
  }
  return result;
}

export const salesPlanRows: SalesPlanRowDataType[] = [
  ...Array.from({ length: 21 }, (_, i) => [
    {
      label: `A${3 + i * 2}`,
      salesTarget: `B${3 + i * 2}`,
      salesActual: `B${4 + i * 2}`,
      monthlyData: monthNames.map((_, monthIndex) => {
        const colStart = 4;
        const targetRow = 3 + i * 2;
        const col = numberToExcelColumn(colStart + monthIndex * 2);
        const nextCol = numberToExcelColumn(colStart + monthIndex * 2 + 1);
        return {
          current: `${col}${targetRow}`,
          total: `${nextCol}${targetRow}`,
        };
      }),
      rowType: "target" as const,
    },
    {
      label: "",
      salesTarget: `B${3 + i * 2}`,
      salesActual: `B${4 + i * 2}`,
      monthlyData: monthNames.map((_, monthIndex) => {
        const colStart = 4;
        const actualRow = 4 + i * 2;
        const col = numberToExcelColumn(colStart + monthIndex * 2);
        const nextCol = numberToExcelColumn(colStart + monthIndex * 2 + 1);
        return {
          current: `${col}${actualRow}`,
          total: `${nextCol}${actualRow}`,
        };
      }),
      rowType: "actual" as const,
    },
  ]).flat(),

  // その他詳 (Other Details)
  {
    label: "その他詳",
    salesTarget: "B45",
    salesActual: "B46",
    monthlyData: monthNames.map((_, monthIndex) => {
      const colStart = 4;
      const targetRow = 45;
      const col = numberToExcelColumn(colStart + monthIndex * 2);
      const nextCol = numberToExcelColumn(colStart + monthIndex * 2 + 1);
      return {
        current: `${col}${targetRow}`,
        total: `${nextCol}${targetRow}`,
      };
    }),
    rowType: "target" as const,
  },
  {
    label: "",
    salesTarget: "B45",
    salesActual: "B46",
    monthlyData: monthNames.map((_, monthIndex) => {
      const colStart = 4;
      const actualRow = 46;
      const col = numberToExcelColumn(colStart + monthIndex * 2);
      const nextCol = numberToExcelColumn(colStart + monthIndex * 2 + 1);
      return {
        current: `${col}${actualRow}`,
        total: `${nextCol}${actualRow}`,
      };
    }),
    rowType: "actual" as const,
  },
];
