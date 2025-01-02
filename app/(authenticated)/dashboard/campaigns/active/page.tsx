import { CampaignCreationDialog } from "@/components/campaign/create-campaign";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { CAMPAIGNS_TABLE } from "@/db/schema/campaign";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { columns } from "./columns";
import { CampaignTable } from "./data-table";

export default async function ActiveCampaignsPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.session.activeOrganizationId) {
		redirect("/dashboard/create-organization");
	}

	const allCampaigns = await db
		.select()
		.from(CAMPAIGNS_TABLE)
		.where(
			eq(CAMPAIGNS_TABLE.organizationId, session?.session.activeOrganizationId),
		);

	const activeCampaigns = allCampaigns.filter(
		(campaign) => campaign.status === "active",
	);
	const totalReach = activeCampaigns.reduce(
		(sum, campaign) => sum + campaign.reachCount,
		0,
	);
	const avgEngagement =
		activeCampaigns.reduce(
			(sum, campaign) => sum + campaign.engagementRate,
			0,
		) / allCampaigns.length;

	return (
		<div className="container mx-auto py-10">
			<div className="flex items-center justify-between mb-8">
				<div className="space-y-1">
					<h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
					<p className="text-muted-foreground">
						Monitor and manage your campaigns.
					</p>
				</div>
				<CampaignCreationDialog />
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Active Campaigns
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{activeCampaigns.length}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Reach</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{totalReach.toLocaleString()}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Avg. Engagement
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{avgEngagement.toFixed(1)}%
						</div>
					</CardContent>
				</Card>
			</div>
			<CampaignTable data={allCampaigns} columns={columns} />
		</div>
	);
}
