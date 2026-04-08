import { Router, Request, Response } from 'express';
import { createBooking, getMyBookings, verifyBooking, scanBooking } from '../controllers/booking.controller';
import { protect, requireRole } from '../middlewares/auth.middleware';
import { Booking } from '../models/booking.model';
import { Waitlist } from '../models/waitlist.model';
import { Slot } from '../models/slot.model';

const router = Router();

router.post('/', protect, createBooking);
router.get('/', protect, getMyBookings);

// QR scan endpoints
router.get('/:id/verify', verifyBooking);  // Public — used when scanning QR
router.post('/:id/scan', protect, requireRole('templeAdmin', 'superadmin'), scanBooking);

/**
 * POST /api/bookings/:bookingId/cancel
 * Cancel a booking within 7 days of visit date
 */
router.post('/:bookingId/cancel', protect, async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        const { reason = 'User requested cancellation' } = req.body;
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }

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

        console.log(`\n🛑 Booking ${bookingId} cancelled by user ${userId}`);
        console.log(`📞 Processing waitlist for slot ${booking.slot}...`);

        // Process waitlist - auto-confirm first person in queue
        const slotObj = booking.slot as any;
        const slotIdForWaitlist = slotObj._id ? slotObj._id.toString() : slotObj.toString();
        await processWaitlist(slotIdForWaitlist, booking.temple?.toString(), slot.date);

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
 * Helper function: Process waitlist when booking is cancelled
 */
async function processWaitlist(slotId: string, templeId: string | undefined, date: string) {
    try {
        console.log(`\n🔄 Processing waitlist for slot ${slotId}...`);
        
        // Get first person in waitlist (sorted by position, then joinedAt for safety)
        const nextInLine = await Waitlist.findOne({
            slot: slotId,
            status: 'waiting'
        }).sort({ position: 1, joinedAt: 1 });

        if (!nextInLine) {
            console.log('❌ No one in waitlist to auto-confirm');
            return;
        }

        console.log(`✅ Found next in line: ${nextInLine.user} at position ${nextInLine.position}`);

        // Create automatic booking for them
        const newBooking = new Booking({
            user: nextInLine.user,
            temple: templeId,
            slot: slotId,
            status: 'confirmed',
            bookingDetails: nextInLine.bookingDetails,
        });

        const savedBooking = await newBooking.save();
        console.log(`✅ Created booking ${savedBooking._id} for user ${nextInLine.user}`);

        // Update slot current booked
        await Slot.findByIdAndUpdate(slotId, {
            $inc: { currentBooked: 1 }
        });

        // Update waitlist entry
        nextInLine.status = 'confirmed';
        nextInLine.confirmedBookingId = savedBooking._id;
        nextInLine.confirmedAt = new Date();
        nextInLine.position = 0; // Mark as confirmed
        await nextInLine.save();
        console.log(`✅ Updated waitlist entry status to confirmed`);

        // Update other waitlist positions
        const updateResult = await Waitlist.updateMany(
            { slot: slotId, status: 'waiting' },
            { $inc: { position: -1 } }
        );
        console.log(`✅ Updated ${updateResult.modifiedCount} other waitlist positions`);

        console.log(`🎉 Auto-confirmed booking for user ${nextInLine.user}\n`);

        // TODO: Send notification/email to user about auto-confirmation
    } catch (error) {
        console.error('❌ Error processing waitlist:', error);
    }
}

export default router;