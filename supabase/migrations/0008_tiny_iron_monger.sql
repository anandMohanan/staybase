ALTER TABLE "organization_settings" ADD COLUMN "automatic_discount_offers" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "organization_settings" ADD COLUMN "enable_discount_restrictions" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "organization_settings" ADD COLUMN "max_discount_percentage" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "organization_settings" ADD COLUMN "min_purchase_amount" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "organization_settings" ADD COLUMN "exclude_discounted_items" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "organization_settings" ADD COLUMN "limit_one_per_customer" boolean DEFAULT true;