import axiosService from "../axios-service";

// PDF Service
class PDFService {
  private isExporting = false;

  async exportPDF(): Promise<void> {
    if (this.isExporting) {
      console.log("PDF export already in progress");
      return;
    }

    this.isExporting = true;
    
    try {
      // Use axiosService.get with { responseType: "blob" } to properly handle file downloads
      const blob = await axiosService.get<Blob>("/api/export-pdf", {
        responseType: "blob",
        timeout: 180000, // allow up to 3 minutes for conversion
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "短期計画PDCA.pdf";
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
