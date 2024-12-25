import { auth } from "@/lib/auth"
import { columns } from "./columns"
import { db } from "@/db"
import { eq } from "drizzle-orm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { campaigns } from "@/db/schema/user"
import { headers } from "next/headers"
import { CampaignTable } from "./data-table"
import { CampaignCreationDialog } from "@/components/campaign/create-campaign"

export default async function ActiveCampaignsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    // Fetch active campaigns

    const activeCampaigns = await db.select().from(campaigns).where(
        eq(campaigns.organizationId, session?.session.activeOrganizationId!)
    )
    // Calculate summary metrics
    const totalReach = activeCampaigns.reduce((sum, campaign) => sum + campaign.reachCount, 0)
    const avgEngagement = activeCampaigns.reduce((sum, campaign) => sum + campaign.engagementRate, 0) / activeCampaigns.length

    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Active Campaigns</h1>
                    <p className="text-muted-foreground">
                        Monitor and manage your currently running campaigns.
                    </p>
                </div>
                <CampaignCreationDialog />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
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
                        <div className="text-2xl font-bold">{totalReach.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgEngagement.toFixed(1)}%</div>
                    </CardContent>
                </Card>
            </div>
            <h1>hii</h1>
            <CampaignTable data={activeCampaigns} columns={columns} />

        </div>
    )
}

