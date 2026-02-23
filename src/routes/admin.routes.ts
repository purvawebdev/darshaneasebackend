import { Router } from 'express';
import { protect, requireRole } from '../middlewares/auth.middleware';
import {
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    createTemple,
    updateTemple,
    deleteTemple,
    toggleTempleStatus,
    getDashboardStats,
    getAllBookings,
} from '../controllers/admin.controller';

const router = Router();

// All routes require: JWT + superadmin role
router.use(protect, requireRole('superadmin'));

// ----- Dashboard -----
router.get('/stats', getDashboardStats);

// ----- User Management -----
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// ----- Temple Management -----
router.post('/temples', createTemple);
router.put('/temples/:id', updateTemple);
router.delete('/temples/:id', deleteTemple);
router.patch('/temples/:id/toggle', toggleTempleStatus);

// ----- Bookings -----
router.get('/bookings', getAllBookings);

export default router;
