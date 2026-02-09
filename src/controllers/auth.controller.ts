import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
    try {
        const { phone, name, password } = req.body;

        if (!phone || !name || !password) {
            return res.status(400).json({ message: "Phone, name and password are required" });
        }

        const result = await authService.register({ phone, name, password });
        return res.status(201).json(result);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ message: "Phone and password are required" });
        }

        const result = await authService.login({ phone, password });
        return res.json(result);
    } catch (error: any) {
        return res.status(401).json({ message: error.message });
    }
};