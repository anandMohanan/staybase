import { z } from "zod";

export const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	image: z.string().nullable().optional(),
});

export const OrganizationMemberSchema = z.object({
	id: z.string(),
	organizationId: z.string(),
	userId: z.string(),
	role: z.enum(["owner", "admin", "member"]),
	createdAt: z.date(),
	user: UserSchema,
});

export const OrganizationSchema = z.object({
	id: z.string(),
	name: z.string(),
	slug: z.string(),
	logo: z.null().optional(),
	createdAt: z.date(),
	metadata: z.null().optional(),
	invitations: z.array(z.unknown()),
	members: z.array(OrganizationMemberSchema),
});

export const TableOrganizationSchema = z.object({
	id: z.string(),
	name: z.string(),
	role: z.enum(["admin", "owner", "member"]),
	email: z.string().email(),
	image: z.string().nullable().optional(),
});

export type RawOrganization = z.infer<typeof OrganizationSchema>;
export type TableOrganization = z.infer<typeof TableOrganizationSchema>;

export const settingsFormSchema = z.object({
	automaticCampaigns: z.boolean().default(false),
	riskThreshold: z.enum(["LOW", "MEDIUM", "HIGH"]),
	notificationPreferences: z.object({
		email: z.boolean(),
		inApp: z.boolean(),
		digest: z.enum(["DAILY", "WEEKLY", "MONTHLY", "NONE"]),
	}),
	autoArchiveDays: z.enum(["7", "14", "30", "60", "90"]),
	fromEmail: z.string().email("Invalid email address"),
	automaticDiscountOffers: z.boolean().default(false),
	enableDiscountRestrictions: z.boolean().default(false),
	maxDiscountPercentage: z.number().default(0),
	minPurchaseAmount: z.number().default(0),
	excludeDiscountedItems: z.boolean().default(false),
	limitOnePerCustomer: z.boolean().default(true),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;
