import { Module } from "@nestjs/common";
import { ReminderService } from "@reminders/application/services/reminder.service";
import { REMINDER_REPOSITORY } from "@reminders/domain/repositories/reminder-repository.interface";
import { RemindersController } from "@reminders/infra/controllers/reminders.controller";
import { DrizzleReminderRepository } from "@reminders/infra/repositories/drizzle-reminder.repository";
import { SharedModule } from "@shared/shared.module";
import { UsersModule } from "@users/users.module";

@Module({
  imports: [SharedModule, UsersModule],
  controllers: [RemindersController],
  providers: [
    ReminderService,
    DrizzleReminderRepository,
    {
      provide: REMINDER_REPOSITORY,
      useExisting: DrizzleReminderRepository,
    },
  ],
})
export class RemindersModule {}
