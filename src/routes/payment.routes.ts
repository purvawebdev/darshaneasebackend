import { Router } from 'express';
import { simulatePayment } from '../controllers/payment.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// POST /api/payments/simulate — Protected, simulates payment + creates booking
router.post('/simulate', protect, simulatePayment);

export default router;
