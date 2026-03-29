import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    user: mongoose.Types.ObjectId;
    type: string;
    title: string;
    body: string;
    isRead: boolean;
    createdAt: Date;
}

const notificationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['system', 'booking', 'alert'], default: 'system' },
    title: { type: String, required: true },
    body: { type: String, required: true },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
