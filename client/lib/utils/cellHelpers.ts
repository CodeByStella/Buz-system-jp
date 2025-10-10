/**
 * Cell Helper Utilities
 * 
 * Helper functions for working with spreadsheet cell references
 */

/**
 * Convert cell reference (e.g., "B6") to array indices
 * @param cell - Cell reference like "B6", "AA10", etc.
 * @returns Object with row and col indices (0-based)
 * 
 * @example
 * cellToIndices("B6") // { row: 5, col: 1 }
 * cellToIndices("AA1") // { row: 0, col: 26 }
 */
export const cellToIndices = (cell: string): { row: number; col: number } => {
  const match = cell.match(/^([A-Z]+)(\d+)$/);
  if (!match) throw new Error(`Invalid cell reference: ${cell}`);

  const colStr = match[1];
  const rowStr = match[2];

  // Convert column letters to index (A=0, B=1, ..., Z=25, AA=26, etc.)
  let col = 0;
  for (let i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - 65 + 1);
  }
  col = col - 1; // Convert to 0-based

  const row = parseInt(rowStr) - 1; // Convert to 0-based

  return { row, col };
};

/**
 * Convert array indices to cell reference
 * @param row - Row index (0-based)
 * @param col - Column index (0-based)
 * @returns Cell reference like "B6", "AA10", etc.
 * 
 * @example
 * indicesToCell(5, 1) // "B6"
 * indicesToCell(0, 26) // "AA1"
 */
export const indicesToCell = (row: number, col: number): string => {
  let colStr = "";
  let c = col + 1; // Convert to 1-based

  while (c > 0) {
    const remainder = (c - 1) % 26;
    colStr = String.fromCharCode(65 + remainder) + colStr;
    c = Math.floor((c - 1) / 26);
  }

  return colStr + (row + 1); // Convert to 1-based
};

/**
 * Get cell value from 2D array using cell reference
 * @param data - 2D array of cell values
 * @param cell - Cell reference like "B6"
 * @returns Cell value or undefined if not found
 * 
 * @example
 * getCellValue(data, "B6") // 100
 */
export const getCellValue = (
  data: (string | number)[][],
  cell: string
): string | number | undefined => {
  try {
    const { row, col } = cellToIndices(cell);
    return data[row]?.[col];
  } catch {
    return undefined;
  }
};

/**
 * Check if a cell contains a formula
 * @param value - Cell value
 * @returns True if cell contains a formula (starts with "=")
 */
export const isFormula = (value: string | number): boolean => {
  return typeof value === "string" && value.startsWith("=");
};

/**
 * Format cell value for display
 * @param value - Cell value (number, string, or formula)
 * @param decimals - Number of decimal places for numbers (default: 2)
 * @returns Formatted string
 */
export const formatCellValue = (
  value: string | number | undefined,
  decimals: number = 2
): string => {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  if (typeof value === "number") {
    return value.toLocaleString("ja-JP", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  return String(value);
};

/**
 * Parse cell value from string input
 * @param input - String input from user
 * @returns Parsed number or original string
 */
export const parseCellInput = (input: string): number | string => {
  // Remove commas and whitespace
  const cleaned = input.replace(/,/g, "").trim();

  // Try to parse as number
  const num = parseFloat(cleaned);
  if (!isNaN(num)) {
    return num;
  }

  // Return as string (might be a formula)
  return input.trim();
};

