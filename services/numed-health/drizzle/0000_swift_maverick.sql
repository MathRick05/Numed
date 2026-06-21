CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"is_caregiver" boolean DEFAULT false NOT NULL,
	"is_premium" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "caregiver_dependents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"caregiver_id" uuid NOT NULL,
	"dependent_id" uuid NOT NULL,
	CONSTRAINT "caregiver_dependents_caregiver_id_dependent_id_unique" UNIQUE("caregiver_id","dependent_id")
);
--> statement-breakpoint
CREATE TABLE "medicine_consumption_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"medicine_id" uuid NOT NULL,
	"intervalo_dias" integer NOT NULL,
	"duracao_unidade" text NOT NULL,
	"duracao_valor" integer,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medicine_consumption_times" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"details_id" uuid NOT NULL,
	"hora" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medicines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"tipo" text NOT NULL,
	"numero_dosagem" integer NOT NULL,
	"unidade_dosagem" text NOT NULL,
	"quantidade_guardada" integer NOT NULL,
	"instrucoes" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "medicine_consumption_details" ADD CONSTRAINT "medicine_consumption_details_medicine_id_medicines_id_fk" FOREIGN KEY ("medicine_id") REFERENCES "public"."medicines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medicine_consumption_times" ADD CONSTRAINT "medicine_consumption_times_details_id_medicine_consumption_details_id_fk" FOREIGN KEY ("details_id") REFERENCES "public"."medicine_consumption_details"("id") ON DELETE no action ON UPDATE no action;