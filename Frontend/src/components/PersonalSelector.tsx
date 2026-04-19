import type { Personal } from '../types';

interface Props {
    personal: Personal[];
    selected: string[];
    onChange: (telefonos: string[]) => void;
}

export default function PersonalSelector({ personal, selected, onChange }: Props) {
    const toggle = (telefono: string) => {
        if (selected.includes(telefono)) {
            onChange(selected.filter((t) => t !== telefono));
        } else {
            onChange([...selected, telefono]);
        }
    };

    if (personal.length === 0) {
        return <p className="text-sm text-text-secondary">No hay personal asignado a esta OT.</p>;
    }

    return (
        <div className="space-y-2">
            {personal.map((p) => (
                <label
                    key={p.id}
                    className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-surface-tertiary transition-colors"
                >
                    <input
                        type="checkbox"
                        checked={selected.includes(p.telefono)}
                        onChange={() => toggle(p.telefono)}
                        className="w-4 h-4 text-primary-600 rounded border-border-DEFAULT focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-text-primary">{p.nombre}</span>
                    <span className="text-xs text-text-secondary">{p.telefono}</span>
                </label>
            ))}
        </div>
    );
}
