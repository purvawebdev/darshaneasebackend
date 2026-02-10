import { Router } from 'express';
import { createBooking } from '../controllers/booking.controller';
import { protect } from '../middlewares/auth.middleware';
import { getMyBookings } from '../controllers/booking.controller';

const router = Router();

router.post('/', protect, createBooking);
router.get('/', protect, getMyBookings);

export default router;