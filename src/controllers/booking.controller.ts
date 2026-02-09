import { Request, Response } from 'express';
import { bookingService } from '../services/booking.service';

export const createBooking = async (req: Request, res: Response) => {
    try {
        // We'll add req.user later (from JWT middleware)
        const userId = (req as any).user?.id; // temporary — will be protected later

        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const { slotId } = req.body;

        if (!slotId) {
            return res.status(400).json({ message: 'slotId is required' });
        }

        const booking = await bookingService.createBooking(userId, slotId);

        return res.status(201).json({
            success: true,
            data: booking,
        });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};