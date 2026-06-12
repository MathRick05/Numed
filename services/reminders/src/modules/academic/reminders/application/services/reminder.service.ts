import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UsersClientService } from "@academic/integrations/users/users-client.service";
import { CreateReminderDto } from "@reminders/application/dto/create-reminder.dto";
import { ReminderResponseDto } from "@reminders/application/dto/reminder-response.dto";
import { UpdateReminderDto } from "@reminders/application/dto/update-reminder.dto";
import { ReminderMessagingService } from "@reminders/application/services/reminder-messaging.service";
import { Reminder } from "@reminders/domain/models/remind.entity";
import {
  REMINDER_REPOSITORY,
  type ReminderRepository,
} from "@reminders/domain/repositories/remind-repository.interface";
import type { PaginatedResult, PaginationParams } from "@shared/infra/hateoas";

@Injectable()
export class ReminderService {
  constructor(
    @Inject(REMINDER_REPOSITORY)
    private readonly reminderRepository: ReminderRepository,
    private readonly usersClientService: UsersClientService,
    private readonly messagingService: ReminderMessagingService,
  ) {}

  async create(userId: string, dto: CreateReminderDto): Promise<void> {
    const user = await this.usersClientService.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const reminder = Reminder.restore({
      userId,
      titulo: dto.titulo,
      descricao: dto.descricao,
      data: dto.data,
      horario: dto.horario,
    })!;

    const created = await this.reminderRepository.create(reminder);

    if (!created) {
      throw new NotFoundException("Created reminder not found");
    }

    await this.messagingService.publishReminderCreated(
      ReminderResponseDto.from(created)!,
    );
  }

  async edit(userId: string, id: string, dto: UpdateReminderDto): Promise<void> {
    const reminder = await this.reminderRepository.findById(userId, id);
    if (!reminder) {
      throw new NotFoundException("Reminder not found");
    }

    if (dto.titulo) reminder.withTitulo(dto.titulo);
    if (dto.descricao) reminder.withDescricao(dto.descricao);
    if (dto.data) reminder.withData(dto.data);
    if (dto.horario) reminder.withHorario(dto.horario);

    await this.reminderRepository.update(reminder);

    await this.messagingService.publishReminderUpdated(
      ReminderResponseDto.from(reminder)!,
    );
  }

  async remove(userId: string, id: string): Promise<void> {
    const reminder = await this.reminderRepository.findById(userId, id);

    if (!reminder) {
      throw new NotFoundException("Reminder not found");
    }

    await this.reminderRepository.delete(userId, id);

    await this.messagingService.publishReminderDeleted(
      ReminderResponseDto.from(reminder)!,
    );
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
