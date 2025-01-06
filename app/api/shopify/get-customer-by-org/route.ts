import { createShopifyClient } from "@/lib/shopify";
import { db } from "@/db";
import { INTEGRATION_TABLE } from "@/db/schema/integration";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { secureCache } from "@/lib/redis";
import { CUSTOMERS_TABLE } from "@/db/schema/campaign";
import { request } from "http";

interface EnrichedCustomer {
	id: string;
	firstName?: string;
	lastName?: string;
	email: string;
	totalSpent: number;
	lastOrderDate: string | null;
	orderCount: number;
	riskScore: number;
	recentOrders: Array<{
		createdAt: string;
		total: number;
	}>;
	source: "shopify" | "database";
}

const CUSTOMERS_QUERY = `
query GetCustomers {
  customers(first: 50) {
    edges {
      node {
        id
        firstName
        lastName
        email
          defaultAddress {
          address1
          city
          province
          country
          zip
        }
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

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		console.log(body);
		const { organizationId } = body;
		if (!organizationId) {
			return NextResponse.json("No organization found", { status: 404 });
		}

		const cacheKey = `customers:${organizationId}`;
		const cachedData = await secureCache.get(cacheKey);
		if (cachedData) {
			return NextResponse.json(cachedData);
		}

		const dbCustomers = await db
			.select()
			.from(CUSTOMERS_TABLE)
			.where(eq(CUSTOMERS_TABLE.organizationId, organizationId));

		const enrichedDbCustomers: EnrichedCustomer[] = dbCustomers.map(
			(customer) => ({
				id: customer.customerId,
				email: customer.email,
				firstName: customer.name.split(" ")[0],
				lastName: customer.name.split(" ").slice(1).join(" "),
				totalSpent: Number(customer.totalSpent),
				lastOrderDate: customer.lastOrderDate?.toISOString() || null,
				orderCount: customer.totalOrders,
				riskScore: calculateRiskScore({
					daysSinceLastOrder: customer.lastOrderDate
						? Math.floor(
								(Date.now() - new Date(customer.lastOrderDate).getTime()) /
									(1000 * 60 * 60 * 24),
							)
						: 999,
					orderCount: customer.totalOrders,
					totalSpent: Number(customer.totalSpent),
					averageOrderValue:
						Number(customer.totalSpent) / (customer.totalOrders || 1),
				}),
				recentOrders: [], // Database customers might not have recent orders detail
				source: "database",
			}),
		);

		const integration = await db
			.select()
			.from(INTEGRATION_TABLE)
			.where(eq(INTEGRATION_TABLE.organizationId, organizationId));

		let enrichedShopifyCustomers: EnrichedCustomer[] = [];

		if (integration.length > 0 && integration[0].accessToken) {
			const client = createShopifyClient(
				integration[0].shopDomain,
				integration[0].accessToken,
			);

			const { data, errors } = await client.request(CUSTOMERS_QUERY);

			if (errors) {
				console.error("GraphQL Errors:", errors);
				throw new Error("GraphQL query failed");
			}

			enrichedShopifyCustomers = data.customers.edges.map((edge: any) => {
				const customer = edge.node;
				const recentOrders = customer.recentOrders.edges.map(
					(o: any) => o.node,
				);
				const lastOrder = customer.lastOrder.edges[0]?.node;
				const allOrders = customer.allOrders.edges.map((o: any) => o.node);

				const totalSpent = allOrders.reduce(
					(sum: number, order: any) =>
						sum + Number.parseFloat(order.totalPriceSet.shopMoney.amount),
					0,
				);

				const orderCount = allOrders.length;

				const daysSinceLastOrder = lastOrder
					? Math.floor(
							(Date.now() - new Date(lastOrder.createdAt).getTime()) /
								(1000 * 60 * 60 * 24),
						)
					: 999;
				console.log(customer, "customer from shopify");

				return {
					id: customer.id.split("/").pop(),
					firstName: customer.firstName,
					lastName: customer.lastName,
					email: customer.email,
					totalSpent,
					lastOrderDate: lastOrder?.createdAt || null,
					orderCount,
					riskScore: calculateRiskScore({
						daysSinceLastOrder,
						orderCount,
						totalSpent,
						averageOrderValue: totalSpent / (orderCount || 1),
					}),
					recentOrders: recentOrders.map((order: any) => ({
						createdAt: order.createdAt,
						total: Number.parseFloat(order.totalPriceSet.shopMoney.amount),
					})),
					source: "shopify" as const,
				};
			});
		}

		const combinedCustomers = mergeCustomers(
			enrichedDbCustomers,
			enrichedShopifyCustomers,
		);

		await secureCache.set(cacheKey, combinedCustomers);

		return NextResponse.json(combinedCustomers);
	} catch (error) {
		console.error("Error fetching customers:", error);
		return NextResponse.json("Error fetching customers", { status: 500 });
	}
}

function calculateRiskScore({
	daysSinceLastOrder,
	orderCount,
	totalSpent,
	averageOrderValue,
}: {
	daysSinceLastOrder: number;
	orderCount: number;
	totalSpent: number;
	averageOrderValue: number;
}): number {
	// Risk increases with days since last order
	const timeFactor = Math.min(daysSinceLastOrder / 90, 1) * 40;

	// Risk decreases with order count and total spent
	const valueFactor = Math.max(1 - totalSpent / 5000, 0) * 30;
	const frequencyFactor = Math.max(1 - orderCount / 10, 0) * 30;

	return Math.round(timeFactor + valueFactor + frequencyFactor);
}

function mergeCustomers(
	dbCustomers: EnrichedCustomer[],
	shopifyCustomers: EnrichedCustomer[],
): EnrichedCustomer[] {
	const emailMap = new Map<string, EnrichedCustomer>();

	dbCustomers.forEach((customer) => {
		emailMap.set(customer.email.toLowerCase(), customer);
	});

	shopifyCustomers.forEach((shopifyCustomer) => {
		const email = shopifyCustomer.email.toLowerCase();
		const existingCustomer = emailMap.get(email);

		if (existingCustomer) {
			emailMap.set(email, {
				...existingCustomer,
				...shopifyCustomer,
				totalSpent: Math.max(
					existingCustomer.totalSpent,
					shopifyCustomer.totalSpent,
				),
				orderCount: Math.max(
					existingCustomer.orderCount,
					shopifyCustomer.orderCount,
				),
				riskScore: Math.min(
					existingCustomer.riskScore,
					shopifyCustomer.riskScore,
				),
			});
		} else {
			emailMap.set(email, shopifyCustomer);
		}
	});

	return Array.from(emailMap.values());
}
