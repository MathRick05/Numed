import { ApiProperty } from "@nestjs/swagger";
import { AppointmentStatus } from "@appointments/domain/enums/appointment-status.enum";
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from "class-validator";

export class CreateAppointmentDto {
  @ApiProperty({ example: "Endocrinologia" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  tipoConsulta: string;

  @ApiProperty({ example: "Dra. Ana Souza" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  doutor: string;

  @ApiProperty({ example: "2026-05-03" })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  data: string;

  @ApiProperty({ example: "14:30" })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}$/)
  hora: string;

  @ApiProperty({ example: "Clínica ABC, Rua X, 123" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(400)
  endereco: string;

  @ApiProperty({ enum: AppointmentStatus, example: AppointmentStatus.EM_ANDAMENTO })
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;

  @ApiProperty({ example: "Levar exames recentes.", required: false })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  descricao?: string;
}
