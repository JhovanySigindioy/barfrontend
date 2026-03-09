import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../../components/Icon';
import { useProducts } from '../hooks/useProducts';

interface RestockModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: any;
}

export const RestockModal = ({ isOpen, onClose, product }: RestockModalProps) => {
    const [quantity, setQuantity] = useState<string>('');
    const [unitCost, setUnitCost] = useState<string>(product?.cost_price || '');
    const { restockProduct } = useProducts();
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !product) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!quantity || !unitCost) return;

        setIsSubmitting(true);
        try {
            await restockProduct.mutateAsync({
                productId: product.id,
                quantity: parseInt(quantity),
                unitCost: parseFloat(unitCost)
            });
            onClose();
            setQuantity('');
        } catch (error) {
            console.error('Error restocking:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
                    className="relative w-full max-w-sm bg-white dark:bg-[#12110a] border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl max-h-[90vh] flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/20">
                        <div className="flex items-center gap-4">
                            <div className="size-10 bg-slate-100 dark:bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-sm dark:shadow-none border border-slate-200 dark:border-transparent">
                                <Icon name="inventory_2" size={20} />
                            </div>
                            <div>
                                <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight uppercase italic">Abastecer</h2>
                                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{product.name}</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">¿Cuántas unidades entraron?</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-500 group-focus-within:text-primary transition-colors">
                                        <Icon name="add_circle" size={16} />
                                    </div>
                                    <input
                                        type="number"
                                        required
                                        value={quantity}
                                        onChange={e => setQuantity(e.target.value)}
                                        placeholder="Ej: 300"
                                        className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-primary/50 focus:bg-white dark:focus:bg-white/[0.05] transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <p className="text-[8px] text-slate-400 dark:text-slate-600 font-bold ml-1">Stock actual: {product.stock} unidades</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">¿Costo de compra (S/ x unidad)?</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-500 group-focus-within:text-primary transition-colors">
                                        <Icon name="payments" size={16} />
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={unitCost}
                                        onChange={e => setUnitCost(e.target.value)}
                                        placeholder="Ej: 3200"
                                        className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-primary/50 focus:bg-white dark:focus:bg-white/[0.05] transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <p className="text-[8px] text-slate-400 dark:text-slate-600 font-bold ml-1">Último costo: ${product.cost_price}</p>
                            </div>
                        </div>

                        <div className="pt-2 flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-100/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 dark:hover:bg-white/5 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-[2] py-3 rounded-xl bg-primary text-background-dark font-black uppercase text-[10px] tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Guardando...' : 'Confirmar Ingreso'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
