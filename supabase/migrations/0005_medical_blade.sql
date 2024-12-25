CREATE TABLE "campaigns" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"status" varchar(50) DEFAULT 'DRAFT' NOT NULL,
	"organization_id" text,
	"target_audience" varchar(50),
	"reach_count" integer DEFAULT 0,
	"engagement_rate" integer DEFAULT 0,
	"is_automated" boolean DEFAULT false,
	"start_date" timestamp,
	"end_date" timestamp,
	"updated_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;