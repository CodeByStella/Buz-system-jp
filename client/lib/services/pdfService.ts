import axiosService from "../axios-service";
import type { WorkbookType } from "../transformers/dataTransformer";

const defaultWorkbook: WorkbookType = "pdca";

class PDFService {
  private isExporting = false;

  async exportPDF(workbook: WorkbookType = defaultWorkbook): Promise<void> {
    if (this.isExporting) {
      console.log("PDF export already in progress");
      return;
    }

    this.isExporting = true;
    const filename = workbook === "company_rating" ? "company-rating.pdf" : "短期計画PDCA.pdf";

    try {
      const blob = await axiosService.get<Blob>("/api/export-pdf", {
        responseType: "blob",
        timeout: 180000,
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
export const pdfService = new PDFService();
