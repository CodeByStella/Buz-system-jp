"use client";

import { FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "./button";
import { excelService } from "@/lib/services/excelService";
import { useState, useEffect } from "react";
import type { WorkbookType } from "@/lib/transformers/dataTransformer";

interface ExcelExportButtonProps {
  workbook?: WorkbookType;
}

export const ExcelExportButton = ({ workbook }: ExcelExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const checkExportStatus = () => {
      setIsExporting(excelService.getIsExporting());
    };

    const interval = setInterval(checkExportStatus, 100);
    return () => clearInterval(interval);
  }, []);

  const handleExport = async () => {
    if (isExporting) return;

    setIsExporting(true);
    try {
      await excelService.exportExcel(workbook);
    } catch (error) {
      console.error("Excel export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      leftIcon={isExporting ? <Loader2 className="animate-spin" /> : FileSpreadsheet}
      className={`border-green-500 text-green-700 hover:bg-green-50 ${
        isExporting ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={isExporting}
      onClick={handleExport}
    >
      <span className="hidden sm:inline">
        {isExporting ? "Excel生成中..." : "Excel出力"}
      </span>
      <span className="sm:hidden">
        {isExporting ? "生成中" : "Excel"}
      </span>
    </Button>
  );
};
