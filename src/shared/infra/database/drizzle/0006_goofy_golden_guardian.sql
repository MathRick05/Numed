CREATE TABLE "appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"tipo_consulta" text NOT NULL,
	"doutor" text NOT NULL,
	"data" text NOT NULL,
	"hora" text NOT NULL,
	"endereco" text NOT NULL,
	"status" text NOT NULL,
	"descricao" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
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
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medicine_consumption_details" ADD CONSTRAINT "medicine_consumption_details_medicine_id_medicines_id_fk" FOREIGN KEY ("medicine_id") REFERENCES "public"."medicines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medicine_consumption_times" ADD CONSTRAINT "medicine_consumption_times_details_id_medicine_consumption_details_id_fk" FOREIGN KEY ("details_id") REFERENCES "public"."medicine_consumption_details"("id") ON DELETE no action ON UPDATE no action;