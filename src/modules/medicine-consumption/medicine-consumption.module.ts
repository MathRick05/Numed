import { Module } from "@nestjs/common";
import { MedicineConsumptionService } from "@medicine-consumption/application/services/medicine-consumption.service";
import { MEDICINE_CONSUMPTION_REPOSITORY } from "@medicine-consumption/domain/repositories/medicine-consumption-repository.interface";
import { MedicineConsumptionController } from "@medicine-consumption/infra/controllers/medicine-consumption.controller";
import { DrizzleMedicineConsumptionRepository } from "@medicine-consumption/infra/repositories/drizzle-medicine-consumption.repository";
import { SharedModule } from "@shared/shared.module";

@Module({
  imports: [SharedModule],
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
