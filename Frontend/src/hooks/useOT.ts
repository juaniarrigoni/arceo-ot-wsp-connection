import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOTs, getOT, createOT, addTarea, enviarTarea, enviarTodasTareas } from '../services/api';
import type { CreateOTDto, CreateTareaDto } from '../types';

export const useOTs = () =>
    useQuery({
        queryKey: ['ots'],
        queryFn: getOTs,
    });

export const useOT = (id: string) =>
    useQuery({
        queryKey: ['ot', id],
        queryFn: () => getOT(id),
        enabled: !!id,
    });

export const useCreateOT = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateOTDto) => createOT(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['ots'] }),
    });
};

export const useAddTarea = (otId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateTareaDto) => addTarea(otId, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['ot', otId] }),
    });
};

export const useEnviarTarea = (otId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (tareaId: string) => enviarTarea(otId, tareaId),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['ot', otId] }),
    });
};

export const useEnviarTodasTareas = (otId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () => enviarTodasTareas(otId),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['ot', otId] }),
    });
};
