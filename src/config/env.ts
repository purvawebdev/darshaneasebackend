import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(4000),
    MONGODB_URI: z.string().min(10, "MongoDB URI is required"),
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
});

const parsed = envSchema.parse(process.env);

export const config = {
    env: parsed.NODE_ENV,
    port: parsed.PORT,
    mongoUri: parsed.MONGODB_URI,
    jwtSecret: parsed.JWT_SECRET,
    isProduction: parsed.NODE_ENV === "production",
} as const;