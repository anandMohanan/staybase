import { NextResponse } from 'next/server';
import { secureCache } from '@/lib/redis';
import { headers } from 'next/headers';
import { verifyShopifyWebhook } from '@/lib/shopify';
import { db } from '@/db';
import { INTEGRATION_TABLE } from '@/db/schema/integration';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
    try {
        const headersList = await headers();
        const topic = headersList.get('x-shopify-topic') || '';
        const shopDomain = headersList.get('x-shopify-shop-domain') || '';
        const hmac = headersList.get('x-shopify-hmac-sha256') || '';

        // Get the raw body
        const rawBody = await req.text();

        // Verify webhook authenticity
        const integration = await db.select()
            .from(INTEGRATION_TABLE)
            .where(eq(INTEGRATION_TABLE.shopDomain, shopDomain))
            .limit(1);

        if (!integration.length) {
            return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
        }

        const isValid = verifyShopifyWebhook(rawBody, hmac, integration[0].webhookSecret);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
        }

        // Handle different webhook topics
        switch (topic) {
            case 'customers/create':
            case 'customers/update':
            case 'customers/delete':
            case 'orders/create':
            case 'orders/updated':
            case 'orders/cancelled':
                // Invalidate cache for this organization
                await secureCache.delete(`customers:${integration[0].organizationId}`);
                break;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
