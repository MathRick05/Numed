import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { CreateMedicineReminderDto } from "@medicine-consumption/application/dto/create-reminder.dto";
import type { ListRemindersQueryDto } from "@medicine-consumption/application/dto/list-reminders-query.dto";
import { ReminderResponseDto } from "@medicine-consumption/application/dto/reminder-response.dto";
import { ReminderStatus } from "@medicine-consumption/domain/enums/reminder-status.enum";
import { MedicineReminder } from "@medicine-consumption/domain/models/medicine-reminder.entity";
import {
  MEDICINE_REMINDER_REPOSITORY,
  type MedicineReminderRepository,
} from "@medicine-consumption/domain/repositories/medicine-reminder-repository.interface";

@Injectable()
export class MedicineReminderService {
  constructor(
    @Inject(MEDICINE_REMINDER_REPOSITORY)
    private readonly reminderRepository: MedicineReminderRepository,
  ) {}

  async create(
    userId: string,
    medicineId: string,
    dto: CreateMedicineReminderDto,
  ): Promise<ReminderResponseDto> {
    const reminder = MedicineReminder.restore({
      consumptionTimeId: dto.consumptionTimeId,
      agendadoPara: new Date(dto.agendadoPara),
      status: ReminderStatus.PENDENTE,
      confirmadoEm: null,
    })!;

    const created = await this.reminderRepository.create(userId, medicineId, reminder);
    return ReminderResponseDto.from(created);
  }

  async confirm(
    userId: string,
    medicineId: string,
    reminderId: string,
  ): Promise<ReminderResponseDto> {
    const reminder = await this.reminderRepository.findById(userId, medicineId, reminderId);
    if (!reminder) throw new NotFoundException("Lembrete não encontrado");

    const updated = await this.reminderRepository.updateStatus(
      userId,
      medicineId,
      reminderId,
      ReminderStatus.CONFIRMADO,
      new Date(),
    );
    return ReminderResponseDto.from(updated);
  }

  async miss(userId: string, medicineId: string, reminderId: string): Promise<ReminderResponseDto> {
    const reminder = await this.reminderRepository.findById(userId, medicineId, reminderId);
    if (!reminder) throw new NotFoundException("Lembrete não encontrado");

    const updated = await this.reminderRepository.updateStatus(
      userId,
      medicineId,
      reminderId,
      ReminderStatus.PERDIDO,
    );
    return ReminderResponseDto.from(updated);
  }

  async list(
    userId: string,
    medicineId: string,
    query: ListRemindersQueryDto,
  ): Promise<ReminderResponseDto[]> {
    const reminders = await this.reminderRepository.findByMedicineId(userId, medicineId, query);
    return reminders.map(ReminderResponseDto.from);
  }
}
