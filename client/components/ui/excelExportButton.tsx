import { FileSpreadsheet } from "lucide-react";
import { Button } from "./button";
import { excelService } from "@/lib/services/excelService";

export const ExcelExportButton = () => {
  return (
    <Button
      variant="outline"
      leftIcon={FileSpreadsheet}
      className="border-green-500 text-green-700 hover:bg-green-50"
      onClick={() => {
        excelService.exportExcel();
      }}
    >
      <span className="hidden sm:inline">Excel出力</span>
      <span className="sm:hidden">Excel</span>
    </Button>
  );
};
