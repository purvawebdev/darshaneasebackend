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
            enum: ["devotee", "admin"],
            default: "devotee",
        },
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model("User", userSchema);