import { AppointmentResponseDto } from "@appointments/application/dto/appointment-response.dto";
import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import {
  RemindersExchangeName,
  RemindersRoutingKey,
} from "@shared/contracts/events/reminders-events.enum";
import { SharedMessagingService } from "@shared/infra/messaging/shared-messaging.service";

@Injectable()
export class AppointmentMessagingService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppointmentMessagingService.name);

  constructor(private readonly sharedMessagingService: SharedMessagingService) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      await Promise.all([
        this.sharedMessagingService.assertExchange(RemindersExchangeName.APPOINTMENT_CREATED),
        this.sharedMessagingService.assertExchange(RemindersExchangeName.APPOINTMENT_UPDATED),
        this.sharedMessagingService.assertExchange(RemindersExchangeName.APPOINTMENT_DELETED),
      ]);
    } catch (error) {
      this.logger.error("Failed to assert appointment exchanges", error);
      throw error;
    }
  }

  async publishAppointmentCreated(appointment: AppointmentResponseDto): Promise<void> {
    await this.sharedMessagingService.publish(
      RemindersExchangeName.APPOINTMENT_CREATED,
      RemindersRoutingKey.APPOINTMENT_CREATED,
      appointment,
    );
  }

  async publishAppointmentUpdated(appointment: AppointmentResponseDto): Promise<void> {
    await this.sharedMessagingService.publish(
      RemindersExchangeName.APPOINTMENT_UPDATED,
      RemindersRoutingKey.APPOINTMENT_UPDATED,
      appointment,
    );
  }

  async publishAppointmentDeleted(appointment: AppointmentResponseDto): Promise<void> {
    await this.sharedMessagingService.publish(
      RemindersExchangeName.APPOINTMENT_DELETED,
      RemindersRoutingKey.APPOINTMENT_DELETED,
      appointment,
    );
  }
}
