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

export const campaignFormSchema = z.object({
    name: z.string().min(2, {
        message: "Campaign name must be at least 2 characters.",
    }),
    description: z.string(),
    targetAudience: z.enum(["HIGH_RISK", "MEDIUM_RISK", "LOW_RISK", "ALL"], {
        required_error: "Please select a target audience.",
    }),
    startDate: z.date({
        required_error: "Please select a start date.",
    }),
    endDate: z.date({
        required_error: "Please select an end date.",
    }),
    isAutomated: z.boolean().default(false),
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
