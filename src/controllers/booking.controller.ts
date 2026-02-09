import { Request, Response } from 'express';
import { bookingService } from '../services/booking.service';

interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}

export const createBooking = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;

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
            message: 'Booking created successfully',
            bookingId: booking._id,
        });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};