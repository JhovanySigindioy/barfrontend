import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

export interface RestockData {
    productId: number | string;
    quantity: number;
    unitCost: number;
}

export const useProducts = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
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

    const restockProduct = useMutation({
        mutationFn: async (data: RestockData) => {
            const response = await fetch(`${API_BASE_URL}/inventory/restock`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al actualizar inventario');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['reports'] }); // Refresh reports to show new expense
            queryClient.invalidateQueries({ queryKey: ['expenses'] }); // Refresh expenses list
        },
    });

    const voidMovement = useMutation({
        mutationFn: async (movementId: number) => {
            const response = await fetch(`${API_BASE_URL}/inventory/movements/${movementId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al anular movimiento');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['movements'] });
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
        },
    });

    const useMovements = (productId?: number) => {
        return useQuery({
            queryKey: ['movements', productId],
            queryFn: async () => {
                const url = productId
                    ? `${API_BASE_URL}/inventory/movements?productId=${productId}`
                    : `${API_BASE_URL}/inventory/movements`;
                const response = await fetch(url);
                if (!response.ok) throw new Error('No se pudieron cargar los movimientos');
                return response.json();
            }
        });
    };

    return {
        ...query,
        restockProduct,
        voidMovement,
        useMovements
    };
};
