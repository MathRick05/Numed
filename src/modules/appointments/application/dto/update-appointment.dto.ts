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

export class UpdateAppointmentDto {
  @ApiProperty({ example: "Endocrinologia", required: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @IsOptional()
  tipoConsulta?: string;

  @ApiProperty({ example: "Dra. Ana Souza", required: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @IsOptional()
  doutor?: string;

  @ApiProperty({ example: "2026-05-03", required: false })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsOptional()
  data?: string;

  @ApiProperty({ example: "14:30", required: false })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}$/)
  @IsOptional()
  hora?: string;

  @ApiProperty({ example: "Clínica ABC, Rua X, 123", required: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(400)
  @IsOptional()
  endereco?: string;

  @ApiProperty({ enum: AppointmentStatus, required: false, example: AppointmentStatus.EM_ANDAMENTO })
  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;

  @ApiProperty({ example: "Levar exames recentes.", required: false })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  descricao?: string;
}
