import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UsersClientService } from "@academic/integrations/users/users-client.service";
import { AppointmentResponseDto } from "@appointments/application/dto/appointment-response.dto";
import { CreateAppointmentDto } from "@appointments/application/dto/create-appointment.dto";
import { UpdateAppointmentDto } from "@appointments/application/dto/update-appointment.dto";
import { AppointmentMessagingService } from "@appointments/application/services/appointment-messaging.service";
import { Appointment } from "@appointments/domain/models/appointment.entity";
import {
  APPOINTMENT_REPOSITORY,
  type AppointmentRepository,
} from "@appointments/domain/repositories/appointment-repository.interface";
import type { PaginatedResult, PaginationParams } from "@shared/infra/hateoas";

@Injectable()
export class AppointmentService {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: AppointmentRepository,
    private readonly usersClientService: UsersClientService,
    private readonly messagingService: AppointmentMessagingService,
  ) {}

  async create(userId: string, dto: CreateAppointmentDto): Promise<void> {
    const user = await this.usersClientService.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const appointment = Appointment.restore({
      userId,
      tipoConsulta: dto.tipoConsulta,
      doutor: dto.doutor,
      data: dto.data,
      hora: dto.hora,
      endereco: dto.endereco,
      status: dto.status,
      descricao: dto.descricao ?? "",
    })!;

    const created = await this.appointmentRepository.create(appointment);

    if (!created) {
      throw new NotFoundException("Created appointment not found");
    }

    await this.messagingService.publishAppointmentCreated(
      AppointmentResponseDto.from(created)!,
    );
  }

  async edit(userId: string, id: string, dto: UpdateAppointmentDto): Promise<void> {
    const appointment = await this.appointmentRepository.findById(userId, id);
    if (!appointment) {
      throw new NotFoundException("Appointment not found");
    }

    if (dto.tipoConsulta) appointment.withTipoConsulta(dto.tipoConsulta);
    if (dto.doutor) appointment.withDoutor(dto.doutor);
    if (dto.data) appointment.withData(dto.data);
    if (dto.hora) appointment.withHora(dto.hora);
    if (dto.endereco) appointment.withEndereco(dto.endereco);
    if (dto.status) appointment.withStatus(dto.status);
    if (dto.descricao !== undefined) appointment.withDescricao(dto.descricao);

    await this.appointmentRepository.update(appointment);

    await this.messagingService.publishAppointmentUpdated(
      AppointmentResponseDto.from(appointment)!,
    );
  }

  async remove(userId: string, id: string): Promise<void> {
    const appointment = await this.appointmentRepository.findById(userId, id);

    if (!appointment) {
      throw new NotFoundException("Appointment not found");
    }

    await this.appointmentRepository.delete(userId, id);

    await this.messagingService.publishAppointmentDeleted(
      AppointmentResponseDto.from(appointment)!,
    );
  }

  async listByUserId(userId: string): Promise<AppointmentResponseDto[]> {
    const rows = await this.appointmentRepository.findAllByUserId(userId);
    return rows.map((a) => AppointmentResponseDto.from(a)!);
  }

  async listByUserIdPaginated(
    userId: string,
    params: PaginationParams,
  ): Promise<PaginatedResult<AppointmentResponseDto>> {
    const { rows, total } =
      await this.appointmentRepository.findAllByUserIdPaginated(userId, params);

    return {
      data: rows.map((a) => AppointmentResponseDto.from(a)!),
      total,
      page: params.page,
      limit: params.limit,
    };
  }

  async findById(userId: string, id: string): Promise<AppointmentResponseDto | null> {
    const appointment = await this.appointmentRepository.findById(userId, id);
    return AppointmentResponseDto.from(appointment);
  }
}
