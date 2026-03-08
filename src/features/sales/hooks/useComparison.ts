import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../../../utils/api';

export interface ComparisonData {
    monthly: Array<{
        period: string;
        revenue: string;
        orders: string;
    }>;
    weekly: Array<{
        period: string;
        revenue: string;
        orders: string;
    }>;
    categories: Array<{
        category: string;
        current_revenue: string;
        prev_revenue: string;
    }>;
}

export const useComparison = () => {
    return useQuery({
        queryKey: ['reports-comparison'],
        queryFn: async () => {
            const response = await fetch(`${API_BASE_URL}/reports/comparison`);
            if (!response.ok) throw new Error('Error al cargar comparativas');
            return response.json() as Promise<ComparisonData>;
        },
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};
