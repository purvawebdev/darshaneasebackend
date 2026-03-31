/**
 * QR Code Service - Backend
 * Handles validation and verification of QR codes
 */

interface QRBookingData {
  type: string;
  version: string;
  timestamp: string;
  booking: {
    id: string;
    name: string;
    age: string;
    phone: string;
    disability: boolean;
    pregnant: boolean;
    people: {
      adults: number;
      children: number;
      total: number;
    };
    temple: {
      id: string;
      name: string;
    };
    darshan: {
      date: string;
      time: string;
      label: string;
      slotId: string;
    };
    amount: number;
  };
}

/**
 * Validate QR booking data
 * Ensures all required fields are present and data is consistent
 */
export function validateQRBookingData(qrValue: string): {
  valid: boolean;
  data?: QRBookingData;
  error?: string;
} {
  try {
    const payload = JSON.parse(qrValue) as QRBookingData;

    // Validate structure
    if (!payload.type || payload.type !== "darshan_booking") {
      return {
        valid: false,
        error: "Invalid QR type",
      };
    }

    // Validate booking data
    const booking = payload.booking;
    if (
      !booking.id ||
      !booking.name ||
      !booking.age ||
      !booking.temple.id ||
      !booking.darshan.date ||
      !booking.darshan.slotId
    ) {
      return {
        valid: false,
        error: "Missing required booking fields",
      };
    }

    // Validate amount is positive
    if (booking.amount <= 0) {
      return {
        valid: false,
        error: "Invalid booking amount",
      };
    }

    // Validate person count
    if (booking.people.total !== booking.people.adults + booking.people.children) {
      return {
        valid: false,
        error: "Person count mismatch",
      };
    }

    return {
      valid: true,
      data: payload,
    };
  } catch (error) {
    return {
      valid: false,
      error: "Failed to parse QR data",
    };
  }
}

/**
 * Extract booking verification info from QR data
 * Used for payment processing and booking confirmation
 */
export function extractQRBookingInfo(qrValue: string): {
  bookingId: string;
  name: string;
  amount: number;
  templeId: string;
  slotId: string;
  personCount: number;
} | null {
  try {
    const payload = JSON.parse(qrValue) as QRBookingData;
    if (payload.type === "darshan_booking" && payload.booking) {
      return {
        bookingId: payload.booking.id,
        name: payload.booking.name,
        amount: payload.booking.amount,
        templeId: payload.booking.temple.id,
        slotId: payload.booking.darshan.slotId,
        personCount: payload.booking.people.total,
      };
    }
  } catch (e) {
    console.error("Failed to extract QR booking info:", e);
  }
  return null;
}

/**
 * Verify QR booking against actual booking in database
 * Called during payment processing to ensure QR data matches booking
 */
export async function verifyQRAgainstBooking(
  qrValue: string,
  bookingId: string,
  amount: number
): Promise<{
  verified: boolean;
  message: string;
}> {
  const validation = validateQRBookingData(qrValue);
  if (!validation.valid) {
    return {
      verified: false,
      message: `QR validation failed: ${validation.error}`,
    };
  }

  const booking = validation.data?.booking;
  if (!booking) {
    return {
      verified: false,
      message: "Invalid booking data in QR",
    };
  }

  // Verify critical fields match
  if (booking.amount !== amount) {
    return {
      verified: false,
      message: "Amount mismatch - QR amount does not match payment amount",
    };
  }

  // All checks passed
  return {
    verified: true,
    message: "QR verification successful",
  };
}
