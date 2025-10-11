// Cell definitions for the Profit Plan Sheet (利益計画表)
// Based on the server-side formulas from sheets.ts

export interface ProfitPlanRowDataType {
  label: string;
  cell: string;
  type: 0 | 1 | 2; // 0: input, 1: calculated, 2: header
  bgcolor?: string;
  tip?: string;
}

// Header row for UP scenarios (粗利 UP scenarios)
export const upScenarioHeaders: ProfitPlanRowDataType[] = [
  { label: "現状", cell: "B2", type: 2, bgcolor: "bg-yellow-100" },
  { label: "粗利 1% UP", cell: "C2", type: 2, bgcolor: "bg-yellow-100" },
  { label: "粗利 2% UP", cell: "D2", type: 2, bgcolor: "bg-yellow-100" },
  { label: "粗利 3% UP", cell: "E2", type: 2, bgcolor: "bg-yellow-100" },
  { label: "粗利 4% UP", cell: "F2", type: 2, bgcolor: "bg-yellow-100" },
  { label: "粗利 5% UP", cell: "G2", type: 2, bgcolor: "bg-yellow-100" },
  { label: "粗利 6% UP", cell: "H2", type: 2, bgcolor: "bg-yellow-100" },
  { label: "粗利 7% UP", cell: "I2", type: 2, bgcolor: "bg-yellow-100" },
  { label: "粗利 8% UP", cell: "J2", type: 2, bgcolor: "bg-yellow-100" },
  { label: "粗利 9% UP", cell: "K2", type: 2, bgcolor: "bg-yellow-100" },
  { label: "粗利 10% UP", cell: "L2", type: 2, bgcolor: "bg-yellow-100" },
];

// Gross profit rate row for UP scenarios (row 3)
export const upGpRateRow: ProfitPlanRowDataType[] = [
  { label: "粗利率", cell: "B3", type: 1, bgcolor: "bg-yellow-100" },
  { label: "", cell: "C3", type: 1, bgcolor: "bg-yellow-100" },
  { label: "", cell: "D3", type: 1, bgcolor: "bg-yellow-100" },
  { label: "", cell: "E3", type: 1, bgcolor: "bg-yellow-100" },
  { label: "", cell: "F3", type: 1, bgcolor: "bg-yellow-100" },
  { label: "", cell: "G3", type: 1, bgcolor: "bg-yellow-100" },
  { label: "", cell: "H3", type: 1, bgcolor: "bg-yellow-100" },
  { label: "", cell: "I3", type: 1, bgcolor: "bg-yellow-100" },
  { label: "", cell: "J3", type: 1, bgcolor: "bg-yellow-100" },
  { label: "", cell: "K3", type: 1, bgcolor: "bg-yellow-100" },
  { label: "", cell: "L3", type: 1, bgcolor: "bg-yellow-100" },
];

// Data rows for UP scenarios (rows 4-9)
export const upScenarioRows: ProfitPlanRowDataType[] = [
  { label: "売上", cell: "B4", type: 1, bgcolor: "bg-yellow-100" },
  { label: "変動費", cell: "B5", type: 1, bgcolor: "bg-yellow-100" },
  { label: "粗利", cell: "B6", type: 1, bgcolor: "bg-yellow-100" },
  { label: "固定費", cell: "B7", type: 1, bgcolor: "bg-yellow-100" },
  { label: "営業利益", cell: "B8", type: 1, bgcolor: "bg-yellow-100" },
  { label: "益率", cell: "B9", type: 1, bgcolor: "bg-yellow-100" },
];

// All cells for UP scenarios (C4-L9)
export const upScenarioDataCells: string[] = [
  "C4", "D4", "E4", "F4", "G4", "H4", "I4", "J4", "K4", "L4", // Sales
  "C5", "D5", "E5", "F5", "G5", "H5", "I5", "J5", "K5", "L5", // Variable costs
  "C6", "D6", "E6", "F6", "G6", "H6", "I6", "J6", "K6", "L6", // Gross profit
  "C7", "D7", "E7", "F7", "G7", "H7", "I7", "J7", "K7", "L7", // Fixed costs
  "C8", "D8", "E8", "F8", "G8", "H8", "I8", "J8", "K8", "L8", // Operating profit
  "C9", "D9", "E9", "F9", "G9", "H9", "I9", "J9", "K9", "L9", // Profit margin
];

// Header row for DOWN scenarios (粗利 DOWN scenarios)
export const downScenarioHeaders: ProfitPlanRowDataType[] = [
  { label: "現状", cell: "B10", type: 2, bgcolor: "bg-yellow-100" },
  { label: "粗利 1% DOWN", cell: "C10", type: 2, bgcolor: "bg-yellow-100" },
  { label: "粗利 2% DOWN", cell: "D10", type: 2, bgcolor: "bg-yellow-100" },
  { label: "粗利 3% DOWN", cell: "E10", type: 2, bgcolor: "bg-yellow-100" },
  { label: "粗利 4% DOWN", cell: "F10", type: 2, bgcolor: "bg-yellow-100" },
  { label: "粗利 5% DOWN", cell: "G10", type: 2, bgcolor: "bg-yellow-100" },
  { label: "粗利 6% DOWN", cell: "H10", type: 2, bgcolor: "bg-yellow-100" },
  { label: "粗利 7% DOWN", cell: "I10", type: 2, bgcolor: "bg-yellow-100" },
  { label: "粗利 8% DOWN", cell: "J10", type: 2, bgcolor: "bg-yellow-100" },
  { label: "粗利 9% DOWN", cell: "K10", type: 2, bgcolor: "bg-yellow-100" },
  { label: "粗利 10% DOWN", cell: "L10", type: 2, bgcolor: "bg-yellow-100" },
];

// Gross profit rate row for DOWN scenarios (row 11)
export const downGpRateRow: ProfitPlanRowDataType[] = [
  { label: "粗利率", cell: "B11", type: 1, bgcolor: "bg-yellow-100" },
  { label: "", cell: "C11", type: 1, bgcolor: "bg-yellow-100" },
  { label: "", cell: "D11", type: 1, bgcolor: "bg-yellow-100" },
  { label: "", cell: "E11", type: 1, bgcolor: "bg-yellow-100" },
  { label: "", cell: "F11", type: 1, bgcolor: "bg-yellow-100" },
  { label: "", cell: "G11", type: 1, bgcolor: "bg-yellow-100" },
  { label: "", cell: "H11", type: 1, bgcolor: "bg-yellow-100" },
  { label: "", cell: "I11", type: 1, bgcolor: "bg-yellow-100" },
  { label: "", cell: "J11", type: 1, bgcolor: "bg-yellow-100" },
  { label: "", cell: "K11", type: 1, bgcolor: "bg-yellow-100" },
  { label: "", cell: "L11", type: 1, bgcolor: "bg-yellow-100" },
];

// Data rows for DOWN scenarios (rows 12-17)
export const downScenarioRows: ProfitPlanRowDataType[] = [
  { label: "売上", cell: "B12", type: 1, bgcolor: "bg-yellow-100" },
  { label: "変動費", cell: "B13", type: 1, bgcolor: "bg-yellow-100" },
  { label: "粗利", cell: "B14", type: 1, bgcolor: "bg-yellow-100" },
  { label: "固定費", cell: "B15", type: 1, bgcolor: "bg-yellow-100" },
  { label: "営業利益", cell: "B16", type: 1, bgcolor: "bg-yellow-100" },
  { label: "益率", cell: "B17", type: 1, bgcolor: "bg-yellow-100" },
];

// All cells for DOWN scenarios (C12-L17)
export const downScenarioDataCells: string[] = [
  "C12", "D12", "E12", "F12", "G12", "H12", "I12", "J12", "K12", "L12", // Sales
  "C13", "D13", "E13", "F13", "G13", "H13", "I13", "J13", "K13", "L13", // Variable costs
  "C14", "D14", "E14", "F14", "G14", "H14", "I14", "J14", "K14", "L14", // Gross profit
  "C15", "D15", "E15", "F15", "G15", "H15", "I15", "J15", "K15", "L15", // Fixed costs
  "C16", "D16", "E16", "F16", "G16", "H16", "I16", "J16", "K16", "L16", // Operating profit
  "C17", "D17", "E17", "F17", "G17", "H17", "I17", "J17", "K17", "L17", // Profit margin
];

// Combined data for all cells that need to be displayed
export const allProfitPlanCells = [
  ...upScenarioHeaders,
  ...upGpRateRow,
  ...upScenarioRows,
  ...downScenarioHeaders,
  ...downGpRateRow,
  ...downScenarioRows,
];

// Column headers for the table display
export const columnHeaders = [
  "", // Row labels column
  "現状", "粗利 1% UP", "粗利 2% UP", "粗利 3% UP", "粗利 4% UP", "粗利 5% UP",
  "粗利 6% UP", "粗利 7% UP", "粗利 8% UP", "粗利 9% UP", "粗利 10% UP",
];

// Row labels
export const rowLabels = [
  "売上", "変動費", "粗利", "固定費", "営業利益", "益率"
];

// Special cells that need special handling
export const specialCells = {
  // Title cell (merged F1:L1)
  title: "F1",
  
  // Notes cells
  note1: "A18", // "粗利が増えれば純利益が増えます。メモ"
  note2: "A19", // "しかし10%落とすと・・・?"
  
  // Logo area (L22:L25)
  logo: "L22"
};
