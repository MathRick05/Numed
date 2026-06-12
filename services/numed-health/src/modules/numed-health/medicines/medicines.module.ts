import { Module } from "@nestjs/common";
import { MedicineService } from "@numed-health/medicines/application/services/medicine.service";
import { MedicineMessagingService } from "@numed-health/medicines/application/services/medicine-messaging.service";
import { MEDICINE_REPOSITORY } from "@numed-health/medicines/domain/repositories/medicine-repository.interface";
import { MedicinesController } from "@numed-health/medicines/infra/controllers/medicines.controller";
import { DrizzleMedicineRepository } from "@numed-health/medicines/infra/repositories/drizzle-medicine.repository";

@Module({
  controllers: [MedicinesController],
  providers: [
    MedicineService,
    MedicineMessagingService,
    DrizzleMedicineRepository,
    {
      provide: MEDICINE_REPOSITORY,
      useExisting: DrizzleMedicineRepository,
    },
  ],
  exports: [MedicineService, DrizzleMedicineRepository, MEDICINE_REPOSITORY],
})
export class MedicinesModule {}
