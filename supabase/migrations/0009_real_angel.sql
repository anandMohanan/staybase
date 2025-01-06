CREATE TABLE "campaign_emails" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"campaign_id" varchar(255) NOT NULL,
	"customer_email" varchar(255) NOT NULL,
	"email_type" varchar(50) NOT NULL,
	"content" text NOT NULL,
	"status" varchar(50) DEFAULT 'PENDING' NOT NULL,
	"scheduled_for" timestamp NOT NULL,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_events" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"email_id" varchar(255) NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"occurred_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "campaign_emails" ADD CONSTRAINT "campaign_emails_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_events" ADD CONSTRAINT "email_events_email_id_campaign_emails_id_fk" FOREIGN KEY ("email_id") REFERENCES "public"."campaign_emails"("id") ON DELETE no action ON UPDATE no action;