import { createAdminApiClient } from '@shopify/admin-api-client';
import { LATEST_API_VERSION } from '@shopify/shopify-api';
import crypto from 'crypto';

export function createShopifyClient(shopDomain: string, accessToken: string) {
    return createAdminApiClient({
        storeDomain: shopDomain,
        accessToken: accessToken,
        apiVersion: LATEST_API_VERSION
    });
}



export function verifyShopifyWebhook(rawBody: string, hmac: string, secret: string): boolean {
    const calculatedHmac = crypto
        .createHmac('sha256', secret)
        .update(rawBody, 'utf8')
        .digest('base64');

    return crypto.timingSafeEqual(
        Buffer.from(hmac),
        Buffer.from(calculatedHmac)
    );
}


export async function registerWebhooks(shop: string, accessToken: string) {
    const client = createShopifyClient(shop, accessToken);

    const webhooks = [
        { topic: 'customers/create' },
        { topic: 'customers/update' },
        { topic: 'customers/delete' },
        { topic: 'orders/create' },
        { topic: 'orders/updated' },
        { topic: 'orders/cancelled' }
    ];

    const WEBHOOK_QUERY = `
        mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $webhookUrl: URL!) {
            webhookSubscriptionCreate(topic: $topic, webhookSubscription: {
                callbackUrl: $webhookUrl,
                format: JSON
            }) {
                webhookSubscription {
                    id
                }
                userErrors {
                    field
                    message
                }
            }
        }
    `;

    for (const { topic } of webhooks) {
        try {
            await client.request(WEBHOOK_QUERY, {
                topic,
                webhookUrl: `${process.env.APP_URL}/api/shopify/webhooks`
            });
        } catch (error) {
            console.error(`Failed to register ${topic} webhook:`, error);
        }
    }
}
