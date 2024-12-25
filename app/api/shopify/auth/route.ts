import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const shop = searchParams.get('shop');

    if (!shop) {
        return new NextResponse('Missing shop parameter', { status: 400 });
    }

    const scopes = [
        'read_customers',
        'write_customers',
        'read_orders',
        'write_orders',
        'read_products',
    ].join(',');

    const nonce = crypto.randomBytes(16).toString('hex');
    const authUrl = `https://${shop}/admin/oauth/authorize?` +
        new URLSearchParams({
            client_id: process.env.SHOPIFY_CLIENT_ID!,
            scope: scopes,
            redirect_uri: `${process.env.APP_URL}/api/shopify/callback`,
            state: nonce
        }).toString();

    return NextResponse.redirect(authUrl);
}
