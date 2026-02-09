import { Router } from 'express';
import { getSlots } from '../controllers/slot.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', protect, getSlots);

export default router;
