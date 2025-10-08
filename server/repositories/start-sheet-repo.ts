import { StartSheet, StartSheetDocument } from "../models/sheets/start";
import mongoose from "mongoose";

class StartSheetRepository {
  /**
   * Get user's start sheet data by userId
   */
  async getByUserId(userId: string): Promise<StartSheetDocument | null> {
    try {
      return await StartSheet.findOne();
      // { userId: new mongoose.Types.ObjectId(userId) }
    } catch (error) {
      console.error("Error fetching start sheet:", error);
      throw error;
    }
  }

  /**
   * Create new start sheet for user
   */
  async create(
    userId: string,
    data: Partial<StartSheetDocument>
  ): Promise<StartSheetDocument> {
    try {
      const startSheet = new StartSheet({
        userId: new mongoose.Types.ObjectId(userId),
        ...data,
      });
      return await startSheet.save();
    } catch (error) {
      console.error("Error creating start sheet:", error);
      throw error;
    }
  }

  /**
   * Update existing start sheet
   */
  async update(
    userId: string,
    data: Partial<StartSheetDocument>
  ): Promise<StartSheetDocument | null> {
    try {
      return await StartSheet.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId) },
        { $set: data },
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error("Error updating start sheet:", error);
      throw error;
    }
  }

  /**
   * Create or update start sheet (upsert)
   */
  async upsert(
    userId: string,
    data: Partial<StartSheetDocument>
  ): Promise<StartSheetDocument> {
    try {
      const result = await StartSheet.findOneAndUpdate(
        {
        //   userId: new mongoose.Types.ObjectId(userId),
        },
        { $set: data },
        { new: true, upsert: true, runValidators: true }
      );
      return result!;
    } catch (error) {
      console.error("Error upserting start sheet:", error);
      throw error;
    }
  }

  /**
   * Delete start sheet by userId
   */
  async delete(userId: string): Promise<boolean> {
    try {
      const result = await StartSheet.deleteOne({
        userId: new mongoose.Types.ObjectId(userId),
      });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting start sheet:", error);
      throw error;
    }
  }

  /**
   * Check if user has start sheet data
   */
  async exists(userId: string): Promise<boolean> {
    try {
      const count = await StartSheet.countDocuments({
        userId: new mongoose.Types.ObjectId(userId),
      });
      return count > 0;
    } catch (error) {
      console.error("Error checking start sheet existence:", error);
      throw error;
    }
  }
}

export const startSheetRepo = new StartSheetRepository();
