import { db } from "@/db";
import { CAMPAIGNS_TABLE } from "@/db/schema/campaign";
import { eq } from "drizzle-orm";

export const POST = async (req: Request) => {
    try {
        const { campaignId } = await req.json();
        const campaign = await db
            .select({
                campaignId: CAMPAIGNS_TABLE.id,
                name: CAMPAIGNS_TABLE.name,
                description: CAMPAIGNS_TABLE.description,
                targetAudience: CAMPAIGNS_TABLE.targetAudience,
                status: CAMPAIGNS_TABLE.status,
                startDate: CAMPAIGNS_TABLE.startDate,
                endDate: CAMPAIGNS_TABLE.endDate,
                engagementRate: CAMPAIGNS_TABLE.engagementRate,
                reachCount: CAMPAIGNS_TABLE.reachCount,
                isAutomated: CAMPAIGNS_TABLE.isAutomated,
            })
            .from(CAMPAIGNS_TABLE)
            .where(eq(CAMPAIGNS_TABLE.id, campaignId))
            .limit(1);

        console.log(campaign, "campaign by id");

        return new Response(JSON.stringify(campaign), { status: 200 });
    } catch (err: any) {
        return new Response(err.message, { status: 500 });
    }
};
