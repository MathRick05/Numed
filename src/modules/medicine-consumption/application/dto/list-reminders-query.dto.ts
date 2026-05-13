import { ReminderStatus } from "@medicine-consumption/domain/enums/reminder-status.enum";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsOptional } from "class-validator";

export class ListRemindersQueryDto {
  @ApiPropertyOptional({
    description: "Filtrar por data (YYYY-MM-DD)",
    example: "2026-05-12",
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ enum: ReminderStatus, description: "Filtrar por status" })
  @IsOptional()
  @IsEnum(ReminderStatus)
  status?: ReminderStatus;
}
