import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Seeds a default superadmin user.
 * Credentials: phone: "9999999999", password: "admin123456"
 * 
 * If the user already exists, it skips creation.
 */
async function seedSuperAdmin() {
    try {
        const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/darshanease';

        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const PHONE = '9999999999';
        const PASSWORD = 'admin123456';
        const NAME = 'Super Admin';

        const existing = await User.findOne({ phone: PHONE });
        if (existing) {
            console.log('⚠️  Superadmin already exists:');
            console.log(`   📱 Phone: ${PHONE}`);
            console.log(`   👤 Role: ${existing.role}`);

            // Ensure their role is superadmin (in case it was changed)
            if (existing.role !== 'superadmin') {
                existing.role = 'superadmin';
                await existing.save();
                console.log('   🔄 Role updated to superadmin');
            }

            process.exit(0);
        }

        const passwordHash = await bcrypt.hash(PASSWORD, 10);

        await User.create({
            phone: PHONE,
            name: NAME,
            passwordHash,
            role: 'superadmin',
        });

        console.log('✅ Superadmin created:');
        console.log(`   📱 Phone: ${PHONE}`);
        console.log(`   🔑 Password: ${PASSWORD}`);
        console.log(`   👤 Role: superadmin`);
        console.log('\n⚠️  Change these credentials in production!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding superadmin:', error);
        process.exit(1);
    }
}

seedSuperAdmin();
