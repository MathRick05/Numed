import { Injectable, NotFoundException } from "@nestjs/common";
import { TreatmentDurationUnit } from "@numed-health/medicine-consumption/domain/enums/treatment-duration-unit.enum";
import { MedicineConsumptionConfirmation } from "@numed-health/medicine-consumption/domain/models/medicine-consumption-confirmation.entity";
import { MedicineConsumptionDetails } from "@numed-health/medicine-consumption/domain/models/medicine-consumption-details.entity";
import { MedicineConsumptionTime } from "@numed-health/medicine-consumption/domain/models/medicine-consumption-time.entity";
import type {
  MedicineConsumptionData,
  MedicineConsumptionRepository,
} from "@numed-health/medicine-consumption/domain/repositories/medicine-consumption-repository.interface";
import { medicineConsumptionConfirmationsSchema } from "@numed-health/medicine-consumption/infra/database/schemas/medicine-consumption-confirmations.schema";
import { medicineConsumptionDetailsSchema } from "@numed-health/medicine-consumption/infra/database/schemas/medicine-consumption-details.schema";
import { medicineConsumptionTimesSchema } from "@numed-health/medicine-consumption/infra/database/schemas/medicine-consumption-times.schema";
import { medicinesSchema } from "@numed-health/medicines/infra/database/schemas/medicine.schema";
import { DrizzleService } from "@shared/infra/database/drizzle.service";
import { and, desc, eq } from "drizzle-orm";

@Injectable()
export class DrizzleMedicineConsumptionRepository
  implements MedicineConsumptionRepository
{
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
        .where(
          and(
            eq(medicinesSchema.id, medicineId),
            eq(medicinesSchema.userId, userId),
          ),
        )
        .limit(1);

      if (medicine.length === 0)
        throw new NotFoundException("Medicine not found");

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
  ): Promise<MedicineConsumptionData | null> {
    const medicine = await this.drizzleService.db
      .select({ id: medicinesSchema.id })
      .from(medicinesSchema)
      .where(
        and(
          eq(medicinesSchema.id, medicineId),
          eq(medicinesSchema.userId, userId),
        ),
      )
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

    const confirmations = await this.listConfirmations(medicineId);

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
      confirmations,
    };
  }

  async deleteByMedicineId(userId: string, medicineId: string): Promise<void> {
    await this.drizzleService.db.transaction(async (tx) => {
      const medicine = await tx
        .select({ id: medicinesSchema.id })
        .from(medicinesSchema)
        .where(
          and(
            eq(medicinesSchema.id, medicineId),
            eq(medicinesSchema.userId, userId),
          ),
        )
        .limit(1);

      if (medicine.length === 0)
        throw new NotFoundException("Medicine not found");

      const detailsRows = await tx
        .select({ id: medicineConsumptionDetailsSchema.id })
        .from(medicineConsumptionDetailsSchema)
        .where(eq(medicineConsumptionDetailsSchema.medicineId, medicineId))
        .limit(1);

      const d = detailsRows[0];
      if (!d) return;

      await tx
        .delete(medicineConsumptionTimesSchema)
        .where(eq(medicineConsumptionTimesSchema.detailsId, d.id));

      await tx
        .delete(medicineConsumptionDetailsSchema)
        .where(eq(medicineConsumptionDetailsSchema.id, d.id));
    });
  }

  async createConfirmation(
    medicineId: string,
    confirmation: MedicineConsumptionConfirmation,
  ): Promise<MedicineConsumptionConfirmation> {
    const inserted = await this.drizzleService.db
      .insert(medicineConsumptionConfirmationsSchema)
      .values({
        medicineId,
        tomado: confirmation.tomado,
        observacao: confirmation.observacao,
        horario: confirmation.horario,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return this.mapConfirmation(inserted[0])!;
  }

  async findConfirmationById(
    medicineId: string,
    confirmationId: string,
  ): Promise<MedicineConsumptionConfirmation | null> {
    const rows = await this.drizzleService.db
      .select()
      .from(medicineConsumptionConfirmationsSchema)
      .where(
        and(
          eq(medicineConsumptionConfirmationsSchema.id, confirmationId),
          eq(medicineConsumptionConfirmationsSchema.medicineId, medicineId),
        ),
      )
      .limit(1);

    return this.mapConfirmation(rows[0]);
  }

  async listConfirmations(
    medicineId: string,
  ): Promise<MedicineConsumptionConfirmation[]> {
    const rows = await this.drizzleService.db
      .select()
      .from(medicineConsumptionConfirmationsSchema)
      .where(eq(medicineConsumptionConfirmationsSchema.medicineId, medicineId))
      .orderBy(
        desc(medicineConsumptionConfirmationsSchema.horario),
        desc(medicineConsumptionConfirmationsSchema.createdAt),
      );

    return rows.map((row) => this.mapConfirmation(row)!);
  }

  async updateConfirmation(
    medicineId: string,
    confirmation: MedicineConsumptionConfirmation,
  ): Promise<void> {
    await this.drizzleService.db
      .update(medicineConsumptionConfirmationsSchema)
      .set({
        tomado: confirmation.tomado,
        observacao: confirmation.observacao,
        horario: confirmation.horario,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(medicineConsumptionConfirmationsSchema.id, confirmation.id!),
          eq(medicineConsumptionConfirmationsSchema.medicineId, medicineId),
        ),
      );
  }

  async deleteConfirmation(
    medicineId: string,
    confirmationId: string,
  ): Promise<void> {
    await this.drizzleService.db
      .delete(medicineConsumptionConfirmationsSchema)
      .where(
        and(
          eq(medicineConsumptionConfirmationsSchema.id, confirmationId),
          eq(medicineConsumptionConfirmationsSchema.medicineId, medicineId),
        ),
      );
  }

  private mapConfirmation(
    row:
      | {
          id: string;
          medicineId: string;
          tomado: boolean;
          observacao: string | null;
          horario: Date;
          createdAt: Date;
          updatedAt: Date;
        }
      | undefined,
  ): MedicineConsumptionConfirmation | null {
    return MedicineConsumptionConfirmation.restore(
      row
        ? {
            id: row.id,
            medicineId: row.medicineId,
            tomado: row.tomado,
            observacao: row.observacao ?? null,
            horario: row.horario,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
          }
        : undefined,
    );
  }
}
