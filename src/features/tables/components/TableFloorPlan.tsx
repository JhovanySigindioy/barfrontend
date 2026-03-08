import React from 'react';
import { Icon } from '../../../components/Icon';
import { type BarTable } from '../types';
import { TableItem } from './TableItem';

interface TableFloorPlanProps {
    tables: BarTable[];
    onTableClick: (table: BarTable) => void;
}

export const TableFloorPlan: React.FC<TableFloorPlanProps> = ({ tables, onTableClick }) => {
    const getTableById = (number: string) => tables.find(t => t.number === number);

    const renderTable = (number: string) => {
        const table = getTableById(number);
        if (!table) return null;
        return (
            <TableItem
                table={table}
                onClick={onTableClick}
                variant="compact"
                className="h-full w-full"
            />
        );
    };

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
                {/* Decoration: Entrance / Exit */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="text-[8px] font-black text-primary/40 uppercase tracking-[0.5em] mb-1">Entrada / Terraza</span>
                    <div className="h-0.5 w-16 bg-primary/20 rounded-full shadow-[0_0_15px_rgba(255,191,0,0.1)]" />
                </div>

                {/* Top Row / Horizontal Area (Tables 6, 7, 8) */}
                <div className="col-span-3 grid grid-cols-3 gap-10 mb-4 pt-4">
                    <div className="aspect-square w-full">
                        {renderTable('06')}
                    </div>
                    <div className="aspect-square w-full">
                        {renderTable('07')}
                    </div>
                    <div className="aspect-square w-full">
                        {renderTable('08')}
                    </div>
                </div>

                {/* Left Column (Tables 1, 2, 3) */}
                <div className="flex flex-col gap-4">
                    <div className="aspect-square w-full">
                        {renderTable('01')}
                    </div>
                    <div className="aspect-square w-full">
                        {renderTable('02')}
                    </div>
                    <div className="aspect-square w-full">
                        {renderTable('03')}
                    </div>
                </div>

                {/* Center Space (Hallway) */}
                <div className="flex flex-col justify-center items-center opacity-5 pointer-events-none">
                    <div className="h-full w-[1px] bg-gradient-to-b from-transparent via-white/50 to-transparent" />
                </div>

                {/* Right Column (Tables 4, 5) */}
                <div className="flex flex-col gap-4">
                    <div className="aspect-square w-full">
                        {renderTable('04')}
                    </div>
                    <div className="aspect-square w-full">
                        {renderTable('05')}
                    </div>
                    <div className="aspect-square w-full opacity-5 border border-dashed border-white/20 rounded-xl flex items-center justify-center">
                        <Icon name="coffee" size={14} />
                    </div>
                </div>
            </div>
        </div>
    );
};
