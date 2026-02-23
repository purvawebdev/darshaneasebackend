import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { User } from '../models/user.model';
import Temple from '../models/temple.model';
import { Slot } from '../models/slot.model';
import { Booking } from '../models/booking.model';

// ==================== USER MANAGEMENT ====================

/** GET /api/admin/users — List all users */
export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await User.find()
            .select('-passwordHash')
            .populate('assignedTemple', 'name location')
            .sort({ createdAt: -1 })
            .lean();

        res.json({ success: true, count: users.length, data: users });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
    }
};

/** GET /api/admin/users/:id — Get single user */
export const getUserById = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-passwordHash')
            .populate('assignedTemple', 'name location')
            .lean();

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        res.json({ success: true, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message });
    }
};

/**
 * PATCH /api/admin/users/:id/role
 * Body: { role: "devotee" | "templeAdmin" | "superadmin", assignedTemple?: string }
 */
export const updateUserRole = async (req: AuthRequest, res: Response) => {
    try {
        const { role, assignedTemple } = req.body;
        const validRoles = ['devotee', 'templeAdmin', 'superadmin'];

        if (!role || !validRoles.includes(role)) {
            return res.status(400).json({ message: `role must be one of: ${validRoles.join(', ')}` });
        }

        // If setting templeAdmin, assignedTemple is required
        if (role === 'templeAdmin' && !assignedTemple) {
            return res.status(400).json({ message: 'assignedTemple is required when role is templeAdmin' });
        }

        const updateData: any = { role };

        if (role === 'templeAdmin') {
            // Verify the temple exists
            const temple = await Temple.findById(assignedTemple);
            if (!temple) return res.status(404).json({ message: 'Assigned temple not found' });
            updateData.assignedTemple = assignedTemple;
        } else {
            updateData.assignedTemple = null;
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true })
            .select('-passwordHash')
            .populate('assignedTemple', 'name location');

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        res.json({ success: true, message: `User role updated to ${role}`, data: user });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/** DELETE /api/admin/users/:id — Delete a user */
export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        // Prevent self-deletion
        if (req.user?.id === req.params.id) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== TEMPLE MANAGEMENT ====================

/** POST /api/admin/temples — Create a new temple */
export const createTemple = async (req: AuthRequest, res: Response) => {
    try {
        const { name, description, location, deity, image, imageUrl, timings, operatingHours } = req.body;

        if (!name || !description || !location || !deity) {
            return res.status(400).json({ message: 'name, description, location, and deity are required' });
        }

        const temple = await Temple.create({
            name,
            description,
            location,
            deity,
            image: image || '🛕',
            imageUrl: imageUrl || '',
            timings: timings || '6:00 AM - 8:00 PM',
            operatingHours: operatingHours || [],
        });

        res.status(201).json({ success: true, message: 'Temple created', data: temple });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/** PUT /api/admin/temples/:id — Update a temple */
export const updateTemple = async (req: AuthRequest, res: Response) => {
    try {
        const temple = await Temple.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!temple) return res.status(404).json({ success: false, message: 'Temple not found' });

        res.json({ success: true, message: 'Temple updated', data: temple });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/** DELETE /api/admin/temples/:id — Delete a temple */
export const deleteTemple = async (req: AuthRequest, res: Response) => {
    try {
        const temple = await Temple.findByIdAndDelete(req.params.id);
        if (!temple) return res.status(404).json({ success: false, message: 'Temple not found' });

        // Also clean up related slots and bookings
        const deletedSlots = await Slot.deleteMany({ templeId: req.params.id });
        console.log(`🗑️ Deleted ${deletedSlots.deletedCount} slots for temple ${temple.name}`);

        res.json({ success: true, message: 'Temple and related slots deleted' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/** PATCH /api/admin/temples/:id/toggle — Toggle temple active status */
export const toggleTempleStatus = async (req: AuthRequest, res: Response) => {
    try {
        const temple = await Temple.findById(req.params.id);
        if (!temple) return res.status(404).json({ success: false, message: 'Temple not found' });

        temple.isActive = !temple.isActive;
        await temple.save();

        res.json({
            success: true,
            message: `Temple ${temple.isActive ? 'activated' : 'deactivated'}`,
            data: temple,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== STATS / DASHBOARD ====================

/** GET /api/admin/stats — Global dashboard stats */
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        const [totalUsers, totalTemples, totalBookings, totalSlots] = await Promise.all([
            User.countDocuments(),
            Temple.countDocuments({ isActive: true }),
            Booking.countDocuments({ status: 'confirmed' }),
            Slot.countDocuments({ isActive: true }),
        ]);

        res.json({
            success: true,
            data: {
                totalUsers,
                totalTemples,
                totalBookings,
                totalSlots,
            },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/** GET /api/admin/bookings — All bookings (with filters) */
export const getAllBookings = async (req: AuthRequest, res: Response) => {
    try {
        const { templeId, status, date } = req.query;
        const filter: any = {};

        if (status && typeof status === 'string') filter.status = status;

        const bookings = await Booking.find(filter)
            .populate({
                path: 'user',
                select: 'name phone role',
            })
            .populate({
                path: 'slot',
                select: 'date startTime endTime label maxCapacity currentBooked templeId',
                populate: {
                    path: 'templeId',
                    select: 'name location imageUrl',
                },
                ...(templeId || date
                    ? {
                        match: {
                            ...(templeId ? { templeId } : {}),
                            ...(date ? { date } : {}),
                        },
                    }
                    : {}),
            })
            .sort({ bookedAt: -1 })
            .lean();

        // Filter out bookings where slot didn't match (populate match returns null)
        const filtered = bookings.filter((b) => b.slot !== null);

        res.json({ success: true, count: filtered.length, data: filtered });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
