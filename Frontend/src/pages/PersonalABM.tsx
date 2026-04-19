import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { getPersonal, createPersonal } from '../services/api';
import type { Personal } from '../types';

const TELEFONO_REGEX = /^\+549\d{10}$/;

export default function PersonalABM() {
    const qc = useQueryClient();
    const { data: personal = [], isLoading } = useQuery({ queryKey: ['personal'], queryFn: getPersonal });

    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [formError, setFormError] = useState('');

    const createMutation = useMutation({
        mutationFn: createPersonal,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['personal'] });
            setNombre('');
            setTelefono('');
            setFormError('');
        },
        onError: (err: any) => {
            setFormError(err?.response?.data?.error ?? 'Error al crear la persona');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (!nombre.trim()) return setFormError('El nombre es obligatorio');
        if (!TELEFONO_REGEX.test(telefono)) return setFormError('El teléfono debe tener formato +549XXXXXXXXXX');

        createMutation.mutate({ nombre: nombre.trim(), telefono });
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-text-primary mb-6">Personal</h1>

            {/* Tabla */}
            <div className="bg-white rounded-xl shadow-card overflow-hidden mb-6">
                {isLoading ? (
                    <div className="p-8 text-center text-text-secondary">Cargando...</div>
                ) : personal.length === 0 ? (
                    <div className="p-8 text-center text-text-secondary">No hay personal registrado aún.</div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border-light">
                                <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wide px-4 py-3">Nombre</th>
                                <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wide px-4 py-3">Teléfono</th>
                            </tr>
                        </thead>
                        <tbody>
                            {personal.map((p: Personal) => (
                                <tr key={p.id} className="border-b border-border-light last:border-0">
                                    <td className="px-4 py-3 text-sm font-medium text-text-primary">{p.nombre}</td>
                                    <td className="px-4 py-3 text-sm text-text-secondary font-mono">{p.telefono}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Formulario agregar */}
            <div className="bg-white rounded-xl shadow-card p-5">
                <h2 className="text-sm font-semibold text-text-primary mb-4">Agregar persona</h2>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Nombre completo"
                        className="flex-1 px-3 py-2 text-sm border border-border-DEFAULT rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                        type="text"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="+549XXXXXXXXXX"
                        className="flex-1 px-3 py-2 text-sm border border-border-DEFAULT rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                    />
                    <button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                        <Plus size={14} />
                        Agregar
                    </button>
                </form>
                {formError && <p className="text-sm text-red-600 mt-2">{formError}</p>}
            </div>
        </div>
    );
}
