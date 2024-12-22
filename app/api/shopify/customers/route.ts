import { db } from '@/db';
import { integrations } from '@/db/schema/integration';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        console.log("GET /api/shopify");
        const organization = await auth.api.listOrganizations({
            headers: await headers()
        })
        const integration = await db.select().from(integrations).where(
            eq(integrations.organizationId, organization[0].id)
        );

        if (!integration || !integration[0].accessToken) {
            return NextResponse.json('Shopify not connected', { status: 400 });
        }

        const response = await fetch(
            `https://${integration[0].shopDomain}/admin/api/2024-01/customers.json`,
            {
                headers: {
                    'X-Shopify-Access-Token': integration[0].accessToken,
                },
            }
        );

        const { customers } = await response.json();

        const enrichedCustomers = await Promise.all(
            customers.map(async (customer: any) => {
                console.log(customer.id, "--------------------------------------------------------------------------------customer")
                const ordersResponse = await fetch(
                    `https://${integration[0].shopDomain}/admin/api/2024-01/customers/${customer.id}/orders.json`,
                    {
                        headers: {
                            'X-Shopify-Access-Token': integration[0].accessToken,
                        },
                    }
                );
                console.log(ordersResponse, "--------------------------------------------------------------------------------ordersResponse")

                const { orders } = await ordersResponse.json();
                console.log(orders, "--------------------------------------------------------------------------------orders")

                // Calculate customer metrics
                const totalSpent = orders.reduce((sum: number, order: any) =>
                    sum + parseFloat(order.total_price), 0
                );

                const lastOrder = orders[0]; // Orders come sorted by date desc

                // Calculate risk score based on various factors
                const daysSinceLastOrder = lastOrder
                    ? Math.floor((Date.now() - new Date(lastOrder.created_at).getTime()) / (1000 * 60 * 60 * 24))
                    : 999;

                const riskScore = calculateRiskScore({
                    daysSinceLastOrder,
                    orderCount: orders.length,
                    totalSpent,
                    averageOrderValue: totalSpent / orders.length
                });

                return {
                    id: customer.id,
                    firstName: customer.first_name,
                    lastName: customer.last_name,
                    email: customer.email,
                    totalSpent,
                    lastOrderDate: lastOrder?.created_at,
                    orderCount: orders.length,
                    riskScore
                };
            })
        );

        return NextResponse.json(enrichedCustomers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        return NextResponse.json('Error fetching customers', { status: 500 });
    }
}

function calculateRiskScore({
    daysSinceLastOrder,
    orderCount,
    totalSpent,
    averageOrderValue
}: {
    daysSinceLastOrder: number;
    orderCount: number;
    totalSpent: number;
    averageOrderValue: number;
}): number {
    // Risk increases with days since last order
    const timeFactor = Math.min(daysSinceLastOrder / 90, 1) * 40;

    // Risk decreases with order count and total spent
    const valueFactor = Math.max(1 - (totalSpent / 5000), 0) * 30;
    const frequencyFactor = Math.max(1 - (orderCount / 10), 0) * 30;

    return Math.round(timeFactor + valueFactor + frequencyFactor);
}
