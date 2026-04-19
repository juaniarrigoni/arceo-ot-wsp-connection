import { z } from 'zod';

const TELEFONO_REGEX = /^\+549\d{10}$/;

export const createPersonalSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio').max(100),
    telefono: z
        .string()
        .regex(TELEFONO_REGEX, 'El teléfono debe tener formato +549XXXXXXXXXX'),
});

export type CreatePersonalDto = z.infer<typeof createPersonalSchema>;
