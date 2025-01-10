"use server";

import { db } from "@/db";
import { CAMPAIGN_EMAILS_TABLE, CAMPAIGNS_TABLE } from "@/db/schema/campaign";
import { auth } from "@/lib/auth";
import type { CampaignFormValues } from "@/lib/types/campaign";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export const createCampaign = async (campaignData: CampaignFormValues) => {
    try {
        console.log(campaignData);
        console.log(campaignData.startDate);
        const organization = await auth.api.listOrganizations({
            headers: await headers(),
        });
        const organizationId = organization?.[0]?.id;
        await db.insert(CAMPAIGNS_TABLE).values({
            id: uuidv4(),
            name: campaignData.name,
            status: "ACTIVE",
            description: campaignData.description,
            targetAudience: campaignData.targetAudience,
            startDate: campaignData.startDate,
            endDate: campaignData.endDate,
            isAutomated: campaignData.isAutomated,
            organizationId: organizationId,
            updatedAt: new Date(),
            createdAt: new Date(),
        });
        revalidatePath("/dashboard/campaigns/active");
        return {
            success: true,
            message: "Campaign created successfully",
        };
    } catch (error) {
        console.error("Error creating campaign:", error);
        return {
            success: false,
            message:
                error instanceof Error ? error.message : "Error creating campaign",
            error: error instanceof Error ? error.toString() : "Unknown error",
        };
    }
};

export const deleteCampaign = async (campaignId: string) => {
    try {
        await db
            .delete(CAMPAIGN_EMAILS_TABLE)
            .where(eq(CAMPAIGN_EMAILS_TABLE.campaignId, campaignId));
        await db.delete(CAMPAIGNS_TABLE).where(eq(CAMPAIGNS_TABLE.id, campaignId));
        revalidatePath("/dashboard/campaigns/active");
        return {
            success: true,
            message: "Campaign deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting campaign:", error);
        return {
            success: false,
            message:
                error instanceof Error ? error.message : "Error deleting campaign",
            error: error instanceof Error ? error.toString() : "Unknown error",
        };
    }
};

export const updateCampaign = async (
    campaignId: string,
    campaignData: CampaignFormValues,
) => {
    try {
        await db
            .update(CAMPAIGNS_TABLE)
            .set(campaignData)
            .where(eq(CAMPAIGNS_TABLE.id, campaignId));
        return {
            success: true,
            message: "Campaign updated successfully",
        };
    } catch (error) {
        console.error("Error updating campaign:", error);
        return {
            success: false,
            message:
                error instanceof Error ? error.message : "Error updating campaign",
            error: error instanceof Error ? error.toString() : "Unknown error",
        };
    }
};
