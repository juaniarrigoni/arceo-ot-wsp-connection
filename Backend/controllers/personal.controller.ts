import { Request, Response } from 'express';
import * as personalService from '../services/personal.service';
import { createPersonalSchema } from '../validators/tarea.validator';
import { ConflictError, ValidationError } from '../lib/errors';

export const getAll = async (_req: Request, res: Response) => {
    try {
        const personal = await personalService.findAll();
        res.json({ success: true, data: personal });
    } catch (error) {
        console.error('[PersonalController] Error al obtener personal:', error);
        res.status(500).json({ success: false, error: 'Error al obtener el personal' });
    }
};

export const getById = async (req: Request, res: Response) => {
    try {
        const persona = await personalService.findById(req.params.id);
        if (!persona) {
            return res.status(404).json({ success: false, error: 'Persona no encontrada' });
        }
        return res.json({ success: true, data: persona });
    } catch (error) {
        console.error('[PersonalController] Error al obtener persona:', error);
        return res.status(500).json({ success: false, error: 'Error al obtener la persona' });
    }
};

export const create = async (req: Request, res: Response) => {
    const parseResult = createPersonalSchema.safeParse(req.body);
    if (!parseResult.success) {
        const firstIssue = parseResult.error.issues[0];
        return res.status(400).json({ success: false, error: firstIssue?.message || 'Datos inválidos' });
    }

    try {
        const persona = await personalService.create(parseResult.data.nombre, parseResult.data.telefono);
        return res.status(201).json({ success: true, data: persona });
    } catch (error) {
        if (error instanceof ConflictError || error instanceof ValidationError) {
            return res.status(error instanceof ConflictError ? 409 : 400).json({ success: false, error: error.message });
        }
        console.error('[PersonalController] Error al crear persona:', error);
        return res.status(500).json({ success: false, error: 'Error al crear la persona' });
    }
};
