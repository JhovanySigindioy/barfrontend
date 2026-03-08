import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type OrderItem } from './useCartStore';

export type PaymentMethod = 'cash' | 'card' | 'nequi' | 'daviplata' | 'bolt' | 'transfer';

export interface CompletedOrder {
    id: string;
    tableId: number;
    items: OrderItem[];
    total: number;
    paymentMethod: PaymentMethod;
    receivedAmount: number;
    changeAmount: number;
    timestamp: number;
    splitCount: number;
}

interface HistoryState {
    orders: CompletedOrder[];
    addOrder: (order: Omit<CompletedOrder, 'id' | 'timestamp'>) => void;
    clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
    persist(
        (set) => ({
            orders: [],

            addOrder: (orderData) => set((state) => ({
                orders: [
                    {
                        ...orderData,
                        id: crypto.randomUUID(),
                        timestamp: Date.now()
                    },
                    ...state.orders
                ]
            })),

            clearHistory: () => set({ orders: [] })
        }),
        {
            name: 'order-history-storage',
        }
    )
);
