import { Request, Response } from 'express';
import { Slot } from '../models/slot.model';

export const getSlots = async (req: Request, res: Response) => {
    try {
        const { date, templeId } = req.query;

        // Build a simple filter
        const filter: any = { isActive: true };

        if (date && typeof date === 'string') {
            filter.date = date; // e.g. ?date=2025-04-18
        }

        if (templeId && typeof templeId === 'string') {
            filter.templeId = templeId;
        }

        // For now — no pagination, no sorting, keep it minimal
        const slots = await Slot.find(filter)
            .populate('templeId', 'name location deity image')
            .sort({ date: 1, startTime: 1 }) // chronological order
            .lean(); // faster, plain JS objects

        return res.json({
            success: true,
            count: slots.length,
            data: slots,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};