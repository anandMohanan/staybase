
import { createShopifyClient } from '@/lib/shopify';
import { db } from '@/db';
import { integrations } from '@/db/schema/integration';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { secureCache } from '@/lib/redis';

const CUSTOMERS_QUERY = `
query GetCustomers {
  customers(first: 50) {
    edges {
      node {
        id
        firstName
        lastName
        email
        metafields(first: 10) {
          edges {
            node {
              key
              value
            }
          }
        }
        allOrders: orders(first: 250) {
          edges {
            node {
              totalPriceSet {
                shopMoney {
                  amount
                }
              }
            }
          }
        }
        lastOrder: orders(first: 1, reverse: true) {
          edges {
            node {
              createdAt
              totalPriceSet {
                shopMoney {
                  amount
                }
              }
            }
          }
        }
        recentOrders: orders(first: 10) {
          edges {
            node {
              createdAt
              totalPriceSet {
                shopMoney {
                  amount
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

export async function GET(req: Request) {
    try {
        const organization = await auth.api.listOrganizations({
            headers: await headers()
        });

        const cacheKey = `customers:${organization[0].id}`;
        const cachedData = await secureCache.get(cacheKey);
        if (cachedData) {
            console.log("From cache--------------------------------------", cachedData)
            return NextResponse.json(cachedData);
        }

        const integration = await db.select().from(integrations).where(
            eq(integrations.organizationId, organization[0].id)
        );

        if (integration.length === 0) {
            return NextResponse.json('Shopify not connected', { status: 400 });
        }

        if (integration.length >=0 && !integration[0].accessToken) {
            return NextResponse.json('Shopify not connected', { status: 400 });
        }

        const client = createShopifyClient(
            integration[0].shopDomain,
            integration[0].accessToken
        );

        const { data, errors } = await client.request(CUSTOMERS_QUERY);

        if (errors) {
            console.error('GraphQL Errors:', errors);
            throw new Error('GraphQL query failed');
        }


        const enrichedCustomers = data.customers.edges.map((edge: any) => {
            const customer = edge.node;
            const recentOrders = customer.recentOrders.edges.map((o: any) => o.node);
            const lastOrder = customer.lastOrder.edges[0]?.node;
            const allOrders = customer.allOrders.edges.map((o: any) => o.node);

            // Calculate total spent from all available orders
            const totalSpent = allOrders.reduce((sum: number, order: any) =>
                sum + parseFloat(order.totalPriceSet.shopMoney.amount), 0);

            const orderCount = allOrders.length;

            const daysSinceLastOrder = lastOrder
                ? Math.floor((Date.now() - new Date(lastOrder.createdAt).getTime()) / (1000 * 60 * 60 * 24))
                : 999;

            return {
                id: customer.id.split('/').pop(),
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                totalSpent,
                lastOrderDate: lastOrder?.createdAt,
                orderCount,
                riskScore: calculateRiskScore({
                    daysSinceLastOrder,
                    orderCount,
                    totalSpent,
                    averageOrderValue: totalSpent / (orderCount || 1)
                }),
                recentOrders: recentOrders.map((order: any) => ({
                    createdAt: order.createdAt,
                    total: parseFloat(order.totalPriceSet.shopMoney.amount)
                }))
            };
        });
        await secureCache.set(cacheKey, enrichedCustomers);

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
