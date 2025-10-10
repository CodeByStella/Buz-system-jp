import { cellToIndices, indicesToCell } from "../utils/cellHelpers";

export interface BackendData {
  cell: string;
  formula: string;
  sheet: string;
  value: number;
}

// Type for a single cell value - can be string or number
type CellValue = string | number;

// FrontendData with dynamic sheet names as keys
export interface FrontendData {
  [sheetName: string]: CellValue[][];
}

export type SheetNameType = "start" | "mq_current_status" | "profit" | "mq_future" | "salary" | "expenses" | "manufacturing_labor" | "manufacturing_expenses" | "manufacturing_income" | "break_even_point" | "progress_result_input" | "sales_plan_by_department" | "profit_planing_table";

// Transform Backend data to Frontend data (2D arrays by sheet)
export const transformBe2Fe = (backendData: BackendData[]): FrontendData => {
  const frontendData: FrontendData = {};

  // Group data by sheet
  backendData.forEach((item) => {
    const { sheet, cell, value, formula } = item;

    // Initialize sheet array if it doesn't exist
    if (!frontendData[sheet]) {
      frontendData[sheet] = [];
    }

    // Parse cell reference to get row and column
    const { row, col } = cellToIndices(cell);

    // Ensure the array has enough rows
    while (frontendData[sheet].length <= row) {
      frontendData[sheet].push([]);
    }

    // Ensure the row has enough columns
    while (frontendData[sheet][row].length <= col) {
      frontendData[sheet][row].push("");
    }

    // If formula exists, use it; otherwise use the numeric value
    // Each cell contains only ONE value (either formula string or number)
    frontendData[sheet][row][col] = formula || value;
  });

  return frontendData;
};

// Transform Frontend data to Backend data (array of cell objects)
export const transformFe2Be = (
  frontendData: FrontendData,
  sheetName?: string
): BackendData[] => {
  const backendData: BackendData[] = [];

  // Determine which sheets to process
  const sheetsToProcess = sheetName ? [sheetName] : Object.keys(frontendData);

  sheetsToProcess.forEach((sheet) => {
    const sheetData = frontendData[sheet];
    if (!sheetData) return;

    sheetData.forEach((row, rowIndex) => {
      row.forEach((cellValue, colIndex) => {
        // Skip empty cells
        if (cellValue === "" || cellValue === null || cellValue === undefined) {
          return;
        }

        const cell = indicesToCell(rowIndex, colIndex);

        // Determine if it's a formula or value
        const isFormula =
          typeof cellValue === "string" && cellValue.startsWith("=");

        backendData.push({
          sheet,
          cell,
          value: typeof cellValue === "number" ? cellValue : 0,
          formula: isFormula ? cellValue : "",
        });
      });
    });
  });

  return backendData;
};
