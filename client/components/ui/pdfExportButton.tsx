import { FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "./button";
import { pdfService } from "@/lib/services/pdfService";

export const PDFExportButton = () => {
  return (
    <Button
      variant="outline"
      leftIcon={FileText}
      className="border-red-500 text-red-700 hover:bg-red-50"
      onClick={() => {
        pdfService.exportPDF();
      }}
    >
      <span className="hidden sm:inline">PDF出力</span>
      <span className="sm:hidden">PDF</span>
    </Button>
  );
};
