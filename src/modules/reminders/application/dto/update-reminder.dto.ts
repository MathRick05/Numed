import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from "class-validator";

export class UpdateReminderDto {
  @ApiProperty({ example: "Tomar remédio", required: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @IsOptional()
  titulo?: string;

  @ApiProperty({ example: "Tomar 1 comprimido após o almoço.", required: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  @IsOptional()
  descricao?: string;

  @ApiProperty({ example: "2026-05-03", required: false })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsOptional()
  data?: string;

  @ApiProperty({ example: "12:30", required: false })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}$/)
  @IsOptional()
  horario?: string;
}
