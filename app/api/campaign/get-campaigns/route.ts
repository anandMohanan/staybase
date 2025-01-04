import { db } from "@/db";
import { auth } from "../../../../lib/auth";
import { headers } from "next/headers";
import { CAMPAIGNS_TABLE } from "@/db/schema/campaign";
import { eq } from "drizzle-orm";

export const GET = async (req: Request) => {
	try {
		const organization = await auth.api.listOrganizations({
			headers: await headers(),
		});
		const organizationId = organization[0].id;
		if (!organizationId) {
			return new Response("No organization found", { status: 404 });
		}
		const campaigns = await db
			.select({
				campaignId: CAMPAIGNS_TABLE.id,
				name: CAMPAIGNS_TABLE.name,
				description: CAMPAIGNS_TABLE.description,
			})
			.from(CAMPAIGNS_TABLE)
			.where(eq(CAMPAIGNS_TABLE.organizationId, organizationId));

		return new Response(JSON.stringify(campaigns), { status: 200 });
	} catch (err: any) {
		return new Response(err.message, { status: 500 });
	}
};
