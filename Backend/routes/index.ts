import { Router } from 'express';
import personalRoutes from './personal.routes';
import otRoutes from './ot.routes';

export const router = Router();

router.use('/personal', personalRoutes);
router.use('/ot', otRoutes);
