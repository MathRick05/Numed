import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { MedicineDto } from "@numed-health/medicines/application/dto/medicine.dto";
import {
  NumedHealthExchangeName,
  NumedHealthRoutingKey,
} from "@shared/contracts/events/numed-health-events.enum";
import { SharedMessagingService } from "@shared/infra/messaging/shared-messaging.service";

@Injectable()
export class MedicineMessagingService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MedicineMessagingService.name);

  constructor(private readonly sharedMessagingService: SharedMessagingService) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      await Promise.all([
        this.sharedMessagingService.assertExchange(NumedHealthExchangeName.MEDICINE_CREATED),
        this.sharedMessagingService.assertExchange(NumedHealthExchangeName.MEDICINE_UPDATED),
        this.sharedMessagingService.assertExchange(NumedHealthExchangeName.MEDICINE_DELETED),
      ]);
    } catch (error) {
      this.logger.error("Failed to assert medicine exchanges", error);
      throw error;
    }
  }

  async publishMedicineCreated(medicine: MedicineDto): Promise<void> {
    await this.sharedMessagingService.publish(
      NumedHealthExchangeName.MEDICINE_CREATED,
      NumedHealthRoutingKey.MEDICINE_CREATED,
      medicine,
    );
  }

  async publishMedicineUpdated(medicine: MedicineDto): Promise<void> {
    await this.sharedMessagingService.publish(
      NumedHealthExchangeName.MEDICINE_UPDATED,
      NumedHealthRoutingKey.MEDICINE_UPDATED,
      medicine,
    );
  }

  async publishMedicineDeleted(medicine: MedicineDto): Promise<void> {
    await this.sharedMessagingService.publish(
      NumedHealthExchangeName.MEDICINE_DELETED,
      NumedHealthRoutingKey.MEDICINE_DELETED,
      medicine,
    );
  }
}
