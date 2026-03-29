import mongoose from "mongoose";
import app from "./app";
import { config } from "./config/env";
import http from "http";
import { Server } from "socket.io";
import { notificationService } from "./services/notification.service";

async function startServer() {
    try {
        await mongoose.connect(config.mongoUri);
        console.log("MongoDB connected");

        const server = http.createServer(app);
        
        // Setup Socket.io
        const io = new Server(server, {
            cors: {
                origin: "*", // Matches your allowedOrigins in prod
                credentials: true,
            }
        });

        // Initialize our central Notification Service with the IO instance
        notificationService.initializeSockets(io);

        io.on("connection", (socket) => {
            console.log(`Socket connected: ${socket.id}`);
            
            // Allow clients to join their own personal push notification room
            socket.on("join_user_room", (userId) => {
                socket.join(userId);
                console.log(`Socket ${socket.id} joined room for user: ${userId}`);
            });
            
            socket.on("disconnect", () => {
                console.log(`Socket disconnected: ${socket.id}`);
            });
        });

        server.listen(config.port, () => {
            console.log(`Server running on port ${config.port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();