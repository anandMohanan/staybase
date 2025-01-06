import {
	boolean,
	decimal,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { organization } from "./organization";

export const CAMPAIGNS_TABLE = pgTable("campaigns", {
	id: varchar("id", { length: 255 }).primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
	status: varchar("status", { length: 50 }).notNull().default("DRAFT"), // DRAFT, ACTIVE, PAUSED, COMPLETED
	organizationId: text("organization_id").references(() => organization.id),
	targetAudience: varchar("target_audience", { length: 50 }),
	reachCount: integer("reach_count").default(0),
	engagementRate: integer("engagement_rate").default(0),
	isAutomated: boolean("is_automated").default(false),
	startDate: timestamp("start_date"),
	endDate: timestamp("end_date"),
	updatedAt: timestamp("updated_at").notNull(),
	createdAt: timestamp("created_at").notNull(),
});

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
	emailType: varchar("email_type", { length: 50 }).notNull(), // initial, followup, reminder
	content: text("content"),
	status: varchar("status", { length: 50 }).notNull().default("PENDING"), // PENDING, SENT, FAILED
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
	eventType: varchar("event_type", { length: 50 }).notNull(), // delivered, opened, clicked, bounced, complained
	metadata: jsonb("metadata").default({}),
	occurredAt: timestamp("occurred_at").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});
