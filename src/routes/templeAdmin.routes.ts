import { Router } from 'express';
import { protect, requireRole } from '../middlewares/auth.middleware';
import {
    getMyTemple,
    updateMyTemple,
    getTempleSlots,
    createSlot,
    updateSlot,
    deleteSlot,
    getTempleBookings,
    getTempleStats,
} from '../controllers/templeAdmin.controller';

const router = Router();

// All routes require: JWT + templeAdmin role
router.use(protect, requireRole('templeAdmin'));

// ----- Dashboard -----
router.get('/stats', getTempleStats);

// ----- Temple Info -----
router.get('/temple', getMyTemple);
router.put('/temple', updateMyTemple);

// ----- Slot Management -----
router.get('/slots', getTempleSlots);
router.post('/slots', createSlot);
router.put('/slots/:id', updateSlot);
router.delete('/slots/:id', deleteSlot);

// ----- Bookings -----
router.get('/bookings', getTempleBookings);

export default router;
