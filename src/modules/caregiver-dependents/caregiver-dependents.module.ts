import { Module } from "@nestjs/common";
import { CaregiverDependentService } from "@caregiver-dependents/application/services/caregiver-dependent.service";
import { CAREGIVER_DEPENDENT_REPOSITORY } from "@caregiver-dependents/domain/repositories/caregiver-dependent-repository.interface";
import { CaregiverDependentsController } from "@caregiver-dependents/infra/controllers/caregiver-dependents.controller";
import { DrizzleCaregiverDependentRepository } from "@caregiver-dependents/infra/repositories/drizzle-caregiver-dependent.repository";
import { SharedModule } from "@shared/shared.module";

@Module({
  imports: [SharedModule],
  controllers: [CaregiverDependentsController],
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
