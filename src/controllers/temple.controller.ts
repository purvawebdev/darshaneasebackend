import { Request, Response } from 'express';
import Temple from '../models/temple.model';

export const getAllTemples = async (req: Request, res: Response) => {
    try {
        const temples = await Temple.find({ isActive: true }).sort({ name: 1 });

        res.json({
            success: true,
            data: temples,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch temples',
            error: error.message,
        });
    }
};

export const getTempleById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const temple = await Temple.findById(id);

        if (!temple) {
            return res.status(404).json({
                success: false,
                message: 'Temple not found',
            });
        }

        res.json({
            success: true,
            data: temple,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch temple',
            error: error.message,
        });
    }
};
