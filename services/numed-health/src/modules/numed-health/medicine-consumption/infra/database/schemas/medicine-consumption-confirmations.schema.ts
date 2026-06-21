import { medicinesSchema } from "@numed-health/medicines/infra/database/schemas/medicine.schema";
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const medicineConsumptionConfirmationsSchema = pgTable(
  "medicine_consumption_confirmations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    medicineId: uuid("medicine_id")
      .notNull()
      .references(() => medicinesSchema.id),
    tomado: boolean("tomado").notNull(),
    observacao: text("observacao"),
    horario: timestamp("horario", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
);
