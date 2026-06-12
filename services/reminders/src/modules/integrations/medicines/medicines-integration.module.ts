import { Module } from "@nestjs/common";
import { SharedModule } from "@shared/shared.module";
import { MedicineConsumerService } from "@integrations/medicines/application/services/medicine-consumer.service";

@Module({
  imports: [SharedModule],
  providers: [MedicineConsumerService],
})
export class MedicinesIntegrationModule {}
