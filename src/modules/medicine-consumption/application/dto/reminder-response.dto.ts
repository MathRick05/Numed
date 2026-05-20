import { ReminderStatus } from "@medicine-consumption/domain/enums/reminder-status.enum";
import type { MedicineReminder } from "@medicine-consumption/domain/models/medicine-reminder.entity";
import { ApiProperty } from "@nestjs/swagger";

export class ReminderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  consumptionTimeId: string;

  @ApiProperty()
  agendadoPara: Date;

  @ApiProperty({ enum: ReminderStatus })
  status: ReminderStatus;

  @ApiProperty({ nullable: true })
  confirmadoEm: Date | null;

  @ApiProperty()
  createdAt: Date;

  static from(reminder: MedicineReminder): ReminderResponseDto {
    const dto = new ReminderResponseDto();
    dto.id = reminder.id!;
    dto.consumptionTimeId = reminder.consumptionTimeId;
    dto.agendadoPara = reminder.agendadoPara;
    dto.status = reminder.status;
    dto.confirmadoEm = reminder.confirmadoEm;
    dto.createdAt = reminder.createdAt!;
    return dto;
  }
}
