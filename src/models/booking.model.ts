import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
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
    status: {
        type: String,
        enum: ['confirmed', 'cancelled'], //add pending later when the admin logic is done and slot availability is done
        default: 'confirmed',
    },
    bookedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

export const Booking = mongoose.model('Booking', bookingSchema);