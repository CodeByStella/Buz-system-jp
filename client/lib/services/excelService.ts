import axiosService from "../axios-service";
import type { WorkbookType } from "../transformers/dataTransformer";

const defaultWorkbook: WorkbookType = "pdca";

class ExcelService {
  private isExporting = false;

  async exportExcel(workbook: WorkbookType = defaultWorkbook): Promise<void> {
    if (this.isExporting) {
      console.log("Excel export already in progress");
      return;
    }

    this.isExporting = true;
    const filename = workbook === "company_rating" ? "company-rating.xlsx" : "短期計画PDCA.xlsx";

    try {
      const blob = await axiosService.get<Blob>("/api/export-excel", {
        responseType: "blob",
        params: { workbook },
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } finally {
      this.isExporting = false;
    }
  }

  getIsExporting(): boolean {
    return this.isExporting;
  }
}

// Export singleton instance
export const excelService = new ExcelService();
