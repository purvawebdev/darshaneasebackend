import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
    date: { type: String, required: true, index: true }, // "YYYY-MM-DD"
    startTime: { type: String, required: true }, // "06:00"
    endTime: { type: String, required: true },   // "07:00"
    maxCapacity: { type: Number, required: true },
    currentBooked: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    // templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple' }, // add later
}, {
    timestamps: true,
});

export const Slot = mongoose.model('Slot', slotSchema);