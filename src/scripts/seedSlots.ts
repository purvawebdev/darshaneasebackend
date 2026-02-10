import mongoose from 'mongoose';
import Temple from '../models/temple.model';
import { Slot } from '../models/slot.model';
import dotenv from 'dotenv';

dotenv.config();

// Helper to generate dates
function getNextDays(count: number): string[] {
    const dates: string[] = [];
    const today = new Date();

    for (let i = 0; i < count; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date.toISOString().split('T')[0]); // YYYY-MM-DD
    }

    return dates;
}

// Define time slots for each temple
const timeSlots = [
    { startTime: '06:00', endTime: '07:00' },
    { startTime: '07:00', endTime: '08:00' },
    { startTime: '08:00', endTime: '09:00' },
    { startTime: '09:00', endTime: '10:00' },
    { startTime: '10:00', endTime: '11:00' },
    { startTime: '11:00', endTime: '12:00' },
    { startTime: '16:00', endTime: '17:00' },
    { startTime: '17:00', endTime: '18:00' },
    { startTime: '18:00', endTime: '19:00' },
    { startTime: '19:00', endTime: '20:00' },
];

async function seedSlots() {
    try {
        const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/darshanease';

        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Get all temples
        const temples = await Temple.find({ isActive: true });

        if (temples.length === 0) {
            console.log('⚠️  No temples found. Please run seedTemples.ts first.');
            process.exit(1);
        }

        console.log(`📋 Found ${temples.length} temples`);

        // Clear existing slots
        await Slot.deleteMany({});
        console.log('🗑️  Cleared existing slots');

        // Generate slots for next 30 days
        const dates = getNextDays(30);
        let totalSlots = 0;

        for (const temple of temples) {
            console.log(`\n🛕 Creating slots for: ${temple.name}`);
            let templeSlotCount = 0;

            for (const date of dates) {
                for (const timeSlot of timeSlots) {
                    const slot = new Slot({
                        templeId: temple._id,
                        date,
                        startTime: timeSlot.startTime,
                        endTime: timeSlot.endTime,
                        maxCapacity: Math.floor(Math.random() * 31) + 20, // Random capacity between 20-50
                        currentBooked: 0,
                        isActive: true,
                    });

                    await slot.save();
                    templeSlotCount++;
                    totalSlots++;
                }
            }

            console.log(`   ✅ Created ${templeSlotCount} slots`);
        }

        console.log(`\n✨ Slot seeding completed successfully!`);
        console.log(`📊 Total slots created: ${totalSlots}`);
        console.log(`📅 Date range: ${dates[0]} to ${dates[dates.length - 1]}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding slots:', error);
        process.exit(1);
    }
}

seedSlots();
