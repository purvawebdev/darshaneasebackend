import { Slot } from '../models/slot.model';
import { Booking } from '../models/booking.model';

export const bookingService = {
    async createBooking(userId: string, slotId: string) {
        // 1. Find the slot
        const slot = await Slot.findById(slotId);
        if (!slot) {
            throw new Error('Slot not found');
        }

        if (!slot.isActive) {
            throw new Error('Slot is not active');
        }

        if (slot.currentBooked >= slot.maxCapacity) {
            throw new Error('Slot is fully booked');
        }

        // 2. Create booking
        const booking = await Booking.create({
            user: userId,
            slot: slotId,
        });

        // 3. Increment currentBooked (atomic update)
        await Slot.findByIdAndUpdate(
            slotId,
            { $inc: { currentBooked: 1 } },
            { new: true }
        );

        return booking;
    },
};