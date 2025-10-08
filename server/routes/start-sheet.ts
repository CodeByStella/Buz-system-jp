import express from "express";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";
import { startSheetService } from "../services/start-sheet-service";

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

/**
 * GET /api/start-sheet
 * Fetch user's start sheet data
 */
router.get("/", async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;

    const startSheet = await startSheetService.getStartSheet(userId);

    if (!startSheet) {
      return res.json({ data: null, message: "データがありません" });
    }

    const transformed = startSheetService.transformToFrontend(startSheet);

    res.json({
      data: transformed,
      message: "データを取得しました",
    });
  } catch (error) {
    console.error("Error fetching start sheet:", error);
    res.status(500).json({ error: "データの取得に失敗しました" });
  }
});

/**
 * POST /api/start-sheet
 * Save or update user's start sheet data
 */
router.post("/", async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const data = req.body;

    if (!data || typeof data !== "object") {
      return res.status(400).json({ error: "無効なデータ形式です" });
    }

    const savedSheet = await startSheetService.saveStartSheet(userId, data);

    const transformed = startSheetService.transformToFrontend(savedSheet);

    res.json({
      data: transformed,
      message: "データを保存しました",
    });
  } catch (error) {
    console.error("Error saving start sheet:", error);
    res.status(500).json({ error: "データの保存に失敗しました" });
  }
});

/**
 * PUT /api/start-sheet
 * Update user's start sheet data (same as POST - upsert)
 */
router.put("/", async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const data = req.body;

    if (!data || typeof data !== "object") {
      return res.status(400).json({ error: "無効なデータ形式です" });
    }

    const savedSheet = await startSheetService.saveStartSheet(userId, data);

    const transformed = startSheetService.transformToFrontend(savedSheet);

    res.json({
      data: transformed,
      message: "データを更新しました",
    });
  } catch (error) {
    console.error("Error updating start sheet:", error);
    res.status(500).json({ error: "データの更新に失敗しました" });
  }
});

/**
 * DELETE /api/start-sheet
 * Delete user's start sheet data
 */
router.delete("/", async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;

    const deleted = await startSheetService.deleteStartSheet(userId);

    if (!deleted) {
      return res.status(404).json({ error: "データが見つかりません" });
    }

    res.json({
      message: "データを削除しました",
    });
  } catch (error) {
    console.error("Error deleting start sheet:", error);
    res.status(500).json({ error: "データの削除に失敗しました" });
  }
});

/**
 * GET /api/start-sheet/exists
 * Check if user has start sheet data
 */
router.get("/exists", async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;

    const exists = await startSheetService.hasStartSheet(userId);

    res.json({
      exists,
    });
  } catch (error) {
    console.error("Error checking start sheet existence:", error);
    res.status(500).json({ error: "確認に失敗しました" });
  }
});

export default router;

