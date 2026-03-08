import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../../components/Icon';

interface OrderItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

interface ConsumptionTableProps {
    items: OrderItem[];
    onRemove: (productId: string) => void;
}

export const ConsumptionTable: React.FC<ConsumptionTableProps> = ({ items, onRemove }) => {
    if (items.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-20 p-10">
                <Icon name="receipt" size={64} className="mb-4" />
                <p className="font-black text-xs uppercase tracking-[0.2em]">Pedido Vacío</p>
                <p className="text-[10px] font-bold mt-2">Añade productos del catálogo</p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-primary/10">
                        <th className="pb-3 text-[9px] font-black text-slate-500 uppercase tracking-widest pl-2">Cant.</th>
                        <th className="pb-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Producto</th>
                        <th className="pb-3 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right pr-2">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    <AnimatePresence initial={false}>
                        {items.map((item) => (
                            <motion.tr
                                layout
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                key={item.id}
                                className="group hover:bg-white/5 transition-colors"
                            >
                                <td className="py-3 pl-2">
                                    <div className="flex items-center justify-center h-7 w-7 bg-primary/10 rounded-lg text-primary font-black text-xs">
                                        {item.quantity}
                                    </div>
                                </td>
                                <td className="py-3">
                                    <p className="font-black text-xs text-slate-100 leading-tight">{item.name}</p>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mt-0.5">
                                        ${item.price.toLocaleString()} c/u
                                    </p>
                                </td>
                                <td className="py-3 text-right pr-2">
                                    <div className="flex items-center justify-end gap-3">
                                        <p className="font-black text-xs text-white">
                                            ${(item.price * item.quantity).toLocaleString()}
                                        </p>
                                        <button
                                            onClick={() => onRemove(item.productId)}
                                            className="p-1.5 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Icon name="close" size={14} />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </AnimatePresence>
                </tbody>
            </table>
        </div>
    );
};
