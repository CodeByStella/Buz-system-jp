import { startSheetRepo } from "../repositories/start-sheet-repo";
import { StartSheetDocument } from "../models/sheets/start";

interface MainRowData {
  incomeStatement?: number;
  manufacturingCostReport?: number;
}

interface OthersRowData {
  title?: number;
  amount?: number;
}

interface StartSheetInput {
  [key: string]: MainRowData | OthersRowData[] | number | undefined;
}

class StartSheetService {
  /**
   * Get start sheet data for user
   * Returns null if no data exists
   */
  async getStartSheet(userId: string): Promise<StartSheetDocument | null> {
    return await startSheetRepo.getByUserId(userId);
  }

  /**
   * Save or update start sheet data
   * Creates new document if doesn't exist, updates if exists
   */
  async saveStartSheet(
    userId: string,
    data: StartSheetInput
  ): Promise<StartSheetDocument> {
    // Prepare data for MongoDB
    const preparedData = this.prepareDataForSave(data);

    // Upsert the document
    return await startSheetRepo.upsert(userId, preparedData as Partial<StartSheetDocument>);
  }

  /**
   * Delete start sheet data
   */
  async deleteStartSheet(userId: string): Promise<boolean> {
    return await startSheetRepo.delete(userId);
  }

  /**
   * Check if user has start sheet data
   */
  async hasStartSheet(userId: string): Promise<boolean> {
    return await startSheetRepo.exists(userId);
  }

  /**
   * Prepare data for MongoDB storage
   * Converts frontend format to backend format
   */
  private prepareDataForSave(data: StartSheetInput): Record<string, any> {
    const prepared: Record<string, any> = {};

    for (const key in data) {
      const value = data[key];

      // Skip undefined values
      if (value === undefined) {
        continue;
      }

      // Handle array types (Others data)
      if (Array.isArray(value)) {
        prepared[key] = value;
      }
      // Handle main row data (objects with incomeStatement/manufacturingCostReport)
      else if (typeof value === "object" && value !== null) {
        const rowData = value as MainRowData;
        prepared[key] = {
          incomeStatement: rowData.incomeStatement ?? 0,
          manufacturingCostReport: rowData.manufacturingCostReport ?? 0,
        };
      }
      // Handle simple numbers
      else if (typeof value === "number") {
        prepared[key] = value;
      }
    }

    return prepared;
  }

  /**
   * Transform database document to frontend format
   */
  transformToFrontend(doc: StartSheetDocument | null): any {
    if (!doc) {
      return null;
    }

    // Convert mongoose document to plain object
    const plainDoc = doc.toObject();

    // Remove MongoDB specific fields
    const { _id, __v, createdAt, updatedAt, userId, ...data } = plainDoc;

    return data;
  }
}

export const startSheetService = new StartSheetService();

