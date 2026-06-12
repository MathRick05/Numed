import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";

export class CreateReminderDto {
  @ApiProperty({ example: "Tomar remédio" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  titulo: string;

  @ApiProperty({ example: "Tomar 1 comprimido após o almoço." })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  descricao: string;

  @ApiProperty({ example: "2026-05-03" })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  data: string;

  @ApiProperty({ example: "12:30" })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}$/)
  horario: string;
}
