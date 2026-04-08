import { Router, Request, Response } from 'express';
import { Waitlist } from '../models/waitlist.model';
import { Slot } from '../models/slot.model';
import { Booking } from '../models/booking.model';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

/**
 * POST /api/waitlist/join
 * User joins waitlist for a full slot
 */
router.post('/join', protect, async (req: Request, res: Response) => {
    try {
        const { slotId, templeId, date, bookingDetails } = req.body;
        const userId = (req as any).user?.id; // From auth middleware

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }

        // Validate input
        if (!slotId || !templeId || !date || !bookingDetails) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: slotId, templeId, date, bookingDetails'
            });
        }

        // Check if slot exists and is full
        const slot = await Slot.findById(slotId);
        if (!slot) {
            return res.status(404).json({ success: false, message: 'Slot not found' });
        }

        if ((slot.currentBooked as number) < (slot.maxCapacity as number)) {
            return res.status(400).json({
                success: false,
                message: 'Slot is not full. Please book directly.',
                availableSeats: (slot.maxCapacity as number) - (slot.currentBooked as number)
            });
        }

        // Check if user already in active waitlist
        const existingWaitlist = await Waitlist.findOne({
            user: userId,
            slot: slotId,
            status: { $in: ['waiting', 'confirmed'] }
        });

        if (existingWaitlist) {
            return res.status(400).json({
                success: false,
                message: 'Already in waitlist for this slot',
                position: existingWaitlist.position
            });
        }

        // Calculate position
        const position = await Waitlist.countDocuments({
            slot: slotId,
            status: 'waiting'
        }) + 1;

        // Create waitlist entry
        const waitlistEntry = new Waitlist({
            user: userId,
            slot: slotId,
            temple: templeId,
            date: date,
            position,
            status: 'waiting',
            bookingDetails: bookingDetails,
            joinedAt: new Date()
        });

        await waitlistEntry.save();

        // Populate user info for response
        await waitlistEntry.populate('user', 'name phone email');

        res.status(201).json({
            success: true,
            message: `Successfully added to waitlist. Your position: ${position}`,
            waitlistEntry,
            position,
            estimatedWaitTime: `${position * 2}-${position * 4} days (estimated)`
        });

    } catch (error: any) {
        console.error('Error joining waitlist:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to join waitlist',
            error: error.message
        });
    }
});

/**
 * GET /api/waitlist/my-position/:slotId
 * Get user's position in waitlist for a specific slot
 */
router.get('/my-position/:slotId', protect, async (req: Request, res: Response) => {
    try {
        const { slotId } = req.params;
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }

        const waitlistEntry = await Waitlist.findOne({
            slot: slotId,
            user: userId,
            status: { $in: ['waiting', 'confirmed'] }
        }).populate('user', 'name').populate('slot', 'date startTime endTime');

        if (!waitlistEntry) {
            return res.status(404).json({
                success: false,
                message: 'Not in waitlist for this slot'
            });
        }

        const totalInWaitlist = await Waitlist.countDocuments({
            slot: slotId,
            status: 'waiting'
        });

        res.json({
            success: true,
            position: waitlistEntry.position,
            totalInWaitlist,
            status: waitlistEntry.status,
            joinedAt: waitlistEntry.joinedAt,
            confirmedAt: waitlistEntry.confirmedAt,
            message: waitlistEntry.status === 'confirmed'
                ? 'Your booking has been confirmed from waitlist'
                : `You are at position ${waitlistEntry.position} in the waitlist`
        });

    } catch (error: any) {
        console.error('Error fetching waitlist position:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch waitlist position'
        });
    }
});

/**
 * GET /api/waitlist/my-waitlists
 * Get all waitlists user is part of
 */
router.get('/my-waitlists', protect, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }

        const waitlists = await Waitlist.find({
            user: userId,
            status: { $in: ['waiting', 'confirmed'] }
        })
            .populate('slot', 'date startTime endTime currentBooked maxCapacity')
            .populate('temple', 'name')
            .sort({ joinedAt: -1 });

        res.json({
            success: true,
            data: waitlists,
            count: waitlists.length
        });

    } catch (error: any) {
        console.error('Error fetching waitlists:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch waitlists'
        });
    }
});

/**
 * GET /api/waitlist/slot/:slotId
 * Get full waitlist for a slot (Admin view)
 */
router.get('/slot/:slotId', async (req: Request, res: Response) => {
    try {
        const { slotId } = req.params;

        const waitlist = await Waitlist.find({
            slot: slotId,
            status: 'waiting'
        })
            .populate('user', 'name phone email')
            .sort({ position: 1 });

        const confirmed = await Waitlist.find({
            slot: slotId,
            status: 'confirmed'
        })
            .populate('user', 'name phone email')
            .sort({ confirmedAt: -1 });

        res.json({
            success: true,
            waitingCount: waitlist.length,
            confirmedCount: confirmed.length,
            waiting: waitlist,
            confirmed
        });

    } catch (error: any) {
        console.error('Error fetching slot waitlist:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch waitlist'
        });
    }
});

/**
 * DELETE /api/waitlist/:waitlistId
 * Remove user from waitlist
 */
router.delete('/:waitlistId', protect, async (req: Request, res: Response) => {
    try {
        const { waitlistId } = req.params;
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }

        const waitlistEntry = await Waitlist.findById(waitlistId);
        if (!waitlistEntry) {
            return res.status(404).json({
                success: false,
                message: 'Waitlist entry not found'
            });
        }

        // Verify user owns this entry
        if (waitlistEntry.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        // If user is confirmed, can't remove
        if (waitlistEntry.status === 'confirmed') {
            return res.status(400).json({
                success: false,
                message: 'Cannot remove from waitlist after confirmation'
            });
        }

        const slotId = waitlistEntry.slot;

        // Update position for all entries after this one
        await Waitlist.updateMany(
            { slot: slotId, position: { $gt: waitlistEntry.position }, status: 'waiting' },
            { $inc: { position: -1 } }
        );

        // Mark entry as cancelled
        waitlistEntry.status = 'cancelled';
        await waitlistEntry.save();

        res.json({
            success: true,
            message: 'Removed from waitlist'
        });

    } catch (error: any) {
        console.error('Error removing from waitlist:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove from waitlist'
        });
    }
});

/**
 * POST /api/waitlist/auto-confirm (Internal route)
 * Called when a booking is cancelled to auto-confirm next in line
 * This is handled by the booking cancellation endpoint
 */
router.post('/auto-confirm/:slotId', async (req: Request, res: Response) => {
    try {
        const { slotId } = req.params;

        // Get first person in waitlist (FIFO)
        const nextInLine = await Waitlist.findOne({
            slot: slotId,
            status: 'waiting'
        }).sort({ joinedAt: 1 });

        if (!nextInLine) {
            return res.json({
                success: true,
                message: 'No one in waitlist to confirm'
            });
        }

        // Create booking
        const booking = new Booking({
            user: nextInLine.user,
            temple: nextInLine.temple,
            slot: slotId,
            status: 'confirmed',
            bookingDetails: nextInLine.bookingDetails
        });

        const savedBooking = await booking.save();

        // Update slot
        await Slot.findByIdAndUpdate(slotId, {
            $inc: { currentBooked: 1 }
        });

        // Update waitlist entry
        nextInLine.status = 'confirmed';
        nextInLine.confirmedBookingId = savedBooking._id;
        nextInLine.confirmedAt = new Date();
        await nextInLine.save();

        // Update other positions
        await Waitlist.updateMany(
            { slot: slotId, status: 'waiting' },
            { $inc: { position: -1 } }
        );

        res.json({
            success: true,
            message: 'Auto-confirmed booking for next in line',
            booking: savedBooking
        });

    } catch (error: any) {
        console.error('Error auto-confirming:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to auto-confirm booking'
        });
    }
});

export default router;
