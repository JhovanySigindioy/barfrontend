import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../../components/Icon';
import { API_BASE_URL } from '../../../utils/api';
import { cn } from '../../../utils/cn';
import { type Product } from '../hooks/useProducts';

interface EditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    product: Product | null;
}

const CATEGORIES = ['Cervezas', 'Botellas', 'Cocteles', 'Botanas', 'Comida', 'Otros'];

export const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, onClose, onSuccess, product }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'Cervezas',
        image: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                price: product.price.toString(),
                category: product.category,
                image: product.image || ''
            });
        }
    }, [product]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/inventory/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price)
                }),
            });

            if (!response.ok) throw new Error('No se pudo actualizar el producto');

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
                        className="w-full max-w-lg bg-white dark:bg-[#12110a] border border-slate-200 dark:border-white/5 rounded-3xl shadow-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-black/20">
                            <div className="flex items-center gap-3">
                                <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                    <Icon name="edit" size={16} />
                                </div>
                                <div>
                                    <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none">Editar Producto</h2>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1 opacity-60">Actualizar catálogo</p>
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

                                <div className="col-span-2 p-3 bg-primary/5 border border-primary/20 dark:border-primary/10 rounded-xl flex items-start gap-3">
                                    <Icon name="info" className="text-primary mt-0.5" size={14} />
                                    <div>
                                        <p className="text-[8px] font-black text-primary uppercase tracking-widest">Gestión de Stock</p>
                                        <p className="text-[7.5px] font-bold text-slate-600 dark:text-slate-400 mt-1 uppercase leading-relaxed">
                                            Para cambiar el stock o el costo, usa el botón <span className="text-primary">ABASTECER</span> en la tabla.
                                        </p>
                                    </div>
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
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">URL Imagen</label>
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
                                {isLoading ? 'Guardando...' : 'Actualizar Producto'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
