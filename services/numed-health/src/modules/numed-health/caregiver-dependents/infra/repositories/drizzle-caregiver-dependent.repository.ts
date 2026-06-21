import { Injectable } from "@nestjs/common";
import { CaregiverDependent } from "@numed-health/caregiver-dependents/domain/models/caregiver-dependent.entity";
import type { CaregiverDependentRepository } from "@numed-health/caregiver-dependents/domain/repositories/caregiver-dependent-repository.interface";
import { caregiverDependentsSchema } from "@numed-health/caregiver-dependents/infra/database/schemas/caregiver-dependent.schema";
import { usersSchema } from "@numed-health/integrations/users/infra/database/schemas/user.schema";
import { DrizzleService } from "@shared/infra/database/drizzle.service";
import { and, eq } from "drizzle-orm";

@Injectable()
export class DrizzleCaregiverDependentRepository
  implements CaregiverDependentRepository
{
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(link: CaregiverDependent): Promise<void> {
    await this.drizzleService.db.transaction(async (tx) => {
      await tx.insert(caregiverDependentsSchema).values({
        caregiverId: link.caregiverId,
        dependentId: link.dependentId,
      });

      await tx
        .update(usersSchema)
        .set({
          isCaregiver: true,
          updatedAt: new Date(),
        })
        .where(eq(usersSchema.id, link.caregiverId));
    });
  }

  async delete(caregiverId: string, dependentId: string): Promise<void> {
    await this.drizzleService.db.transaction(async (tx) => {
      await tx
        .delete(caregiverDependentsSchema)
        .where(
          and(
            eq(caregiverDependentsSchema.caregiverId, caregiverId),
            eq(caregiverDependentsSchema.dependentId, dependentId),
          ),
        );

      const remainingDependents = await tx
        .select({ id: caregiverDependentsSchema.id })
        .from(caregiverDependentsSchema)
        .where(eq(caregiverDependentsSchema.caregiverId, caregiverId))
        .limit(1);

      await tx
        .update(usersSchema)
        .set({
          isCaregiver: remainingDependents.length > 0,
          updatedAt: new Date(),
        })
        .where(eq(usersSchema.id, caregiverId));
    });
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

    return rows.map(
      (row) =>
        CaregiverDependent.restore({
          id: row.id,
          caregiverId: row.caregiverId,
          dependentId: row.dependentId,
        })!,
    );
  }
}
