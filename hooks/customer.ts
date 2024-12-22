import { CustomersResponseSchema } from "@/lib/types/customer";
import { useQuery } from "@tanstack/react-query";

export const useCustomer = () => {
    return useQuery({
        queryKey: ['customers'],
        queryFn: async () => {
            try {
                const response = await fetch('/api/shopify/customers');
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }
                const rawData = await response.json();
                const parsedData = CustomersResponseSchema.safeParse(rawData);

                if (!parsedData.success) {
                    console.error('Validation error:', parsedData.error);
                    throw new Error('Invalid data received from API');
                }
                return parsedData.data;
            } catch (error) {
                throw error;
            }
        },
        gcTime: 1000 * 60 * 60 * 24,
        staleTime: 1000 * 60 * 15,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchInterval: 1000 * 60 * 5,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
} 
