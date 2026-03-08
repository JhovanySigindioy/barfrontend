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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className={cn(
                "group relative bg-[#1a1a14] rounded-3xl overflow-hidden border border-white/5 hover:border-primary/40 transition-all duration-500 shadow-2xl flex flex-col h-full",
                isOutOfStock && "opacity-40 grayscale pointer-events-none",
                className
            )}
        >
            {/* Minimalist Image Container */}
            <div className="aspect-[4/5] overflow-hidden relative">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-slate-700">
                        <Icon name="fastfood" size={48} strokeWidth={1} />
                    </div>
                )}

                {/* Visual Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a14] via-transparent to-black/20 group-hover:from-[#1a1a14]/90 transition-all duration-500" />

                {/* Top Badge: Price Tag */}
                <div className="absolute top-4 right-4 z-10">
                    <div className="bg-primary/95 backdrop-blur-md text-background-dark font-black px-3 py-1.5 rounded-2xl text-[11px] shadow-lg shadow-primary/20 transform -rotate-2 group-hover:rotate-0 transition-transform duration-500">
                        ${product.price.toLocaleString()}
                    </div>
                </div>

                {/* Bottom Info (On Image) */}
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary/70 mb-0.5">
                            {product.category}
                        </span>
                        <h4 className="font-black text-sm text-white leading-tight uppercase tracking-tighter group-hover:text-primary transition-colors duration-500">
                            {product.name}
                        </h4>
                    </div>
                </div>

                {/* Interactive Add Button (Floating) */}
                {!isOutOfStock && (
                    <motion.button
                        layoutId={`add-${product.id}`}
                        onClick={(e) => onAdd(product, e)}
                        whileTap={{ scale: 0.9 }}
                        className="absolute bottom-4 right-4 size-10 bg-primary rounded-2xl flex items-center justify-center text-background-dark shadow-xl shadow-primary/20 transition-all duration-300 z-20"
                    >
                        <Icon name="Plus" size={24} strokeWidth={3} />
                    </motion.button>
                )}
            </div>

            {/* Bottom Meta Bar (Stock & Status) */}
            <div className="px-4 py-3 flex items-center justify-between border-t border-white/5 bg-black/20">
                <div className="flex items-center gap-2">
                    <div className={cn("size-1.5 rounded-full shadow-[0_0_8px]", isOutOfStock ? "bg-red-500 shadow-red-500" : "bg-success shadow-success")} />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                        {isOutOfStock ? 'Sin Stock' : `Disp. ${product.stock}`}
                    </span>
                </div>
                <div className="flex gap-0.5 opacity-20">
                    <div className="size-1 rounded-full bg-white" />
                    <div className="size-1 rounded-full bg-white" />
                </div>
            </div>
        </motion.div>
    );
};
