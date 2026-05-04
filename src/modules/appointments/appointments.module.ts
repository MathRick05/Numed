import { Module } from "@nestjs/common";
import { AppointmentService } from "@appointments/application/services/appointment.service";
import { APPOINTMENT_REPOSITORY } from "@appointments/domain/repositories/appointment-repository.interface";
import { AppointmentsController } from "@appointments/infra/controllers/appointments.controller";
import { DrizzleAppointmentRepository } from "@appointments/infra/repositories/drizzle-appointment.repository";
import { SharedModule } from "@shared/shared.module";
import { UsersModule } from "@users/users.module";

@Module({
  imports: [SharedModule, UsersModule],
  controllers: [AppointmentsController],
  providers: [
    AppointmentService,
    DrizzleAppointmentRepository,
    {
      provide: APPOINTMENT_REPOSITORY,
      useExisting: DrizzleAppointmentRepository,
    },
  ],
})
export class AppointmentsModule {}
