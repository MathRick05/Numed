import type { PaginationParams } from "@shared/infra/hateoas";
import type { Reminder } from "@reminders/domain/models/remind.entity";

export const REMINDER_REPOSITORY = Symbol("REMINDER_REPOSITORY");

export interface ReminderRepository {
  create(reminder: Reminder): Promise<Reminder>;
  update(reminder: Reminder): Promise<void>;
  delete(userId: string, id: string): Promise<void>;
  findById(userId: string, id: string): Promise<Reminder | null>;
  findAllByUserId(userId: string): Promise<Reminder[]>;
  findAllByUserIdPaginated(
    userId: string,
    params: PaginationParams,
  ): Promise<{ rows: Reminder[]; total: number }>;
}
