import { db } from "@/db";
import { INTEGRATION_TABLE } from "@/db/schema/integration";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const POST = async () => {
	try {
		const organization = await auth.api.listOrganizations({
			headers: await headers(),
		});

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
			.delete(INTEGRATION_TABLE)
			.where(eq(INTEGRATION_TABLE.id, integrationData[0].id));
		revalidatePath("/dashboard/integrations");

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error) {
		return new Response(error.message, { status: 500 });
	}
};
