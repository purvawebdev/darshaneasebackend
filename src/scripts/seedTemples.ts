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
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Tirumala_090615.jpg/1280px-Tirumala_090615.jpg',
        timings: '2:30 AM - 11:00 PM',
        operatingHours: [{ open: '02:30', close: '23:00' }],
        isActive: true,
    },
    {
        name: 'Shirdi Sai Baba Temple',
        description: 'Sacred shrine of the revered saint Sai Baba',
        location: 'Shirdi, Maharashtra',
        deity: 'Sai Baba',
        image: '🕉️',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Shirdi_Sai_Baba_Temple%2C_India.jpg/1280px-Shirdi_Sai_Baba_Temple%2C_India.jpg',
        timings: '4:00 AM - 11:15 PM',
        operatingHours: [{ open: '04:00', close: '23:15' }],
        isActive: true,
    },
    {
        name: 'Golden Temple',
        description: 'The holiest Gurdwara of Sikhism, known for its stunning golden architecture',
        location: 'Amritsar, Punjab',
        deity: 'Guru Granth Sahib',
        image: '⛩️',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/The_Golden_Temple_of_Amritsar_-_India_%28Sikh_holy_place%29.jpg/1280px-The_Golden_Temple_of_Amritsar_-_India_%28Sikh_holy_place%29.jpg',
        timings: '24 Hours',
        operatingHours: [{ open: '00:00', close: '23:59' }],
        isActive: true,
    },
    {
        name: 'Siddhivinayak Temple',
        description: 'Famous temple dedicated to Lord Ganesha in the heart of Mumbai',
        location: 'Prabhadevi, Mumbai',
        deity: 'Lord Ganesha',
        image: '🐘',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Siddhi_Vinayak_Temple_Mumbai_2012.jpg/800px-Siddhi_Vinayak_Temple_Mumbai_2012.jpg',
        timings: '5:30 AM - 9:50 PM',
        operatingHours: [{ open: '05:30', close: '21:50' }],
        isActive: true,
    },
    {
        name: 'Vaishno Devi Temple',
        description: 'One of the holiest Hindu temples dedicated to Goddess Vaishno Devi',
        location: 'Katra, Jammu',
        deity: 'Goddess Vaishno Devi',
        image: '🙏',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Vaishno_devi_ثلاثية.jpg/1280px-Vaishno_devi_temple.jpg',
        timings: '5:00 AM - 12:00 PM, 4:00 PM - 9:00 PM',
        operatingHours: [
            { open: '05:00', close: '12:00' },
            { open: '16:00', close: '21:00' },
        ],
        isActive: true,
    },
    {
        name: 'Meenakshi Amman Temple',
        description: 'Historic temple with stunning Dravidian architecture',
        location: 'Madurai, Tamil Nadu',
        deity: 'Goddess Meenakshi & Lord Sundareswarar',
        image: '🏛️',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Meenakshi_Temple%2C_Madurai.jpg/1280px-Meenakshi_Temple%2C_Madurai.jpg',
        timings: '5:00 AM - 12:30 PM, 4:00 PM - 10:00 PM',
        operatingHours: [
            { open: '05:00', close: '12:30' },
            { open: '16:00', close: '22:00' },
        ],
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
            console.log(`     📸 imageUrl: ${temple.imageUrl ? '✅' : '❌ missing'}`);
            console.log(`     🕐 operatingHours: ${temple.operatingHours.map(h => `${h.open}-${h.close}`).join(', ')}`);
        });

        console.log('\n✨ Temple seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding temples:', error);
        process.exit(1);
    }
}

seedTemples();
