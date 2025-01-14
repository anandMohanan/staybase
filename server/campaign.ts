"use server";

import { db } from "@/db";
import { CAMPAIGN_EMAILS_TABLE, CAMPAIGNS_TABLE } from "@/db/schema/campaign";
import { auth } from "@/lib/auth";
import type { CampaignFormValues } from "@/lib/types/campaign";
import { calculatePriorityScore } from "@/lib/utils";
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
		const priorityScore = calculatePriorityScore({
			campaignType: campaignData.type,
			targetAudience: campaignData.targetAudience,
			// Add other factors as needed
		});
		await db.insert(CAMPAIGNS_TABLE).values({
			id: uuidv4(),
			name: campaignData.name,
			description: campaignData.description,

			// New fields
			type: campaignData.type || "NEWSLETTER", // Default type
			priority: campaignData.priority || "MEDIUM", // Default priority
			priorityScore: priorityScore,

			// Targeting and scheduling
			targetingRules: campaignData.targetingRules || {
				lastPurchaseRange: null,
				totalSpentRange: null,
				riskScoreRange: null,
				tags: [],
			},
			sendingSchedule: campaignData.sendingSchedule || {
				maxEmailsPerDay: null,
				preferredTimeOfDay: [],
				daysOfWeek: [],
				timezone: "UTC",
			},

			// Existing fields
			status: "DRAFT", // Changed from "ACTIVE" to "DRAFT" as initial state
			targetAudience: campaignData.targetAudience,
			startDate: campaignData.startDate,
			endDate: campaignData.endDate,
			isAutomated: campaignData.isAutomated,
			organizationId: organizationId,
			updatedAt: new Date(),
			createdAt: new Date(),

			// Initialize metrics
			reachCount: 0,
			engagementRate: 0,
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
		revalidatePath("/dashboard/");
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
		revalidatePath("/dashboard/campaigns/active");
		revalidatePath("/dashboard/");
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

export const changeCampaignStatus = async (
	campaignId: string,
	status: string,
) => {
	try {
		await db
			.update(CAMPAIGNS_TABLE)
			.set({ status: status })
			.where(eq(CAMPAIGNS_TABLE.id, campaignId));
		revalidatePath("/dashboard/campaigns/active");
		return {
			success: true,
			message: "Campaign status changed successfully",
		};
	} catch (error) {
		console.error("Error changing campaign status:", error);
		return {
			success: false,
			message:
				error instanceof Error
					? error.message
					: "Error changing campaign status",
			error: error instanceof Error ? error.toString() : "Unknown error",
		};
	}
};
