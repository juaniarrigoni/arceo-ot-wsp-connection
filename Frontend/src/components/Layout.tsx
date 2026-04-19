import { Outlet, NavLink } from 'react-router-dom';
import { ClipboardList, Users } from 'lucide-react';

const navItems = [
    { to: '/ot', label: 'Órdenes de Trabajo', icon: ClipboardList },
    { to: '/personal', label: 'Personal', icon: Users },
];

export default function Layout() {
    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-56 bg-white border-r border-border-light flex flex-col">
                <div className="p-4 border-b border-border-light">
                    <h1 className="text-base font-bold text-primary-700">OT-WSP</h1>
                    <p className="text-xs text-text-secondary">Órdenes de Trabajo</p>
                </div>
                <nav className="p-3 flex-1">
                    {navItems.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 ${
                                    isActive
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-tertiary'
                                }`
                            }
                        >
                            <Icon size={16} />
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main */}
            <main className="flex-1 p-6 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
