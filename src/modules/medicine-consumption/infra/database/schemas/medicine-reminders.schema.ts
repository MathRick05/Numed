import { medicineConsumptionTimesSchema } from "@medicine-consumption/infra/database/schemas/medicine-consumption-times.schema";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const medicineRemindersSchema = pgTable("medicine_reminders", {
  id: uuid("id").primaryKey().defaultRandom(),
  consumptionTimeId: uuid("consumption_time_id")
    .notNull()
    .references(() => medicineConsumptionTimesSchema.id),
  agendadoPara: timestamp("agendado_para", { withTimezone: true }).notNull(),
  status: text("status").notNull(),
  confirmadoEm: timestamp("confirmado_em", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});
