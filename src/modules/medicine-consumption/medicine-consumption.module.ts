import { Module } from "@nestjs/common";
import { MedicineConsumptionService } from "@medicine-consumption/application/services/medicine-consumption.service";
import { MedicineReminderService } from "@medicine-consumption/application/services/medicine-reminder.service";
import { MEDICINE_CONSUMPTION_REPOSITORY } from "@medicine-consumption/domain/repositories/medicine-consumption-repository.interface";
import { MEDICINE_REMINDER_REPOSITORY } from "@medicine-consumption/domain/repositories/medicine-reminder-repository.interface";
import { MedicineConsumptionController } from "@medicine-consumption/infra/controllers/medicine-consumption.controller";
import { MedicineReminderController } from "@medicine-consumption/infra/controllers/medicine-reminder.controller";
import { DrizzleMedicineConsumptionRepository } from "@medicine-consumption/infra/repositories/drizzle-medicine-consumption.repository";
import { DrizzleMedicineReminderRepository } from "@medicine-consumption/infra/repositories/drizzle-medicine-reminder.repository";
import { SharedModule } from "@shared/shared.module";

@Module({
  imports: [SharedModule],
  controllers: [MedicineConsumptionController, MedicineReminderController],
  providers: [
    MedicineConsumptionService,
    DrizzleMedicineConsumptionRepository,
    {
      provide: MEDICINE_CONSUMPTION_REPOSITORY,
      useExisting: DrizzleMedicineConsumptionRepository,
    },
    MedicineReminderService,
    DrizzleMedicineReminderRepository,
    {
      provide: MEDICINE_REMINDER_REPOSITORY,
      useExisting: DrizzleMedicineReminderRepository,
    },
  ],
})
export class MedicineConsumptionModule {}
