import mongoose from 'mongoose';
import { config } from '../config/env';
import { Slot } from '../models/slot.model'; // ← create this model next if not done yet

// Simple helper to generate times like "06:00", "06:30", etc.
function generateTimeSlots(startHour: number, endHour: number, intervalMinutes = 60): string[] {
    const slots: string[] = [];
    for (let h = startHour; h < endHour; h++) {
        for (let m = 0; m < 60; m += intervalMinutes) {
            const hourStr = h.toString().padStart(2, '0');
            const minStr = m.toString().padStart(2, '0');
            slots.push(`${hourStr}:${minStr}`);
        }
    }
    return slots;
}

async function seedSlots() {
    try {
        await mongoose.connect(config.mongoUri);
        console.log('Connected to MongoDB');

        // === Decide how many slots per day ===
        const slotsPerDay = 10; // you can change this (8–12 range)

        // Morning + evening focus — adjust hours as you like
        const morningSlots = generateTimeSlots(5, 10, 60);   // 5:00 to 9:00
        const eveningSlots = generateTimeSlots(16, 21, 60);  // 4:00 PM to 8:00 PM

        const timeOptions = [...morningSlots, ...eveningSlots].slice(0, slotsPerDay);

        const today = new Date();
        today.setHours(0, 0, 0, 0); // normalize to start of day

        const documents = [];

        for (let i = 0; i < 7; i++) { // 7 days (today + next 6)
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            for (const time of timeOptions) {
                const [hour, minute] = time.split(':').map(Number);
                const startDateTime = new Date(date);
                startDateTime.setHours(hour, minute, 0, 0);

                const endDateTime = new Date(startDateTime);
                endDateTime.setMinutes(endDateTime.getMinutes() + 60); // 60-min slot

                // Simulate realistic booking numbers
                const booked = Math.floor(Math.random() * 101); // 0 to 100
                // or more controlled:
                // const booked = [0, 15, 35, 60, 85, 95, 100][Math.floor(Math.random() * 7)];

                documents.push({
                    // templeId: new mongoose.Types.ObjectId('...'), // ← add later
                    date: date.toISOString().split('T')[0], // "2025-04-18"
                    startTime: time,
                    endTime: endDateTime.toTimeString().slice(0, 5), // "06:00" format
                    maxCapacity: 100,
                    currentBooked: booked,
                    isActive: true,
                    createdAt: new Date(),
                });
            }
        }

        // Optional: clear previous slots (uncomment if you want clean slate)
        // await Slot.deleteMany({});

        await Slot.insertMany(documents);
        console.log(`Successfully inserted ${documents.length} slots`);

        mongoose.disconnect();
    } catch (err) {
        console.error('Seed failed:', err);
        process.exit(1);
    }
}

seedSlots();