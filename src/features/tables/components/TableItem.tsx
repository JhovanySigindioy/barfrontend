import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';
import { Icon } from '../../../components/Icon';
import { type BarTable, type TableStatus } from '../types';

interface TableItemProps {
    table: BarTable;
    onClick: (table: BarTable) => void;
    className?: string;
    variant?: 'compact' | 'full';
}

const statusTranslations: Record<TableStatus, string> = {
    available: 'Disponible',
    occupied: 'Ocupada',
    dirty: 'Sucia',
    reserved: 'Reservada'
};

export const TableItem: React.FC<TableItemProps> = ({ table, onClick, className, variant = 'full' }) => {
    const isOccupied = table.status === 'occupied' || (table.currentConsumption ?? 0) > 0;

    if (isOccupied) {
        return (
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onClick(table)}
                className={cn(
                    "bg-[#050505] rounded-2xl border border-primary/50 relative overflow-hidden group text-left shadow-2xl transition-all",
                    variant === 'compact' ? "p-3" : "p-6",
                    className
                )}
            >
                {/* Status Dot */}
                <div className={cn("absolute", variant === 'compact' ? "top-3 right-3" : "top-4 right-4")}>
                    <div className="size-2 bg-primary rounded-full shadow-[0_0_12px_rgba(255,191,0,0.8)]" />
                </div>

                <div className={cn("mb-3", variant === 'compact' ? "mb-2" : "mb-4")}>
                    <h3 className={cn("font-black text-white leading-none mb-1", variant === 'compact' ? "text-xl" : "text-4xl")}>M-{table.number}</h3>
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <Icon name="group" size={variant === 'compact' ? 10 : 14} />
                        <p className={cn("font-bold uppercase tracking-tighter", variant === 'compact' ? "text-[7px]" : "text-[10px]")}>
                            {table.capacity} PERSONAS • {table.lastOrderTime || 'AHORA'}
                        </p>
                    </div>
                </div>

                {/* Separator line */}
                <div className="h-[1px] w-full bg-white/10 mb-3" />

                <div className="flex justify-between items-end">
                    <div className="space-y-0.5">
                        <p className={cn("text-primary font-black uppercase tracking-widest leading-none", variant === 'compact' ? "text-[6px]" : "text-[10px]")}>CONSUMO ACTUAL</p>
                        <p className={cn("font-black text-white leading-none", variant === 'compact' ? "text-[13px]" : "text-3xl")}>
                            ${(table.currentConsumption ?? 0).toLocaleString()}
                        </p>
                    </div>
                    <div className={cn(
                        "bg-primary text-background-dark flex items-center justify-center shadow-lg shadow-primary/30 rounded-xl",
                        variant === 'compact' ? "size-6 rounded-lg" : "size-11"
                    )}>
                        <Icon name="receipt_long" size={variant === 'compact' ? 14 : 20} />
                    </div>
                </div>
            </motion.button>
        );
    }

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(table)}
            className={cn(
                "rounded-2xl transition-all flex flex-col items-start group text-left border relative",
                variant === 'compact' ? "p-3" : "p-6",
                table.status === 'reserved'
                    ? "bg-amber-500/5 border-amber-500/30"
                    : "bg-slate-900/40 border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-700",
                className
            )}
        >
            <h3 className={cn("font-black text-slate-500 group-hover:text-white transition-colors leading-none mb-1", variant === 'compact' ? "text-xl" : "text-4xl")}>
                M-{table.number}
            </h3>
            <p className={cn("font-black uppercase tracking-widest text-slate-600 group-hover:text-primary transition-colors", variant === 'compact' ? "text-[7px]" : "text-xs")}>
                {table.status === 'reserved' ? 'RESERVADA' : statusTranslations[table.status].toUpperCase()}
            </p>

            <div className={cn(
                "w-full border-2 border-dashed rounded-xl flex items-center justify-center transition-all mt-4",
                variant === 'compact' ? "h-10 mt-auto" : "h-12",
                table.status === 'reserved'
                    ? "border-amber-500/30 text-amber-500"
                    : "border-slate-700 text-slate-600 group-hover:border-primary group-hover:text-primary opacity-20 group-hover:opacity-100"
            )}>
                <Icon name={table.status === 'reserved' ? "event" : "add"} size={variant === 'compact' ? 16 : 20} />
            </div>
        </motion.button>
    );
};
