export interface Personal {
    id: string;
    nombre: string;
    telefono: string;
}

export interface Tarea {
    id: string;
    otId: string;
    descripcion: string;
    observacion: string;
    visibilidad: 'publica' | 'privada';
    destinatarios: string[];
    enviada: boolean;
    createdAt: string;
}

export interface OTPersonal {
    otId: string;
    personalId: string;
    personal: Personal;
}

export interface OT {
    id: string;
    fecha: string;
    recursos: string[];
    estado: string;
    createdAt: string;
    personal: OTPersonal[];
    tareas: Tarea[];
    _count?: {
        personal: number;
        tareas: number;
    };
}

export interface CreateOTDto {
    fecha: string;
    recursos: string[];
    personalIds: string[];
}

export interface CreateTareaDto {
    descripcion: string;
    observacion: string;
    visibilidad: 'publica' | 'privada';
    destinatarios: string[];
}

export interface CreatePersonalDto {
    nombre: string;
    telefono: string;
}

export interface EnvioResult {
    enviados: number;
    errores: string[];
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
}
