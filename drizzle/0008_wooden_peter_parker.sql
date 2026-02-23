ALTER TABLE "conversation_participants" DROP CONSTRAINT "conversation_participants_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_created_by_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "messages_sender_id_user_id_fk";
--> statement-breakpoint

DROP INDEX "conversation_participants_unique";
--> statement-breakpoint

ALTER TABLE "conversation_participants" ALTER COLUMN "user_id" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "conversations" ALTER COLUMN "created_by_user_id" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "sender_id" DROP NOT NULL;
--> statement-breakpoint

-- ✅ user_key: add nullable -> backfill -> set NOT NULL (safe even if user_id is NULL)
ALTER TABLE "conversation_participants" ADD COLUMN "user_key" text;
--> statement-breakpoint
UPDATE "conversation_participants"
SET "user_key" = COALESCE("user_id", 'deleted:' || "id"::text)
WHERE "user_key" IS NULL;
--> statement-breakpoint
ALTER TABLE "conversation_participants" ALTER COLUMN "user_key" SET NOT NULL;
--> statement-breakpoint

ALTER TABLE "conversation_participants" ADD COLUMN "user_name_snapshot" text;
--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "sender_name_snapshot" text;
--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "sender_avatar_snapshot" text;
--> statement-breakpoint

ALTER TABLE "user" ADD COLUMN "disabled_at" timestamp;
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "deletion_requested_at" timestamp;
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "deleted_at" timestamp;
--> statement-breakpoint

ALTER TABLE "conversation_participants"
ADD CONSTRAINT "conversation_participants_user_id_user_id_fk"
FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint

ALTER TABLE "conversations"
ADD CONSTRAINT "conversations_created_by_user_id_user_id_fk"
FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint

ALTER TABLE "messages"
ADD CONSTRAINT "messages_sender_id_user_id_fk"
FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint

CREATE INDEX "conversation_participants_conversation_id_idx"
ON "conversation_participants" USING btree ("conversation_id");
--> statement-breakpoint

CREATE INDEX "messages_conversation_created_idx"
ON "messages" USING btree ("conversation_id","created_at");
--> statement-breakpoint

CREATE INDEX "user_deleted_at_idx" ON "user" USING btree ("deleted_at");
--> statement-breakpoint
CREATE INDEX "user_disabled_at_idx" ON "user" USING btree ("disabled_at");
--> statement-breakpoint
CREATE INDEX "user_deletion_requested_at_idx" ON "user" USING btree ("deletion_requested_at");
--> statement-breakpoint

CREATE UNIQUE INDEX "conversation_participants_unique"
ON "conversation_participants" USING btree ("conversation_id","user_key");