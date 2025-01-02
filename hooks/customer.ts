import { CustomersResponseSchema } from "@/lib/types/customer";
import { useQuery } from "@tanstack/react-query";

export const useCustomer = () => {
    return useQuery({
        queryKey: ['customers'],
        queryFn: async () => {
            try {
                const response = await fetch('/api/shopify/customers');
                console.log(response, "response")
                if (!response.ok) {
                    throw new Error(`API error: ${response.text}`);
                }
                const rawData = await response.json();
                const parsedData = CustomersResponseSchema.safeParse(rawData);

                if (!parsedData.success) {
                    console.error('Validation error:', parsedData.error);
                    throw new Error('Invalid data received from API');
                }
                return parsedData.data;
            } catch (error) {
                console.error('Error fetching customers:', error);
                throw error;
            }
        },
        gcTime: 1000 * 60 * 60 * 24,
        staleTime: 1000 * 60 * 15,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchInterval: 1000 * 60 * 5,
    });
}


export const useCustomerDetails = (customerId: string) => {

    return useQuery({
        queryKey: ['customer-details', customerId],
        queryFn: async () => {
            try {
                const response = await fetch(`/api/shopify/customers/${customerId}/details`);
                console.log(response, "response")
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data, "data")
                return data;
            } catch (error) {
                console.error('Error fetching customer details:', error);
                throw error;
            }
        },
        enabled: !!customerId,
        staleTime: 1000 * 60 * 15,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    })

}
