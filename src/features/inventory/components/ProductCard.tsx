import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';
import { Icon } from '../../../components/Icon';

import { type Product } from '../hooks/useProducts';

interface ProductCardProps {
    product: Product;
    onAdd: (product: Product, e?: React.MouseEvent) => void;
    className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd, className }) => {
    const isOutOfStock = product.stock <= 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            onClick={(e) => !isOutOfStock && onAdd(product, e)}
            className={cn(
                "group relative bg-white dark:bg-[#1a1a14] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer flex flex-col h-full",
                isOutOfStock && "opacity-40 grayscale pointer-events-none",
                className
            )}
        >
            {/* Top Image Section (More compact) */}
            <div className="aspect-[16/10] overflow-hidden relative">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center text-slate-200 dark:text-slate-800">
                        <Icon name="fastfood" size={32} strokeWidth={1} />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content Section */}
            <div className="p-3 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-2 mb-1">
                    <span className="text-[7px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                        {product.category}
                    </span>
                    <span className="text-[10px] font-black text-primary tracking-tighter">
                        ${product.price.toLocaleString()}
                    </span>
                </div>

                <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight uppercase tracking-tight mb-auto group-hover:text-primary transition-colors">
                    {product.name}
                </h4>

                <div className="mt-3 pt-3 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <div className={cn("size-1 rounded-full", isOutOfStock ? "bg-red-500" : "bg-success")} />
                        <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">
                            {isOutOfStock ? 'Sin Stock' : `${product.stock} un.`}
                        </span>
                    </div>

                    {!isOutOfStock && (
                        <div className="size-6 bg-primary/10 dark:bg-primary/5 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background-dark transition-all duration-300">
                            <Icon name="plus" size={14} strokeWidth={3} />
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
