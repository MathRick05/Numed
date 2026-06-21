CREATE TABLE "medicine_consumption_confirmations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"medicine_id" uuid NOT NULL,
	"tomado" boolean NOT NULL,
	"observacao" text,
	"horario" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "medicine_consumption_confirmations" ADD CONSTRAINT "medicine_consumption_confirmations_medicine_id_medicines_id_fk" FOREIGN KEY ("medicine_id") REFERENCES "public"."medicines"("id") ON DELETE no action ON UPDATE no action;