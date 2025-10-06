import axiosService from '../axios-service';

// PDF Types
export interface PdfGenerateRequest {
  sheetName: string;
  options?: {
    includeCharts?: boolean;
    includeTables?: boolean;
    format?: 'A4' | 'A3' | 'Letter';
  };
}

export interface PdfGenerateResponse {
  pdfUrl: string;
  fileName: string;
  generatedAt: string;
  fileSize: number;
}

// PDF Service
class PdfService {
  async generatePdf(params: PdfGenerateRequest): Promise<PdfGenerateResponse> {
    return axiosService.post<PdfGenerateResponse>('/api/pdf/generate', params);
  }

  async downloadPdf(pdfUrl: string): Promise<Blob> {
    const response = await axiosService.get(pdfUrl, {
      responseType: 'blob'
    });
    return response;
  }

  async getPdfHistory(): Promise<PdfGenerateResponse[]> {
    return axiosService.get<PdfGenerateResponse[]>('/api/pdf/history');
  }

  async deletePdf(pdfId: string): Promise<void> {
    return axiosService.delete(`/api/pdf/${pdfId}`);
  }
}

// Export singleton instance
export const pdfService = new PdfService();
export default pdfService;
