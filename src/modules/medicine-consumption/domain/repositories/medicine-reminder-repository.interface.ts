import type { ReminderStatus } from "@medicine-consumption/domain/enums/reminder-status.enum";
import type { MedicineReminder } from "@medicine-consumption/domain/models/medicine-reminder.entity";

export const MEDICINE_REMINDER_REPOSITORY = Symbol("MEDICINE_REMINDER_REPOSITORY");

export interface MedicineReminderRepository {
  create(userId: string, medicineId: string, reminder: MedicineReminder): Promise<MedicineReminder>;

  findById(userId: string, medicineId: string, reminderId: string): Promise<MedicineReminder | null>;

  findByMedicineId(
    userId: string,
    medicineId: string,
    filters?: { date?: string; status?: ReminderStatus },
  ): Promise<MedicineReminder[]>;

  updateStatus(
    userId: string,
    medicineId: string,
    reminderId: string,
    status: ReminderStatus,
    confirmadoEm?: Date,
  ): Promise<MedicineReminder>;
}
