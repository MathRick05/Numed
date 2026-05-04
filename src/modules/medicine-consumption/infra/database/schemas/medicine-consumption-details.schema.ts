import { medicinesSchema } from "@medicine/infra/database/schemas/medicine.schema";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const medicineConsumptionDetailsSchema = pgTable(
  "medicine_consumption_details",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    medicineId: uuid("medicine_id")
      .notNull()
      .references(() => medicinesSchema.id),
    intervaloDias: integer("intervalo_dias").notNull(),
    duracaoUnidade: text("duracao_unidade").notNull(),
    duracaoValor: integer("duracao_valor"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
);
