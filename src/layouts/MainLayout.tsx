import React, { useEffect } from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { Icon } from '../components/Icon';
import { cn } from '../utils/cn';

interface MainLayoutProps {
    children?: React.ReactNode;
    hideHeader?: boolean;
    hideSidebar?: boolean;
    activeTab?: 'tables' | 'inventory' | 'sales' | 'auth';
    onTabChange?: (tab: 'tables' | 'inventory' | 'sales' | 'auth') => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    hideHeader = false,
    hideSidebar = false,
    activeTab = 'tables',
    onTabChange
}) => {
    const { theme, toggleTheme } = useThemeStore();
    const { user, logout } = useAuthStore();

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-[#12110a] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">

            {/* Sidebar */}
            {!hideSidebar && (
                <aside className="w-64 flex-shrink-0 border-r border-primary/10 bg-background-light dark:bg-background-dark/50 hidden lg:flex flex-col">
                    <div className="p-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-background-dark shadow-lg shadow-primary/20">
                            <Icon name="sports_bar" className="font-bold" fill />
                        </div>
                        <h2 className="text-xl font-black tracking-tighter text-primary uppercase italic">Elite POS</h2>
                    </div>

                    <nav className="flex-1 px-4 space-y-2 mt-4">
                        <button
                            onClick={() => onTabChange?.('tables')}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                                activeTab === 'tables' ? "bg-primary text-background-dark shadow-xl shadow-primary/20" : "text-slate-500 hover:bg-primary/5"
                            )}
                        >
                            <Icon name="grid_view" fill={activeTab === 'tables'} />
                            <span>Mesas</span>
                        </button>

                        <button
                            onClick={() => onTabChange?.('inventory')}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                                activeTab === 'inventory' ? "bg-primary text-background-dark shadow-xl shadow-primary/20" : "text-slate-500 hover:bg-primary/5"
                            )}
                        >
                            <Icon name="inventory_2" fill={activeTab === 'inventory'} />
                            <span>Inventario</span>
                        </button>

                        <button
                            onClick={() => onTabChange?.('sales')}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                                activeTab === 'sales' ? "bg-primary text-background-dark shadow-xl shadow-primary/20" : "text-slate-500 hover:bg-primary/5"
                            )}
                        >
                            <Icon name="bar_chart" fill={activeTab === 'sales'} />
                            <span>Ventas</span>
                        </button>

                        <button
                            onClick={() => onTabChange?.('auth')}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                                activeTab === 'auth' ? "bg-primary text-background-dark shadow-xl shadow-primary/20" : "text-slate-500 hover:bg-primary/5"
                            )}
                        >
                            <Icon name="admin_panel_settings" fill={activeTab === 'auth'} />
                            <span>Usuarios</span>
                        </button>
                    </nav>

                    <div className="p-4 mt-auto">
                        <div className="glass p-5 rounded-2xl border border-primary/20 bg-primary/5">
                            <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-2 opacity-50">Información de Turno</p>
                            <p className="text-sm font-black text-white">{user?.role === 'admin' ? 'Administrador' : 'Mesero'}</p>
                            <p className="text-[10px] text-slate-500 font-bold mt-1">Finaliza a las 04:00 AM</p>
                        </div>
                    </div>
                </aside>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden bg-background-light dark:bg-[#0a0a06]">

                {/* Top Header */}
                {!hideHeader && (
                    <header className="h-20 border-b border-primary/10 flex items-center justify-between px-8 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-40">
                        <div className="flex items-center gap-4 w-1/3">
                            <div className="relative w-full max-w-sm">
                                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                                <input
                                    type="text"
                                    placeholder="Buscar mesas o productos..."
                                    className="w-full bg-primary/5 border border-primary/10 rounded-xl py-2.5 pl-10 pr-4 focus:ring-primary focus:border-primary text-slate-900 dark:text-slate-100 placeholder:text-slate-600 outline-none text-xs transition-all uppercase font-bold tracking-widest"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 sm:gap-6">
                            <div className="flex gap-2">
                                <button
                                    onClick={toggleTheme}
                                    className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors active:scale-95"
                                >
                                    <Icon name={theme === 'dark' ? 'light_mode' : 'dark_mode'} />
                                </button>
                                <button className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors relative active:scale-95">
                                    <Icon name="notifications" />
                                    <span className="absolute top-3 right-3 size-2 bg-red-500 rounded-full border-2 border-background-dark shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
                                </button>
                            </div>

                            <div className="h-8 w-px bg-primary/10 hidden sm:block"></div>

                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-black leading-none uppercase tracking-tighter">{user?.name || 'Invitado'}</p>
                                    <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1 opacity-70">{user?.role || 'Mesero'}</p>
                                </div>
                                <div className="relative group" onClick={logout}>
                                    <div className="w-11 h-11 rounded-2xl border-2 border-primary/30 p-0.5 overflow-hidden cursor-pointer group-hover:border-primary transition-colors">
                                        <div className="w-full h-full rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                            <Icon name="person" fill />
                                        </div>
                                    </div>
                                    <div className="absolute top-full right-0 mt-2 bg-background-dark border border-primary/20 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all scale-95 group-hover:scale-100 origin-top-right whitespace-nowrap z-50">
                                        <span className="text-[10px] font-black uppercase text-primary">Cerrar Sesión</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                )}

                {/* Dynamic Body */}
                <main className="flex-1 overflow-y-auto custom-scrollbar">
                    {children}
                </main>

            </div>
        </div>
    );
};
