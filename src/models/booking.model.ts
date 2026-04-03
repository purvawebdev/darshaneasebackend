import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    temple: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Temple',
        required: false,
    },
    slot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slot',
        required: true,
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'completed'],
        default: 'confirmed',
    },
    bookedAt: {
        type: Date,
        default: Date.now,
    },
    scannedAt: {
        type: Date,
        default: null,
    },
    // Cancellation fields
    cancellationDate: {
        type: Date,
        default: null,
    },
    cancellationReason: {
        type: String,
        default: null,
    },
    refundStatus: {
        type: String,
        enum: ['pending', 'completed', null],
        default: null,
    },
    cancellationPenalty: {
        type: Number,
        default: 0,
    },
    cancellationType: {
        type: String,
        enum: ['free', 'with-penalty', null],
        default: null,
    },
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

export const Booking = mongoose.model('Booking', bookingSchema);