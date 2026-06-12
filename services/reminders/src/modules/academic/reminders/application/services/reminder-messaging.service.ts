import { ReminderResponseDto } from "@reminders/application/dto/reminder-response.dto";
import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import {
  RemindersExchangeName,
  RemindersRoutingKey,
} from "@shared/contracts/events/reminders-events.enum";
import { SharedMessagingService } from "@shared/infra/messaging/shared-messaging.service";

@Injectable()
export class ReminderMessagingService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ReminderMessagingService.name);

  constructor(private readonly sharedMessagingService: SharedMessagingService) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      await Promise.all([
        this.sharedMessagingService.assertExchange(RemindersExchangeName.REMINDER_CREATED),
        this.sharedMessagingService.assertExchange(RemindersExchangeName.REMINDER_UPDATED),
        this.sharedMessagingService.assertExchange(RemindersExchangeName.REMINDER_DELETED),
      ]);
    } catch (error) {
      this.logger.error("Failed to assert reminder exchanges", error);
      throw error;
    }
  }

  async publishReminderCreated(reminder: ReminderResponseDto): Promise<void> {
    await this.sharedMessagingService.publish(
      RemindersExchangeName.REMINDER_CREATED,
      RemindersRoutingKey.REMINDER_CREATED,
      reminder,
    );
  }

  async publishReminderUpdated(reminder: ReminderResponseDto): Promise<void> {
    await this.sharedMessagingService.publish(
      RemindersExchangeName.REMINDER_UPDATED,
      RemindersRoutingKey.REMINDER_UPDATED,
      reminder,
    );
  }

  async publishReminderDeleted(reminder: ReminderResponseDto): Promise<void> {
    await this.sharedMessagingService.publish(
      RemindersExchangeName.REMINDER_DELETED,
      RemindersRoutingKey.REMINDER_DELETED,
      reminder,
    );
  }
}
