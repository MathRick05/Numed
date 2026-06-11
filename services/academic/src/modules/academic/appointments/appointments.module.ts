import { Module } from "@nestjs/common";
import { UsersClientService } from "@academic/integrations/users/users-client.service";
import { AppointmentMessagingService } from "@appointments/application/services/appointment-messaging.service";
import { AppointmentService } from "@appointments/application/services/appointment.service";
import { APPOINTMENT_REPOSITORY } from "@appointments/domain/repositories/appointment-repository.interface";
import { AppointmentsController } from "@appointments/infra/controllers/appointments.controller";
import { DrizzleAppointmentRepository } from "@appointments/infra/repositories/drizzle-appointment.repository";
import { SharedModule } from "@shared/shared.module";

@Module({
  imports: [SharedModule],
  controllers: [AppointmentsController],
  providers: [
    UsersClientService,
    AppointmentMessagingService,
    AppointmentService,
    DrizzleAppointmentRepository,
    {
      provide: APPOINTMENT_REPOSITORY,
      useExisting: DrizzleAppointmentRepository,
    },
  ],
})
export class AppointmentsModule {}
