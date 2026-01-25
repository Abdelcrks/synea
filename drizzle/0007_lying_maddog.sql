ALTER TABLE "conversations" RENAME COLUMN "participant_pair_id" TO "participant_duo_id";--> statement-breakpoint
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_participant_pair_id_unique";--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_participant_duo_id_unique" UNIQUE("participant_duo_id");