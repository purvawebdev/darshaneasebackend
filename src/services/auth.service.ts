import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { config } from "../config/env";

interface RegisterInput {
    phone: string;
    name: string;
    password: string;
}

interface LoginInput {
    phone: string;
    password: string;
}

export const authService = {
    async register({ phone, name, password }: RegisterInput) {
        const existing = await User.findOne({ phone });
        if (existing) {
            throw new Error("Phone number already registered");
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            phone,
            name,
            passwordHash,
        });

        const token = jwt.sign(
            { id: user._id, phone: user.phone, role: user.role },
            config.jwtSecret,
            { expiresIn: "7d" }
        );

        return {
            user: { id: user._id, phone: user.phone, name: user.name, role: user.role },
            token,
        };
    },

    async login({ phone, password }: LoginInput) {
        const user = await User.findOne({ phone });
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign(
            { id: user._id, phone: user.phone, role: user.role },
            config.jwtSecret,
            { expiresIn: "7d" }
        );

        return {
            user: { id: user._id, phone: user.phone, name: user.name, role: user.role },
            token,
        };
    },
};