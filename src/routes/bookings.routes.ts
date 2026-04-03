import { Router, Request, Response } from 'express';
import { Booking } from '../models/booking.model';
import { Waitlist } from '../models/waitlist.model';
import { Slot } from '../models/slot.model';
import { User } from '../models/user.model';

const router = Router();

/**
 * POST /api/bookings/:bookingId/cancel
 * Cancel a booking within 7 days of visit date
 */
router.post('/:bookingId/cancel', async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        const { reason = 'User requested cancellation' } = req.body;
        const userId = (req as any).userId; // From auth middleware

        // Find booking
        const booking = await Booking.findById(bookingId).populate('slot');
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Verify user owns this booking
        if (booking.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        // Check if already cancelled
        if (booking.status === 'cancelled') {
            return res.status(400).json({ success: false, message: 'Booking already cancelled' });
        }

        // Validate slot
        if (!booking.slot) {
            return res.status(400).json({ success: false, message: 'Slot not found for this booking' });
        }

        // Check 7-day rule
        const slot = booking.slot as any;
        if (!slot.date) {
            return res.status(400).json({ success: false, message: 'Invalid slot date' });
        }

        const slotDate = new Date(slot.date);
        if (isNaN(slotDate.getTime())) {
            return res.status(400).json({ success: false, message: 'Invalid slot date format' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        slotDate.setHours(0, 0, 0, 0);

        const daysBeforeVisit = Math.floor((slotDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysBeforeVisit < 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel - visit date has passed',
                daysBeforeVisit
            });
        }

        // Determine if cancellation is free or with penalty
        // Free: > 7 days before | With penalty: <= 7 days before
        const isFreeCancel = daysBeforeVisit > 7;
        const penaltyAmount = isFreeCancel ? 0 : Math.ceil((booking.bookingDetails?.totalAmount || 0) * 0.25);

        // Update booking status
        booking.status = 'cancelled';
        booking.cancellationDate = new Date();
        booking.cancellationReason = reason;
        booking.refundStatus = 'pending';
        booking.cancellationPenalty = penaltyAmount;
        booking.cancellationType = isFreeCancel ? 'free' : 'with-penalty';

        await booking.save();

        // Increment slot available capacity
        await Slot.findByIdAndUpdate(booking.slot, {
            $inc: { currentBooked: -1 }
        });

        // Process waitlist - auto-confirm first person in queue
        await processWaitlist(booking.slot.toString(), booking.temple?.toString(), slot.date);

        res.json({
            success: true,
            message: isFreeCancel 
                ? 'Booking cancelled successfully. Full refund will be processed within 5-7 business days.'
                : `Booking cancelled. 25% penalty (₹${penaltyAmount}) applied. Refund will be processed within 5-7 business days.`,
            booking,
            isFreeCancel,
            penaltyAmount,
            refundAmount: (booking.bookingDetails?.totalAmount || 0) - penaltyAmount
        });

    } catch (error: any) {
        console.error('Cancellation error:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

/**
 * GET /api/bookings/cancellation-history
 * Get user's cancelled bookings
 */
router.get('/cancellation-history', async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const cancelledBookings = await Booking.find({
            user: userId,
            status: 'cancelled'
        })
            .populate('temple', 'name')
            .populate('slot', 'date startTime endTime')
            .sort({ cancellationDate: -1 });

        res.json({
            success: true,
            data: cancelledBookings,
            count: cancelledBookings.length
        });
    } catch (error: any) {
        console.error('Error fetching cancellation history:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch cancellation history' });
    }
});

/**
 * GET /api/bookings/:bookingId/cancellation-eligibility
 * Check if booking can be cancelled
 */
router.get('/:bookingId/cancellation-eligibility', async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        console.log('Checking eligibility for bookingId:', bookingId);

        const booking = await Booking.findById(bookingId).populate('slot');
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (!booking.slot) {
            console.error('Slot not populated for booking:', bookingId);
            return res.status(400).json({ success: false, message: 'Slot not found for this booking' });
        }

        const slot = booking.slot as any;
        if (!slot.date) {
            console.error('Slot has no date. Slot:', slot);
            return res.status(400).json({ success: false, message: 'Invalid slot date' });
        }

        const slotDate = new Date(slot.date);
        if (isNaN(slotDate.getTime())) {
            console.error('Invalid slot date format:', slot.date);
            return res.status(400).json({ success: false, message: 'Invalid slot date format' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        slotDate.setHours(0, 0, 0, 0);

        const daysBeforeVisit = Math.floor((slotDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        console.log('Days before visit:', daysBeforeVisit, 'Slot date:', slot.date, 'Today:', today);

        const canCancel = daysBeforeVisit > 0;
        const isFreeCancel = daysBeforeVisit > 7;
        const penaltyAmount = !isFreeCancel && daysBeforeVisit > 0 ? Math.ceil((booking.bookingDetails?.totalAmount || 0) * 0.25) : 0;
        let message = '';

        if (booking.status === 'cancelled') {
            message = 'Booking already cancelled';
        } else if (daysBeforeVisit < 0) {
            message = 'Cannot cancel - visit date has passed';
        } else if (isFreeCancel) {
            message = 'Booking can be cancelled without any penalty - Full refund';
        } else if (daysBeforeVisit > 0) {
            message = `Cancellation allowed but 25% penalty (₹${penaltyAmount}) will apply. Your visit is in ${daysBeforeVisit} days.`;
        }

        res.json({
            success: true,
            canCancel,
            isFreeCancel,
            penaltyAmount,
            daysBeforeVisit,
            message,
            bookingStatus: booking.status
        });
    } catch (error: any) {
        console.error('Error checking cancellation eligibility:', error);
        res.status(500).json({ success: false, message: 'Failed to check eligibility' });
    }
});

/**
 * POST /api/waitlist/join
 * Join waitlist for a full slot
 */
router.post('/join', async (req: Request, res: Response) => {
    try {
        const { slotId, templeId, date, bookingDetails } = req.body;
        const userId = (req as any).userId;

        // Check if slot is full
        const slot = await Slot.findById(slotId);
        if (!slot) {
            return res.status(404).json({ success: false, message: 'Slot not found' });
        }

        if ((slot.currentBooked as number) < (slot.maxCapacity as number)) {
            return res.status(400).json({
                success: false,
                message: 'Slot is not full. Please book directly instead.'
            });
        }

        // Check if user already in waitlist for this slot
        const existing = await Waitlist.findOne({
            user: userId,
            slot: slotId,
            status: { $in: ['waiting', 'confirmed'] }
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Already in waitlist for this slot'
            });
        }

        // Get position (count + 1)
        const position = await Waitlist.countDocuments({
            slot: slotId,
            status: 'waiting'
        }) + 1;

        // Create waitlist entry
        const waitlist = new Waitlist({
            user: userId,
            slot: slotId,
            temple: templeId,
            date,
            position,
            bookingDetails
        });

        await waitlist.save();

        res.json({
            success: true,
            message: `Added to waitlist. Your position: ${position}`,
            waitlist,
            position
        });
    } catch (error: any) {
        console.error('Error joining waitlist:', error);
        res.status(500).json({ success: false, message: 'Failed to join waitlist' });
    }
});

/**
 * GET /api/waitlist/:slotId
 * Get waitlist info for a slot
 */
router.get('/:slotId', async (req: Request, res: Response) => {
    try {
        const { slotId } = req.params;

        const waitlist = await Waitlist.find({
            slot: slotId,
            status: 'waiting'
        })
            .populate('user', 'name phone')
            .sort({ joinedAt: 1 });

        res.json({
            success: true,
            waitlistCount: waitlist.length,
            waitlist
        });
    } catch (error: any) {
        console.error('Error fetching waitlist:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch waitlist' });
    }
});

/**
 * GET /api/waitlist/my-position/:slotId
 * Check user's position in waitlist
 */
router.get('/my-position/:slotId', async (req: Request, res: Response) => {
    try {
        const { slotId } = req.params;
        const userId = (req as any).userId;

        const waitlistEntry = await Waitlist.findOne({
            slot: slotId,
            user: userId,
            status: { $in: ['waiting', 'confirmed'] }
        });

        if (!waitlistEntry) {
            return res.status(404).json({
                success: false,
                message: 'Not in waitlist for this slot'
            });
        }

        res.json({
            success: true,
            position: waitlistEntry.position,
            status: waitlistEntry.status,
            joinedAt: waitlistEntry.joinedAt,
            confirmedAt: waitlistEntry.confirmedAt
        });
    } catch (error: any) {
        console.error('Error checking waitlist position:', error);
        res.status(500).json({ success: false, message: 'Failed to check position' });
    }
});

/**
 * Helper function: Process waitlist when booking is cancelled
 */
async function processWaitlist(slotId: string, templeId: string | undefined, date: string) {
    try {
        // Get first person in waitlist
        const nextInLine = await Waitlist.findOne({
            slot: slotId,
            status: 'waiting'
        }).sort({ joinedAt: 1 });

        if (!nextInLine) {
            console.log('No one in waitlist');
            return;
        }

        // Create automatic booking for them
        const newBooking = new Booking({
            user: nextInLine.user,
            temple: templeId,
            slot: slotId,
            status: 'confirmed',
            bookingDetails: nextInLine.bookingDetails,
        });

        const savedBooking = await newBooking.save();

        // Update slot current booked
        await Slot.findByIdAndUpdate(slotId, {
            $inc: { currentBooked: 1 }
        });

        // Update waitlist entry
        nextInLine.status = 'confirmed';
        nextInLine.confirmedBookingId = savedBooking._id;
        nextInLine.confirmedAt = new Date();
        nextInLine.position = 1; // Mark as confirmed
        await nextInLine.save();

        // Update other waitlist positions
        await Waitlist.updateMany(
            { slot: slotId, status: 'waiting' },
            { $inc: { position: -1 } }
        );

        console.log(`Auto-confirmed booking for user ${nextInLine.user}`);

        // TODO: Send notification/email to user about auto-confirmation
    } catch (error) {
        console.error('Error processing waitlist:', error);
    }
}

export default router;
