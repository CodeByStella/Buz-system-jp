"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { authService, userService } from "@/lib/services";
import { HyperFormula } from "hyperformula";

// Import all sheet components
import MQCurrentSheet from "@/components/sheets/mq-current-sheet";
import { ProfitSheet } from "@/components/sheets/profit-sheet";
import MQFutureSheet from "@/components/sheets/mq-future-sheet";
import BreakevenSheet from "@/components/sheets/breakeven-sheet";
import SalarySheet from "@/components/sheets/salary-sheet";
import ExpensesSheet from "@/components/sheets/expenses-sheet";
import ManufacturingLaborSheet from "@/components/sheets/manufacturing-labor-sheet";
import ManufacturingExpensesSheet from "@/components/sheets/manufacturing-expenses-sheet";
import CostDetailsSheet from "@/components/sheets/cost-details-sheet";
import ProgressSheet from "@/components/sheets/progress-sheet";
import SalesPlanSheet from "@/components/sheets/sales-plan-sheet";
import ProfitPlanSheet from "@/components/sheets/profit-plan-sheet";
import StartSheet from "@/components/sheets/start-sheet";
import {
  FrontendData,
  transformBe2Fe,
  transformFe2Be,
  BackendData,
} from "@/lib/transformers/dataTransformer";
import { DataProvider } from "@/lib/contexts/DataContext";

interface User {
  id: string;
  email: string;
  name?: string;
  role?: "ADMIN" | "USER";
}

// Helper to convert cell reference to indices (0-based)
const cellToIndices = (cell: string): { row: number; col: number } => {
  const match = cell.match(/^([A-Z]+)(\d+)$/);
  if (!match) throw new Error(`Invalid cell reference: ${cell}`);

  const colStr = match[1];
  const rowStr = match[2];

  let col = 0;
  for (let i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - 65 + 1);
  }

  const row = parseInt(rowStr);
  return { row: row - 1, col: col - 1 }; // Convert to 0-based
};

// Helper to convert indices to cell reference
const indicesToCell = (row: number, col: number): string => {
  let colStr = "";
  let c = col + 1; // Convert to 1-based

  while (c > 0) {
    const remainder = (c - 1) % 26;
    colStr = String.fromCharCode(65 + remainder) + colStr;
    c = Math.floor((c - 1) / 26);
  }

  return colStr + (row + 1); // Convert to 1-based
};

export default function DashboardLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("start");
  const [userInput, setUserInput] = useState<FrontendData>({});
  const [saving, setSaving] = useState(false);
  
  // Store original data from server for change tracking
  const originalDataRef = useRef<BackendData[]>([]);
  
  // HyperFormula instance
  const hfInstanceRef = useRef<HyperFormula | null>(null);
  
  // Map sheet names to sheet IDs in HyperFormula
  const sheetIdsRef = useRef<Map<string, number>>(new Map());
  
  const router = useRouter();

  // Initialize HyperFormula instance
  useEffect(() => {
    if (!hfInstanceRef.current) {
      hfInstanceRef.current = HyperFormula.buildEmpty({
        licenseKey: "gpl-v3",
      });
    }

    return () => {
      // Cleanup on unmount
      if (hfInstanceRef.current) {
        hfInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    fetchUser();
    fetchUserInputs();
  }, []);

  const fetchUser = async () => {
    try {
      const data = await authService.getCurrentUser();
      setUser(data);
    } catch (error) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInputs = async () => {
    try {
      const backendData: BackendData[] = await userService.getUserInputs();
      
      // Store original data for change tracking
      originalDataRef.current = JSON.parse(JSON.stringify(backendData));
      
      // Transform to frontend format
      const frontendData = transformBe2Fe(backendData);
      
      // Initialize HyperFormula with the data
      initializeHyperFormula(frontendData);
      
      // Get calculated values from HyperFormula
      const calculatedData = getCalculatedData();
      
      setUserInput(calculatedData);
    } catch (error) {
      console.error("Failed to fetch user inputs:", error);
    }
  };

  // Initialize HyperFormula with sheets and formulas
  const initializeHyperFormula = (frontendData: FrontendData) => {
    const hf = hfInstanceRef.current;
    if (!hf) return;

    // Clear existing sheets
    const existingSheets = hf.getSheetNames();
    existingSheets.forEach((sheetName) => {
      const sheetId = hf.getSheetId(sheetName);
      if (sheetId !== undefined) {
        hf.removeSheet(sheetId);
      }
    });
    sheetIdsRef.current.clear();

    // Add sheets from frontendData (already transformed)
    Object.entries(frontendData).forEach(([sheetName, sheetData]) => {
      // Add sheet to HyperFormula
      hf.addSheet(sheetName);
      const sheetId = hf.getSheetId(sheetName);
      
      if (sheetId !== undefined) {
        sheetIdsRef.current.set(sheetName, sheetId);
        
        // Set sheet content directly from transformed data
        if (sheetData && sheetData.length > 0) {
          hf.setSheetContent(sheetId, sheetData);
        }
      }
    });
  };

  // Get calculated data from HyperFormula
  const getCalculatedData = (): FrontendData => {
    const hf = hfInstanceRef.current;
    if (!hf) return {};

    const result: FrontendData = {};

    sheetIdsRef.current.forEach((sheetId, sheetName) => {
      const sheetSize = hf.getSheetDimensions(sheetId);
      const sheetData: any[][] = [];

      for (let row = 0; row < sheetSize.height; row++) {
        sheetData[row] = [];
        for (let col = 0; col < sheetSize.width; col++) {
          // Only get calculated value (optimized - single call per cell)
          const cellValue = hf.getCellValue({ sheet: sheetId, row, col });
          sheetData[row][col] = cellValue ?? "";
        }
      }

      result[sheetName] = sheetData;
    });

    return result;
  };

  // Handle cell change
  const handleChangeCell = (sheet: string, cell: string, value: number) => {
    const hf = hfInstanceRef.current;
    if (!hf) return;

    const sheetId = sheetIdsRef.current.get(sheet);
    if (sheetId === undefined) return;

    const { row, col } = cellToIndices(cell);

    // Check if this cell has a formula (shouldn't be editable)
    const serializedCell = hf.getCellSerialized({ sheet: sheetId, row, col });
    if (serializedCell && typeof serializedCell === "string" && serializedCell.startsWith("=")) {
      console.warn(`Cannot edit cell ${cell} in sheet ${sheet} - it contains a formula`);
      return;
    }

    // Update the cell value in HyperFormula
    hf.setCellContents({ sheet: sheetId, row, col }, [[value]]);

    // Get updated calculated data
    const calculatedData = getCalculatedData();
    
    setUserInput(calculatedData);
  };

  // Get changed cells compared to original data
  const getChangedCells = (): BackendData[] => {
    const hf = hfInstanceRef.current;
    if (!hf) return [];

    const changedCells: BackendData[] = [];
    const originalDataMap = new Map<string, BackendData>();

    // Create map of original data for quick lookup
    originalDataRef.current.forEach((item) => {
      const key = `${item.sheet}:${item.cell}`;
      originalDataMap.set(key, item);
    });

    // Check each cell in HyperFormula for changes
    sheetIdsRef.current.forEach((sheetId, sheetName) => {
      const sheetSize = hf.getSheetDimensions(sheetId);

      for (let row = 0; row < sheetSize.height; row++) {
        for (let col = 0; col < sheetSize.width; col++) {
          const cellRef = indicesToCell(row, col);
          const key = `${sheetName}:${cellRef}`;
          
          const cellValue = hf.getCellValue({ sheet: sheetId, row, col });
          const serializedCell = hf.getCellSerialized({ sheet: sheetId, row, col });
          
          // Skip empty cells
          if (cellValue === null || cellValue === undefined || cellValue === "") {
            continue;
          }
          
          // Skip cells with formulas (they are calculated, not user input)
          if (serializedCell && typeof serializedCell === "string" && serializedCell.startsWith("=")) {
            continue;
          }
          
          const originalData = originalDataMap.get(key);
          
          // Check if value changed
          const currentValue = typeof cellValue === "number" ? cellValue : Number(cellValue) || 0;
          
          if (!originalData) {
            // New cell that wasn't in original data
            changedCells.push({
              sheet: sheetName,
              cell: cellRef,
              value: currentValue,
              formula: "",
            });
          } else if (originalData.value !== currentValue && !originalData.formula) {
            // Value changed and it's not a formula cell
            changedCells.push({
              sheet: sheetName,
              cell: cellRef,
              value: currentValue,
              formula: "",
            });
          }
        }
      }
    });

    return changedCells;
  };

  // Save changes to backend
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Get only changed cells
      const changedCells = getChangedCells();
      
      if (changedCells.length === 0) {
        console.log("No changes to save");
        return;
      }

      console.log(`Saving ${changedCells.length} changed cells:`, changedCells);
      
      // Convert to bulk save format
      const bulkData = changedCells.map((cell) => ({
        sheet: cell.sheet,
        cell: cell.cell,
        value: cell.value,
      }));
      
      // Send bulk update to backend
      await userService.saveMultipleInputs(bulkData);
      
      // Update original data to reflect saved state
      const updatedBackendData: BackendData[] = await userService.getUserInputs();
      originalDataRef.current = JSON.parse(JSON.stringify(updatedBackendData));
      
      console.log("Changes saved successfully");
    } catch (error) {
      console.error("Failed to save changes:", error);
    } finally {
      setSaving(false);
    }
  };

  const contextValue = {
    data: userInput,
    onChange: handleChangeCell,
    onSave: handleSave,
    saving,
    hasChanges: getChangedCells().length > 0,
  };

  const renderContent = () => {
    switch (activeTab) {
      case "start":
        return <StartSheet />;
      case "mq-current":
        return <MQCurrentSheet />;
      case "profit":
        return <ProfitSheet />;
      case "mq-future":
        return <MQFutureSheet />;
      case "salary":
        return <SalarySheet />;
      case "expenses":
        return <ExpensesSheet />;
      case "manufacturing-labor":
        return <ManufacturingLaborSheet />;
      case "manufacturing-expenses":
        return <ManufacturingExpensesSheet />;
      case "cost-details":
        return <CostDetailsSheet />;
      case "breakeven":
        return <BreakevenSheet />;
      case "progress":
        return <ProgressSheet />;
      case "sales-plan":
        return <SalesPlanSheet />;
      case "profit-plan":
        return <ProfitPlanSheet />;
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">準備中</h1>
            <p className="text-gray-600">このセクションは開発中です。</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <div className="w-64 bg-white border-r border-gray-200 h-screen">
            <div className="p-4">
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="mt-4 space-y-2">
              {[...Array(13)].map((_, i) => (
                <div key={i} className="px-4 py-2">
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="p-6">
              <div className="h-64 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DataProvider value={contextValue}>
      <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">
        <Header />
        <div className="flex-1 overflow-hidden flex justify-center">
          <div className="w-full max-w-[1440px] h-full p-4">
            <div className="h-full border border-gray-200 bg-white overflow-hidden">
              <div className="flex h-full">
                <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Save button bar */}
                  {/* <div className="border-b border-gray-200 px-6 py-3 flex justify-end items-center gap-3">
                    <div className="text-sm text-gray-500">
                      {getChangedCells().length > 0 && (
                        <span>{getChangedCells().length} 件の変更</span>
                      )}
                    </div>
                    <button
                      onClick={handleSave}
                      disabled={saving || getChangedCells().length === 0}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        saving || getChangedCells().length === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {saving ? "保存中..." : "変更を保存"}
                    </button>
                  </div> */}
                  
                  <main className="flex-1 p-6 overflow-auto">
                    {renderContent()}
                  </main>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DataProvider>
  );
}
