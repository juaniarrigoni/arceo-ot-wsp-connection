import axios from 'axios';
import type {
    OT,
    Personal,
    Tarea,
    CreateOTDto,
    CreateTareaDto,
    CreatePersonalDto,
    EnvioResult,
    ApiResponse,
} from '../types';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    headers: { 'Content-Type': 'application/json' },
});

// ---- Personal ----

export const getPersonal = async (): Promise<Personal[]> => {
    const res = await api.get<ApiResponse<Personal[]>>('/personal');
    return res.data.data;
};

export const createPersonal = async (data: CreatePersonalDto): Promise<Personal> => {
    const res = await api.post<ApiResponse<Personal>>('/personal', data);
    return res.data.data;
};

// ---- OT ----

export const getOTs = async (): Promise<OT[]> => {
    const res = await api.get<ApiResponse<OT[]>>('/ot');
    return res.data.data;
};

export const getOT = async (id: string): Promise<OT> => {
    const res = await api.get<ApiResponse<OT>>(`/ot/${id}`);
    return res.data.data;
};

export const createOT = async (data: CreateOTDto): Promise<OT> => {
    const res = await api.post<ApiResponse<OT>>('/ot', data);
    return res.data.data;
};

// ---- Tareas ----

export const addTarea = async (otId: string, data: CreateTareaDto): Promise<Tarea> => {
    const res = await api.post<ApiResponse<Tarea>>(`/ot/${otId}/tareas`, data);
    return res.data.data;
};

export const enviarTarea = async (otId: string, tareaId: string): Promise<EnvioResult> => {
    const res = await api.post<ApiResponse<EnvioResult>>(`/ot/${otId}/tareas/${tareaId}/enviar`);
    return res.data.data;
};

export interface EnvioTotalResult {
    totalTareas: number;
    resultados: Array<{ tareaId: string; enviados: number; errores: string[] }>;
}

export const enviarTodasTareas = async (otId: string): Promise<EnvioTotalResult> => {
    const res = await api.post<ApiResponse<EnvioTotalResult>>(`/ot/${otId}/enviar-todas`);
    return res.data.data;
};
