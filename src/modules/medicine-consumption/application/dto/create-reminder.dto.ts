import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsUUID } from "class-validator";

export class CreateMedicineReminderDto {
  @ApiProperty({ description: "ID do horário de consumo agendado", example: "uuid-do-horario" })
  @IsUUID()
  consumptionTimeId: string;

  @ApiProperty({
    description: "Data e hora agendada para o lembrete (ISO 8601)",
    example: "2026-05-12T08:00:00.000Z",
  })
  @IsDateString()
  agendadoPara: string;
}
