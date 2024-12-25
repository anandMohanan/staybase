CREATE TABLE "organization_settings" (
	"organization_settings_id" text PRIMARY KEY NOT NULL,
	"organization_id" text,
	"automatic_campaigns" boolean DEFAULT false,
	"risk_threshold" text DEFAULT 'MEDIUM',
	"notification_preferences" json,
	"auto_archive_days" text DEFAULT '30',
	"custom_fields" json,
	"updated_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organization_settings" ADD CONSTRAINT "organization_settings_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;