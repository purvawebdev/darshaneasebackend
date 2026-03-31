import { Router } from 'express';
import { createBooking, getMyBookings, verifyBooking, scanBooking } from '../controllers/booking.controller';
import { protect, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', protect, createBooking);
router.get('/', protect, getMyBookings);

// QR scan endpoints
router.get('/:id/verify', verifyBooking);  // Public — used when scanning QR
router.post('/:id/scan', protect, requireRole('templeAdmin', 'superadmin'), scanBooking);

export default router;