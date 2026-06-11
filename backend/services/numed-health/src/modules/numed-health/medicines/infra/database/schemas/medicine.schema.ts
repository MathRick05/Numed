import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const medicinesSchema = pgTable("medicines", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  nome: text("nome").notNull(),
  tipo: text("tipo").notNull(),
  numeroDosagem: integer("numero_dosagem").notNull(),
  unidadeDosagem: text("unidade_dosagem").notNull(),
  quantidadeGuardada: integer("quantidade_guardada").notNull(),
  instrucoes: text("instrucoes").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});
