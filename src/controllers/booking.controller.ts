import { Request, Response } from 'express';
import { bookingService } from '../services/booking.service';
import { Booking } from '../models/booking.model';

interface AuthRequest extends Request {
    user?: {
        id: string;
        phone?: string;
        role?: string;
    };
}

interface PopulatedSlot {
    _id: string;
    date: string;
    startTime: string;
    endTime: string;
    maxCapacity: number;
    currentBooked: number;
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

export const getMyBookings = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Not authenticated' });

        const bookings = await Booking.find({ user: userId, status: 'confirmed' })
            .populate<{ slot: PopulatedSlot }>({
                path: 'slot',
                select: 'date startTime endTime maxCapacity currentBooked templeId',
                populate: {
                    path: 'templeId',
                    select: 'name location deity image',
                },
            })
            .sort({ bookedAt: -1 })
            .lean();

        const formatted = bookings.map(b => ({
            bookingId: b._id,
            slot: {
                date: b.slot.date,
                time: `${(b.slot as any).startTime} - ${(b.slot as any).endTime}`,
                capacity: `${(b.slot as any).currentBooked}/${(b.slot as any).maxCapacity}`,
                temple: (b.slot as any).templeId,
            },
            bookedAt: b.bookedAt,
        }));

        res.json({
            success: true,
            count: formatted.length,
            data: formatted,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

