import { Router } from 'express';
import * as personalController from '../controllers/personal.controller';

const router = Router();

// GET /api/personal
router.get('/', personalController.getAll);

// GET /api/personal/:id
router.get('/:id', personalController.getById);

// POST /api/personal
router.post('/', personalController.create);

export default router;
