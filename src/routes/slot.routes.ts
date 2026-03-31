import { Router } from 'express';
import { getSlots } from '../controllers/slot.controller';

const router = Router();

router.get('/', getSlots);  // Public — users browse slots before login

export default router;
