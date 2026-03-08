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
        cost_price: '',
        category: 'Cervezas',
        stock: '',
        image: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                price: product.price.toString(),
                cost_price: (product.cost_price || 0).toString(),
                category: product.category,
                stock: product.stock.toString(),
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
                    price: Number(formData.price),
                    cost_price: Number(formData.cost_price || 0),
                    stock: Number(formData.stock || 0)
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
                        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-full max-w-lg bg-[#12110a] border border-white/5 rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
                    >
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <Icon name="edit" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Editar Producto</h2>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 opacity-60">Actualizar catálogo</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="size-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                                <Icon name="close" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Nombre del Producto</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/[0.05] border border-white/5 rounded-2xl py-4 px-5 text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-medium placeholder:text-slate-800"
                                        placeholder="Ej. Cerveza BBC"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Costo (Compra)</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-black">$</span>
                                        <input
                                            type="number"
                                            required
                                            value={formData.cost_price}
                                            onChange={e => setFormData({ ...formData, cost_price: e.target.value })}
                                            className="w-full bg-white/[0.05] border border-white/5 rounded-2xl py-4 pl-10 pr-5 text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-medium"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Precio (Venta)</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-black">$</span>
                                        <input
                                            type="number"
                                            required
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full bg-white/[0.05] border border-white/5 rounded-2xl py-4 pl-10 pr-5 text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-medium"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Stock Actual</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full bg-white/[0.05] border border-white/5 rounded-2xl py-4 px-5 text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-medium"
                                        placeholder="0"
                                    />
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Categoría</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {CATEGORIES.map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, category: cat })}
                                                className={cn(
                                                    "py-3 rounded-xl font-black text-[9px] uppercase tracking-widest border transition-all",
                                                    formData.category === cat
                                                        ? "bg-primary text-background-dark border-primary shadow-lg shadow-primary/10"
                                                        : "bg-white/5 border-white/5 text-slate-500 hover:bg-white/10"
                                                )}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">URL Imagen</label>
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full bg-white/[0.05] border border-white/5 rounded-2xl py-4 px-5 text-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-medium placeholder:text-slate-800 text-[10px]"
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                    />
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
                                {isLoading ? 'Guardando...' : 'Actualizar Producto'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
