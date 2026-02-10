import express from 'express';
import { getAllTemples, getTempleById } from '../controllers/temple.controller';

const router = express.Router();

router.get('/', getAllTemples);
router.get('/:id', getTempleById);

export default router;
