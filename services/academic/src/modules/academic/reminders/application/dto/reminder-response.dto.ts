import { ApiProperty } from "@nestjs/swagger";
import type { Reminder } from "@reminders/domain/models/remind.entity";

export class ReminderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  titulo: string;

  @ApiProperty()
  descricao: string;

  @ApiProperty()
  data: string;

  @ApiProperty()
  horario: string;

  @ApiProperty()
  createdAt: Date | undefined;

  @ApiProperty()
  updatedAt: Date | undefined;

  private constructor(
    id: string,
    userId: string,
    titulo: string,
    descricao: string,
    data: string,
    horario: string,
    createdAt: Date | undefined,
    updatedAt: Date | undefined,
  ) {
    this.id = id;
    this.userId = userId;
    this.titulo = titulo;
    this.descricao = descricao;
    this.data = data;
    this.horario = horario;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static from(reminder: Reminder | null): ReminderResponseDto | null {
    if (!reminder) return null;

    return new ReminderResponseDto(
      reminder.id!,
      reminder.userId,
      reminder.titulo,
      reminder.descricao,
      reminder.data,
      reminder.horario,
      reminder.createdAt,
      reminder.updatedAt,
    );
  }
}
