import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../../components/Icon';
import { useAuthStore } from '../../../store/useAuthStore';
import { API_BASE_URL } from '../../../utils/api';
import { cn } from '../../../utils/cn';

export const Login = () => {
    const { login } = useAuthStore();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al iniciar sesión');
            }

            const userData = await response.json();
            login(userData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-[#05070a] flex items-center justify-center p-6 overflow-hidden relative transition-colors duration-500">
            {/* Background Orbs */}
            <div className="absolute top-0 -left-1/4 w-[600px] h-[600px] bg-primary/10 dark:bg-primary/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" />
            <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-slate-200 dark:bg-purple-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white dark:bg-white/[0.03] backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-10 shadow-2xl dark:shadow-none overflow-hidden relative">
                    {/* Internal Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 dark:bg-primary/20 blur-[60px] -mr-16 -mt-16" />

                    <div className="text-center space-y-4 mb-10 relative">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-primary/10 rounded-[1.75rem] flex items-center justify-center mx-auto border border-slate-200 dark:border-primary/20 rotate-12 group hover:rotate-0 transition-transform duration-500 shadow-sm">
                            <Icon name="liquor" size={32} className="text-primary" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase"><span className="text-primary">BAR</span></h1>
                            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Sistema de Control Profesional</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Usuario</label>
                            <div className="relative group">
                                <Icon name="person" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-medium placeholder:text-slate-300 dark:placeholder:text-slate-800"
                                    placeholder="admin"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Contraseña</label>
                            <div className="relative group">
                                <Icon name="lock" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-medium placeholder:text-slate-300 dark:placeholder:text-slate-800"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3"
                                >
                                    <Icon name="error" size={16} className="text-red-500" />
                                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={cn(
                                "w-full py-5 bg-primary text-background-dark rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden",
                                isLoading && "opacity-80 pointer-events-none"
                            )}
                        >
                            <span className={cn(isLoading ? "opacity-0" : "opacity-100")}>Iniciar Sesión</span>
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-background-dark/30 border-t-background-dark rounded-full animate-spin" />
                                </div>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-slate-100 dark:border-white/5 text-center">
                        <p className="text-slate-400 dark:text-slate-700 text-[9px] font-bold uppercase tracking-widest">v1.2.0 • Premium Edition</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
