import { Module } from "@nestjs/common";
import { MedicinesModule } from "@numed-health/medicines/medicines.module";
import { MedicineConsumptionModule } from "@numed-health/medicine-consumption/medicine-consumption.module";
import { CaregiverDependentsModule } from "@numed-health/caregiver-dependents/caregiver-dependents.module";

@Module({
  imports: [MedicinesModule, MedicineConsumptionModule, CaregiverDependentsModule],
})
export class NumedHealthModule {}
