import { usersSchema } from "@users/infra/database/schemas/user.schema";
import { pgTable, unique, uuid } from "drizzle-orm/pg-core";

export const caregiverDependentsSchema = pgTable(
  "caregiver_dependents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    caregiverId: uuid("caregiver_id")
      .notNull()
      .references(() => usersSchema.id),
    dependentId: uuid("dependent_id")
      .notNull()
      .references(() => usersSchema.id),
  },
  (t) => ({
    caregiverDependentUnique: unique().on(t.caregiverId, t.dependentId),
  }),
);
