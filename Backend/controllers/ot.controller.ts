import { Request, Response } from 'express';
import * as otService from '../services/ot.service';
import { createOTSchema, createTareaSchema } from '../validators/ot.validator';
import { NotFoundError } from '../lib/errors';

export const getAll = async (_req: Request, res: Response) => {
    try {
        const ots = await otService.findAll();
        res.json({ success: true, data: ots });
    } catch (error) {
        console.error('[OTController] Error al obtener OTs:', error);
        res.status(500).json({ success: false, error: 'Error al obtener las OTs' });
    }
};

export const getById = async (req: Request, res: Response) => {
    try {
        const ot = await otService.findById(req.params.id);
        return res.json({ success: true, data: ot });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ success: false, error: error.message });
        }
        console.error('[OTController] Error al obtener OT:', error);
        return res.status(500).json({ success: false, error: 'Error al obtener la OT' });
    }
};

export const create = async (req: Request, res: Response) => {
    const parseResult = createOTSchema.safeParse(req.body);
    if (!parseResult.success) {
        const firstIssue = parseResult.error.issues[0];
        return res.status(400).json({ success: false, error: firstIssue?.message || 'Datos inválidos' });
    }

    try {
        const ot = await otService.create(parseResult.data);
        return res.status(201).json({ success: true, data: ot });
    } catch (error) {
        console.error('[OTController] Error al crear OT:', error);
        return res.status(500).json({ success: false, error: 'Error al crear la OT' });
    }
};

export const addTarea = async (req: Request, res: Response) => {
    const parseResult = createTareaSchema.safeParse(req.body);
    if (!parseResult.success) {
        const firstIssue = parseResult.error.issues[0];
        return res.status(400).json({ success: false, error: firstIssue?.message || 'Datos inválidos' });
    }

    try {
        const tarea = await otService.addTarea(req.params.id, parseResult.data);
        return res.status(201).json({ success: true, data: tarea });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ success: false, error: error.message });
        }
        console.error('[OTController] Error al agregar tarea:', error);
        return res.status(500).json({ success: false, error: 'Error al agregar la tarea' });
    }
};
