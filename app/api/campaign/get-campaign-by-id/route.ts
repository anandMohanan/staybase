import { db } from "@/db";
import { CAMPAIGNS_TABLE } from "@/db/schema/campaign";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import type { CampaignFormValues } from "@/lib/types/campaign";

// GET campaign by ID
export const POST = async (req: Request) => {
    try {
        const { campaignId } = await req.json();
        const campaign = await db
            .select({
                campaignId: CAMPAIGNS_TABLE.id,
                name: CAMPAIGNS_TABLE.name,
                description: CAMPAIGNS_TABLE.description,
                // New fields
                type: CAMPAIGNS_TABLE.type,
                priority: CAMPAIGNS_TABLE.priority,
                targetingRules: CAMPAIGNS_TABLE.targetingRules,
                sendingSchedule: CAMPAIGNS_TABLE.sendingSchedule,
                // Existing fields
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
        console.error("Error fetching campaign:", err);
        return new Response(JSON.stringify({ 
            error: err.message || "Failed to fetch campaign" 
        }), { 
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};

