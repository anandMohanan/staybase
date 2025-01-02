import { db } from "@/db";
import { INTEGRATION_TABLE } from "@/db/schema/integration";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const code = searchParams.get("code");
	const shop = searchParams.get("shop");
	if (!shop) {
		return new NextResponse("Missing shop parameter", { status: 400 });
	}

	try {
		// Exchange code for access token
		const tokenResponse = await fetch(
			`https://${shop}/admin/oauth/access_token`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					client_id: process.env.SHOPIFY_CLIENT_ID,
					client_secret: process.env.SHOPIFY_CLIENT_SECRET,
					code,
				}),
			},
		);

		const { access_token } = await tokenResponse.json();

		const organization = await auth.api.listOrganizations({
			headers: await headers(),
		});
		const webhookSecret = crypto.randomBytes(32).toString("hex");

		await db.insert(INTEGRATION_TABLE).values({
			accessToken: access_token,
			shopDomain: shop,
			status: "active",
			platform: "shopify",
			organizationId: organization[0].id,
			webhookSecret: webhookSecret,
		});

		return NextResponse.redirect(
			`${process.env.APP_URL}/dashboard/integrations`,
		);
	} catch (error) {
		console.error("Shopify integration error:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Integration failed";
		return new NextResponse(errorMessage, {
			status: 500,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
}
