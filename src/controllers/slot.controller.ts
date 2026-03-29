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

import { getCrowdPrediction } from '../services/crowdPrediction.service';
        
        // For now — no pagination, no sorting, keep it minimal
        const slots = await Slot.find(filter)
            .populate('templeId', 'name location deity image imageUrl')
            .sort({ date: 1, startTime: 1 }) // chronological order
            .lean(); // faster, plain JS objects

        // Inject ML AI Predictions
        const slotsWithPredictions = await Promise.all(slots.map(async (slot: any) => {
            const dateObj = new Date(slot.date);
            const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
            const historical_fill_rate = slot.maxCapacity > 0 ? (slot.currentBooked / slot.maxCapacity) : 0;
            
            const aiPrediction = await getCrowdPrediction({
                templeId: slot.templeId?._id?.toString() || 'unknown',
                date: slot.date,
                startTime: slot.startTime,
                historical_fill_rate,
                is_weekend: isWeekend,
                is_festival: false // placeholder for V1
            });

            return {
                ...slot,
                aiPrediction: aiPrediction || {
                    crowd_level: "UNKNOWN",
                    estimated_wait_time_mins: 0,
                    confidence_score: 0
                }
            };
        }));

        return res.json({
            success: true,
            count: slotsWithPredictions.length,
            data: slotsWithPredictions,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};