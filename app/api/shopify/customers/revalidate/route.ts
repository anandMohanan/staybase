import { auth } from '@/lib/auth';
import { secureCache } from '@/lib/redis';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const organization = await auth.api.listOrganizations({
            headers: await headers()
        });

        const cacheKey = `customers:${organization[0].id}`;
        await secureCache.delete(cacheKey);

        return NextResponse.json({ revalidated: true });
    } catch (error) {
        return NextResponse.json({ revalidated: false }, { status: 500 });
    }
}
