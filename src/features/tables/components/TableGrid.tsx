import React from 'react';
import { type BarTable } from '../types';
import { TableItem } from './TableItem';

interface TableGridProps {
    tables: BarTable[];
    onTableClick: (table: BarTable) => void;
}

export const TableGrid: React.FC<TableGridProps> = ({ tables, onTableClick }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tables.map((table) => (
                <TableItem
                    key={table.id}
                    table={table}
                    onClick={onTableClick}
                    variant="full"
                />
            ))}
        </div>
    );
};
