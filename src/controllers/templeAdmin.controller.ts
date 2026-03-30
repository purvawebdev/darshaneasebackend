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

/** POST /api/temple-admin/slots/bulk — Create multiple slots at once */
export const createBulkSlots = async (req: AuthRequest, res: Response) => {
    try {
        const templeId = await getAssignedTemple(req, res);
        if (!templeId) return;

        const { startDate, endDate, openTime, closeTime, intervalMinutes, maxCapacity } = req.body;

        if (!startDate || !endDate || !openTime || !closeTime || !intervalMinutes) {
            return res.status(400).json({
                message: 'startDate, endDate, openTime, closeTime, and intervalMinutes are required',
            });
        }

        // Parse dates
        const start = new Date(`${startDate}T00:00:00Z`);
        const end = new Date(`${endDate}T23:59:59Z`);

        if (start > end) {
            return res.status(400).json({ message: 'startDate must be before or equal to endDate' });
        }

        // Parse times
        const [openHour, openMin] = openTime.split(':').map(Number);
        const [closeHour, closeMin] = closeTime.split(':').map(Number);
        const openMinutes = openHour * 60 + openMin;
        const closeMinutes = closeHour * 60 + closeMin;

        if (openMinutes >= closeMinutes) {
            return res.status(400).json({ message: 'openTime must be before closeTime' });
        }

        // Generate slots
        const slots = [];
        const currentDate = new Date(start);

        while (currentDate <= end) {
            const dateStr = currentDate.toISOString().split('T')[0];

            // Generate slots for this day
            let currentMinutes = openMinutes;
            let slotIndex = 0;

            while (currentMinutes + intervalMinutes <= closeMinutes) {
                const slotHour = Math.floor(currentMinutes / 60);
                const slotMin = currentMinutes % 60;
                const endHour = Math.floor((currentMinutes + intervalMinutes) / 60);
                const endMin = (currentMinutes + intervalMinutes) % 60;

                const startTimeStr = `${String(slotHour).padStart(2, '0')}:${String(slotMin).padStart(2, '0')}`;
                const endTimeStr = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

                slots.push({
                    templeId,
                    date: dateStr,
                    startTime: startTimeStr,
                    endTime: endTimeStr,
                    label: String.fromCharCode(65 + (slotIndex % 26)), // A, B, C, ...
                    maxCapacity: maxCapacity || 30,
                    isActive: true,
                });

                currentMinutes += intervalMinutes;
                slotIndex++;
            }

            // Move to next day
            currentDate.setDate(currentDate.getDate() + 1);
        }

        if (slots.length === 0) {
            return res.status(400).json({ message: 'No slots to create with the given parameters' });
        }

        // Bulk insert
        const created = await Slot.insertMany(slots);

        res.status(201).json({
            success: true,
            message: `Created ${created.length} slots`,
            count: created.length,
            data: created,
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};
