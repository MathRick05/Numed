import { Injectable } from "@nestjs/common";
import { DrizzleService } from "@shared/infra/database/drizzle.service";
import { CaregiverDependent } from "@caregiver-dependents/domain/models/caregiver-dependent.entity";
import type { CaregiverDependentRepository } from "@caregiver-dependents/domain/repositories/caregiver-dependent-repository.interface";
import { caregiverDependentsSchema } from "@caregiver-dependents/infra/database/schemas/caregiver-dependent.schema";
import { and, eq } from "drizzle-orm";

@Injectable()
export class DrizzleCaregiverDependentRepository implements CaregiverDependentRepository {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(link: CaregiverDependent): Promise<void> {
    await this.drizzleService.db.insert(caregiverDependentsSchema).values({
      caregiverId: link.caregiverId,
      dependentId: link.dependentId,
    });
  }

  async delete(caregiverId: string, dependentId: string): Promise<void> {
    await this.drizzleService.db
      .delete(caregiverDependentsSchema)
      .where(
        and(
          eq(caregiverDependentsSchema.caregiverId, caregiverId),
          eq(caregiverDependentsSchema.dependentId, dependentId),
        ),
      );
  }

  async exists(caregiverId: string, dependentId: string): Promise<boolean> {
    const result = await this.drizzleService.db
      .select({ id: caregiverDependentsSchema.id })
      .from(caregiverDependentsSchema)
      .where(
        and(
          eq(caregiverDependentsSchema.caregiverId, caregiverId),
          eq(caregiverDependentsSchema.dependentId, dependentId),
        ),
      )
      .limit(1);

    return result.length > 0;
  }

  async listDependents(caregiverId: string): Promise<CaregiverDependent[]> {
    const rows = await this.drizzleService.db
      .select()
      .from(caregiverDependentsSchema)
      .where(eq(caregiverDependentsSchema.caregiverId, caregiverId));

    return rows.map((row) =>
      CaregiverDependent.restore({
        id: row.id,
        caregiverId: row.caregiverId,
        dependentId: row.dependentId,
      })!,
    );
  }
}
