import { Injectable, NotFoundException } from "@nestjs/common";
import { TreatmentDurationUnit } from "@medicine-consumption/domain/enums/treatment-duration-unit.enum";
import { MedicineConsumptionDetails } from "@medicine-consumption/domain/models/medicine-consumption-details.entity";
import { MedicineConsumptionTime } from "@medicine-consumption/domain/models/medicine-consumption-time.entity";
import type { MedicineConsumptionRepository } from "@medicine-consumption/domain/repositories/medicine-consumption-repository.interface";
import { medicineConsumptionDetailsSchema } from "@medicine-consumption/infra/database/schemas/medicine-consumption-details.schema";
import { medicineConsumptionTimesSchema } from "@medicine-consumption/infra/database/schemas/medicine-consumption-times.schema";
import { medicinesSchema } from "@medicine/infra/database/schemas/medicine.schema";
import { DrizzleService } from "@shared/infra/database/drizzle.service";
import { and, eq } from "drizzle-orm";

@Injectable()
export class DrizzleMedicineConsumptionRepository implements MedicineConsumptionRepository {
  constructor(private readonly drizzleService: DrizzleService) {}

  async upsertDetailsWithTimes(
    userId: string,
    medicineId: string,
    details: MedicineConsumptionDetails,
    times: MedicineConsumptionTime[],
  ): Promise<void> {
    await this.drizzleService.db.transaction(async (tx) => {
      const medicine = await tx
        .select({ id: medicinesSchema.id })
        .from(medicinesSchema)
        .where(and(eq(medicinesSchema.id, medicineId), eq(medicinesSchema.userId, userId)))
        .limit(1);

      if (medicine.length === 0) throw new NotFoundException("Medicine not found");

      const existing = await tx
        .select({ id: medicineConsumptionDetailsSchema.id })
        .from(medicineConsumptionDetailsSchema)
        .where(eq(medicineConsumptionDetailsSchema.medicineId, medicineId))
        .limit(1);

      let detailsId: string;

      if (existing.length > 0) {
        detailsId = existing[0].id;
        await tx
          .update(medicineConsumptionDetailsSchema)
          .set({
            intervaloDias: details.intervaloDias,
            duracaoUnidade: details.duracaoUnidade,
            duracaoValor: details.duracaoValor,
            updatedAt: new Date(),
          })
          .where(eq(medicineConsumptionDetailsSchema.id, detailsId));
      } else {
        const inserted = await tx
          .insert(medicineConsumptionDetailsSchema)
          .values({
            medicineId,
            intervaloDias: details.intervaloDias,
            duracaoUnidade: details.duracaoUnidade,
            duracaoValor: details.duracaoValor,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning({ id: medicineConsumptionDetailsSchema.id });

        detailsId = inserted[0].id;
      }

      await tx
        .delete(medicineConsumptionTimesSchema)
        .where(eq(medicineConsumptionTimesSchema.detailsId, detailsId));

      await tx.insert(medicineConsumptionTimesSchema).values(
        times.map((t) => ({
          detailsId,
          hora: t.hora,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      );
    });
  }

  async findByMedicineId(
    userId: string,
    medicineId: string,
  ): Promise<{ details: MedicineConsumptionDetails; times: MedicineConsumptionTime[] } | null> {
    const medicine = await this.drizzleService.db
      .select({ id: medicinesSchema.id })
      .from(medicinesSchema)
      .where(and(eq(medicinesSchema.id, medicineId), eq(medicinesSchema.userId, userId)))
      .limit(1);

    if (medicine.length === 0) return null;

    const detailsRows = await this.drizzleService.db
      .select()
      .from(medicineConsumptionDetailsSchema)
      .where(eq(medicineConsumptionDetailsSchema.medicineId, medicineId))
      .limit(1);

    const detailsRow = detailsRows[0];
    if (!detailsRow) return null;

    const timesRows = await this.drizzleService.db
      .select()
      .from(medicineConsumptionTimesSchema)
      .where(eq(medicineConsumptionTimesSchema.detailsId, detailsRow.id));

    return {
      details: MedicineConsumptionDetails.restore({
        id: detailsRow.id,
        medicineId: detailsRow.medicineId,
        intervaloDias: detailsRow.intervaloDias,
        duracaoUnidade: detailsRow.duracaoUnidade as TreatmentDurationUnit,
        duracaoValor: detailsRow.duracaoValor ?? null,
        createdAt: detailsRow.createdAt,
        updatedAt: detailsRow.updatedAt,
      })!,
      times: timesRows.map(
        (row) =>
          MedicineConsumptionTime.restore({
            id: row.id,
            detailsId: row.detailsId,
            hora: row.hora,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
          })!,
      ),
    };
  }

  async deleteByMedicineId(userId: string, medicineId: string): Promise<void> {
    await this.drizzleService.db.transaction(async (tx) => {
      const medicine = await tx
        .select({ id: medicinesSchema.id })
        .from(medicinesSchema)
        .where(and(eq(medicinesSchema.id, medicineId), eq(medicinesSchema.userId, userId)))
        .limit(1);

      if (medicine.length === 0) throw new NotFoundException("Medicine not found");

      const detailsRows = await tx
        .select({ id: medicineConsumptionDetailsSchema.id })
        .from(medicineConsumptionDetailsSchema)
        .where(eq(medicineConsumptionDetailsSchema.medicineId, medicineId))
        .limit(1);

      const details = detailsRows[0];
      if (!details) return;

      await tx
        .delete(medicineConsumptionTimesSchema)
        .where(eq(medicineConsumptionTimesSchema.detailsId, details.id));

      await tx
        .delete(medicineConsumptionDetailsSchema)
        .where(eq(medicineConsumptionDetailsSchema.id, details.id));
    });
  }
}
