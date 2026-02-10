import mongoose from 'mongoose';
import { Booking } from '../models/booking.model';
import dotenv from 'dotenv';

dotenv.config();

async function cleanup() {
    try {
        const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/darshanease';

        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Delete all old bookings (they reference old slots without templeId)
        const result = await Booking.deleteMany({});
        console.log(`🗑️  Deleted ${result.deletedCount} old bookings`);

        console.log('\n✨ Cleanup completed successfully!');
        console.log('💡 You can now create new bookings with the updated slots.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error during cleanup:', error);
        process.exit(1);
    }
}

cleanup();
