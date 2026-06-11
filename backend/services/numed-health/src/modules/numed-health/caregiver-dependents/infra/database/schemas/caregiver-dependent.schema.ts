import { pgTable, unique, uuid } from "drizzle-orm/pg-core";

export const caregiverDependentsSchema = pgTable(
  "caregiver_dependents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    caregiverId: uuid("caregiver_id").notNull(),
    dependentId: uuid("dependent_id").notNull(),
  },
  (t) => ({
    caregiverDependentUnique: unique().on(t.caregiverId, t.dependentId),
  }),
);
