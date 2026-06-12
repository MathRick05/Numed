import { Module } from "@nestjs/common";
import { MedicinesModule } from "@numed-health/medicines/medicines.module";
import { MedicineConsumptionModule } from "@numed-health/medicine-consumption/medicine-consumption.module";
import { CaregiverDependentsModule } from "@numed-health/caregiver-dependents/caregiver-dependents.module";
import { UsersIntegrationModule } from "../integrations/users/users-integration.module";

@Module({
  imports: [MedicinesModule, MedicineConsumptionModule, CaregiverDependentsModule, UsersIntegrationModule],
})
export class NumedHealthModule {}
