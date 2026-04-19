import { useState, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getPersonal } from '../services/api';
import { useCreateOT } from '../hooks/useOT';
import type { Personal } from '../types';

export default function OTForm() {
    const navigate = useNavigate();
    const { data: personal = [] } = useQuery({ queryKey: ['personal'], queryFn: getPersonal });
    const createOT = useCreateOT();

    const [fecha, setFecha] = useState('');
    const [recursoInput, setRecursoInput] = useState('');
    const [recursos, setRecursos] = useState<string[]>([]);
    const [personalIds, setPersonalIds] = useState<string[]>([]);
    const [error, setError] = useState('');

    const addRecurso = () => {
        const trimmed = recursoInput.trim();
        if (trimmed && !recursos.includes(trimmed)) {
            setRecursos([...recursos, trimmed]);
            setRecursoInput('');
        }
    };

    const handleRecursoKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addRecurso();
        }
    };

    const removeRecurso = (r: string) => setRecursos(recursos.filter((x) => x !== r));

    const togglePersonal = (id: string) => {
        setPersonalIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!fecha) return setError('La fecha es obligatoria');
        if (recursos.length === 0) return setError('Agregá al menos un recurso');
        if (personalIds.length === 0) return setError('Seleccioná al menos un integrante de personal');

        try {
            const ot = await createOT.mutateAsync({ fecha, recursos, personalIds });
            navigate(`/ot/${ot.id}`);
        } catch {
            setError('Error al crear la OT. Intentá nuevamente.');
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold text-text-primary mb-6">Nueva Orden de Trabajo</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card p-6 space-y-5">
                {/* Fecha */}
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Fecha</label>
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-border-DEFAULT rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>

                {/* Recursos */}
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Recursos</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={recursoInput}
                            onChange={(e) => setRecursoInput(e.target.value)}
                            onKeyDown={handleRecursoKeyDown}
                            placeholder="Escribí un recurso y presioná Enter"
                            className="flex-1 px-3 py-2 text-sm border border-border-DEFAULT rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <button
                            type="button"
                            onClick={addRecurso}
                            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    {recursos.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {recursos.map((r) => (
                                <span
                                    key={r}
                                    className="flex items-center gap-1 text-xs font-medium px-2 py-1 bg-primary-100 text-primary-700 rounded-full"
                                >
                                    {r}
                                    <button type="button" onClick={() => removeRecurso(r)}>
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Personal */}
                <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Personal</label>
                    {personal.length === 0 ? (
                        <p className="text-sm text-text-secondary">
                            No hay personal registrado.{' '}
                            <a href="/personal" className="text-primary-600 underline">Agregar personal</a>
                        </p>
                    ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {personal.map((p: Personal) => (
                                <label
                                    key={p.id}
                                    className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-surface-tertiary"
                                >
                                    <input
                                        type="checkbox"
                                        checked={personalIds.includes(p.id)}
                                        onChange={() => togglePersonal(p.id)}
                                        className="w-4 h-4 text-primary-600 rounded border-border-DEFAULT"
                                    />
                                    <span className="text-sm font-medium">{p.nombre}</span>
                                    <span className="text-xs text-text-secondary">{p.telefono}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => navigate('/ot')}
                        className="flex-1 px-4 py-2 text-sm font-medium border border-border-DEFAULT rounded-lg hover:bg-surface-tertiary transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={createOT.isPending}
                        className="flex-1 px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                        {createOT.isPending ? 'Creando...' : 'Crear OT'}
                    </button>
                </div>
            </form>
        </div>
    );
}
