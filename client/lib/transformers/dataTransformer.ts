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

// Helper function to convert cell reference (e.g., "C7") to row and column indices
const cellToIndices = (cell: string): { row: number; col: number } => {
  const match = cell.match(/^([A-Z]+)(\d+)$/);
  if (!match) throw new Error(`Invalid cell reference: ${cell}`);

  const colStr = match[1];
  const rowStr = match[2];

  // Convert column letters to index (A=1, B=2, ..., Z=26, AA=27, etc.)
  let col = 0;
  for (let i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - 65 + 1);
  }
  // Keep as 1-based index (A=1, B=2, etc.)

  const row = parseInt(rowStr); // Keep as 1-based index (1, 2, 3, etc.)

  return { row, col };
};

// Helper function to convert row and column indices to cell reference (e.g., 1, 1 => "A1")
const indicesToCell = (row: number, col: number): string => {
  let colStr = "";
  let c = col; // Already 1-based (A=1, B=2, etc.)

  while (c > 0) {
    const remainder = (c - 1) % 26;
    colStr = String.fromCharCode(65 + remainder) + colStr;
    c = Math.floor((c - 1) / 26);
  }

  const rowStr = row.toString(); // Already 1-based

  return colStr + rowStr;
};

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
