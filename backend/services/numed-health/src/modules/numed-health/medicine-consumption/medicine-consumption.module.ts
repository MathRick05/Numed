import { Module } from "@nestjs/common";
import { MedicineConsumptionService } from "@numed-health/medicine-consumption/application/services/medicine-consumption.service";
import { MEDICINE_CONSUMPTION_REPOSITORY } from "@numed-health/medicine-consumption/domain/repositories/medicine-consumption-repository.interface";
import { MedicineConsumptionController } from "@numed-health/medicine-consumption/infra/controllers/medicine-consumption.controller";
import { DrizzleMedicineConsumptionRepository } from "@numed-health/medicine-consumption/infra/repositories/drizzle-medicine-consumption.repository";

@Module({
  controllers: [MedicineConsumptionController],
  providers: [
    MedicineConsumptionService,
    DrizzleMedicineConsumptionRepository,
    {
      provide: MEDICINE_CONSUMPTION_REPOSITORY,
      useExisting: DrizzleMedicineConsumptionRepository,
    },
  ],
})
export class MedicineConsumptionModule {}
