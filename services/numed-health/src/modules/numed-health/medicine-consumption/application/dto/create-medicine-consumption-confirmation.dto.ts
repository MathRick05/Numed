import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsISO8601, IsOptional, IsString } from "class-validator";

export class CreateMedicineConsumptionConfirmationDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  tomado: boolean;

  @ApiProperty({
    example: "Paciente relatou melhora",
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  observacao?: string;

  @ApiProperty({ example: "2026-06-20T08:00:00.000Z" })
  @IsISO8601()
  horario: string;
}
