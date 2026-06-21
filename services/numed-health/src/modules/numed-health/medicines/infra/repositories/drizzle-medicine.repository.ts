import { Injectable } from "@nestjs/common";
import { medicineConsumptionDetailsSchema } from "@numed-health/medicine-consumption/infra/database/schemas/medicine-consumption-details.schema";
import { medicineConsumptionTimesSchema } from "@numed-health/medicine-consumption/infra/database/schemas/medicine-consumption-times.schema";
import { DosageUnit } from "@numed-health/medicines/domain/enums/dosage-unit.enum";
import { MedicineType } from "@numed-health/medicines/domain/enums/medicine-type.enum";
import { Medicine } from "@numed-health/medicines/domain/models/medicine.entity";
import type { MedicineRepository } from "@numed-health/medicines/domain/repositories/medicine-repository.interface";
import { medicinesSchema } from "@numed-health/medicines/infra/database/schemas/medicine.schema";
import { DrizzleService } from "@shared/infra/database/drizzle.service";
import type { PaginationParams } from "@shared/infra/hateoas";
import { and, eq, sql } from "drizzle-orm";

@Injectable()
export class DrizzleMedicineRepository implements MedicineRepository {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(medicine: Medicine): Promise<void> {
    await this.drizzleService.db.insert(medicinesSchema).values({
      userId: medicine.userId,
      nome: medicine.nome,
      tipo: medicine.tipo,
      numeroDosagem: medicine.numeroDosagem,
      unidadeDosagem: medicine.unidadeDosagem,
      quantidadeGuardada: medicine.quantidadeGuardada,
      instrucoes: medicine.instrucoes,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async update(medicine: Medicine): Promise<void> {
    await this.drizzleService.db
      .update(medicinesSchema)
      .set({
        nome: medicine.nome,
        tipo: medicine.tipo,
        numeroDosagem: medicine.numeroDosagem,
        unidadeDosagem: medicine.unidadeDosagem,
        quantidadeGuardada: medicine.quantidadeGuardada,
        instrucoes: medicine.instrucoes,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(medicinesSchema.id, medicine.id!),
          eq(medicinesSchema.userId, medicine.userId),
        ),
      );
  }

  async delete(userId: string, id: string): Promise<void> {
    await this.drizzleService.db.transaction(async (tx) => {
      const detailsRows = await tx
        .select({ id: medicineConsumptionDetailsSchema.id })
        .from(medicineConsumptionDetailsSchema)
        .where(eq(medicineConsumptionDetailsSchema.medicineId, id));

      const detailIds = detailsRows.map((row) => row.id);

      if (detailIds.length > 0) {
        for (const detailId of detailIds) {
          await tx
            .delete(medicineConsumptionTimesSchema)
            .where(eq(medicineConsumptionTimesSchema.detailsId, detailId));
        }

        await tx
          .delete(medicineConsumptionDetailsSchema)
          .where(eq(medicineConsumptionDetailsSchema.medicineId, id));
      }

      await tx
        .delete(medicinesSchema)
        .where(
          and(eq(medicinesSchema.id, id), eq(medicinesSchema.userId, userId)),
        );
    });
  }

  async findById(userId: string, id: string): Promise<Medicine | null> {
    const result = await this.drizzleService.db
      .select()
      .from(medicinesSchema)
      .where(
        and(eq(medicinesSchema.id, id), eq(medicinesSchema.userId, userId)),
      )
      .limit(1);

    return Medicine.restore(
      result[0]
        ? {
            ...result[0],
            tipo: result[0].tipo as MedicineType,
            unidadeDosagem: result[0].unidadeDosagem as DosageUnit,
          }
        : undefined,
    );
  }

  async findAllByUserId(userId: string): Promise<Medicine[]> {
    const rows = await this.drizzleService.db
      .select()
      .from(medicinesSchema)
      .where(eq(medicinesSchema.userId, userId));

    return rows.map(
      (row) =>
        Medicine.restore({
          ...row,
          tipo: row.tipo as MedicineType,
          unidadeDosagem: row.unidadeDosagem as DosageUnit,
        })!,
    );
  }

  async findAllByUserIdPaginated(
    userId: string,
    params: PaginationParams,
  ): Promise<{ rows: Medicine[]; total: number }> {
    const { page, limit } = params;
    const offset = (page - 1) * limit;

    const [rows, [countResult]] = await Promise.all([
      this.drizzleService.db
        .select()
        .from(medicinesSchema)
        .where(eq(medicinesSchema.userId, userId))
        .limit(limit)
        .offset(offset),
      this.drizzleService.db
        .select({ count: sql<number>`count(*)::int` })
        .from(medicinesSchema)
        .where(eq(medicinesSchema.userId, userId)),
    ]);

    return {
      rows: rows.map(
        (row) =>
          Medicine.restore({
            ...row,
            tipo: row.tipo as MedicineType,
            unidadeDosagem: row.unidadeDosagem as DosageUnit,
          })!,
      ),
      total: countResult.count,
    };
  }
}
