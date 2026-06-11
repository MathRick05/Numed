import { ReminderResponseDto } from "@reminders/application/dto/reminder-response.dto";
import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import {
  AcademicExchangeName,
  AcademicRoutingKey,
} from "@shared/contracts/events/academic-events.enum";
import { SharedMessagingService } from "@shared/infra/messaging/shared-messaging.service";

@Injectable()
export class ReminderMessagingService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ReminderMessagingService.name);

  constructor(private readonly sharedMessagingService: SharedMessagingService) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      await Promise.all([
        this.sharedMessagingService.assertExchange(
          AcademicExchangeName.REMINDER_CREATED,
        ),
        this.sharedMessagingService.assertExchange(
          AcademicExchangeName.REMINDER_UPDATED,
        ),
        this.sharedMessagingService.assertExchange(
          AcademicExchangeName.REMINDER_DELETED,
        ),
      ]);
    } catch (error) {
      this.logger.error("Failed to assert reminder exchanges", error);
      throw error;
    }
  }

  async publishReminderCreated(reminder: ReminderResponseDto): Promise<void> {
    await this.sharedMessagingService.publish(
      AcademicExchangeName.REMINDER_CREATED,
      AcademicRoutingKey.REMINDER_CREATED,
      reminder,
    );
  }

  async publishReminderUpdated(reminder: ReminderResponseDto): Promise<void> {
    await this.sharedMessagingService.publish(
      AcademicExchangeName.REMINDER_UPDATED,
      AcademicRoutingKey.REMINDER_UPDATED,
      reminder,
    );
  }

  async publishReminderDeleted(reminder: ReminderResponseDto): Promise<void> {
    await this.sharedMessagingService.publish(
      AcademicExchangeName.REMINDER_DELETED,
      AcademicRoutingKey.REMINDER_DELETED,
      reminder,
    );
  }
}
