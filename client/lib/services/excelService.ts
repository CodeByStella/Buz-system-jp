import axiosService from "../axios-service";

// Excel Service
class ExcelService {
  async exportExcel(): Promise<void> {
    // Use axiosService.get with { responseType: "blob" } to properly handle file downloads
    const blob = await axiosService.get<Blob>("/api/export-excel", { responseType: "blob" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "短期計画PDCA.xlsx";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

// Export singleton instance
export const excelService = new ExcelService();
