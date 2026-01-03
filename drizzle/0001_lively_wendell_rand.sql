ALTER TABLE "profiles" ALTER COLUMN "cancer_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."cancer_type";--> statement-breakpoint
CREATE TYPE "public"."cancer_type" AS ENUM('bone', 'breast', 'lung', 'skin', 'brain', 'digestive', 'gynecologic', 'urologic', 'head_neck', 'leukemia', 'lymphoma', 'myeloma', 'sarcoma', 'other');--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "cancer_type" SET DATA TYPE "public"."cancer_type" USING "cancer_type"::"public"."cancer_type";