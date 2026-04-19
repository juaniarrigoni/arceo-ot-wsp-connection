import prisma from '../lib/prisma';
import { ConflictError, ValidationError } from '../lib/errors';

const TELEFONO_REGEX = /^\+549\d{10}$/;

export const findAll = async () => {
    return prisma.personal.findMany({
        orderBy: { nombre: 'asc' },
    });
};

export const findById = async (id: string) => {
    return prisma.personal.findUnique({
        where: { id },
    });
};

export const create = async (nombre: string, telefono: string) => {
    if (!TELEFONO_REGEX.test(telefono)) {
        throw new ValidationError('El teléfono debe tener formato +549XXXXXXXXXX');
    }

    try {
        return await prisma.personal.create({
            data: { nombre, telefono },
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            throw new ConflictError('Ya existe una persona con ese teléfono');
        }
        throw error;
    }
};
