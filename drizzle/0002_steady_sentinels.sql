ALTER TABLE "profiles" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "location_region" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "show_region_public" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "profile_completed_at" timestamp with time zone;