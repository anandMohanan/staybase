import { z } from "zod";

export const campaignApiResponseSchema = z.object({
	campaignId: z.string(),
	name: z.string(),
	description: z.string(),
	targetAudience: z.enum(["HIGH_RISK", "MEDIUM_RISK", "LOW_RISK", "ALL"]),
	status: z.enum(["ACTIVE", "INACTIVE", "DRAFT", "COMPLETED"]),
	startDate: z.string(), // API sends dates as ISO strings
	endDate: z.string(),
	engagementRate: z.number(),
	reachCount: z.number(),
	isAutomated: z.boolean(),
});

const rangeSchema = z
	.object({
		min: z.number(),
		max: z.number(),
	})
	.nullable()
	.optional();

export const campaignFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	type: z.enum([
		"ABANDONED_CART",
		"WINBACK",
		"REENGAGEMENT",
		"LOYALTY_REWARD",
		"PRODUCT_UPDATE",
		"NEWSLETTER",
	]),
	priority: z.enum(["URGENT", "HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),

	// Targeting rules with nullable fields
	targetingRules: z
		.object({
			lastPurchaseRange: rangeSchema,
			totalSpentRange: rangeSchema,
			riskScoreRange: rangeSchema,
			tags: z.array(z.string()).optional().default([]),
		})
		.optional()
		.default({}),

	// Sending schedule with nullable fields
	sendingSchedule: z
		.object({
			maxEmailsPerDay: z.number().nullable().optional(),
			preferredTimeOfDay: z.array(z.string()).optional().default([]),
			daysOfWeek: z.array(z.number()).optional().default([]),
			timezone: z.string().optional().default("UTC"),
		})
		.optional()
		.default({}),

	// Existing fields
	targetAudience: z
		.enum(["HIGH_RISK", "MEDIUM_RISK", "LOW_RISK", "ALL"])
		.optional(),
	isAutomated: z.boolean().default(false),
	startDate: z.date().optional(),
	endDate: z.date().optional(),
});

export type CampaignFormValues = z.infer<typeof campaignFormSchema>;

export const MinimalCampaignSchema = z.array(
	z.object({
		campaignId: z.string(),
		name: z.string(),
		description: z.string().nullable(),
	}),
);

export type MinimalCampaignType = z.infer<typeof MinimalCampaignSchema>;
