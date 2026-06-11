import { medicineConsumptionDetailsSchema } from "@numed-health/medicine-consumption/infra/database/schemas/medicine-consumption-details.schema";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const medicineConsumptionTimesSchema = pgTable("medicine_consumption_times", {
  id: uuid("id").primaryKey().defaultRandom(),
  detailsId: uuid("details_id")
    .notNull()
    .references(() => medicineConsumptionDetailsSchema.id),
  hora: text("hora").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});
