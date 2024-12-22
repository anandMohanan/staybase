import { z } from 'zod';

export const CustomerSchema = z.object({
    id: z.number().or(z.string()),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    totalSpent: z.number().nonnegative(),
    lastOrderDate: z.string().datetime().nullish().optional(),
    orderCount: z.number().int().nonnegative(),
    riskScore: z.number().min(0).max(100)
});

export const CustomersResponseSchema = z.array(CustomerSchema);

export type Customer = z.infer<typeof CustomerSchema>;
