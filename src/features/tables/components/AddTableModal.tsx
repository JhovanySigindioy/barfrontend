import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../../components/Icon';
import { API_BASE_URL } from '../../../utils/api';
import { cn } from '../../../utils/cn';

interface AddTableModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddTableModal: React.FC<AddTableModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        number: '',
        capacity: '4'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/tables`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    number: formData.number,
                    capacity: Number(formData.capacity)
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'No se pudo crear la mesa');
            }

            onSuccess();
            onClose();
            setFormData({ number: '', capacity: '4' });
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
                        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-full max-w-sm bg-[#12110a] border border-white/5 rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
                    >
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <Icon name="event_seat" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Nueva Mesa</h2>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 opacity-60">Configurar ubicación</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="size-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                                <Icon name="close" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Número de Mesa</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={10}
                                        value={formData.number}
                                        onChange={e => setFormData({ ...formData, number: e.target.value })}
                                        className="w-full bg-white/[0.05] border border-white/5 rounded-2xl py-4 px-5 text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-medium placeholder:text-slate-800"
                                        placeholder="Ej. T-01"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Capacidad (Pax)</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {['2', '4', '6', '8'].map(cap => (
                                            <button
                                                key={cap}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, capacity: cap })}
                                                className={cn(
                                                    "py-3 rounded-xl font-black text-[9px] uppercase tracking-widest border transition-all",
                                                    formData.capacity === cap
                                                        ? "bg-primary text-background-dark border-primary shadow-lg shadow-primary/10"
                                                        : "bg-white/5 border-white/5 text-slate-500 hover:bg-white/10"
                                                )}
                                            >
                                                {cap}p
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                                    <Icon name="error" className="text-red-500" />
                                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-5 bg-primary text-background-dark rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                            >
                                {isLoading ? 'Creando...' : 'Crear Mesa'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
