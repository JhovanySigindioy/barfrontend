import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../../components/Icon';
import { API_BASE_URL } from '../../../utils/api';
import { cn } from '../../../utils/cn';
import { type BarTable } from '../types';

interface EditTableModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    table: BarTable | null;
}

export const EditTableModal: React.FC<EditTableModalProps> = ({ isOpen, onClose, onSuccess, table }) => {
    const [formData, setFormData] = useState({
        number: '',
        capacity: '4'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (table) {
            setFormData({
                number: table.number,
                capacity: table.capacity.toString()
            });
        }
    }, [table]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!table) return;
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/tables/${table.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    number: formData.number,
                    capacity: Number(formData.capacity)
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'No se pudo actualizar la mesa');
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 dark:bg-black/95 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-full max-w-sm bg-white dark:bg-[#12110a] border border-slate-200 dark:border-white/5 rounded-3xl shadow-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-black/20">
                            <div className="flex items-center gap-3">
                                <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                    <Icon name="edit" size={16} />
                                </div>
                                <div>
                                    <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none">Editar Mesa</h2>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1 opacity-60">Actualizar ubicación</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="size-8 bg-slate-100 dark:bg-white/5 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-transparent">
                                <Icon name="close" size={14} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Número de Mesa</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={10}
                                        value={formData.number}
                                        onChange={e => setFormData({ ...formData, number: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-4 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-bold placeholder:text-slate-300 dark:placeholder:text-slate-800"
                                        placeholder="Ej. T-01"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Capacidad (Pax)</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {['2', '4', '6', '8'].map(cap => (
                                            <button
                                                key={cap}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, capacity: cap })}
                                                className={cn(
                                                    "py-2 rounded-lg font-black text-[8px] uppercase tracking-widest border transition-all",
                                                    formData.capacity === cap
                                                        ? "bg-primary text-background-dark border-primary shadow-md shadow-primary/10"
                                                        : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900"
                                                )}
                                            >
                                                {cap}p
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                                    <Icon name="error" className="text-red-500" size={14} />
                                    <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 bg-primary text-background-dark rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
                            >
                                {isLoading ? 'Guardando...' : 'Actualizar Mesa'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
