import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const appointmentsSchema = pgTable("appointments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  tipoConsulta: text("tipo_consulta").notNull(),
  doutor: text("doutor").notNull(),
  data: text("data").notNull(),
  hora: text("hora").notNull(),
  endereco: text("endereco").notNull(),
  status: text("status").notNull(),
  descricao: text("descricao").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});
