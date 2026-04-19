import { z } from 'zod';

export const createOTSchema = z.object({
    fecha: z.string().min(1, 'La fecha es obligatoria'),
    recursos: z.array(z.string().min(1)).min(1, 'Se requiere al menos un recurso'),
    personalIds: z.array(z.string().min(1)).min(1, 'Se requiere al menos un integrante de personal'),
});

export const createTareaSchema = z.object({
    descripcion: z.string().min(1, 'La descripción es obligatoria'),
    observacion: z.string().min(1, 'La observación es obligatoria'),
    visibilidad: z.enum(['publica', 'privada'], {
        error: 'La visibilidad debe ser "publica" o "privada"',
    }),
    destinatarios: z.array(z.string()).default([]),
});

export type CreateOTDto = z.infer<typeof createOTSchema>;
export type CreateTareaDto = z.infer<typeof createTareaSchema>;
