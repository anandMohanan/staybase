"use server";

import { db } from "@/db";
import { campaigns } from "@/db/schema/user";
import { auth } from "@/lib/auth";
import type { CampaignFormValues } from "@/lib/types/campaign";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export const createCampaign = async (campaignData: CampaignFormValues) => {
	try {
        console.log(campaignData)
        console.log(campaignData.startDate)
		const organization = await auth.api.listOrganizations({
			headers: await headers(),
		});
		const organizationId = organization?.[0]?.id;
		await db.insert(campaigns).values({
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
        revalidatePath('/dashboard/campaigns/active')
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
