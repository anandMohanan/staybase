CREATE TABLE "customers" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"last_order_date" timestamp NOT NULL,
	"total_orders" integer NOT NULL,
	"total_spent" numeric(10, 2) NOT NULL,
	"organization_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;