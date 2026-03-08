import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../../../utils/api';

export interface Product {
    id: string | number;
    name: string;
    price: number;
    cost_price: number;
    category: string;
    stock: number;
    image?: string;
}

export const useProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await fetch(`${API_BASE_URL}/inventory`);
            if (!response.ok) {
                throw new Error('No se pudieron cargar los productos');
            }
            return response.json() as Promise<Product[]>;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
