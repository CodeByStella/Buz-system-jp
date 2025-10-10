"use client";

import React, { createContext, useContext } from "react";
import { FrontendData, SheetNameType } from "../transformers/dataTransformer";

interface DataContextType {
  data: FrontendData;
  onChange: (sheet: SheetNameType, cell: string, value: number) => void;
  onSave: () => Promise<void>;
  saving: boolean;
  hasChanges: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{
  children: React.ReactNode;
  value: DataContextType;
}> = ({ children, value }) => {
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

/**
 * Hook to access spreadsheet data and operations
 * 
 * Usage in sheet components:
 * ```tsx
 * const { data, onChange, onSave, saving, hasChanges } = useDataContext();
 * 
 * // Get cell value
 * const value = data["start"]?.[6]?.[2]; // Row 6, Column 2 (B6)
 * 
 * // Update cell value
 * onChange("start", "B6", 100);
 * 
 * // Save changes
 * await onSave();
 * ```
 */
export const useDataContext = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};

