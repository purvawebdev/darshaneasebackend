import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["devotee", "templeAdmin", "superadmin"],
            default: "devotee",
        },
        // For templeAdmin: which temple they manage
        assignedTemple: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Temple",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model("User", userSchema);