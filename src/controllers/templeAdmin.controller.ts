import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { User } from '../models/user.model';
import Temple from '../models/temple.model';
import { Slot } from '../models/slot.model';
import { Booking } from '../models/booking.model';

// ==================== HELPERS ====================

/** Extracts the templeAdmin's assigned temple from the JWT user, or returns 403 */
async function getAssignedTemple(req: AuthRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: 'Not authenticated' });
        return null;
    }

    const user = await User.findById(userId).select('assignedTemple');
    if (!user?.assignedTemple) {
        res.status(403).json({ message: 'No temple assigned to your account' });
        return null;
    }

    return user.assignedTemple.toString();
}

// ==================== TEMPLE INFO ====================

/** GET /api/temple-admin/temple — Get the admin's assigned temple */
export const getMyTemple = async (req: AuthRequest, res: Response) => {
    try {
        const templeId = await getAssignedTemple(req, res);
        if (!templeId) return;

        const temple = await Temple.findById(templeId);
        if (!temple) return res.status(404).json({ success: false, message: 'Temple not found' });

        res.json({ success: true, data: temple });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/** PUT /api/temple-admin/temple — Update own temple details */
export const updateMyTemple = async (req: AuthRequest, res: Response) => {
    try {
        const templeId = await getAssignedTemple(req, res);
        if (!templeId) return;

        // Only allow updating certain fields (not _id, isActive — superadmin controls that)
        const { name, description, location, deity, image, imageUrl, timings, operatingHours } = req.body;
        const updateData: any = {};

        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (location) updateData.location = location;
        if (deity) updateData.deity = deity;
        if (image) updateData.image = image;
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
        if (timings) updateData.timings = timings;
        if (operatingHours) updateData.operatingHours = operatingHours;

        const temple = await Temple.findByIdAndUpdate(templeId, updateData, {
            new: true,
            runValidators: true,
        });

        if (!temple) return res.status(404).json({ success: false, message: 'Temple not found' });

        res.json({ success: true, message: 'Temple updated', data: temple });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// ==================== SLOT MANAGEMENT ====================

/** GET /api/temple-admin/slots — Get all slots for the admin's temple */
export const getTempleSlots = async (req: AuthRequest, res: Response) => {
    try {
        const templeId = await getAssignedTemple(req, res);
        if (!templeId) return;

        const { date } = req.query;
        const filter: any = { templeId };
        if (date && typeof date === 'string') filter.date = date;

        const slots = await Slot.find(filter)
            .sort({ date: 1, startTime: 1 })
            .lean();

        res.json({ success: true, count: slots.length, data: slots });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/** POST /api/temple-admin/slots — Create a new slot for the admin's temple */
export const createSlot = async (req: AuthRequest, res: Response) => {
    try {
        const templeId = await getAssignedTemple(req, res);
        if (!templeId) return;

        const { date, startTime, endTime, label, maxCapacity } = req.body;

        if (!date || !startTime || !endTime || !label) {
            return res.status(400).json({ message: 'date, startTime, endTime, and label are required' });
        }

        const slot = await Slot.create({
            templeId,
            date,
            startTime,
            endTime,
            label,
            maxCapacity: maxCapacity || 30,
        });

        res.status(201).json({ success: true, message: 'Slot created', data: slot });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/** PUT /api/temple-admin/slots/:id — Update a slot */
export const updateSlot = async (req: AuthRequest, res: Response) => {
    try {
        const templeId = await getAssignedTemple(req, res);
        if (!templeId) return;

        // Ensure the slot belongs to this admin's temple
        const slot = await Slot.findById(req.params.id);
        if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
        if (slot.templeId.toString() !== templeId) {
            return res.status(403).json({ message: 'This slot does not belong to your temple' });
        }

        const { maxCapacity, isActive, label, startTime, endTime } = req.body;
        if (maxCapacity !== undefined) slot.maxCapacity = maxCapacity;
        if (isActive !== undefined) slot.isActive = isActive;
        if (label) slot.label = label;
        if (startTime) slot.startTime = startTime;
        if (endTime) slot.endTime = endTime;

        await slot.save();

        res.json({ success: true, message: 'Slot updated', data: slot });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/** DELETE /api/temple-admin/slots/:id — Delete a slot */
export const deleteSlot = async (req: AuthRequest, res: Response) => {
    try {
        const templeId = await getAssignedTemple(req, res);
        if (!templeId) return;

        const slot = await Slot.findById(req.params.id);
        if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
        if (slot.templeId.toString() !== templeId) {
            return res.status(403).json({ message: 'This slot does not belong to your temple' });
        }

        await Slot.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'Slot deleted' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== BOOKING VIEW ====================

/** GET /api/temple-admin/bookings — View bookings for the admin's temple */
export const getTempleBookings = async (req: AuthRequest, res: Response) => {
    try {
        const templeId = await getAssignedTemple(req, res);
        if (!templeId) return;

        const { date, status } = req.query;

        // First find all slot IDs for this temple (optionally filtered by date)
        const slotFilter: any = { templeId };
        if (date && typeof date === 'string') slotFilter.date = date;

        const slotIds = await Slot.find(slotFilter).select('_id').lean();
        const slotIdArray = slotIds.map((s) => s._id);

        const bookingFilter: any = { slot: { $in: slotIdArray } };
        if (status && typeof status === 'string') bookingFilter.status = status;

        const bookings = await Booking.find(bookingFilter)
            .populate('user', 'name phone')
            .populate({
                path: 'slot',
                select: 'date startTime endTime label maxCapacity currentBooked',
            })
            .sort({ bookedAt: -1 })
            .lean();

        res.json({ success: true, count: bookings.length, data: bookings });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== TEMPLE DASHBOARD STATS ====================

/** GET /api/temple-admin/stats — Stats for the admin's temple */
export const getTempleStats = async (req: AuthRequest, res: Response) => {
    try {
        const templeId = await getAssignedTemple(req, res);
        if (!templeId) return;

        const today = new Date().toISOString().split('T')[0];

        const [totalSlots, todaySlots, totalBookings, todayBookings] = await Promise.all([
            Slot.countDocuments({ templeId, isActive: true }),
            Slot.countDocuments({ templeId, isActive: true, date: today }),
            Booking.countDocuments({
                slot: { $in: await Slot.find({ templeId }).select('_id').lean().then(s => s.map(x => x._id)) },
                status: 'confirmed',
            }),
            Booking.countDocuments({
                slot: {
                    $in: await Slot.find({ templeId, date: today }).select('_id').lean().then(s => s.map(x => x._id)),
                },
                status: 'confirmed',
            }),
        ]);

        res.json({
            success: true,
            data: {
                totalSlots,
                todaySlots,
                totalBookings,
                todayBookings,
            },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
