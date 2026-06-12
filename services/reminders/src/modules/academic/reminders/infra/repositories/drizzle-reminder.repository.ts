import { Injectable } from "@nestjs/common";
import { DrizzleService } from "@shared/infra/database/drizzle.service";
import type { PaginationParams } from "@shared/infra/hateoas";
import { Reminder } from "@reminders/domain/models/remind.entity";
import type { ReminderRepository } from "@reminders/domain/repositories/remind-repository.interface";
import { remindersSchema } from "@reminders/infra/database/schemas/reminder.schema";
import { and, eq, sql } from "drizzle-orm";

@Injectable()
export class DrizzleReminderRepository implements ReminderRepository {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(reminder: Reminder): Promise<Reminder> {
    const [row] = await this.drizzleService.db
      .insert(remindersSchema)
      .values({
        userId: reminder.userId,
        titulo: reminder.titulo,
        descricao: reminder.descricao,
        data: reminder.data,
        horario: reminder.horario,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return Reminder.restore(row)!;
  }

  async update(reminder: Reminder): Promise<void> {
    await this.drizzleService.db
      .update(remindersSchema)
      .set({
        titulo: reminder.titulo,
        descricao: reminder.descricao,
        data: reminder.data,
        horario: reminder.horario,
        updatedAt: new Date(),
      })
      .where(and(eq(remindersSchema.id, reminder.id!), eq(remindersSchema.userId, reminder.userId)));
  }

  async delete(userId: string, id: string): Promise<void> {
    await this.drizzleService.db
      .delete(remindersSchema)
      .where(and(eq(remindersSchema.id, id), eq(remindersSchema.userId, userId)));
  }

  async findById(userId: string, id: string): Promise<Reminder | null> {
    const result = await this.drizzleService.db
      .select()
      .from(remindersSchema)
      .where(and(eq(remindersSchema.id, id), eq(remindersSchema.userId, userId)))
      .limit(1);

    return Reminder.restore(result[0]);
  }

  async findAllByUserId(userId: string): Promise<Reminder[]> {
    const rows = await this.drizzleService.db
      .select()
      .from(remindersSchema)
      .where(eq(remindersSchema.userId, userId));

    return rows.map((row: any) => Reminder.restore(row)!);
  }

  async findAllByUserIdPaginated(
    userId: string,
    params: PaginationParams,
  ): Promise<{ rows: Reminder[]; total: number }> {
    const { page, limit } = params;
    const offset = (page - 1) * limit;

    const [rows, [countResult]] = await Promise.all([
      this.drizzleService.db
        .select()
        .from(remindersSchema)
        .where(eq(remindersSchema.userId, userId))
        .limit(limit)
        .offset(offset),
      this.drizzleService.db
        .select({ count: sql<number>`count(*)::int` })
        .from(remindersSchema)
        .where(eq(remindersSchema.userId, userId)),
    ]);

    return {
      rows: rows.map((row: any) => Reminder.restore(row)!),
      total: countResult.count,
    };
  }
}
