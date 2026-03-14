"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { WorkbookType } from "../transformers/dataTransformer";

const STORAGE_KEY = "lastWorkbook";

interface WorkbookContextType {
  workbook: WorkbookType;
  setWorkbook: (w: WorkbookType) => void;
}

const WorkbookContext = createContext<WorkbookContextType | undefined>(undefined);

export const WorkbookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workbook, setWorkbookState] = useState<WorkbookType>(() => {
    if (typeof window === "undefined") return "pdca";
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "pdca" || saved === "company_rating") return saved;
    return "pdca";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, workbook);
    }
  }, [workbook]);

  const setWorkbook = (w: WorkbookType) => setWorkbookState(w);

  return (
    <WorkbookContext.Provider value={{ workbook, setWorkbook }}>
      {children}
    </WorkbookContext.Provider>
  );
};

export function useWorkbookContext(): WorkbookContextType {
  const ctx = useContext(WorkbookContext);
  if (ctx === undefined) {
    throw new Error("useWorkbookContext must be used within WorkbookProvider");
  }
  return ctx;
}

export function useOptionalWorkbookContext(): WorkbookContextType | undefined {
  return useContext(WorkbookContext);
}
