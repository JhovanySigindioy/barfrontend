import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../../../utils/api';

export interface Expense {
    id: string | number;
    description: string;
    amount: number;
    category: string;
    date: string;
}

export const useExpenses = (month?: string) => {
    return useQuery({
        queryKey: ['expenses', month],
        queryFn: async () => {
            const url = new URL(`${API_BASE_URL}/expenses`);
            if (month) url.searchParams.append('month', month);

            const response = await fetch(url.toString());
            if (!response.ok) throw new Error('Error al cargar gastos');
            return response.json() as Promise<Expense[]>;
        }
    });
};

export const useAddExpense = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newExpense: Omit<Expense, 'id'>) => {
            const response = await fetch(`${API_BASE_URL}/expenses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newExpense),
            });
            if (!response.ok) throw new Error('Error al guardar gasto');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
        }
    });
};

export const useDeleteExpense = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string | number) => {
            const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error al eliminar gasto');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
        }
    });
};
