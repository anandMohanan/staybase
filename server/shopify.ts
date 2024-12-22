"use server"
import '@shopify/shopify-api/adapters/node';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';


const shopify = shopifyApi({
    apiKey: process.env.SHOPIFY_CLIENT_ID,
    apiSecretKey: process.env.SHOPIFY_CLIENT_SECRET!,
    scopes: [
        'read_customers',
        'write_customers',
        'read_orders',
        'write_orders',
        'read_products'
    ],
    hostName: process.env.APP_URL!,
    apiVersion: LATEST_API_VERSION,
    isEmbeddedApp: true,
})
