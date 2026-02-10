import mongoose from 'mongoose';
import Temple from '../models/temple.model';
import dotenv from 'dotenv';

dotenv.config();

const temples = [
    {
        name: 'Tirupati Balaji',
        description: 'One of the most visited temples in the world, dedicated to Lord Venkateswara',
        location: 'Tirupati, Andhra Pradesh',
        deity: 'Lord Venkateswara (Vishnu)',
        image: '🛕',
        timings: '2:30 AM - 11:00 PM',
        isActive: true,
    },
    {
        name: 'Shirdi Sai Baba Temple',
        description: 'Sacred shrine of the revered saint Sai Baba',
        location: 'Shirdi, Maharashtra',
        deity: 'Sai Baba',
        image: '🕉️',
        timings: '4:00 AM - 11:15 PM',
        isActive: true,
    },
    {
        name: 'Golden Temple',
        description: 'The holiest Gurdwara of Sikhism, known for its stunning golden architecture',
        location: 'Amritsar, Punjab',
        deity: 'Guru Granth Sahib',
        image: '⛩️',
        timings: '24 Hours',
        isActive: true,
    },
    {
        name: 'Siddhivinayak Temple',
        description: 'Famous temple dedicated to Lord Ganesha in the heart of Mumbai',
        location: 'Prabhadevi, Mumbai',
        deity: 'Lord Ganesha',
        image: '🐘',
        timings: '5:30 AM - 9:50 PM',
        isActive: true,
    },
    {
        name: 'Vaishno Devi Temple',
        description: 'One of the holiest Hindu temples dedicated to Goddess Vaishno Devi',
        location: 'Katra, Jammu',
        deity: 'Goddess Vaishno Devi',
        image: '🙏',
        timings: '5:00 AM - 12:00 PM, 4:00 PM - 9:00 PM',
        isActive: true,
    },
    {
        name: 'Meenakshi Amman Temple',
        description: 'Historic temple with stunning Dravidian architecture',
        location: 'Madurai, Tamil Nadu',
        deity: 'Goddess Meenakshi & Lord Sundareswarar',
        image: '🏛️',
        timings: '5:00 AM - 12:30 PM, 4:00 PM - 10:00 PM',
        isActive: true,
    },
];

async function seedTemples() {
    try {
        const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/darshanease';

        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing temples
        await Temple.deleteMany({});
        console.log('🗑️  Cleared existing temples');

        // Insert new temples
        const insertedTemples = await Temple.insertMany(temples);
        console.log(`✅ Inserted ${insertedTemples.length} temples:`);
        insertedTemples.forEach(temple => {
            console.log(`   ${temple.image} ${temple.name} - ${temple.location}`);
        });

        console.log('\n✨ Temple seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding temples:', error);
        process.exit(1);
    }
}

seedTemples();
