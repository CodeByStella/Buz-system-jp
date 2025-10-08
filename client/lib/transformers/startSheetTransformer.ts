import {
  MainRowDataType,
  OthersRowDataType,
  SummaryRowDataType,
} from "@/components/sheets/start-sheet/StartSheetCells";

/**
 * Backend data structure
 */
interface BackendMainRow {
  incomeStatement?: number;
  manufacturingCostReport?: number;
}

interface BackendOthersRow {
  title?: string;
  amount?: number;
}

interface BackendStartSheet {
  [key: string]: BackendMainRow | BackendOthersRow[] | number | undefined;
}

/**
 * Transform backend data to frontend format
 */
export function transformBackendToFrontend(
  backendData: BackendStartSheet | null,
  initialMain: MainRowDataType[],
  initialOthers: OthersRowDataType[]
): {
  main: MainRowDataType[];
  others: OthersRowDataType[];
} {
  if (!backendData) {
    return {
      main: initialMain,
      others: initialOthers,
    };
  }

  // Transform main data
  const transformedMain = initialMain.map((row) => {
    const backendRow = backendData[row.key] as BackendMainRow | undefined;

    if (backendRow && typeof backendRow === "object" && !Array.isArray(backendRow)) {
      return {
        ...row,
        incomeStatement: {
          ...row.incomeStatement,
          value: backendRow.incomeStatement ?? row.incomeStatement.value,
        },
        manufacturingCostReport: {
          ...row.manufacturingCostReport,
          value: backendRow.manufacturingCostReport ?? row.manufacturingCostReport.value,
        },
      };
    }

    return row;
  });

  // Transform others data
  const transformedOthers: OthersRowDataType[] = [];

  // For each key in backendData, if it's an array (others), convert to OthersRowDataType[]
  Object.entries(backendData).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // Add a header row (non-editable) for this group, if initialOthers has it
      const header = initialOthers.find(
        (row) => row.key === key && !row.editable
      );
      if (header) {
        transformedOthers.push({ ...header });
      }
      // Add each item as an editable row
      value.forEach((item, idx) => {
        // Try to get a template row from initialOthers for this group
        const template = initialOthers.find(
          (row) => row.parent_key === key && row.editable
        );
        transformedOthers.push({
          key: `${key}_${idx}`,
          no: `営${(idx + 1).toString().padStart(2, "0")}` || "",
          parent_key: key,
          label: typeof item.title === "string" ? item.title : "",
          value: typeof item.amount === "number" ? item.amount : "0",
          editable: true,
        });
      });
    }
  });

  // If no backendData for others, fallback to initialOthers
  if (transformedOthers.length === 0) {
    transformedOthers.push(...initialOthers);
  }

  return {
    main: transformedMain,
    others: transformedOthers,
  };
}

/**
 * Transform frontend data to backend format
 */
export function transformFrontendToBackend(
  mainData: MainRowDataType[],
  othersData: OthersRowDataType[]
): BackendStartSheet {
  const backendData: BackendStartSheet = {};

  // Transform main data
  mainData.forEach((row) => {
    backendData[row.key] = {
      incomeStatement: row.incomeStatement.value,
      manufacturingCostReport: row.manufacturingCostReport.value,
    };
  });

  // Transform others data (only editable ones with non-empty data)
  othersData.forEach((row) => {
    // Filter out blank rows (empty label or zero value)
    const hasLabel = row.label && row.label.trim() !== "";
    const hasValue = row.value && Number(row.value) !== 0;
    
    if (row.editable && (hasLabel || hasValue)) {
      if (!backendData[row.parent_key]) {
        backendData[row.parent_key] = [];
      }
      (backendData[row.parent_key] as BackendOthersRow[]).push({
        title: row.label,
        amount: typeof row.value === "number" ? row.value : Number(row.value),
      });
    }
  });
  console.log(backendData, "=============>backendData");

  return backendData;
}

/**
 * Get only changed fields between two datasets
 * This optimizes save operations by only sending changed data
 */
export function getChangedFields(
  original: MainRowDataType[],
  updated: MainRowDataType[]
): Partial<BackendStartSheet> {
  const changes: Partial<BackendStartSheet> = {};

  updated.forEach((updatedRow, index) => {
    const originalRow = original[index];

    // Check if incomeStatement changed
    if (
      originalRow &&
      updatedRow.incomeStatement.value !== originalRow.incomeStatement.value
    ) {
      if (!changes[updatedRow.key]) {
        changes[updatedRow.key] = {} as BackendMainRow;
      }
      (changes[updatedRow.key] as BackendMainRow).incomeStatement =
        updatedRow.incomeStatement.value;
    }

    // Check if manufacturingCostReport changed
    if (
      originalRow &&
      updatedRow.manufacturingCostReport.value !== originalRow.manufacturingCostReport.value
    ) {
      if (!changes[updatedRow.key]) {
        changes[updatedRow.key] = {} as BackendMainRow;
      }
      (changes[updatedRow.key] as BackendMainRow).manufacturingCostReport =
        updatedRow.manufacturingCostReport.value;
    }
  });

  return changes;
}

/**
 * Validate backend data structure
 */
export function validateBackendData(data: any): data is BackendStartSheet {
  if (!data || typeof data !== "object") {
    return false;
  }

  // Basic validation - can be expanded
  return true;
}

