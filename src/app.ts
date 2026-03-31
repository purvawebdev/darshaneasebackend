import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import slotRoutes from "./routes/slot.routes";
import bookingRoutes from "./routes/booking.routes";
import templeRoutes from "./routes/temple.routes";
import paymentRoutes from "./routes/payment.routes";
import adminRoutes from "./routes/admin.routes";
import templeAdminRoutes from "./routes/templeAdmin.routes";
import festivalRoutes from "./routes/festival.routes";
import qrRoutes from "./routes/qr.routes";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());

app.use(express.json());

// ----- Public / Devotee routes -----
app.use("/api/auth", authRoutes);
app.use("/api/temples", templeRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/festivals", festivalRoutes);

// ----- Admin routes -----
app.use("/api/admin", adminRoutes);
app.use("/api/temple-admin", templeAdminRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;