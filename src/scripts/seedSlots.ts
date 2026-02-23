import mongoose from 'mongoose';
import Temple from '../models/temple.model';
import { Slot } from '../models/slot.model';
import dotenv from 'dotenv';

dotenv.config();

// ----- Helpers -----

/** Generate an array of "YYYY-MM-DD" strings for the next `count` days */
function getNextDays(count: number): string[] {
    const dates: string[] = [];
    const today = new Date();

    for (let i = 0; i < count; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
    }

    return dates;
}

/** Convert "HH:mm" → total minutes since midnight */
function timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}

/** Convert total minutes since midnight → "HH:mm" */
function minutesToTime(mins: number): string {
    const h = Math.floor(mins / 60)
        .toString()
        .padStart(2, '0');
    const m = (mins % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
}

/** Turn an index (0, 1, 2 ... 25, 26 ...) into a label (A, B, C ... Z, AA ...) */
function indexToLabel(index: number): string {
    let label = '';
    let n = index;
    do {
        label = String.fromCharCode(65 + (n % 26)) + label;
        n = Math.floor(n / 26) - 1;
    } while (n >= 0);
    return label;
}

// Slot duration in minutes
const SLOT_DURATION = 15;
const DEFAULT_CAPACITY = 30;

// ----- Main -----

async function seedSlots() {
    try {
        const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/darshanease';

        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Get all active temples
        const temples = await Temple.find({ isActive: true });

        if (temples.length === 0) {
            console.log('⚠️  No temples found. Please run seedTemples.ts first.');
            process.exit(1);
        }

        console.log(`📋 Found ${temples.length} temples`);

        // Clear existing slots
        await Slot.deleteMany({});
        console.log('🗑️  Cleared existing slots');

        // Generate slots for the next 30 days
        const dates = getNextDays(30);
        let totalSlots = 0;

        for (const temple of temples) {
            console.log(`\n🛕 Creating slots for: ${temple.name}`);

            const hours = temple.operatingHours;
            if (!hours || hours.length === 0) {
                console.log(`   ⚠️  No operatingHours defined — skipping`);
                continue;
            }

            let templeSlotCount = 0;

            for (const date of dates) {
                let labelIndex = 0; // reset labels per day per temple

                for (const window of hours) {
                    const openMins = timeToMinutes(window.open);
                    const closeMins = timeToMinutes(window.close);

                    // Generate 15-min slots from open → close
                    for (let start = openMins; start + SLOT_DURATION <= closeMins; start += SLOT_DURATION) {
                        const slot = new Slot({
                            templeId: temple._id,
                            date,
                            startTime: minutesToTime(start),
                            endTime: minutesToTime(start + SLOT_DURATION),
                            label: indexToLabel(labelIndex),
                            maxCapacity: DEFAULT_CAPACITY,
                            currentBooked: 0,
                            isActive: true,
                        });

                        await slot.save();
                        labelIndex++;
                        templeSlotCount++;
                        totalSlots++;
                    }
                }
            }

            console.log(`   ✅ Created ${templeSlotCount} slots (${templeSlotCount / dates.length} per day)`);
        }

        console.log(`\n✨ Slot seeding completed successfully!`);
        console.log(`📊 Total slots created: ${totalSlots}`);
        console.log(`📅 Date range: ${dates[0]} to ${dates[dates.length - 1]}`);
        console.log(`⏱️  Each slot: ${SLOT_DURATION} minutes`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding slots:', error);
        process.exit(1);
    }
}

seedSlots();
