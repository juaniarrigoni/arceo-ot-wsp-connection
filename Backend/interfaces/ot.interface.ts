export interface CreateOTInput {
    fecha: string;
    recursos: string[];
    personalIds: string[];
}

export interface CreateTareaInput {
    descripcion: string;
    observacion: string;
    visibilidad: 'publica' | 'privada';
    destinatarios: string[];
}
