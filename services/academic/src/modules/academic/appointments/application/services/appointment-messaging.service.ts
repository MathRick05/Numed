import { AppointmentResponseDto } from "@appointments/application/dto/appointment-response.dto";
import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import {
  AcademicExchangeName,
  AcademicRoutingKey,
} from "@shared/contracts/events/academic-events.enum";
import { SharedMessagingService } from "@shared/infra/messaging/shared-messaging.service";

@Injectable()
export class AppointmentMessagingService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppointmentMessagingService.name);

  constructor(private readonly sharedMessagingService: SharedMessagingService) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      await Promise.all([
        this.sharedMessagingService.assertExchange(
          AcademicExchangeName.APPOINTMENT_CREATED,
        ),
        this.sharedMessagingService.assertExchange(
          AcademicExchangeName.APPOINTMENT_UPDATED,
        ),
        this.sharedMessagingService.assertExchange(
          AcademicExchangeName.APPOINTMENT_DELETED,
        ),
      ]);
    } catch (error) {
      this.logger.error("Failed to assert appointment exchanges", error);
      throw error;
    }
  }

  async publishAppointmentCreated(appointment: AppointmentResponseDto): Promise<void> {
    await this.sharedMessagingService.publish(
      AcademicExchangeName.APPOINTMENT_CREATED,
      AcademicRoutingKey.APPOINTMENT_CREATED,
      appointment,
    );
  }

  async publishAppointmentUpdated(appointment: AppointmentResponseDto): Promise<void> {
    await this.sharedMessagingService.publish(
      AcademicExchangeName.APPOINTMENT_UPDATED,
      AcademicRoutingKey.APPOINTMENT_UPDATED,
      appointment,
    );
  }

  async publishAppointmentDeleted(appointment: AppointmentResponseDto): Promise<void> {
    await this.sharedMessagingService.publish(
      AcademicExchangeName.APPOINTMENT_DELETED,
      AcademicRoutingKey.APPOINTMENT_DELETED,
      appointment,
    );
  }
}
