export type TableStatus = 'available' | 'occupied' | 'dirty' | 'reserved';

export interface BarTable {
    id: number;
    number: string;
    status: TableStatus;
    capacity: number;
    currentConsumption?: number;
    lastOrderTime?: string;
}
