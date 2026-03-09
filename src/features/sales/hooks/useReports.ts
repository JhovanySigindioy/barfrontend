import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../../../utils/api';

export interface ReportData {
    summary: {
        total_revenue: string;
        total_orders: string;
        average_ticket: string;
        total_cost: string;
        total_expenses: string;
    };
    payments: Array<{
        payment_method: string;
        count: string;
        amount: string;
    }>;
    topProducts?: Array<{
        name: string;
        total_quantity: string;
        total_revenue: string;
    }>;
    monthlyTrend?: Array<{
        month: string;
        revenue: string;
        orders: string;
    }>;
}

export const useReports = (period: 'day' | 'week' | 'month' | 'total' = 'total') => {
    return useQuery({
        queryKey: ['reports', period],
        queryFn: async () => {
            const response = await fetch(`${API_BASE_URL}/reports?period=${period}`);
            if (!response.ok) throw new Error('Error al cargar reportes');
            return response.json() as Promise<ReportData>;
        },
        staleTime: 0, // Keep reports fresh
    });
};
