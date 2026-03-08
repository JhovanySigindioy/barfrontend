import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

export type TableStatus = 'available' | 'occupied' | 'dirty' | 'reserved';

export interface BarTable {
    id: number;
    number: string;
    status: TableStatus;
    capacity: number;
    currentConsumption?: number;
    lastOrderTime?: string;
}

interface TableGridProps {
    tables: BarTable[];
    onTableClick: (table: BarTable) => void;
}

import { Icon } from '../../../components/Icon';

const statusTranslations: Record<TableStatus, string> = {
    available: 'Disponible',
    occupied: 'Ocupada',
    dirty: 'Sucia',
    reserved: 'Reservada'
};

export const TableGrid: React.FC<TableGridProps> = ({ tables, onTableClick }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tables.map((table) => {
                const isOccupied = table.status === 'occupied' || (table.currentConsumption ?? 0) > 0;

                if (isOccupied) {
                    return (
                        <motion.button
                            key={table.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onTableClick(table)}
                            className="glass p-6 rounded-2xl border border-primary/30 relative overflow-hidden group text-left animate-in fade-in duration-300"
                        >
                            <div className="absolute top-0 right-0 p-3">
                                <span className="flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                </span>
                            </div>

                            <h3 className="text-3xl font-black mb-1 text-slate-900 dark:text-white">M-{table.number}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 flex items-center gap-2 font-bold uppercase tracking-tighter">
                                <Icon name="group" className="text-sm" />
                                {table.capacity} Personas • {table.lastOrderTime || 'Ahora'}
                            </p>

                            <div className="flex items-end justify-between border-t border-primary/10 pt-4">
                                <div>
                                    <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1">Consumo Actual</p>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                                        ${(table.currentConsumption ?? 0).toLocaleString()}
                                    </p>
                                </div>
                                <div className="size-11 rounded-xl bg-primary text-background-dark flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                                    <Icon name="receipt_long" />
                                </div>
                            </div>
                        </motion.button>
                    );
                }

                return (
                    <motion.button
                        key={table.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onTableClick(table)}
                        className={cn(
                            "p-6 rounded-2xl transition-all flex flex-col items-start gap-1 group text-left",
                            table.status === 'reserved'
                                ? "bg-slate-800/10 border border-amber-500/20 opacity-80"
                                : "bg-slate-800/20 border border-slate-700/50 opacity-60 hover:opacity-100"
                        )}
                    >
                        <h3 className="text-3xl font-black mb-1 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                            M-{table.number}
                        </h3>

                        <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-4">
                            {table.status === 'reserved' ? `Reserva (${table.lastOrderTime || '21:00'})` : statusTranslations[table.status]}
                        </p>

                        <div className={cn(
                            "h-12 w-full border-2 border-dashed rounded-xl flex items-center justify-center transition-all",
                            table.status === 'reserved'
                                ? "border-amber-500/30 text-amber-500"
                                : "border-slate-700 text-slate-600 group-hover:border-primary group-hover:text-primary"
                        )}>
                            <Icon name={table.status === 'reserved' ? "event" : "add"} />
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
};
