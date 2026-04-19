import prisma from '../lib/prisma';
import { NotFoundError } from '../lib/errors';
import { CreateOTDto, CreateTareaDto } from '../validators/ot.validator';

export const findAll = async () => {
    return prisma.oT.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: {
                    personal: true,
                    tareas: true,
                },
            },
        },
    });
};

export const findById = async (id: string) => {
    const ot = await prisma.oT.findUnique({
        where: { id },
        include: {
            personal: {
                include: {
                    personal: true,
                },
            },
            tareas: {
                orderBy: { createdAt: 'asc' },
            },
        },
    });

    if (!ot) {
        throw new NotFoundError(`OT con id ${id} no encontrada`);
    }

    return ot;
};

export const create = async (data: CreateOTDto) => {
    const { fecha, recursos, personalIds } = data;

    return prisma.oT.create({
        data: {
            fecha: new Date(fecha),
            recursos,
            personal: {
                create: personalIds.map((personalId) => ({ personalId })),
            },
        },
        include: {
            personal: {
                include: { personal: true },
            },
        },
    });
};

export const addTarea = async (otId: string, data: CreateTareaDto) => {
    // Verificar que la OT existe
    const ot = await prisma.oT.findUnique({ where: { id: otId } });
    if (!ot) {
        throw new NotFoundError(`OT con id ${otId} no encontrada`);
    }

    return prisma.tarea.create({
        data: {
            otId,
            descripcion: data.descripcion,
            observacion: data.observacion,
            visibilidad: data.visibilidad,
            destinatarios: data.destinatarios,
        },
    });
};
