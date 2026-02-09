import { Router } from 'express';
import { createBooking } from '../controllers/booking.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', protect, createBooking);

export default router;