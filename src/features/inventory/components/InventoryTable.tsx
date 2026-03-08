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
}

export const InventoryTable: React.FC<InventoryTableProps> = ({ products, isLoading, onEdit, onDelete }) => {
    if (isLoading) {
        return (
            <div className="glass rounded-3xl border border-primary/10 overflow-hidden animate-pulse">
                <div className="h-16 bg-white/5 border-b border-primary/5"></div>
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-14 bg-white/5 border-b border-white/5 mx-4 my-2 rounded-lg"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="glass rounded-3xl border border-primary/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-primary/5 border-b border-primary/10">
                            <th className="px-6 py-5 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Producto</th>
                            <th className="px-6 py-5 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Categoría</th>
                            <th className="px-6 py-5 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Costo</th>
                            <th className="px-6 py-5 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Venta</th>
                            <th className="px-6 py-5 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Margen</th>
                            <th className="px-6 py-5 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Stock</th>
                            <th className="px-6 py-5 text-[10px] font-black text-primary uppercase tracking-[0.2em]">Estado</th>
                            <th className="px-6 py-5 text-[10px] font-black text-primary uppercase tracking-[0.2em] text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, idx) => {
                            const isLowStock = product.stock > 0 && product.stock <= 5;
                            const isOutOfStock = product.stock <= 0;

                            return (
                                <motion.tr
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={product.id}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-default"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 overflow-hidden border border-white/5 group-hover:border-primary/30 transition-colors">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} className="size-full object-cover" />
                                                ) : (
                                                    <Icon name="fastfood" className="text-xl" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-black text-sm text-white uppercase tracking-tight">{product.name}</p>
                                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">ID: {String(product.id).split('-')[0]}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-xs text-slate-400">
                                            ${(product.cost_price || 0).toLocaleString()}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-black text-sm text-primary-400">
                                            ${product.price.toLocaleString()}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {(() => {
                                            const margin = product.price - (product.cost_price || 0);
                                            const percent = product.price > 0 ? (margin / product.price) * 100 : 0;
                                            return (
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-success tracking-tighter cursor-help" title={`Diferencia: $${margin.toLocaleString()}`}>
                                                        {percent.toFixed(0)}%
                                                    </span>
                                                </div>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "font-black text-sm",
                                                isOutOfStock ? "text-red-500" : isLowStock ? "text-amber-500" : "text-slate-300"
                                            )}>
                                                {product.stock}
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-500 uppercase">unidades</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {isOutOfStock ? (
                                            <div className="flex items-center gap-1.5 text-red-500">
                                                <div className="size-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                                                <span className="text-[9px] font-black uppercase tracking-widest">Agotado</span>
                                            </div>
                                        ) : isLowStock ? (
                                            <div className="flex items-center gap-1.5 text-amber-500">
                                                <div className="size-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                                                <span className="text-[9px] font-black uppercase tracking-widest">Stock Crítico</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-success">
                                                <div className="size-1.5 rounded-full bg-success"></div>
                                                <span className="text-[9px] font-black uppercase tracking-widest">En Stock</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 transition-opacity">
                                            <button
                                                onClick={() => onEdit(product)}
                                                className="p-2.5 bg-white/5 hover:bg-primary/20 rounded-xl text-slate-400 hover:text-primary transition-all border border-white/5 hover:border-primary/20"
                                            >
                                                <Icon name="edit" size={14} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(product.id)}
                                                className="p-2.5 bg-white/5 hover:bg-red-500/20 rounded-xl text-slate-400 hover:text-red-500 transition-all border border-white/5 hover:border-red-500/20"
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
            <div className="px-8 py-5 bg-black/40 border-t border-primary/5 flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Mostrando <span className="text-slate-300">{products.length}</span> productos en catálogo
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
