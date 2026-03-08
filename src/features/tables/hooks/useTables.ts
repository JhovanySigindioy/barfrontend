import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../../../utils/api';
import { type BarTable } from '../types';

export const useTables = () => {
    return useQuery({
        queryKey: ['tables'],
        queryFn: async () => {
            const response = await fetch(`${API_BASE_URL}/tables`);
            if (!response.ok) {
                throw new Error('No se pudieron cargar las mesas');
            }
            return response.json() as Promise<BarTable[]>;
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
};
