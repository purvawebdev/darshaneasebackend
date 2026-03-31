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
                select: 'date startTime endTime label maxCapacity currentBooked templeId',
                populate: {
                    path: 'templeId',
                    select: 'name location deity image imageUrl',
                },
            })
            .sort({ bookedAt: -1 })
            .lean();

        const formatted = bookings.map(b => ({
            bookingId: b._id,
            slot: {
                date: b.slot.date,
                time: `${(b.slot as any).startTime} - ${(b.slot as any).endTime}`,
                label: (b.slot as any).label,
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

/**
 * GET /api/bookings/:id/verify
 * Public endpoint — returns booking details for QR scan verification.
 * No auth required so it works when temple staff scan the QR.
 */
export const verifyBooking = async (req: Request, res: Response) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate({
                path: 'user',
                select: 'name phone',
            })
            .populate({
                path: 'slot',
                select: 'date startTime endTime label maxCapacity currentBooked templeId',
                populate: {
                    path: 'templeId',
                    select: 'name location deity image imageUrl',
                },
            })
            .lean();

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.json({
            success: true,
            data: {
                bookingId: booking._id,
                status: booking.status,
                scannedAt: booking.scannedAt || null,
                user: booking.user,
                slot: booking.slot,
                bookedAt: booking.bookedAt,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * POST /api/bookings/:id/scan
 * Marks a booking as scanned (visited). Called by temple admin when scanning QR.
 * Requires auth (templeAdmin or superadmin).
 */
export const scanBooking = async (req: AuthRequest, res: Response) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.status !== 'confirmed') {
            return res.status(400).json({
                success: false,
                message: 'Booking is not in confirmed status',
            });
        }

        if (booking.scannedAt) {
            return res.status(400).json({
                success: false,
                message: 'Booking already scanned',
                scannedAt: booking.scannedAt,
            });
        }

        booking.scannedAt = new Date();
        await booking.save();

        // Return the full booking data for display
        const populated = await Booking.findById(booking._id)
            .populate({ path: 'user', select: 'name phone' })
            .populate({
                path: 'slot',
                select: 'date startTime endTime label templeId',
                populate: { path: 'templeId', select: 'name location' },
            })
            .lean();

        res.json({
            success: true,
            message: 'Booking scanned — visit confirmed',
            data: populated,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
