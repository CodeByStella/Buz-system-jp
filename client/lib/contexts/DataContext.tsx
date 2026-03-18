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
import { useOptionalWorkbookContext } from "./WorkbookContext";

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
  resetAllData: () => Promise<void>;
  resetting: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const workbookContext = useOptionalWorkbookContext();
  const workbook = workbookContext?.workbook ?? "pdca";
  const [userInput, setUserInput] = useState<FrontendDataType>({});
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
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

  useEffect(() => {
    if (!hfInstanceRef.current) {
      hfInstanceRef.current = HyperFormula.buildEmpty({
        licenseKey: "gpl-v3",
      });
    }

    // Clear edit tracking when switching workbooks so getChangedCells() never uses stale sheet ids
    userEditedCellsRef.current.clear();
    formulaCellsRef.current.clear();

    fetchUserInputs();

    return () => {
      if (hfInstanceRef.current) {
        hfInstanceRef.current = null;
      }
    };
  }, [workbook]);

  const fetchUserInputs = async () => {
    console.log("fetching user input.............")
    try {
      setLoading(true);
      setErrorMessage(null);

      const backendData: BackendDataType[] = await userService.getUserInputs(workbook);
      console.log("Backend data received:", backendData.length, "items");

      // [DEBUG] Result sheet: did backend send result!E6, C6, etc.?
      if (workbook === "company_rating") {
        const resultItems = backendData.filter((i) => i.sheet === "result");
        const sampleCells = ["C6", "E6", "C7", "E7", "E26", "J26"];
        console.log("[ResultSheet DEBUG] Backend result sheet items:", resultItems.length);
        sampleCells.forEach((cell) => {
          const item = resultItems.find((i) => i.cell === cell);
          const isForm = item && isFormula(item.value);
          console.log(`[ResultSheet DEBUG] Backend result!${cell}:`, item ? (isForm ? "FORMULA" : item.value) : "MISSING");
        });
      }

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

      // Company_rating result: ensure key formula cells exist so E26, E42, J26, J42 (and display) always work
      if (workbook === "company_rating" && frontendData.result) {
        const resultSheet = frontendData.result;
        const ensureResultCell = (cell: string, formula: string) => {
          const { row, col } = cellToIndices(cell);
          while (resultSheet.length <= row) resultSheet.push([]);
          while (resultSheet[row].length <= col) resultSheet[row].push("");
          const cur = resultSheet[row][col];
          const isEmpty = cur === undefined || cur === "";
          const isError = typeof cur === "string" && /#(CYCLE|ERROR|REF|VALUE|NAME|DIV\/0|N\/A|NUM|NULL)!?/.test(cur);
          const isNotFormula = typeof cur !== "string" || !String(cur).trim().startsWith("=");
          if (isEmpty || isError || isNotFormula) resultSheet[row][col] = formula;
        };
        ensureResultCell("E26", "=SUM(E5:E25)");
        ensureResultCell("E40", "=SUM(E28:E38)");
        ensureResultCell("E42", "=E26+E40");
        // J26, J42 (格付け判定) are manual entry — not ensured as formulas
      }

      // [DEBUG] After transform: does frontendData.result have formulas at E6 (row 5, col 4)?
      if (workbook === "company_rating" && frontendData.result) {
        const r5 = frontendData.result[5];
        console.log("[ResultSheet DEBUG] After transform result row 5 (Excel row 6):", r5 ? [r5[2], r5[4]] : "no row 5");
        console.log("[ResultSheet DEBUG] result[5][4] (E6) is formula?", typeof r5?.[4] === "string" && (r5?.[4] as string).startsWith("="));
      }

      // Initialize HyperFormula with the data
      console.log("Initializing HyperFormula...");
      initializeHyperFormula(frontendData, workbook);

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

  // Sheet order for company_rating: input_data first (result formulas depend on it)
  const COMPANY_RATING_SHEET_ORDER = [
    "input_data",
    "result",
    "score_table",
    "safety_indicators",
  ];

  // Initialize HyperFormula with sheets and formulas
  const initializeHyperFormula = (
    frontendData: FrontendDataType,
    currentWorkbook?: string
  ) => {
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

    const sheetNames = Object.keys(frontendData);
    // For company_rating, add sheets in dependency order so result can reference input_data
    const orderedNames =
      currentWorkbook === "company_rating"
        ? COMPANY_RATING_SHEET_ORDER.filter((n) => sheetNames.includes(n)).concat(
            sheetNames.filter((n) => !COMPANY_RATING_SHEET_ORDER.includes(n))
          )
        : sheetNames;

    orderedNames.forEach((sheetName) => {
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

    // Normalize 2D array to rectangular grid (HyperFormula expects consistent dimensions)
    const toRectangular = (grid: (string | number)[][]): (string | number)[][] => {
      if (!grid.length) return grid;
      const safeRow = (row: (string | number)[] | undefined) => row ?? [];
      const maxCols = Math.max(...grid.map((r) => safeRow(r).length));
      return grid.map((row) => {
        const padded = [...safeRow(row)];
        while (padded.length < maxCols) padded.push("");
        return padded;
      });
    };

    // Company-rating result sheet: ensure min 42 rows x 10 cols so E26/E42/J26/J42 and all 配点 cells are in range
    const RESULT_SHEET_MIN_ROWS = 42;
    const RESULT_SHEET_MIN_COLS = 10;

    // HyperFormula does not recognize bare TRUE/FALSE in formula text (only TRUE()/FALSE() or named expressions)
    const rewriteTrueFalseInFormula = (formula: string): string =>
      formula
        .replace(/([,(])TRUE([,)])/g, "$1TRUE()$2")
        .replace(/([,(])FALSE([,)])/g, "$1FALSE()$2");

    // Set cell values in same dependency order so result formulas see input_data
    orderedNames.forEach((sheetName) => {
      let sheetData = frontendData[sheetName];
      const sheetId = hf.getSheetId(sheetName);
      if (sheetId === undefined || !sheetData || sheetData.length === 0) return;

      // Company_rating result: ensure min dimensions so E26, E42, J26, J42 (and E19, etc.) are in grid
      if (currentWorkbook === "company_rating" && sheetName === "result") {
        const rows = sheetData.length;
        const needRows = Math.max(0, RESULT_SHEET_MIN_ROWS - rows);
        if (needRows > 0) {
          sheetData = [...sheetData] as (string | number)[][];
          for (let i = 0; i < needRows; i++) sheetData.push([]);
        }
      }

      const rectangular = toRectangular(sheetData);
      let grid = rectangular.map((row) =>
        row.map((cell) => {
          if (typeof cell === "string" && cell.includes("#")) {
            console.warn(
              `Found error value in ${sheetName}, replacing with empty string`
            );
            return "";
          }
          if (typeof cell === "string" && cell.trim().startsWith("=")) {
            return rewriteTrueFalseInFormula(cell);
          }
          return cell;
        })
      );

      if (currentWorkbook === "company_rating" && sheetName === "result") {
        const minCols = Math.max(grid[0]?.length ?? 0, RESULT_SHEET_MIN_COLS);
        grid = grid.map((row) => {
          const r = [...row];
          while (r.length < minCols) r.push("");
          return r;
        });
      }

      try {
        hf.setSheetContent(sheetId, grid);
        if (currentWorkbook === "company_rating" && sheetName === "result") {
          const dims = hf.getSheetDimensions(sheetId);
          console.log("[ResultSheet DEBUG] setSheetContent result OK. Dimensions:", dims.height, "x", dims.width);
          const e6Val = hf.getCellValue({ sheet: sheetId, row: 5, col: 4 });
          const c6Val = hf.getCellValue({ sheet: sheetId, row: 5, col: 2 });
          console.log("[ResultSheet DEBUG] Right after set, HF result!C6:", c6Val, "result!E6:", e6Val);
        }
      } catch (error) {
        console.error(`Error setting content for sheet ${sheetName}:`, error);
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
          const cellValue = hf.getCellValue({ sheet: sheetId, row, col });
          // HyperFormula returns DetailedCellError for formula errors; store .value (e.g. "#NAME?") so UI can show "—"
          const normalized =
            cellValue != null && typeof cellValue === "object" && "value" in cellValue && typeof (cellValue as { value: string }).value === "string"
              ? (cellValue as { value: string }).value
              : cellValue ?? "";
          sheetData[row][col] = normalized;
        }
      }

      result[sheetName] = sheetData;

      if (sheetName === "result") {
        console.log("[ResultSheet DEBUG] getCalculatedData result sheet size:", sheetSize.height, "x", sheetSize.width);
        console.log("[ResultSheet DEBUG] getCalculatedData result!C6 (row5 col2):", sheetData[5]?.[2]);
        console.log("[ResultSheet DEBUG] getCalculatedData result!E6 (row5 col4):", sheetData[5]?.[4]);
        console.log("[ResultSheet DEBUG] getCalculatedData result!E26 (row25 col4):", sheetData[25]?.[4]);
      }
    });

    return result;
  };

  // Company-rating result manual cells: 配点 (E6–E25, E28–E38) and 格付け判定 (J26, J42). Allow overwrite/save even if DB had old formulas.
  const isResultManualCell = (cell: string): boolean => {
    if (cell === "J26" || cell === "J42") return true;
    const m = cell.match(/^E(\d+)$/);
    if (!m) return false;
    const row = parseInt(m[1], 10);
    return (row >= 6 && row <= 25) || (row >= 28 && row <= 38);
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
      // Prevent overwriting formula cells with non-formula values, except company_rating result manual cells (配点 + 格付け判定)
      const isEditableResultCell =
        workbook === "company_rating" && sheet === "result" && isResultManualCell(cell);
      if (
        formulaCellsRef.current.has(cellKey) &&
        !isFormula(value) &&
        !isEditableResultCell
      ) {
        console.warn(
          `Attempted to overwrite formula cell ${cellKey} with non-formula value: ${value}. Ignoring change to preserve formula.`
        );
        return; // Exit early to prevent formula overwrite
      }

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

    // Only process user-edited cells (skip cells whose sheet no longer exists, e.g. after tab switch before refs cleared)
    userEditedCellsRef.current.forEach((cellKey) => {
      const [sheetName, cellRef] = cellKey.split(":");
      const sheetId = sheetIdsRef.current.get(sheetName);

      if (sheetId === undefined) return;

      const { row, col } = cellToIndices(cellRef);

      // Guard: never send updates for cells that were formulas in the original data (except company_rating result manual cells: 配点 + 格付け判定)
      const originalData = originalDataMap.get(cellKey);
      const isEditableResultCell =
        workbook === "company_rating" && sheetName === "result" && isResultManualCell(cellRef);
      if (
        originalData &&
        typeof originalData.value === "string" &&
        originalData.value.trim().startsWith("=") &&
        !isEditableResultCell
      ) {
        return; // skip updates to originally-formula cells entirely
      }

      let cellContents: string | number | null = null;
      let cellValue: unknown = null;
      try {
        cellContents = hf.getCellSerialized({ sheet: sheetId, row, col }) as string | number | null;
        cellValue = hf.getCellValue({ sheet: sheetId, row, col });
      } catch (err) {
        // Sheet may no longer exist after switching workbooks (e.g. "There's no sheet with id = 12")
        return;
      }

      // Determine the value to save
      let valueToSave: number | string | null = null;

      // Guard: never send formulas to the backend
      if (typeof cellContents === "string" && cellContents.trim().startsWith("=")) {
        return; // user entered a formula or kept a formula; do not send
      } else {
        // This is a regular value - get the actual value
        if (cellValue === null || cellValue === undefined || cellValue === "") {
          valueToSave = "";
        } else {
          valueToSave = cellValue as number | string;
        }
      }

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

      await userService.saveMultipleInputs(bulkData, workbook);

      const updatedBackendData: BackendDataType[] =
        await userService.getUserInputs(workbook);
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
  const getCell = (sheet: string, cell: string): string | number | undefined => {
    const sheetData = userInput[sheet];
    if (!sheetData) {
      if (sheet === "result" && ["E6", "E7", "E26", "J26"].includes(cell)) {
        console.log("[ResultSheet DEBUG] getCell", sheet, cell, "-> no sheetData, returning ''");
      }
      return "";
    }

    try {
      const { row, col } = cellToIndices(cell);
      const val = sheetData[row]?.[col];
      const out = val !== undefined && val !== null ? val : "";
      if (sheet === "result" && ["E6", "E7", "E26", "J26"].includes(cell)) {
        console.log("[ResultSheet DEBUG] getCell", sheet, cell, "row", row, "col", col, "->", out);
      }
      return out;
    } catch (e) {
      if (sheet === "result") console.log("[ResultSheet DEBUG] getCell", sheet, cell, "throw", e);
      return "";
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

  // Reset all data to initial seed values
  const resetAllData = async () => {
    try {
      setResetting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      console.log("Starting full data reset...");
      
      const response = await userService.resetUserData(workbook);
      
      if (response.success && response.resetCompleted) {
        console.log("Reset successful, refetching data...");
        
        // Instead of using the response data, refetch all data from server
        // This ensures we get the latest seeded data
        await fetchUserInputs();
        
        setSuccessMessage(response.message);
        
        console.log("Data reset completed successfully");
        
        // Auto-clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      } else {
        throw new Error("Reset failed");
      }
    } catch (error) {
      console.error("Failed to reset data:", error);
      
      let errorMessage = "データのリセットに失敗しました";
      
      if (error instanceof Error) {
        if (error.message.includes("サーバーに接続できません")) {
          errorMessage = "サーバーに接続できません。ネットワーク接続を確認してください。";
        } else if (error.message.includes("認証が必要です")) {
          errorMessage = "認証が必要です。ページを再読み込みしてください。";
        } else if (error.message.includes("timeout") || error.message.includes("タイムアウト")) {
          errorMessage = "リセット処理がタイムアウトしました。しばらく待ってから再試行してください。";
        } else if (error.message.includes("データベース")) {
          errorMessage = "データベースエラーが発生しました。しばらく待ってから再試行してください。";
        } else {
          errorMessage = `データのリセットに失敗しました: ${error.message}`;
        }
      }
      
      setErrorMessage(errorMessage);
      
      // Auto-clear error message after 8 seconds
      setTimeout(() => {
        setErrorMessage(null);
      }, 8000);
    } finally {
      setResetting(false);
    }
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
    resetAllData,
    resetting,
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

// Optional variant that returns undefined instead of throwing when no provider
export const useOptionalDataContext = (): DataContextType | undefined => {
  return useContext(DataContext);
};