import { RemindersModule } from "@academic/reminders/reminders.module";
import { AppointmentsModule } from "@academic/appointments/appointments.module";
import { Module } from "@nestjs/common";
import { UsersIntegrationModule } from "../integrations/users/users-integration.module";
import { MedicinesIntegrationModule } from "../integrations/medicines/medicines-integration.module";

@Module({
  imports: [RemindersModule, AppointmentsModule, UsersIntegrationModule, MedicinesIntegrationModule],
})
export class RemindersServiceModule {}
