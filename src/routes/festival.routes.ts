import express, { Request, Response } from "express";
import { getFestivals } from "../services/festival.service";

const router = express.Router();

/**
 * GET /api/festivals?year=2026&month=4
 * Returns festivals for the given month from curated dataset.
 */
router.get("/", (req: Request, res: Response) => {
  try {
    const year = parseInt(req.query.year as string, 10);
    const month = parseInt(req.query.month as string, 10);

    if (!year || !month || month < 1 || month > 12) {
      return res.status(400).json({
        success: false,
        message: "Valid year and month (1-12) query params are required",
      });
    }

    const festivals = getFestivals(year, month);

    return res.json({
      success: true,
      count: festivals.length,
      data: festivals,
    });
  } catch (err: any) {
    console.error("[festival route] Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch festivals",
    });
  }
});

export default router;
