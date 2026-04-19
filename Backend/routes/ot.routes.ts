import { Router } from 'express';
import * as otController from '../controllers/ot.controller';
import * as tareaController from '../controllers/tarea.controller';

const router = Router();

// GET /api/ot
router.get('/', otController.getAll);

// POST /api/ot
router.post('/', otController.create);

// GET /api/ot/:id
router.get('/:id', otController.getById);

// POST /api/ot/:id/tareas
router.post('/:id/tareas', otController.addTarea);

// POST /api/ot/:id/enviar-todas  ← nuevo: envía todas las tareas pendientes
router.post('/:id/enviar-todas', tareaController.enviarTodas);

// POST /api/ot/:id/tareas/:tid/enviar
router.post('/:id/tareas/:tid/enviar', tareaController.enviar);

export default router;

