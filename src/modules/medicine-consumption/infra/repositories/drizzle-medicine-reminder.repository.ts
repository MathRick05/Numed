import { Injectable, NotFoundException } from "@nestjs/common";
import { ReminderStatus } from "@medicine-consumption/domain/enums/reminder-status.enum";
import { MedicineReminder } from "@medicine-consumption/domain/models/medicine-reminder.entity";
import type { MedicineReminderRepository } from "@medicine-consumption/domain/repositories/medicine-reminder-repository.interface";
import { medicineConsumptionDetailsSchema } from "@medicine-consumption/infra/database/schemas/medicine-consumption-details.schema";
import { medicineConsumptionTimesSchema } from "@medicine-consumption/infra/database/schemas/medicine-consumption-times.schema";
import { medicineRemindersSchema } from "@medicine-consumption/infra/database/schemas/medicine-reminders.schema";
import { medicinesSchema } from "@medicine/infra/database/schemas/medicine.schema";
import { DrizzleService } from "@shared/infra/database/drizzle.service";
import { and, eq, gte, lt } from "drizzle-orm";

@Injectable()
export class DrizzleMedicineReminderRepository implements MedicineReminderRepository {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(
    userId: string,
    medicineId: string,
    reminder: MedicineReminder,
  ): Promise<MedicineReminder> {
    const medicine = await this.drizzleService.db
      .select({ id: medicinesSchema.id })
      .from(medicinesSchema)
      .where(and(eq(medicinesSchema.id, medicineId), eq(medicinesSchema.userId, userId)))
      .limit(1);

    if (medicine.length === 0) throw new NotFoundException("Remédio não encontrado");

    const consumptionTime = await this.drizzleService.db
      .select({ id: medicineConsumptionTimesSchema.id })
      .from(medicineConsumptionTimesSchema)
      .innerJoin(
        medicineConsumptionDetailsSchema,
        eq(medicineConsumptionTimesSchema.detailsId, medicineConsumptionDetailsSchema.id),
      )
      .where(
        and(
          eq(medicineConsumptionTimesSchema.id, reminder.consumptionTimeId),
          eq(medicineConsumptionDetailsSchema.medicineId, medicineId),
        ),
      )
      .limit(1);

    if (consumptionTime.length === 0)
      throw new NotFoundException("Horário de consumo não encontrado");

    const now = new Date();
    const inserted = await this.drizzleService.db
      .insert(medicineRemindersSchema)
      .values({
        consumptionTimeId: reminder.consumptionTimeId,
        agendadoPara: reminder.agendadoPara,
        status: reminder.status,
        confirmadoEm: null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return this.toEntity(inserted[0]);
  }

  async findById(
    userId: string,
    medicineId: string,
    reminderId: string,
  ): Promise<MedicineReminder | null> {
    const rows = await this.drizzleService.db
      .select({ reminder: medicineRemindersSchema })
      .from(medicineRemindersSchema)
      .innerJoin(
        medicineConsumptionTimesSchema,
        eq(medicineRemindersSchema.consumptionTimeId, medicineConsumptionTimesSchema.id),
      )
      .innerJoin(
        medicineConsumptionDetailsSchema,
        eq(medicineConsumptionTimesSchema.detailsId, medicineConsumptionDetailsSchema.id),
      )
      .innerJoin(
        medicinesSchema,
        and(
          eq(medicineConsumptionDetailsSchema.medicineId, medicinesSchema.id),
          eq(medicinesSchema.id, medicineId),
          eq(medicinesSchema.userId, userId),
        ),
      )
      .where(eq(medicineRemindersSchema.id, reminderId))
      .limit(1);

    if (rows.length === 0) return null;
    return this.toEntity(rows[0].reminder);
  }

  async findByMedicineId(
    userId: string,
    medicineId: string,
    filters?: { date?: string; status?: ReminderStatus },
  ): Promise<MedicineReminder[]> {
    const conditions = [
      eq(medicinesSchema.id, medicineId),
      eq(medicinesSchema.userId, userId),
    ];

    if (filters?.status) {
      conditions.push(eq(medicineRemindersSchema.status, filters.status));
    }

    if (filters?.date) {
      const start = new Date(`${filters.date}T00:00:00.000Z`);
      const end = new Date(`${filters.date}T23:59:59.999Z`);
      conditions.push(gte(medicineRemindersSchema.agendadoPara, start));
      conditions.push(lt(medicineRemindersSchema.agendadoPara, end));
    }

    const rows = await this.drizzleService.db
      .select({ reminder: medicineRemindersSchema })
      .from(medicineRemindersSchema)
      .innerJoin(
        medicineConsumptionTimesSchema,
        eq(medicineRemindersSchema.consumptionTimeId, medicineConsumptionTimesSchema.id),
      )
      .innerJoin(
        medicineConsumptionDetailsSchema,
        eq(medicineConsumptionTimesSchema.detailsId, medicineConsumptionDetailsSchema.id),
      )
      .innerJoin(
        medicinesSchema,
        eq(medicineConsumptionDetailsSchema.medicineId, medicinesSchema.id),
      )
      .where(and(...conditions));

    return rows.map((r) => this.toEntity(r.reminder));
  }

  async updateStatus(
    userId: string,
    medicineId: string,
    reminderId: string,
    status: ReminderStatus,
    confirmadoEm?: Date,
  ): Promise<MedicineReminder> {
    const existing = await this.findById(userId, medicineId, reminderId);
    if (!existing) throw new NotFoundException("Lembrete não encontrado");

    const updated = await this.drizzleService.db
      .update(medicineRemindersSchema)
      .set({
        status,
        confirmadoEm: confirmadoEm ?? null,
        updatedAt: new Date(),
      })
      .where(eq(medicineRemindersSchema.id, reminderId))
      .returning();

    return this.toEntity(updated[0]);
  }

  private toEntity(row: typeof medicineRemindersSchema.$inferSelect): MedicineReminder {
    return MedicineReminder.restore({
      id: row.id,
      consumptionTimeId: row.consumptionTimeId,
      agendadoPara: row.agendadoPara,
      status: row.status as ReminderStatus,
      confirmadoEm: row.confirmadoEm ?? null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    })!;
  }
}
