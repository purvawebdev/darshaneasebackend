import mongoose, { Document, Schema } from 'mongoose';

export interface IOperatingHour {
    open: string;  // "HH:mm" 24-hour format
    close: string; // "HH:mm" 24-hour format
}

export interface ITemple extends Document {
    name: string;
    description: string;
    location: string;
    deity: string;
    image: string;
    imageUrl: string;
    timings: string;
    operatingHours: IOperatingHour[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const operatingHourSchema = new Schema<IOperatingHour>(
    {
        open: {
            type: String,
            required: [true, 'Opening time is required (HH:mm)'],
        },
        close: {
            type: String,
            required: [true, 'Closing time is required (HH:mm)'],
        },
    },
    { _id: false }
);

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
        imageUrl: {
            type: String,
            default: '',
        },
        timings: {
            type: String,
            default: '6:00 AM - 8:00 PM',
        },
        operatingHours: {
            type: [operatingHourSchema],
            default: [],
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
