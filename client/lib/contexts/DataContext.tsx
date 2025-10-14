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
  FrontendDataType,
  BackendDataType,
  transformBe2Fe,
} from "../transformers/dataTransformer";
import { userService } from "../services";
import { cellToIndices, indicesToCell } from "../utils/cellHelpers";

interface DataContextType {
  data: FrontendDataType;
  onChange: (sheet: string, cell: string, value: number | string) => void;
  onSave: () => Promise<void>;
  saving: boolean;
  hasChanges: boolean;
  getCell: (sheet: string, cell: string) => string | number | undefined;
  loading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  clearMessages: () => void;
  retry: () => Promise<void>;
  clearSheet: (sheet?: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [userInput, setUserInput] = useState<FrontendDataType>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Store original data from server for change tracking
  const originalDataRef = useRef<BackendDataType[]>([]);

  // HyperFormula instance
  const hfInstanceRef = useRef<HyperFormula | null>(null);

  // Map sheet names to sheet IDs in HyperFormula
  const sheetIdsRef = useRef<Map<string, number>>(new Map());

  // Track cells with formulas (format: "sheet:cell")
  const formulaCellsRef = useRef<Set<string>>(new Set());

  // Track user-edited cells (format: "sheet:cell")
  const userEditedCellsRef = useRef<Set<string>>(new Set());

  // Helper function to check if a value is a formula
  // A formula is a string that starts with "="
  // Regular strings (like "Total", "Sales", etc.) do NOT start with "="
  const isFormula = (value: any): boolean => {
    if (typeof value !== "string") return false;
    const trimmed = value.trim();
    return trimmed.length > 0 && trimmed.startsWith("=");
  };

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

      const backendData: BackendDataType[] = await userService.getUserInputs();
      console.log("Backend data received:", backendData.length, "items");

      // Store original data for change tracking
      originalDataRef.current = JSON.parse(JSON.stringify(backendData));

      // Clear previous formula and edit tracking
      formulaCellsRef.current.clear();
      userEditedCellsRef.current.clear();

      // Identify and track formula cells from backend data
      backendData.forEach((item) => {
        if (isFormula(item.value)) {
          const key = `${item.sheet}:${item.cell}`;
          formulaCellsRef.current.add(key);
        }
      });

      console.log(
        `Loaded ${formulaCellsRef.current.size} formula cells from database`
      );

      // Transform to frontend format
      console.log("Transforming data...");
      const frontendData = transformBe2Fe(backendData);
      console.log("Frontend data transformed:", Object.keys(frontendData));

      // Initialize HyperFormula with the data
      console.log("Initializing HyperFormula...");
      initializeHyperFormula(frontendData);

      // Get calculated values from HyperFormula
      console.log("Getting calculated data...");
      const calculatedData = getCalculatedData();
      console.log("Calculated data ready:", Object.keys(calculatedData));

      setUserInput(calculatedData);
      console.log("Data loading completed successfully");
    } catch (error) {
      console.error("Failed to fetch user inputs:", error);

      // Provide more specific error messages
      let errorMessage = "データの読み込みに失敗しました";

      if (error instanceof Error) {
        if (error.message.includes("サーバーに接続できません")) {
          errorMessage =
            "サーバーに接続できません。ネットワーク接続を確認してください。";
        } else if (error.message.includes("認証が必要です")) {
          errorMessage = "認証が必要です。ページを再読み込みしてください。";
        } else if (error.message.includes("timeout")) {
          errorMessage =
            "リクエストがタイムアウトしました。再試行してください。";
        } else {
          errorMessage = `データの読み込みに失敗しました: ${error.message}`;
        }
      }

      setErrorMessage(errorMessage);

      // Auto-clear error message after 8 seconds for better UX
      setTimeout(() => {
        setErrorMessage(null);
      }, 8000);
    } finally {
      setLoading(false);
    }
  };

  // Initialize HyperFormula with sheets and formulas
  const initializeHyperFormula = (frontendData: FrontendDataType) => {
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

    Object.entries(frontendData).forEach(([sheetName, sheetData]) => {
      try {
        hf.addSheet(sheetName);
        const sheetId = hf.getSheetId(sheetName);
        if (sheetId !== undefined) {
          sheetIdsRef.current.set(sheetName, sheetId);
        }
      } catch (error) {
        console.error(`Error adding sheet ${sheetName}:`, error);
      }
    });

    // Then, set cell values (content) for all sheets
    Object.entries(frontendData).forEach(([sheetName, sheetData]) => {
      const sheetId = hf.getSheetId(sheetName);
      if (sheetId === undefined) return;

      // Set sheet content directly from transformed data
      if (sheetData && sheetData.length > 0) {
        // Additional sanitization before sending to HyperFormula
        const sanitizedSheetData = sheetData.map((row) =>
          row.map((cell) => {
            // Ensure no error values slip through
            if (typeof cell === "string" && cell.includes("#")) {
              console.warn(
                `Found error value in ${sheetName}: ${cell}, replacing with empty string`
              );
              return "";
            }
            return cell;
          })
        );

        try {
          hf.setSheetContent(sheetId, sanitizedSheetData);
        } catch (error) {
          console.error(`Error setting content for sheet ${sheetName}:`, error);
        }
      }
    });
  };

  // Get calculated data from HyperFormula
  const getCalculatedData = (): FrontendDataType => {
    const hf = hfInstanceRef.current;
    if (!hf) return {};

    const result: FrontendDataType = {};

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
  const handleChangeCell = (
    sheet: string,
    cell: string,
    value: number | string
  ) => {
    const hf = hfInstanceRef.current;
    if (!hf) return;

    const sheetId = sheetIdsRef.current.get(sheet);
    if (sheetId === undefined) return;

    const { row, col } = cellToIndices(cell);
    const cellKey = `${sheet}:${cell}`;

    try {
      // Sanitize the value before setting it
      let sanitizedValue = value;
      if (typeof value === "string") {
        // Check for error values
        if (
          value.includes("#DIV/0!") ||
          value.includes("#N/A") ||
          value.includes("#NAME?") ||
          value.includes("#NUM!") ||
          value.includes("#REF!") ||
          value.includes("#VALUE!") ||
          value.includes("#CYCLE!") ||
          value.includes("#ERROR!") ||
          value.includes("#LIC!")
        ) {
          console.warn(
            `Attempted to set error value in ${sheet}:${cell}: ${value}, using empty string instead`
          );
          sanitizedValue = "";
        }
      }

      // Track this cell as user-edited
      userEditedCellsRef.current.add(cellKey);

      // If user enters a formula, track it as a formula cell
      if (isFormula(sanitizedValue)) {
        formulaCellsRef.current.add(cellKey);
        console.log(`User entered formula in ${cellKey}: ${sanitizedValue}`);
      } else {
        // If user overwrites a formula cell with a value, remove it from formula cells
        if (formulaCellsRef.current.has(cellKey)) {
          formulaCellsRef.current.delete(cellKey);
          console.log(
            `User replaced formula in ${cellKey} with value: ${sanitizedValue}`
          );
        }
      }

      // Update the cell value in HyperFormula
      hf.setCellContents({ sheet: sheetId, row, col }, [[sanitizedValue]]);

      // Get updated calculated data
      const calculatedData = getCalculatedData();

      setUserInput(calculatedData);
    } catch (error) {
      console.error(
        `Error setting cell ${sheet}:${cell} to value ${value}:`,
        error
      );
      // Don't update the UI if there was an error
    }
  };

  // Get changed cells compared to original data
  const getChangedCells = (): BackendDataType[] => {
    const hf = hfInstanceRef.current;
    if (!hf) return [];

    const changedCells: BackendDataType[] = [];
    const originalDataMap = new Map<string, BackendDataType>();

    // Create map of original data for quick lookup
    originalDataRef.current.forEach((item) => {
      const key = `${item.sheet}:${item.cell}`;
      originalDataMap.set(key, item);
    });

    // Only process user-edited cells
    userEditedCellsRef.current.forEach((cellKey) => {
      const [sheetName, cellRef] = cellKey.split(":");
      const sheetId = sheetIdsRef.current.get(sheetName);

      if (sheetId === undefined) return;

      const { row, col } = cellToIndices(cellRef);

      // Get the cell contents (formula or value)
      const cellContents = hf.getCellSerialized({ sheet: sheetId, row, col });

      // Determine the value to save
      let valueToSave: number | string | null = null;

      if (
        typeof cellContents === "string" &&
        cellContents.trim().startsWith("=")
      ) {
        // This is a formula - save the formula string
        valueToSave = cellContents;
      } else {
        // This is a regular value - get the actual value
        const cellValue = hf.getCellValue({ sheet: sheetId, row, col });

        // If cell is empty, mark for deletion
        if (cellValue === null || cellValue === undefined || cellValue === "") {
          valueToSave = "";
        } else {
          valueToSave = cellValue as number | string;
        }
      }

      const originalData = originalDataMap.get(cellKey);

      // Check if the value actually changed
      if (!originalData && valueToSave !== "") {
        // New cell that wasn't in original data (and not empty)
        changedCells.push({
          sheet: sheetName,
          cell: cellRef,
          value: valueToSave,
        });
      } else if (originalData) {
        // Cell existed before
        if (valueToSave === "" && originalData.value !== "") {
          // User cleared the cell - save as empty to delete it
          changedCells.push({
            sheet: sheetName,
            cell: cellRef,
            value: "",
          });
        } else if (originalData.value !== valueToSave) {
          // Value changed
          changedCells.push({
            sheet: sheetName,
            cell: cellRef,
            value: valueToSave,
          });
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
      const updatedBackendData: BackendDataType[] =
        await userService.getUserInputs();
      originalDataRef.current = JSON.parse(JSON.stringify(updatedBackendData));

      // Clear user-edited cells since they're now saved
      userEditedCellsRef.current.clear();

      // Re-identify formula cells from updated data
      formulaCellsRef.current.clear();
      updatedBackendData.forEach((item) => {
        if (isFormula(item.value)) {
          const key = `${item.sheet}:${item.cell}`;
          formulaCellsRef.current.add(key);
        }
      });

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

  // Reset cells back to last loaded server state (does NOT delete formulas)
  // If sheet is omitted, reset all sheets
  const clearSheet = (sheet?: string) => {
    const hf = hfInstanceRef.current;
    if (!hf) return;

    // Build frontend snapshot from original backend data
    const originalFrontend = transformBe2Fe(originalDataRef.current);

    const targetSheets = sheet ? [sheet] : Object.keys(originalFrontend);

    targetSheets.forEach((sheetName) => {
      const sheetId = sheetIdsRef.current.get(sheetName);
      if (sheetId === undefined) return;

      // If we have original content for this sheet, apply it entirely
      const sheetContent = originalFrontend[sheetName] || [];
      try {
        hf.setSheetContent(sheetId, sheetContent);
      } catch (e) {
        console.error(`Failed to reset sheet ${sheetName}:`, e);
      }

      // Remove edited flags for this sheet
      const toDelete: string[] = [];
      userEditedCellsRef.current.forEach((key) => {
        if (key.startsWith(`${sheetName}:`)) toDelete.push(key);
      });
      toDelete.forEach((k) => userEditedCellsRef.current.delete(k));
    });

    // Recompute and update UI
    const calculatedData = getCalculatedData();
    setUserInput(calculatedData);
  };

  // Helper to get cell value by reference
  const getCell = (sheet: string, cell: string): string | number => {
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

  // Retry function for failed data loading
  const retry = async () => {
    await fetchUserInputs();
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
    retry,
    clearSheet,
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
