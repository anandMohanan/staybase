import { db } from "@/db";
import { INTEGRATION_TABLE } from "@/db/schema/integration";
import { auth } from "@/lib/auth";
import { secureCache } from "@/lib/redis";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const organization = await auth.api.listOrganizations({
			headers: await headers(),
		});

		const cacheKey = `customers:${organization[0].id}`;
		await secureCache.delete(cacheKey);

		const integrationData = await db
			.select()
			.from(INTEGRATION_TABLE)
			.where(
				and(
					eq(INTEGRATION_TABLE.organizationId, organization[0].id),
					eq(INTEGRATION_TABLE.platform, "shopify"),
				),
			);

		await db
			.update(INTEGRATION_TABLE)
			.set({
				lastSync: new Date(),
			})
			.where(eq(INTEGRATION_TABLE.id, integrationData[0].id));

		revalidatePath("/dashboard/integrations");

		return NextResponse.json({ revalidated: true });
	} catch (error) {
		return NextResponse.json({ revalidated: false }, { status: 500 });
	}
}
