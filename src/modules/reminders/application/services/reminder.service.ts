import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateReminderDto } from "@reminders/application/dto/create-reminder.dto";
import { ReminderResponseDto } from "@reminders/application/dto/reminder-response.dto";
import { UpdateReminderDto } from "@reminders/application/dto/update-reminder.dto";
import { Reminder } from "@reminders/domain/models/reminder.entity";
import {
  REMINDER_REPOSITORY,
  type ReminderRepository,
} from "@reminders/domain/repositories/reminder-repository.interface";
import type { PaginatedResult, PaginationParams } from "@shared/infra/hateoas";
import { UserService } from "@users/application/services/user.service";

@Injectable()
export class ReminderService {
  constructor(
    @Inject(REMINDER_REPOSITORY)
    private readonly reminderRepository: ReminderRepository,
    private readonly userService: UserService,
  ) {}

  async create(userId: string, dto: CreateReminderDto): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    const reminder = Reminder.restore({
      userId,
      titulo: dto.titulo,
      descricao: dto.descricao,
      data: dto.data,
      horario: dto.horario,
    })!;

    await this.reminderRepository.create(reminder);
  }

  async edit(userId: string, id: string, dto: UpdateReminderDto): Promise<void> {
    const reminder = await this.reminderRepository.findById(userId, id);
    if (!reminder) throw new NotFoundException("Reminder not found");

    if (dto.titulo) reminder.withTitulo(dto.titulo);
    if (dto.descricao) reminder.withDescricao(dto.descricao);
    if (dto.data) reminder.withData(dto.data);
    if (dto.horario) reminder.withHorario(dto.horario);

    await this.reminderRepository.update(reminder);
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.reminderRepository.delete(userId, id);
  }

  async listByUserIdPaginated(
    userId: string,
    params: PaginationParams,
  ): Promise<PaginatedResult<ReminderResponseDto>> {
    const { rows, total } = await this.reminderRepository.findAllByUserIdPaginated(
      userId,
      params,
    );

    return {
      data: rows.map((r) => ReminderResponseDto.from(r)!),
      total,
      page: params.page,
      limit: params.limit,
    };
  }

  async findById(userId: string, id: string): Promise<ReminderResponseDto | null> {
    const reminder = await this.reminderRepository.findById(userId, id);
    return ReminderResponseDto.from(reminder);
  }
}
