import { Module } from "@nestjs/common";
import { MedicineService } from "@medicine/application/services/medicine.service";
import { MEDICINE_REPOSITORY } from "@medicine/domain/repositories/medicine-repository.interface";
import { MedicinesController } from "@medicine/infra/controllers/medicines.controller";
import { DrizzleMedicineRepository } from "@medicine/infra/repositories/drizzle-medicine.repository";
import { SharedModule } from "@shared/shared.module";
import { UsersModule } from "@users/users.module";

@Module({
  imports: [SharedModule, UsersModule],
  controllers: [MedicinesController],
  providers: [
    MedicineService,
    DrizzleMedicineRepository,
    {
      provide: MEDICINE_REPOSITORY,
      useExisting: DrizzleMedicineRepository,
    },
  ],
})
export class MedicineModule {}
