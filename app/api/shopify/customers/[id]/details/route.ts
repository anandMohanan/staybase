import { createShopifyClient } from '@/lib/shopify';
import { db } from '@/db';
import { integrations } from '@/db/schema/integration';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log('Fetching details for customer:', params.id);
        const { id: customerId } = await params;
        if (!customerId) {
            return NextResponse.json({ error: 'Missing customer ID' }, { status: 400 });
        }
        console.log('Customer ID:', customerId);

        const organization = await auth.api.listOrganizations({
            headers: await headers()
        });

        const integration = await db.select().from(integrations).where(
            eq(integrations.organizationId, organization[0].id)
        );

        if (!integration[0]) {
            return NextResponse.json({ error: 'No integration found' }, { status: 404 });
        }

        const client = createShopifyClient(
            integration[0].shopDomain,
            integration[0].accessToken
        );

        console.log(`gid://shopify/Customer/${customerId}`);
        const { data, errors } = await client.request(
            `query GetCustomerDetails($id: ID!) {
        customer(id: $id) {
            id
            firstName
            lastName
            email
            phone
            createdAt
            taxExempt
            tags
            emailMarketingConsent {
                marketingState
                consentUpdatedAt
            }
            addresses {
                address1
                address2
                city
                province
                country
                zip
            }
            orders(first: 10) {
                edges {
                    node {
                        id
                        name
                        createdAt
                        totalPriceSet {
                            shopMoney {
                                amount
                            }
                        }
                        displayFulfillmentStatus
                        displayFinancialStatus
                    }
                }
            }
        }
    }`,
            {
                id: `gid://shopify/Customer/8723459932275` 

            }
        );

        if (errors) {
            console.error('GraphQL Errors:', errors);
            return NextResponse.json({ errors }, { status: 400 });
        }

        return NextResponse.json(data.customer);

    } catch (error) {
        console.error('Error fetching customer details:', error);
        return NextResponse.json(
            { error: 'Failed to fetch customer details' },
            { status: 500 }
        );
    }
}
