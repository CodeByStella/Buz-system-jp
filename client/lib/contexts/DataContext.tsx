"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { HyperFormula } from "hyperformula";
import {
  FrontendData,
  BackendData,
  transformBe2Fe,
} from "../transformers/dataTransformer";
import { userService } from "../services";
import { cellToIndices, indicesToCell } from "../utils/cellHelpers";

interface DataContextType {
  data: FrontendData;
  onChange: (sheet: string, cell: string, value: number) => void;
  onSave: () => Promise<void>;
  saving: boolean;
  hasChanges: boolean;
  getCell: (sheet: string, cell: string) => string | number | undefined;
  loading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  clearMessages: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [userInput, setUserInput] = useState<FrontendData>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Store original data from server for change tracking
  const originalDataRef = useRef<BackendData[]>([]);

  // HyperFormula instance
  const hfInstanceRef = useRef<HyperFormula | null>(null);

  // Map sheet names to sheet IDs in HyperFormula
  const sheetIdsRef = useRef<Map<string, number>>(new Map());

  // Initialize HyperFormula instance
  useEffect(() => {
    if (!hfInstanceRef.current) {
      hfInstanceRef.current = HyperFormula.buildEmpty({
        licenseKey: "gpl-v3",
      });
    }

    // Fetch initial data
    fetchUserInputs();

    return () => {
      if (hfInstanceRef.current) {
        hfInstanceRef.current = null;
      }
    };
  }, []);

  const fetchUserInputs = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
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
      setErrorMessage("データの読み込みに失敗しました");
      
      // Auto-clear error message after 5 seconds
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    } finally {
      setLoading(false);
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
    if (
      serializedCell &&
      typeof serializedCell === "string" &&
      serializedCell.startsWith("=")
    ) {
      console.warn(
        `Cannot edit cell ${cell} in sheet ${sheet} - it contains a formula`
      );
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
          const serializedCell = hf.getCellSerialized({
            sheet: sheetId,
            row,
            col,
          });

          // Skip empty cells
          if (
            cellValue === null ||
            cellValue === undefined ||
            cellValue === ""
          ) {
            continue;
          }

          // Skip cells with formulas (they are calculated, not user input)
          if (
            serializedCell &&
            typeof serializedCell === "string" &&
            serializedCell.startsWith("=")
          ) {
            continue;
          }

          const originalData = originalDataMap.get(key);

          // Check if value changed
          const currentValue =
            typeof cellValue === "number" ? cellValue : Number(cellValue) || 0;

          if (!originalData) {
            // New cell that wasn't in original data
            changedCells.push({
              sheet: sheetName,
              cell: cellRef,
              value: currentValue,
              formula: "",
            });
          } else if (
            originalData.value !== currentValue &&
            !originalData.formula
          ) {
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
      setErrorMessage(null);
      setSuccessMessage(null);

      // Get only changed cells
      const changedCells = getChangedCells();

      if (changedCells.length === 0) {
        setSuccessMessage("変更はありません");
        
        // Auto-clear info message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
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
      const updatedBackendData: BackendData[] =
        await userService.getUserInputs();
      originalDataRef.current = JSON.parse(JSON.stringify(updatedBackendData));

      setSuccessMessage(`${changedCells.length}件の変更を保存しました`);
      console.log("Changes saved successfully");

      // Auto-clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Failed to save changes:", error);
      setErrorMessage("保存に失敗しました。もう一度お試しください。");
      
      // Auto-clear error message after 5 seconds
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    } finally {
      setSaving(false);
    }
  };

  // Helper to get cell value by reference
  const getCell = (
    sheet: string,
    cell: string
  ): string | number => {
    const sheetData = userInput[sheet];
    if (!sheetData) return cell; // Return the text itself if sheet doesn't exist

    try {
      const { row, col } = cellToIndices(cell);
      return sheetData[row]?.[col];
    } catch {
      return cell; // Return the text itself if it's not a valid cell reference
    }
  };

  // Clear messages
  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const value: DataContextType = {
    data: userInput,
    onChange: handleChangeCell,
    onSave: handleSave,
    saving,
    hasChanges: getChangedCells().length > 0,
    getCell,
    loading,
    errorMessage,
    successMessage,
    clearMessages,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

/**
 * Hook to access spreadsheet data and operations
 *
 * Usage in sheet components:
 * ```tsx
 * const { 
 *   data, 
 *   onChange, 
 *   onSave, 
 *   saving, 
 *   hasChanges, 
 *   getCell,
 *   errorMessage,
 *   successMessage,
 *   clearMessages
 * } = useDataContext();
 *
 * // Get cell value by reference
 * const value = getCell("start", "B6");
 *
 * // Update cell value
 * onChange("start", "B6", 100);
 *
 * // Save changes
 * await onSave();
 *
 * // Show messages
 * {errorMessage && <div className="error">{errorMessage}</div>}
 * {successMessage && <div className="success">{successMessage}</div>}
 * ```
 */
export const useDataContext = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
