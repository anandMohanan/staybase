CREATE TYPE "public"."campaign_priority" AS ENUM('URGENT', 'HIGH', 'MEDIUM', 'LOW');--> statement-breakpoint
CREATE TYPE "public"."campaign_status" AS ENUM('DRAFT', 'SCHEDULED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."campaign_type" AS ENUM('ABANDONED_CART', 'WINBACK', 'REENGAGEMENT', 'LOYALTY_REWARD', 'PRODUCT_UPDATE', 'NEWSLETTER');--> statement-breakpoint
ALTER TABLE "campaigns" ALTER COLUMN "status" SET DATA TYPE campaign_status;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "type" "campaign_type";--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "priority" "campaign_priority" DEFAULT 'MEDIUM';--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "priority_score" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "targeting_rules" jsonb DEFAULT '{"lastPurchaseRange":null,"totalSpentRange":null,"riskScoreRange":null,"tags":[]}'::jsonb;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "sending_schedule" jsonb DEFAULT '{"maxEmailsPerDay":null,"preferredTimeOfDay":[],"daysOfWeek":[],"timezone":"UTC"}'::jsonb;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "metrics" jsonb DEFAULT '{"emailsSent":0,"opened":0,"clicked":0,"converted":0,"unsubscribed":0}'::jsonb;