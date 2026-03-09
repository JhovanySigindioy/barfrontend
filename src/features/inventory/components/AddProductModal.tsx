import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../../components/Icon';
import { API_BASE_URL } from '../../../utils/api';
import { cn } from '../../../utils/cn';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CATEGORIES = ['Cervezas', 'Botellas', 'Cocteles', 'Botanas', 'Comida', 'Otros'];

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        cost_price: '',
        category: 'Cervezas',
        stock: '',
        image: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/inventory`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price),
                    cost_price: Number(formData.cost_price || 0),
                    stock: Number(formData.stock || 0)
                }),
            });

            if (!response.ok) throw new Error('No se pudo crear el producto');

            onSuccess();
            onClose();
            setFormData({ name: '', price: '', cost_price: '', category: 'Cervezas', stock: '', image: '' });
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
                        className="w-full max-w-lg bg-white dark:bg-[#12110a] border border-slate-200 dark:border-white/5 rounded-3xl shadow-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-black/20">
                            <div className="flex items-center gap-3">
                                <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                    <Icon name="add_shopping_cart" size={16} />
                                </div>
                                <div>
                                    <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none">Nuevo Producto</h2>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1 opacity-60">Añadir al catálogo</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="size-8 bg-slate-100 dark:bg-white/5 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors border border-slate-200 dark:border-transparent">
                                <Icon name="close" size={14} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Nombre del Producto</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-4 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-medium placeholder:text-slate-300 dark:placeholder:text-slate-800"
                                        placeholder="Ej. Cerveza BBC"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Costo (Compra)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-black text-xs">$</span>
                                        <input
                                            type="number"
                                            required
                                            value={formData.cost_price}
                                            onChange={e => setFormData({ ...formData, cost_price: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 pl-8 pr-4 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-medium placeholder:text-slate-300"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Precio (Venta)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black text-xs">$</span>
                                        <input
                                            type="number"
                                            required
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 pl-8 pr-4 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-medium placeholder:text-slate-300"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Stock Inicial</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-4 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-medium placeholder:text-slate-300"
                                        placeholder="0"
                                    />
                                </div>

                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Categoría</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {CATEGORIES.map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, category: cat })}
                                                className={cn(
                                                    "py-2 rounded-lg font-black text-[8px] uppercase tracking-widest border transition-all",
                                                    formData.category === cat
                                                        ? "bg-primary text-background-dark border-primary shadow-md shadow-primary/10"
                                                        : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900"
                                                )}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">URL Imagen (Opcional)</label>
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/5 rounded-xl py-2.5 px-4 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-medium placeholder:text-slate-300 dark:placeholder:text-slate-800 text-[9px]"
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                    />
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
                                {isLoading ? 'Guardando...' : 'Guardar Producto'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
