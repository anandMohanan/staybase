import { db } from '@/db';
import { integrations } from '@/db/schema/integration';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const shop = searchParams.get('shop');

    try {
        // Exchange code for access token
        const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: process.env.SHOPIFY_CLIENT_ID,
                client_secret: process.env.SHOPIFY_CLIENT_SECRET,
                code
            })
        });

        const { access_token } = await tokenResponse.json();
        console.log(access_token, "----------------------------------------------------------------")

        const organization = await auth.api.listOrganizations({
            headers: await headers()
        })

        await db.insert(integrations)
            .values({
                accessToken: access_token,
                shopDomain: shop!,
                status: 'active',
                platform: 'shopify',
                organizationId: organization[0].id
            })


        return NextResponse.redirect(`${process.env.APP_URL}/dashboard/integrations`);
    } catch (error) {
        console.error('Shopify integration error:', error);
        return new NextResponse('Integration failed', { status: 500 });
    }
}
