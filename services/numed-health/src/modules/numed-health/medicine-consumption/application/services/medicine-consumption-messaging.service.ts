import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import {
  NumedHealthExchangeName,
  NumedHealthRoutingKey,
} from "@shared/contracts/events/numed-health-events.enum";
import { SharedMessagingService } from "@shared/infra/messaging/shared-messaging.service";

export interface MedicineConsumptionUpsertedPayload {
  medicineId: string;
  userId: string;
  medicineName: string;
  instrucoes: string;
  intervaloDias: number;
  horarios: string[];
}

@Injectable()
export class MedicineConsumptionMessagingService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MedicineConsumptionMessagingService.name);

  constructor(private readonly sharedMessagingService: SharedMessagingService) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      await this.sharedMessagingService.assertExchange(
        NumedHealthExchangeName.MEDICINE_CONSUMPTION_UPSERTED,
      );
    } catch (error) {
      this.logger.error("Failed to assert medicine consumption exchanges", error);
      throw error;
    }
  }

  async publishConsumptionUpserted(payload: MedicineConsumptionUpsertedPayload): Promise<void> {
    await this.sharedMessagingService.publish(
      NumedHealthExchangeName.MEDICINE_CONSUMPTION_UPSERTED,
      NumedHealthRoutingKey.MEDICINE_CONSUMPTION_UPSERTED,
      payload,
    );
  }
}
