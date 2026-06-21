import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsISO8601, IsOptional, IsString } from "class-validator";

export class UpdateMedicineConsumptionConfirmationDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  tomado: boolean;

  @ApiProperty({
    example: "Nao conseguiu tomar no horario",
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  observacao?: string;

  @ApiProperty({ example: "2026-06-20T20:00:00.000Z" })
  @IsISO8601()
  horario: string;
}
