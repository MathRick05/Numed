import { RemindersModule } from "@academic/reminders/reminders.module";
import { AppointmentsModule } from "@academic/appointments/appointments.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [RemindersModule, AppointmentsModule],
})
export class AcademicModule {}
