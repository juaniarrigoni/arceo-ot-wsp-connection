import { Request, Response, NextFunction } from 'express';
import { ValidationError, NotFoundError, ConflictError } from '../lib/errors';

/**
 * Centralized error handler middleware.
 * Maps custom error classes to appropriate HTTP status codes.
 * Must be registered LAST in Express middleware chain.
 */
export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // Custom business errors
    if (err instanceof ValidationError) {
        res.status(400).json({ success: false, error: err.message });
        return;
    }

    if (err instanceof NotFoundError) {
        res.status(404).json({ success: false, error: err.message });
        return;
    }

    if (err instanceof ConflictError) {
        res.status(409).json({ success: false, error: err.message });
        return;
    }

    // Prisma unique constraint violations
    if ((err as any).code === 'P2002') {
        res.status(409).json({ success: false, error: 'Ya existe un registro con esos datos' });
        return;
    }

    // Prisma record not found
    if ((err as any).code === 'P2025') {
        res.status(404).json({ success: false, error: 'Registro no encontrado' });
        return;
    }

    // Default: Internal server error
    console.error('[ErrorHandler] Unhandled error:', err);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
};
