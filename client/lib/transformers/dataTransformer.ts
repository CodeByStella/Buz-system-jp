import { cellToIndices, indicesToCell } from "../utils/cellHelpers";

export interface BackendDataType {
  cell: string;
  sheet: string;
  value: number | string;
}

// Type for a single cell value - can be string or number
type CellValue = string | number;

// FrontendData with dynamic sheet names as keys
export interface FrontendDataType {
  [sheetName: string]: CellValue[][];
}

export type SheetNameType =
  | "start"
  | "mq_current_status"
  | "profit"
  | "mq_future"
  | "salary"
  | "expenses"
  | "manufacturing_labor"
  | "manufacturing_expenses"
  | "manufacturing_income"
  | "break_even_point"
  | "progress_result_input"
  | "sales_plan_by_department"
  | "profit_planing_table";

// Transform Backend data to Frontend data (2D arrays by sheet)
export const transformBe2Fe = (backendData: BackendDataType[]): FrontendDataType => {
  const frontendData: FrontendDataType = {};

  // Group data by sheet
  backendData.forEach((item) => {
    const { sheet, cell, value } = item;

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
    frontendData[sheet][row][col] = value;
  });

  return frontendData;
};

// Transform Frontend data to Backend data (array of cell objects)
export const transformFe2Be = (
  frontendData: FrontendDataType,
  sheetName?: string
): BackendDataType[] => {
  const backendData: BackendDataType[] = [];

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

        backendData.push({
          sheet,
          cell,
          value: cellValue,
        });
      });
    });
  });

  return backendData;
};
