import { Request, Response } from 'express';
import * as tareaService from '../services/tarea.service';
import { NotFoundError } from '../lib/errors';

export const enviarTodas = async (req: Request, res: Response) => {
    const { id: otId } = req.params;
    try {
        const resultado = await tareaService.enviarTodasTareas(otId);
        return res.json({ success: true, data: resultado });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ success: false, error: error.message });
        }
        console.error('[TareaController] Error al enviar todas las tareas:', error);
        return res.status(500).json({ success: false, error: 'Error al enviar las tareas' });
    }
};

export const enviar = async (req: Request, res: Response) => {
    const { id: otId, tid: tareaId } = req.params;

    try {
        const resultado = await tareaService.enviarTarea(otId, tareaId);
        return res.json({ success: true, data: resultado });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ success: false, error: error.message });
        }
        console.error('[TareaController] Error al enviar tarea:', error);
        return res.status(500).json({ success: false, error: 'Error al enviar la tarea' });
    }
};
