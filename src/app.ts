import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import slotRoutes from "./routes/slot.routes";
import bookingRoutes from "./routes/booking.routes";
import templeRoutes from "./routes/temple.routes";
import paymentRoutes from "./routes/payment.routes";
import adminRoutes from "./routes/admin.routes";
import templeAdminRoutes from "./routes/templeAdmin.routes";

const app = express();

// CORS must be first, before routes
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
  : "*";

const corsOptions = {
  origin: allowedOrigins === "*" ? "*" : allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Handle preflight explicitly
app.options("*", cors(corsOptions));

app.use(express.json());

// ----- Public / Devotee routes -----
app.use("/api/auth", authRoutes);
app.use("/api/temples", templeRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

// ----- Admin routes -----
app.use("/api/admin", adminRoutes);
app.use("/api/temple-admin", templeAdminRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;