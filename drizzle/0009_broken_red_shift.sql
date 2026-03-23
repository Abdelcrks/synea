DROP INDEX "user_deletion_requested_at_idx";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "deletion_requested_at";