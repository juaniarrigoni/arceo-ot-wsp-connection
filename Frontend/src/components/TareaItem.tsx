import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle, Send, AlertCircle, Plus } from 'lucide-react';
import { useAddTarea, useEnviarTarea } from '../hooks/useOT';
import PersonalSelector from './PersonalSelector';
import type { Tarea, Personal, CreateTareaDto } from '../types';

interface Props {
    otId: string;
    tareas: Tarea[];
    personal: Personal[];
}

type FormData = Omit<CreateTareaDto, 'destinatarios'>;

export default function TareaItem({ otId, tareas, personal }: Props) {
    const [visibilidad, setVisibilidad] = useState<'publica' | 'privada'>('publica');
    const [destinatarios, setDestinatarios] = useState<string[]>([]);
    const [envioResults, setEnvioResults] = useState<Record<string, { enviados: number; errores: string[] }>>({});
    const [enviandoIds, setEnviandoIds] = useState<Set<string>>(new Set());

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
    const addTarea = useAddTarea(otId);
    const enviarTarea = useEnviarTarea(otId);

    const onSubmit = async (data: FormData) => {
        await addTarea.mutateAsync({
            ...data,
            visibilidad,
            destinatarios: visibilidad === 'privada' ? destinatarios : [],
        });
        reset();
        setDestinatarios([]);
    };

    const handleEnviar = async (tareaId: string) => {
        setEnviandoIds((prev) => new Set(prev).add(tareaId));
        try {
            const result = await enviarTarea.mutateAsync(tareaId);
            setEnvioResults((prev) => ({ ...prev, [tareaId]: result }));
        } finally {
            setEnviandoIds((prev) => { const s = new Set(prev); s.delete(tareaId); return s; });
        }
    };

    return (
        <div className="space-y-4">
            {/* Lista de tareas existentes */}
            {tareas.map((tarea) => (
                <div key={tarea.id} className="bg-white rounded-xl shadow-card p-4 border border-border-light">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                    tarea.visibilidad === 'publica'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {tarea.visibilidad === 'publica' ? 'Pública' : 'Privada'}
                                </span>
                                {tarea.enviada && (
                                    <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                                        <CheckCircle size={12} />
                                        Enviada
                                    </span>
                                )}
                            </div>
                            <p className="text-sm font-semibold text-text-primary">{tarea.descripcion}</p>
                            <p className="text-xs text-text-secondary mt-1">{tarea.observacion}</p>
                        </div>
                        <button
                                onClick={() => handleEnviar(tarea.id)}
                                disabled={enviandoIds.has(tarea.id)}
                                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                                    tarea.enviada
                                        ? 'bg-surface-tertiary text-text-secondary hover:bg-gray-200'
                                        : 'bg-primary-600 text-white hover:bg-primary-700'
                                }`}
                            >
                                {enviandoIds.has(tarea.id) ? (
                                    <>
                                        <svg className="animate-spin" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Send size={14} />
                                        {tarea.enviada ? 'Reenviar' : 'Enviar'}
                                    </>
                                )}
                            </button>
                    </div>

                    {/* Resultado de envío */}
                    {envioResults[tarea.id] && (
                        <div className="mt-3 pt-3 border-t border-border-light">
                            <p className="text-xs text-green-700">
                                ✓ {envioResults[tarea.id].enviados} enviados correctamente
                            </p>
                            {envioResults[tarea.id].errores.length > 0 && (
                                <div className="mt-1">
                                    <p className="text-xs text-red-600 flex items-center gap-1">
                                        <AlertCircle size={12} />
                                        Errores en: {envioResults[tarea.id].errores.join(', ')}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}

            {/* Formulario nueva tarea */}
            <div className="bg-white rounded-xl shadow-card p-4 border border-border-light">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Nueva tarea</h3>

                {/* Tabs visibilidad */}
                <div className="flex gap-1 p-1 bg-surface-tertiary rounded-lg mb-4 w-fit">
                    {(['publica', 'privada'] as const).map((v) => (
                        <button
                            key={v}
                            type="button"
                            onClick={() => setVisibilidad(v)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                visibilidad === v
                                    ? 'bg-white text-primary-700 shadow-sm'
                                    : 'text-text-secondary hover:text-text-primary'
                            }`}
                        >
                            {v === 'publica' ? 'Pública' : 'Privada'}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div>
                        <input
                            {...register('descripcion', { required: 'La descripción es obligatoria' })}
                            placeholder="Descripción de la tarea"
                            className="w-full px-3 py-2 text-sm border border-border-DEFAULT rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {errors.descripcion && (
                            <p className="text-xs text-red-600 mt-1">{errors.descripcion.message}</p>
                        )}
                    </div>

                    <div>
                        <textarea
                            {...register('observacion', { required: 'La observación es obligatoria' })}
                            placeholder="Observación"
                            rows={2}
                            className="w-full px-3 py-2 text-sm border border-border-DEFAULT rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        />
                        {errors.observacion && (
                            <p className="text-xs text-red-600 mt-1">{errors.observacion.message}</p>
                        )}
                    </div>

                    {visibilidad === 'privada' && (
                        <div>
                            <p className="text-xs font-medium text-text-secondary mb-2">Destinatarios</p>
                            <PersonalSelector
                                personal={personal}
                                selected={destinatarios}
                                onChange={setDestinatarios}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={addTarea.isPending}
                        className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                        <Plus size={14} />
                        Agregar Tarea
                    </button>
                </form>
            </div>
        </div>
    );
}
