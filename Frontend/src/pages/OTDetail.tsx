import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useOT, useEnviarTodasTareas } from '../hooks/useOT';
import TareaItem from '../components/TareaItem';
import type { EnvioTotalResult } from '../services/api';

export default function OTDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: ot, isLoading, isError } = useOT(id!);
    const enviarTodas = useEnviarTodasTareas(id!);
    const [envioResult, setEnvioResult] = useState<EnvioTotalResult | null>(null);

    if (isLoading) return <div className="p-8 text-center text-text-secondary">Cargando...</div>;
    if (isError || !ot) return <div className="p-8 text-center text-red-600">OT no encontrada</div>;

    const personal = ot.personal.map((p) => p.personal);
    const tareasEnviadas = ot.tareas.filter((t) => t.enviada).length;
    const tareasPendientes = ot.tareas.filter((t) => !t.enviada).length;
    const todasEnviadas = tareasPendientes === 0 && ot.tareas.length > 0;

    const handleEnviarTodas = async () => {
        const result = await enviarTodas.mutateAsync();
        setEnvioResult(result);
    };

    const totalEnviados = envioResult?.resultados.reduce((s, r) => s + r.enviados, 0) ?? 0;
    const totalErrores = envioResult?.resultados.flatMap((r) => r.errores) ?? [];

    return (
        <div className="max-w-2xl mx-auto">
            <button
                onClick={() => navigate('/ot')}
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors"
            >
                <ArrowLeft size={16} />
                Volver a OTs
            </button>

            {/* Header */}
            <div className="bg-white rounded-xl shadow-card p-5 mb-4">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-mono text-text-secondary mb-1">{ot.id}</p>
                        <h1 className="text-xl font-bold text-text-primary">
                            {format(new Date(ot.fecha), "dd 'de' MMMM yyyy", { locale: es })}
                        </h1>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        ot.estado === 'activa' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                        {ot.estado}
                    </span>
                </div>

                {/* Recursos */}
                {ot.recursos.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {ot.recursos.map((r) => (
                            <span key={r} className="text-xs px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full font-medium">
                                {r}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Personal */}
            <div className="bg-white rounded-xl shadow-card p-5 mb-4">
                <h2 className="text-sm font-semibold text-text-primary mb-3">
                    Personal asignado ({personal.length})
                </h2>
                <div className="space-y-2">
                    {personal.map((p) => (
                        <div key={p.id} className="flex items-center justify-between text-sm">
                            <span className="font-medium text-text-primary">{p.nombre}</span>
                            <span className="text-text-secondary">{p.telefono}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tareas */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-text-primary">
                        Tareas ({tareasEnviadas}/{ot.tareas.length} enviadas)
                    </h2>

                    {ot.tareas.length > 0 && (
                        <button
                            onClick={handleEnviarTodas}
                            disabled={enviarTodas.isPending}
                            className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                                todasEnviadas
                                    ? 'bg-surface-tertiary text-text-secondary hover:bg-gray-200'
                                    : 'bg-primary-600 text-white hover:bg-primary-700'
                            }`}
                        >
                            {enviarTodas.isPending ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Send size={14} />
                                    {todasEnviadas ? 'Reenviar todas' : `Enviar todas (${tareasPendientes})`}
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Resultado del envío masivo */}
                {envioResult && (
                    <div className="mb-4 p-4 bg-white rounded-xl shadow-card border border-border-light">
                        <p className="text-sm font-semibold text-text-primary mb-2">Resultado del envío</p>
                        <div className="space-y-1">
                            <p className="text-xs text-green-700 flex items-center gap-1">
                                <CheckCircle size={12} />
                                {envioResult.totalTareas} tarea{envioResult.totalTareas !== 1 ? 's' : ''} procesada{envioResult.totalTareas !== 1 ? 's' : ''} · {totalEnviados} notificacion{totalEnviados !== 1 ? 'es' : ''} enviada{totalEnviados !== 1 ? 's' : ''}
                            </p>
                            <p className="text-xs text-text-secondary">
                                (Las tareas públicas notifican a todo el personal asignado)
                            </p>
                            {totalErrores.length > 0 && (
                                <p className="text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle size={12} />
                                    Errores en: {totalErrores.join(', ')}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <TareaItem otId={ot.id} tareas={ot.tareas} personal={personal} />
            </div>
        </div>
    );
}
