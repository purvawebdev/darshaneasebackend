import { Request, Response } from 'express';
import { bookingService } from '../services/booking.service';
import crypto from 'crypto';

interface AuthRequest extends Request {
    user?: {
        id: string;
        phone?: string;
        role?: string;
    };
}

/**
 * POST /api/payments/simulate
 * Simulates a payment gateway with a 2-second delay, then creates a booking.
 * 
 * Request body: { slotId: string }
 * Response: { success, message, paymentId, bookingId }
 */
export const simulatePayment = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const { slotId } = req.body;

        if (!slotId) {
            return res.status(400).json({ message: 'slotId is required' });
        }

        // Simulate payment processing delay (2 seconds)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Generate a fake payment ID
        const paymentId = `pay_sim_${crypto.randomBytes(8).toString('hex')}`;

        // Create the actual booking via the existing booking service
        const booking = await bookingService.createBooking(userId, slotId);

        return res.status(201).json({
            success: true,
            message: 'Payment successful, booking confirmed',
            paymentId,
            bookingId: booking._id,
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
