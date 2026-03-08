import { useQuery } from '@tanstack/react-query';

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    stock: number;
    image?: string;
}

const MOCK_PRODUCTS: Product[] = [
    { id: '1', name: 'Cerveza Club Colombia', price: 6500, category: 'Bebidas', stock: 24, image: 'https://cdn.iconscout.com/icon/free/png-256/free-beer-bottle-1437146-1216035.png' },
    { id: '2', name: 'Papas Margarita Pollo', price: 3500, category: 'Snacks', stock: 12 },
    { id: '3', name: 'Cerveza Aguila Light', price: 5500, category: 'Bebidas', stock: 48 },
    { id: '4', name: 'Patacones con Hogao', price: 8000, category: 'Snacks', stock: 3 },
    { id: '5', name: 'Cerveza BBC Monserrate', price: 9500, category: 'Bebidas', stock: 15 },
    { id: '6', name: 'Hamburguesa de la Casa', price: 22000, category: 'Comida', stock: 0 },
];

export const useProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));
            return MOCK_PRODUCTS;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
