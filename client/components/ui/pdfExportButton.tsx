"use client";

import { FileText, Loader2 } from "lucide-react";
import { Button } from "./button";
import { pdfService } from "@/lib/services/pdfService";
import { useState, useEffect } from "react";
import type { WorkbookType } from "@/lib/transformers/dataTransformer";

interface PDFExportButtonProps {
  workbook?: WorkbookType;
}

export const PDFExportButton = ({ workbook }: PDFExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const checkExportStatus = () => {
      setIsExporting(pdfService.getIsExporting());
    };

    const interval = setInterval(checkExportStatus, 100);
    return () => clearInterval(interval);
  }, []);

  const handleExport = async () => {
    if (isExporting) return;

    setIsExporting(true);
    try {
      await pdfService.exportPDF(workbook);
    } catch (error) {
      console.error("PDF export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      leftIcon={isExporting ? <Loader2 className="animate-spin" /> : FileText}
      className={`border-red-500 text-red-700 hover:bg-red-50 ${
        isExporting ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={isExporting}
      onClick={handleExport}
    >
      <span className="hidden sm:inline">
        {isExporting ? "PDF生成中..." : "PDF出力"}
      </span>
      <span className="sm:hidden">
        {isExporting ? "生成中" : "PDF"}
      </span>
    </Button>
  );
};

