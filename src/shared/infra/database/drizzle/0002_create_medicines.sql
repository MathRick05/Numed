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
ALTER TABLE "medicines" ADD CONSTRAINT "medicines_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
