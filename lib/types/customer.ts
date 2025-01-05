import { z } from "zod";

export const CustomerSchema = z.object({
    id: z.number().or(z.string()),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    totalSpent: z.number().nonnegative(),
    lastOrderDate: z.string().datetime().nullish().optional(),
    orderCount: z.number().int().nonnegative(),
    riskScore: z.number().min(0).max(100),
    source: z.string(),
});

export const CustomersResponseSchema = z.array(CustomerSchema);

export type Customer = z.infer<typeof CustomerSchema>;

export interface RawCustomerData {
    name: string;
    email: string;
    total_orders: number | string;
    total_spent: number | string;
    last_order_date: Date | string;
}

export interface ProcessedCustomerData {
    organizationId: string;
    name: string;
    email: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: Date;
    customerId: string;
}

export interface UploadResponse {
    success: boolean;
    message: string;
    error?: string;
}
