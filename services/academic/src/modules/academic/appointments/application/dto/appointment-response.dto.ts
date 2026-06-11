import { ApiProperty } from "@nestjs/swagger";
import { AppointmentStatus } from "@appointments/domain/enums/appointment-status.enum";
import type { Appointment } from "@appointments/domain/models/appointment.entity";

export class AppointmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  tipoConsulta: string;

  @ApiProperty()
  doutor: string;

  @ApiProperty()
  data: string;

  @ApiProperty()
  hora: string;

  @ApiProperty()
  endereco: string;

  @ApiProperty({ enum: AppointmentStatus })
  status: AppointmentStatus;

  @ApiProperty()
  descricao: string;

  @ApiProperty()
  createdAt: Date | undefined;

  @ApiProperty()
  updatedAt: Date | undefined;

  private constructor(
    id: string,
    userId: string,
    tipoConsulta: string,
    doutor: string,
    data: string,
    hora: string,
    endereco: string,
    status: AppointmentStatus,
    descricao: string,
    createdAt: Date | undefined,
    updatedAt: Date | undefined,
  ) {
    this.id = id;
    this.userId = userId;
    this.tipoConsulta = tipoConsulta;
    this.doutor = doutor;
    this.data = data;
    this.hora = hora;
    this.endereco = endereco;
    this.status = status;
    this.descricao = descricao;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static from(appointment: Appointment | null): AppointmentResponseDto | null {
    if (!appointment) return null;

    return new AppointmentResponseDto(
      appointment.id!,
      appointment.userId,
      appointment.tipoConsulta,
      appointment.doutor,
      appointment.data,
      appointment.hora,
      appointment.endereco,
      appointment.status,
      appointment.descricao,
      appointment.createdAt,
      appointment.updatedAt,
    );
  }
}
