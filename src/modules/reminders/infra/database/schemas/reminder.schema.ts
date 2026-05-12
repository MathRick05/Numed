import { usersSchema } from "@users/infra/database/schemas/user.schema";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const remindersSchema = pgTable("reminders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersSchema.id),
  titulo: text("titulo").notNull(),
  descricao: text("descricao").notNull(),
  data: text("data").notNull(),
  horario: text("horario").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});
