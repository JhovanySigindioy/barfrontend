import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';
import { Icon } from '../../../components/Icon';
import { type BarTable, type TableStatus } from './TableGrid';

interface TableFloorPlanProps {
    tables: BarTable[];
    onTableClick: (table: BarTable) => void;
}

const statusTranslations: Record<TableStatus, string> = {
    available: 'Disponible',
    occupied: 'Ocupada',
    dirty: 'Sucia',
    reserved: 'Reservada'
};

const TableItem = ({ table, onClick }: { table: BarTable, onClick: () => void }) => {
    const isOccupied = table.status === 'occupied' || (table.currentConsumption ?? 0) > 0;

    if (isOccupied) {
        return (
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClick}
                className="bg-[#050505] p-3 rounded-2xl border border-primary/50 relative overflow-hidden group text-left h-full w-full shadow-2xl"
            >
                {/* Status Dot */}
                <div className="absolute top-3 right-3">
                    <div className="size-2 bg-primary rounded-full shadow-[0_0_12px_rgba(255,191,0,0.8)]" />
                </div>

                <div className="mb-3">
                    <h3 className="text-xl font-black text-white leading-none mb-1">M-{table.number}</h3>
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <Icon name="group" size={10} />
                        <p className="text-[7px] font-bold uppercase tracking-tighter">
                            {table.capacity} PERSONAS • {table.lastOrderTime || 'AHORA'}
                        </p>
                    </div>
                </div>

                {/* Separator line */}
                <div className="h-[1px] w-full bg-white/10 mb-3" />

                <div className="flex justify-between items-end">
                    <div className="space-y-0.5">
                        <p className="text-[6px] text-primary font-black uppercase tracking-widest leading-none">CONSUMO ACTUAL</p>
                        <p className="text-[13px] font-black text-white leading-none">
                            ${(table.currentConsumption ?? 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="size-6 rounded-lg bg-primary text-background-dark flex items-center justify-center shadow-lg shadow-primary/30">
                        <Icon name="receipt_long" size={14} />
                    </div>
                </div>
            </motion.button>
        );
    }

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={cn(
                "p-3 rounded-2xl transition-all flex flex-col items-start group text-left h-full w-full border",
                table.status === 'reserved'
                    ? "bg-amber-500/5 border-amber-500/30"
                    : "bg-slate-900/40 border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-700"
            )}
        >
            <h3 className="text-xl font-black text-slate-500 group-hover:text-white transition-colors leading-none mb-1">M-{table.number}</h3>
            <p className="text-[7px] font-black uppercase tracking-widest text-slate-600 group-hover:text-primary transition-colors">
                {table.status === 'reserved' ? 'RESERVADA' : statusTranslations[table.status].toUpperCase()}
            </p>
            <div className="mt-auto w-full flex justify-center py-1 opacity-10 group-hover:opacity-100 transition-all text-slate-400 group-hover:text-primary">
                <Icon name={table.status === 'reserved' ? "event" : "add"} size={14} />
            </div>
        </motion.button>
    );
};

export const TableFloorPlan: React.FC<TableFloorPlanProps> = ({ tables, onTableClick }) => {
    const getTableById = (number: string) => tables.find(t => t.number === number);

    return (
        <div className="max-w-3xl mx-auto p-6 bg-black/40 rounded-[2.5rem] border border-white/5">
            {/* Header / Info */}
            <div className="flex items-center justify-between mb-8 px-4">
                <div className="flex items-center gap-3">
                    <div className="size-1.5 bg-success rounded-full animate-pulse" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Plano Operativo Real</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="size-1.5 bg-primary rounded-full" />
                        <span className="text-[7px] font-black text-slate-500 uppercase">Ocupada</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-1.5 bg-white/10 rounded-full border border-white/20" />
                        <span className="text-[7px] font-black text-slate-500 uppercase">Libre</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-x-10 gap-y-4 relative">
                {/* Decoration: Entrance / Exit (Now at the top/bottom depending on preference, moving to top as "Entrance") */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="text-[8px] font-black text-primary/40 uppercase tracking-[0.5em] mb-1">Entrada / Terraza</span>
                    <div className="h-0.5 w-16 bg-primary/20 rounded-full shadow-[0_0_15px_rgba(255,191,0,0.1)]" />
                </div>

                {/* Top Row / Horizontal Area (Tables 6, 7, 8) */}
                <div className="col-span-3 grid grid-cols-3 gap-10 mb-4 pt-4">
                    <div className="aspect-square w-full">
                        {getTableById('06') && <TableItem table={getTableById('06')!} onClick={() => onTableClick(getTableById('06')!)} />}
                    </div>
                    <div className="aspect-square w-full">
                        {getTableById('07') && <TableItem table={getTableById('07')!} onClick={() => onTableClick(getTableById('07')!)} />}
                    </div>
                    <div className="aspect-square w-full">
                        {getTableById('08') && <TableItem table={getTableById('08')!} onClick={() => onTableClick(getTableById('08')!)} />}
                    </div>
                </div>

                {/* Left Column (Tables 1, 2, 3) */}
                <div className="flex flex-col gap-4">
                    <div className="aspect-square w-full">
                        {getTableById('01') && <TableItem table={getTableById('01')!} onClick={() => onTableClick(getTableById('01')!)} />}
                    </div>
                    <div className="aspect-square w-full">
                        {getTableById('02') && <TableItem table={getTableById('02')!} onClick={() => onTableClick(getTableById('02')!)} />}
                    </div>
                    <div className="aspect-square w-full">
                        {getTableById('03') && <TableItem table={getTableById('03')!} onClick={() => onTableClick(getTableById('03')!)} />}
                    </div>
                </div>

                {/* Center Space (Hallway) */}
                <div className="flex flex-col justify-center items-center opacity-5 pointer-events-none">
                    <div className="h-full w-[1px] bg-gradient-to-b from-transparent via-white/50 to-transparent" />
                </div>

                {/* Right Column (Tables 4, 5) */}
                <div className="flex flex-col gap-4">
                    <div className="aspect-square w-full">
                        {getTableById('04') && <TableItem table={getTableById('04')!} onClick={() => onTableClick(getTableById('04')!)} />}
                    </div>
                    <div className="aspect-square w-full">
                        {getTableById('05') && <TableItem table={getTableById('05')!} onClick={() => onTableClick(getTableById('05')!)} />}
                    </div>
                    <div className="aspect-square w-full opacity-5 border border-dashed border-white/20 rounded-xl flex items-center justify-center">
                        <Icon name="coffee" size={14} />
                    </div>
                </div>
            </div>
        </div>
    );
};
