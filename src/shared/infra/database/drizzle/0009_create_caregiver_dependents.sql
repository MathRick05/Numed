CREATE TABLE "caregiver_dependents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"caregiver_id" uuid NOT NULL,
	"dependent_id" uuid NOT NULL
);
ALTER TABLE "caregiver_dependents" ADD CONSTRAINT "caregiver_dependents_caregiver_id_users_id_fk" FOREIGN KEY ("caregiver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "caregiver_dependents" ADD CONSTRAINT "caregiver_dependents_dependent_id_users_id_fk" FOREIGN KEY ("dependent_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "caregiver_dependents" ADD CONSTRAINT "caregiver_dependents_caregiver_id_dependent_id_unique" UNIQUE ("caregiver_id","dependent_id");
