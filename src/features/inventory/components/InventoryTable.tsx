import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../../components/Icon';
import { cn } from '../../../utils/cn';

import { type Product } from '../hooks/useProducts';

interface InventoryTableProps {
    products: Product[];
    isLoading?: boolean;
    onEdit: (product: Product) => void;
    onDelete: (id: string | number) => void;
    onRestock: (product: Product) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({ products, isLoading, onEdit, onDelete, onRestock }) => {
    if (isLoading) {
        return (
            <div className="bg-white dark:glass rounded-3xl border border-slate-200 dark:border-primary/10 overflow-hidden animate-pulse">
                <div className="h-16 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-primary/5"></div>
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-14 bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 mx-4 my-2 rounded-lg"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[3rem] overflow-hidden shadow-sm dark:shadow-none transition-all">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Producto</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Categoría</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Costo</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Venta</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Margen</th>
                            <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Estado</th>
                            <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {products.map((product, idx) => {
                            const isLowStock = product.stock > 0 && product.stock <= 5;
                            const isOutOfStock = product.stock <= 0;
                            const margin = product.price - (product.cost_price || 0);
                            const percent = product.price > 0 ? (margin / product.price) * 100 : 0;

                            return (
                                <motion.tr
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={product.id}
                                    className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-default"
                                >
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 overflow-hidden border border-slate-200 dark:border-white/5 group-hover:border-primary/30 transition-colors">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} className="size-full object-cover" />
                                                ) : (
                                                    <Icon name="fastfood" className="text-xl" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight">{product.name}</p>
                                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">ID: {String(product.id).split('-')[0]}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4">
                                        <p className="font-bold text-xs text-slate-400">
                                            ${(product.cost_price || 0).toLocaleString()}
                                        </p>
                                    </td>
                                    <td className="px-8 py-4">
                                        <p className="font-black text-sm text-primary">
                                            ${product.price.toLocaleString()}
                                        </p>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex flex-col">
                                            <span className={cn(
                                                "text-xs font-black tracking-tighter",
                                                percent > 50 ? "text-emerald-500" : percent > 20 ? "text-amber-500" : "text-slate-400"
                                            )}>
                                                {percent.toFixed(0)}%
                                            </span>
                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Margen</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <span className={cn(
                                                    "font-black text-sm",
                                                    isOutOfStock ? "text-red-500" : isLowStock ? "text-amber-500" : "text-slate-700 dark:text-slate-300"
                                                )}>
                                                    {product.stock}
                                                </span>
                                                <span className="text-[8px] font-bold text-slate-400 uppercase">Unidades</span>
                                            </div>
                                            {isOutOfStock ? (
                                                <div className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-px font-black uppercase tracking-widest">Agotado</div>
                                            ) : isLowStock ? (
                                                <div className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-px font-black uppercase tracking-widest">Crítico</div>
                                            ) : null}
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 transition-opacity">
                                            <button
                                                onClick={() => onRestock(product)}
                                                className="p-2.5 bg-primary/10 hover:bg-primary/20 rounded-xl text-primary transition-all border border-primary/10 hover:border-primary/40 group/btn relative shadow-sm dark:shadow-none"
                                                title="Abastecer"
                                            >
                                                <Icon name="inventory_2" size={14} />
                                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-[8px] font-black text-white rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 uppercase tracking-widest">Abastecer</span>
                                            </button>
                                            <button
                                                onClick={() => onEdit(product)}
                                                className="p-2.5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-primary/20 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-primary transition-all border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-primary/20"
                                            >
                                                <Icon name="edit" size={14} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(product.id)}
                                                className="p-2.5 bg-slate-50 dark:bg-white/5 hover:bg-red-500/10 rounded-xl text-slate-400 hover:text-red-500 transition-all border border-slate-200 dark:border-white/5 hover:border-red-500/20"
                                            >
                                                <Icon name="delete" size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination / Summary Footer */}
            <div className="bg-slate-50 dark:bg-white/[0.02] border-t border-slate-200 dark:border-white/5 px-8 py-6 flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Total: <span className="text-slate-900 dark:text-white">{products.length} productos</span>
                </p>
                <div className="flex gap-2">
                    <button className="p-2 text-slate-500 hover:text-primary transition-colors disabled:opacity-20" disabled>
                        <Icon name="chevron_left" />
                    </button>
                    <button className="p-2 text-slate-500 hover:text-primary transition-colors">
                        <Icon name="chevron_right" />
                    </button>
                </div>
            </div>
        </div>
    );
};
