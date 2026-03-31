/**
 * QR Code Controller
 * Handles QR code validation and verification endpoints
 */

import { Request, Response } from "express";
import { validateQRBookingData, extractQRBookingInfo, verifyQRAgainstBooking } from "../services/qr.service";

/**
 * Validate a QR code value
 * POST /api/qr/validate
 * Body: { qrValue: string }
 */
export const validateQRCode = (req: Request, res: Response) => {
  try {
    const { qrValue } = req.body;

    if (!qrValue) {
      return res.status(400).json({
        success: false,
        message: "QR value is required",
      });
    }

    const validation = validateQRBookingData(qrValue);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.error || "QR validation failed",
      });
    }

    // Extract key info from QR
    const bookingInfo = extractQRBookingInfo(qrValue);

    return res.status(200).json({
      success: true,
      message: "QR validation successful",
      data: {
        valid: true,
        bookingInfo,
        fullData: validation.data,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "QR validation error: " + error.message,
    });
  }
};

/**
 * Verify QR against a specific booking
 * POST /api/qr/verify
 * Body: { qrValue: string, bookingId: string, amount: number }
 */
export const verifyQRCode = async (req: Request, res: Response) => {
  try {
    const { qrValue, bookingId, amount } = req.body;

    if (!qrValue || !bookingId || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "QR value, booking ID, and amount are required",
      });
    }

    // Verify QR against booking
    const verification = await verifyQRAgainstBooking(qrValue, bookingId, amount);

    if (!verification.verified) {
      return res.status(400).json({
        success: false,
        message: verification.message,
      });
    }

    // Extract booking info for reference
    const bookingInfo = extractQRBookingInfo(qrValue);

    return res.status(200).json({
      success: true,
      message: verification.message,
      data: {
        verified: true,
        bookingInfo,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "QR verification error: " + error.message,
    });
  }
};

/**
 * Decode and extract info from QR
 * POST /api/qr/decode
 * Body: { qrValue: string }
 */
export const decodeQRCode = (req: Request, res: Response) => {
  try {
    const { qrValue } = req.body;

    if (!qrValue) {
      return res.status(400).json({
        success: false,
        message: "QR value is required",
      });
    }

    const bookingInfo = extractQRBookingInfo(qrValue);

    if (!bookingInfo) {
      return res.status(400).json({
        success: false,
        message: "Failed to decode QR value",
      });
    }

    return res.status(200).json({
      success: true,
      message: "QR decoded successfully",
      data: bookingInfo,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "QR decode error: " + error.message,
    });
  }
};
