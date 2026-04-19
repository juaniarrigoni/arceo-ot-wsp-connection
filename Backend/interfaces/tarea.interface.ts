export interface ChatwootTemplateParams {
    nombre: string;
    otId: string;
    descripcion: string;
    observacion: string;
}

export interface EnvioResult {
    enviados: number;
    errores: string[];
}
