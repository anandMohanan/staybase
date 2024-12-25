import {
    pgTable,
    text,
    timestamp,
    boolean,
    json,
    varchar,
    integer,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("emailVerified").notNull(),
    image: text("image"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    username: text("username").unique(),
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId")
        .notNull()
        .references(() => user.id),
    activeOrganizationId: text("activeOrganizationId"),
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId")
        .notNull()
        .references(() => user.id),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt"),
    updatedAt: timestamp("updatedAt"),
});

export const organization = pgTable("organization", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").unique(),
    logo: text("logo"),
    createdAt: timestamp("createdAt").notNull(),
    metadata: text("metadata"),
});

export const organizationSettings = pgTable('organization_settings', {
    organizationSettingsId: text('organization_settings_id').primaryKey(),
    organizationId: text('organization_id').references(() => organization.id),
    automaticCampaigns: boolean('automatic_campaigns').default(false),
    riskThreshold: text('risk_threshold').default('MEDIUM'),
    notificationPreferences: json('notification_preferences').$type<{
        email: boolean,
        inApp: boolean,
        digest: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'NONE'
    }>(),
    autoArchiveDays: text('auto_archive_days').default('30'),
    customFields: json('custom_fields').$type<Record<string, string>>(),
    updatedAt: timestamp('updated_at').notNull(),
    createdAt: timestamp('created_at').notNull(),
})


export type OrganizationSettingsType = typeof organizationSettings.$inferSelect
export type NewOrganizationSettings = typeof organizationSettings.$inferInsert

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



export const campaigns = pgTable('campaigns', {
    id: varchar('id', { length: 255 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    status: varchar('status', { length: 50 })
        .notNull()
        .default('DRAFT'),  // DRAFT, ACTIVE, PAUSED, COMPLETED
    organizationId: text('organization_id').references(() => organization.id),
    targetAudience: varchar('target_audience', { length: 50 }),
    reachCount: integer('reach_count').default(0),
    engagementRate: integer('engagement_rate').default(0),
    isAutomated: boolean('is_automated').default(false),
    startDate: timestamp('start_date'),
    endDate: timestamp('end_date'),
    updatedAt: timestamp('updated_at').notNull(),
    createdAt: timestamp('created_at').notNull(),
})
