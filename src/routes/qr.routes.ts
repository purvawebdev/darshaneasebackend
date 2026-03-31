/**
 * QR Code Routes
 * Handles all QR code related endpoints
 */

import { Router } from "express";
import {
  validateQRCode,
  verifyQRCode,
  decodeQRCode,
} from "../controllers/qr.controller";

const router = Router();

/**
 * QR Code Endpoints
 */

// Validate QR code structure and data
router.post("/validate", validateQRCode);

// Verify QR code against a specific booking
router.post("/verify", verifyQRCode);

// Decode QR and extract booking information
router.post("/decode", decodeQRCode);

export default router;
