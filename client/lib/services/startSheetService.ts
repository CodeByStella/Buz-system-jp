import axiosService from "../axios-service";

// Response types
export interface StartSheetResponse {
  data: any;
  message: string;
}

export interface ExistsResponse {
  exists: boolean;
}

// Start Sheet Service
class StartSheetService {
  /**
   * Fetch user's start sheet data
   */
  async getStartSheet(): Promise<any> {
    const response = await axiosService.get<StartSheetResponse>("/api/start-sheet");
    return response.data;
  }

  /**
   * Save or update start sheet data
   */
  async saveStartSheet(data: any): Promise<any> {
    const response = await axiosService.post<StartSheetResponse>("/api/start-sheet", data);
    return response.data;
  }

  /**
   * Update start sheet data (same as save - upsert)
   */
  async updateStartSheet(data: any): Promise<any> {
    const response = await axiosService.put<StartSheetResponse>("/api/start-sheet", data);
    return response.data;
  }

  /**
   * Delete start sheet data
   */
  async deleteStartSheet(): Promise<{ message: string }> {
    return await axiosService.delete("/api/start-sheet");
  }

  /**
   * Check if user has start sheet data
   */
  async exists(): Promise<boolean> {
    const response = await axiosService.get<ExistsResponse>("/api/start-sheet/exists");
    return response.exists;
  }
}

// Export singleton instance
export const startSheetService = new StartSheetService();
export default startSheetService;

