import { Module } from "@nestjs/common";
import { CaregiverDependentService } from "@numed-health/caregiver-dependents/application/services/caregiver-dependent.service";
import { CAREGIVER_DEPENDENT_REPOSITORY } from "@numed-health/caregiver-dependents/domain/repositories/caregiver-dependent-repository.interface";
import { CaregiverDependentsController } from "@numed-health/caregiver-dependents/infra/controllers/caregiver-dependents.controller";
import { DependentCaregiversController } from "@numed-health/caregiver-dependents/infra/controllers/dependent-caregivers.controller";
import { DrizzleCaregiverDependentRepository } from "@numed-health/caregiver-dependents/infra/repositories/drizzle-caregiver-dependent.repository";

@Module({
  controllers: [CaregiverDependentsController, DependentCaregiversController],
  providers: [
    CaregiverDependentService,
    DrizzleCaregiverDependentRepository,
    {
      provide: CAREGIVER_DEPENDENT_REPOSITORY,
      useExisting: DrizzleCaregiverDependentRepository,
    },
  ],
})
export class CaregiverDependentsModule {}
