import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OrderItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    timestamp: number;
}

export interface TableOrder {
    tableId: number;
    items: OrderItem[];
    total: number;
    status: 'active' | 'closed';
}

interface CartState {
    orders: Record<number, TableOrder>; // Key is tableId
    addToTable: (tableId: number, product: { id: string; name: string; price: number }) => void;
    removeFromTable: (tableId: number, productId: string) => void;
    clearTable: (tableId: number) => void;
    getTableTotal: (tableId: number) => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            orders: {},

            addToTable: (tableId, product) => set((state) => {
                const tableOrder = state.orders[tableId] || { tableId, items: [], total: 0, status: 'active' };
                const existingItem = tableOrder.items.find(item => item.productId === product.id);

                let newItems;
                if (existingItem) {
                    newItems = tableOrder.items.map(item =>
                        item.productId === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    newItems = [...tableOrder.items, {
                        id: crypto.randomUUID(),
                        productId: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                        timestamp: Date.now()
                    }];
                }

                const newTotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

                return {
                    orders: {
                        ...state.orders,
                        [tableId]: { ...tableOrder, items: newItems, total: newTotal }
                    }
                };
            }),

            removeFromTable: (tableId, productId) => set((state) => {
                const tableOrder = state.orders[tableId];
                if (!tableOrder) return state;

                const newItems = tableOrder.items.map(item =>
                    item.productId === productId
                        ? { ...item, quantity: Math.max(0, item.quantity - 1) }
                        : item
                ).filter(item => item.quantity > 0);

                const newTotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

                return {
                    orders: {
                        ...state.orders,
                        [tableId]: { ...tableOrder, items: newItems, total: newTotal }
                    }
                };
            }),

            clearTable: (tableId) => set((state) => {
                const newOrders = { ...state.orders };
                delete newOrders[tableId];
                return { orders: newOrders };
            }),

            getTableTotal: (tableId) => {
                return get().orders[tableId]?.total || 0;
            }
        }),
        {
            name: 'cart-storage',
        }
    )
);
