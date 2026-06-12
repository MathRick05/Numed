import { Module } from "@nestjs/common";
import { UsersClientService } from "@academic/integrations/users/users-client.service";
import { ReminderMessagingService } from "@reminders/application/services/reminder-messaging.service";
import { ReminderService } from "@reminders/application/services/reminder.service";
import { REMINDER_REPOSITORY } from "@reminders/domain/repositories/remind-repository.interface";
import { RemindersController } from "@reminders/infra/controllers/reminder.controller";
import { DrizzleReminderRepository } from "@reminders/infra/repositories/drizzle-reminder.repository";
import { SharedModule } from "@shared/shared.module";

@Module({
  imports: [SharedModule],
  controllers: [RemindersController],
  providers: [
    UsersClientService,
    ReminderMessagingService,
    ReminderService,
    DrizzleReminderRepository,
    {
      provide: REMINDER_REPOSITORY,
      useExisting: DrizzleReminderRepository,
    },
  ],
})
export class RemindersModule {}
