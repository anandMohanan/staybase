import { z } from "zod";

export const campaignFormSchema = z.object({
	name: z.string().min(2, {
		message: "Campaign name must be at least 2 characters.",
	}),
	description: z.string().min(10, {
		message: "Description must be at least 10 characters.",
	}),
	targetAudience: z.enum(["HIGH_RISK", "MEDIUM_RISK", "LOW_RISK", "ALL"], {
		required_error: "Please select a target audience.",
	}),
	riskLevel: z.enum(["HIGH", "MEDIUM", "LOW"], {
		required_error: "Please select a risk level.",
	}),
	startDate: z.date({
		required_error: "Please select a start date.",
	}),
	endDate: z
		.date({
			required_error: "Please select an end date.",
		})
		.refine((date) => date > new Date(), {
			message: "End date must be in the future",
		}),
	isAutomated: z.boolean().default(false),
});

export type CampaignFormValues = z.infer<typeof campaignFormSchema>;

export const MinimalCampaignSchema = z.array(z.object({
	campaignId: z.string(),
	name: z.string(),
	description: z.string().nullable(),
}));

export type MinimalCampaignType = z.infer<typeof MinimalCampaignSchema>;
