import { index, json, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { organization } from "./user";

export const integrations = pgTable('integrations', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: text('business_id').notNull().references(() => organization.id),
    platform: text('platform').notNull(),
    accessToken: text('access_token').notNull(),
    shopDomain: text('shop_domain').notNull(),
    status: text('status').notNull(),
    webhookSecret: text('webhook_secret').notNull(),
    lastSync: timestamp('last_sync'),
}, (table) => ({
    organizationId: index('integrations_organization_idx').on(table.organizationId),
}));
