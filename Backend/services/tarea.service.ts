import prisma from '../lib/prisma';
import { NotFoundError } from '../lib/errors';
import { enviarTemplateWhatsapp } from './meta.service';
import { EnvioResult } from '../interfaces/tarea.interface';

export interface EnvioTotalResult {
    totalTareas: number;
    resultados: Array<{ tareaId: string; enviados: number; errores: string[] }>;
}

export const enviarTodasTareas = async (otId: string): Promise<EnvioTotalResult> => {
    const ot = await prisma.oT.findUnique({
        where: { id: otId },
        include: {
            personal: { include: { personal: true } },
            tareas: { orderBy: { createdAt: 'asc' } },
        },
    });

    if (!ot) throw new NotFoundError(`OT con id ${otId} no encontrada`);

    const todoElPersonal = ot.personal.map((p) => p.personal);
    const resultados: EnvioTotalResult['resultados'] = [];

    for (const tarea of ot.tareas) {
        const destinatarios =
            tarea.visibilidad === 'publica'
                ? todoElPersonal
                : todoElPersonal.filter((p) => tarea.destinatarios.includes(p.telefono));

        const errores: string[] = [];
        let enviados = 0;

        for (const persona of destinatarios) {
            const ok = await enviarTemplateWhatsapp(persona.telefono, {
                nombre: persona.nombre,
                otId,
                descripcion: tarea.descripcion,
                observacion: tarea.observacion,
            });
            if (ok) { enviados++; } else { errores.push(persona.telefono); }
        }

        if (errores.length === 0 && enviados > 0) {
            await prisma.tarea.update({ where: { id: tarea.id }, data: { enviada: true } });
        }

        resultados.push({ tareaId: tarea.id, enviados, errores });
    }

    return { totalTareas: ot.tareas.length, resultados };
};

export const enviarTarea = async (otId: string, tareaId: string): Promise<EnvioResult> => {
    // 1. Obtener tarea con OT y personal
    const tarea = await prisma.tarea.findUnique({
        where: { id: tareaId },
        include: {
            ot: {
                include: {
                    personal: {
                        include: { personal: true },
                    },
                },
            },
        },
    });

    if (!tarea) {
        throw new NotFoundError(`Tarea con id ${tareaId} no encontrada`);
    }

    if (tarea.otId !== otId) {
        throw new NotFoundError(`Tarea ${tareaId} no pertenece a la OT ${otId}`);
    }

    // 2. Determinar destinatarios según visibilidad
    const todoElPersonal = tarea.ot.personal.map((p) => p.personal);
    const destinatarios =
        tarea.visibilidad === 'publica'
            ? todoElPersonal
            : todoElPersonal.filter((p) => tarea.destinatarios.includes(p.telefono));

    // 3. Enviar a cada destinatario — nunca cortar el loop si uno falla
    const errores: string[] = [];
    let enviados = 0;

    for (const persona of destinatarios) {
        const ok = await enviarTemplateWhatsapp(persona.telefono, {
            nombre: persona.nombre,
            otId,
            descripcion: tarea.descripcion,
            observacion: tarea.observacion,
        });

        if (ok) {
            enviados++;
        } else {
            errores.push(persona.telefono);
        }
    }

    // 4. Marcar como enviada solo si todos los envíos fueron exitosos
    if (errores.length === 0 && enviados > 0) {
        await prisma.tarea.update({
            where: { id: tareaId },
            data: { enviada: true },
        });
    }

    return { enviados, errores };
};
