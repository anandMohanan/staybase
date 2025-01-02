import { boolean, integer, json, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";

export const organization = pgTable("organization", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").unique(),
	logo: text("logo"),
	createdAt: timestamp("createdAt").notNull(),
	metadata: text("metadata"),
});

export const ORGANIZATION_SETTINGS_TABLE = pgTable("organization_settings", {
	organizationSettingsId: text("organization_settings_id").primaryKey(),
	organizationId: text("organization_id").references(() => organization.id),
	automaticCampaigns: boolean("automatic_campaigns").default(false),
	riskThreshold: text("risk_threshold").default("MEDIUM"),
	notificationPreferences: json("notification_preferences").$type<{
		email: boolean;
		inApp: boolean;
		digest: "DAILY" | "WEEKLY" | "MONTHLY" | "NONE";
	}>(),
	fromEmail: text("from_email").notNull(),
	autoArchiveDays: text("auto_archive_days").default("30"),
	customFields: json("custom_fields").$type<Record<string, string>>(),
	updatedAt: timestamp("updated_at").notNull(),
	createdAt: timestamp("created_at").notNull(),
	automaticDiscountOffers: boolean("automatic_discount_offers").default(false),
	enableDiscountRestrictions: boolean("enable_discount_restrictions").default(
		false,
	),
	maxDiscountPercentage: integer("max_discount_percentage").default(0),
	minPurchaseAmount: integer("min_purchase_amount").default(0),
	excludeDiscountedItems: boolean("exclude_discounted_items").default(false),
	limitOnePerCustomer: boolean("limit_one_per_customer").default(true),
});

export type OrganizationSettingsType =
	typeof ORGANIZATION_SETTINGS_TABLE.$inferSelect;
export type NewOrganizationSettings =
	typeof ORGANIZATION_SETTINGS_TABLE.$inferInsert;

export const member = pgTable("member", {
	id: text("id").primaryKey(),
	organizationId: text("organizationId")
		.notNull()
		.references(() => organization.id),
	userId: text("userId")
		.notNull()
		.references(() => user.id),
	role: text("role").notNull(),
	createdAt: timestamp("createdAt").notNull(),
});

export const invitation = pgTable("invitation", {
	id: text("id").primaryKey(),
	organizationId: text("organizationId")
		.notNull()
		.references(() => organization.id),
	email: text("email").notNull(),
	role: text("role"),
	status: text("status").notNull(),
	expiresAt: timestamp("expiresAt").notNull(),
	inviterId: text("inviterId")
		.notNull()
		.references(() => user.id),
});
