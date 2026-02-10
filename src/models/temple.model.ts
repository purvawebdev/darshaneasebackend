import mongoose, { Document, Schema } from 'mongoose';

export interface ITemple extends Document {
    name: string;
    description: string;
    location: string;
    deity: string;
    image: string;
    timings: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const templeSchema = new Schema<ITemple>(
    {
        name: {
            type: String,
            required: [true, 'Temple name is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
        },
        deity: {
            type: String,
            required: [true, 'Deity name is required'],
            trim: true,
        },
        image: {
            type: String,
            default: '🛕',
        },
        timings: {
            type: String,
            default: '6:00 AM - 8:00 PM',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Temple = mongoose.model<ITemple>('Temple', templeSchema);

export default Temple;
