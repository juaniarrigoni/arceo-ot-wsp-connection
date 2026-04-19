import { useNavigate } from 'react-router-dom';
import { Plus, Eye } from 'lucide-react';
import { useOTs } from '../hooks/useOT';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function OTList() {
    const navigate = useNavigate();
    const { data: ots = [], isLoading, isError } = useOTs();

    if (isLoading) return <div className="p-8 text-center text-text-secondary">Cargando...</div>;
    if (isError) return <div className="p-8 text-center text-red-600">Error al cargar las OTs</div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-text-primary">Órdenes de Trabajo</h1>
                <button
                    onClick={() => navigate('/ot/nueva')}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <Plus size={16} />
                    Nueva OT
                </button>
            </div>

            {ots.length === 0 ? (
                <div className="bg-white rounded-xl shadow-card p-12 text-center">
                    <p className="text-text-secondary mb-4">No hay órdenes de trabajo todavía.</p>
                    <button
                        onClick={() => navigate('/ot/nueva')}
                        className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700"
                    >
                        Crear primera OT
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-card overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border-light">
                                <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wide px-4 py-3">ID</th>
                                <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wide px-4 py-3">Fecha</th>
                                <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wide px-4 py-3">Personal</th>
                                <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wide px-4 py-3">Tareas</th>
                                <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wide px-4 py-3">Estado</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {ots.map((ot) => (
                                <tr key={ot.id} className="border-b border-border-light last:border-0 hover:bg-surface-secondary transition-colors">
                                    <td className="px-4 py-3 text-xs text-text-secondary font-mono">{ot.id.slice(0, 8)}…</td>
                                    <td className="px-4 py-3 text-sm text-text-primary">
                                        {format(new Date(ot.fecha), 'dd MMM yyyy', { locale: es })}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-text-primary">{ot._count?.personal ?? 0}</td>
                                    <td className="px-4 py-3 text-sm text-text-primary">{ot._count?.tareas ?? 0}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                            ot.estado === 'activa'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {ot.estado}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => navigate(`/ot/${ot.id}`)}
                                            className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-800"
                                        >
                                            <Eye size={14} />
                                            Ver
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
