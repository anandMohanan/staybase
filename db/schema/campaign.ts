import {
	boolean,
	decimal,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	varchar,
	pgEnum,
} from "drizzle-orm/pg-core";
import { organization } from "./organization";

// Define enums for campaign management
export const campaignPriorityEnum = pgEnum("campaign_priority", [
	"URGENT",
	"HIGH",
	"MEDIUM",
	"LOW",
]);

export const campaignTypeEnum = pgEnum("campaign_type", [
	"ABANDONED_CART",
	"WINBACK",
	"REENGAGEMENT",
	"LOYALTY_REWARD",
	"PRODUCT_UPDATE",
	"NEWSLETTER",
]);

export const campaignStatusEnum = pgEnum("campaign_status", [
	"DRAFT",
	"SCHEDULED",
	"ACTIVE",
	"PAUSED",
	"COMPLETED",
	"ARCHIVED",
]);

export const CAMPAIGNS_TABLE = pgTable("campaigns", {
	id: varchar("id", { length: 255 }).primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),

	// Status and Type
	status: campaignStatusEnum("status").notNull().default("DRAFT"),
	type: campaignTypeEnum("type"),

	// Priority Fields
	priority: campaignPriorityEnum("priority").default("MEDIUM"),
	priorityScore: integer("priority_score").default(0),

	// Organization and Targeting
	organizationId: text("organization_id").references(() => organization.id),
	targetAudience: varchar("target_audience", { length: 50 }),
	targetingRules: jsonb("targeting_rules").default({
		lastPurchaseRange: null,
		totalSpentRange: null,
		riskScoreRange: null,
		tags: [],
	}),

	// Metrics
	reachCount: integer("reach_count").default(0),
	engagementRate: integer("engagement_rate").default(0),

	// Automation and Schedule
	isAutomated: boolean("is_automated").default(false),
	sendingSchedule: jsonb("sending_schedule").default({
		maxEmailsPerDay: null,
		preferredTimeOfDay: [],
		daysOfWeek: [],
		timezone: "UTC",
	}),

	// Dates
	startDate: timestamp("start_date"),
	endDate: timestamp("end_date"),
	updatedAt: timestamp("updated_at").notNull(),
	createdAt: timestamp("created_at").notNull(),

	// Campaign Metrics
	metrics: jsonb("metrics").default({
		emailsSent: 0,
		opened: 0,
		clicked: 0,
		converted: 0,
		unsubscribed: 0,
	}),
});

// Rest of your existing tables remain the same
export const CUSTOMERS_TABLE = pgTable("customers", {
	id: text("id").primaryKey(),
	customerId: text("customer_id").notNull(),
	email: text("email").notNull(),
	name: text("name").notNull(),
	lastOrderDate: timestamp("last_order_date").notNull(),
	totalOrders: integer("total_orders").notNull(),
	totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).notNull(),
	organizationId: text("organization_id").references(() => organization.id),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const CAMPAIGN_EMAILS_TABLE = pgTable("campaign_emails", {
	id: varchar("id", { length: 255 }).primaryKey(),
	campaignId: varchar("campaign_id", { length: 255 })
		.notNull()
		.references(() => CAMPAIGNS_TABLE.id),
	customerEmail: varchar("customer_email", { length: 255 }).notNull(),
	emailType: varchar("email_type", { length: 50 }).notNull(),
	content: text("content"),
	status: varchar("status", { length: 50 }).notNull().default("PENDING"),
	scheduledFor: timestamp("scheduled_for").notNull(),
	sentAt: timestamp("sent_at"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const EMAIL_EVENTS_TABLE = pgTable("email_events", {
	id: varchar("id", { length: 255 }).primaryKey(),
	emailId: varchar("email_id", { length: 255 })
		.notNull()
		.references(() => CAMPAIGN_EMAILS_TABLE.id),
	eventType: varchar("event_type", { length: 50 }).notNull(),
	metadata: jsonb("metadata").default({}),
	occurredAt: timestamp("occurred_at").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});
