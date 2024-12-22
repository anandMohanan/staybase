CREATE TABLE "integrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"platform" text NOT NULL,
	"access_token" text NOT NULL,
	"shop_domain" text NOT NULL,
	"status" text NOT NULL,
	"last_sync" timestamp
);
--> statement-breakpoint
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_business_id_organization_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "integrations_organization_idx" ON "integrations" USING btree ("business_id");