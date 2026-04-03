import mongoose from 'mongoose';

const waitlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    slot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slot',
        required: true,
    },
    temple: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Temple',
        required: true,
    },
    date: {
        type: String, // YYYY-MM-DD format
        required: true,
    },
    status: {
        type: String,
        enum: ['waiting', 'confirmed', 'expired', 'cancelled'],
        default: 'waiting',
    },
    position: {
        type: Number,
        required: true,
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
    // When auto-confirmed from waitlist
    confirmedBookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        default: null,
    },
    confirmedAt: {
        type: Date,
        default: null,
    },
    // Booking details stored for reference
    bookingDetails: {
        name: String,
        age: Number,
        hasDisability: Boolean,
        isPregnant: Boolean,
        adults: Number,
        children: Number,
        totalAmount: Number,
    }
}, { timestamps: true });

export const Waitlist = mongoose.model('Waitlist', waitlistSchema);
