import { AppointmentResponseDto } from "@appointments/application/dto/appointment-response.dto";
import { CreateAppointmentDto } from "@appointments/application/dto/create-appointment.dto";
import { UpdateAppointmentDto } from "@appointments/application/dto/update-appointment.dto";
import { AppointmentService } from "@appointments/application/services/appointment.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { Public } from "@shared/infra/decorators/public.decorator";

@ApiTags("appointments")
@Controller("users/:userId/appointments")
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  @Public() // @RequirePermissions(Permission.APPOINTMENTS_READ)
  @ApiOperation({ summary: "Listar consultas do usuário" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "_page", required: false, type: Number })
  @ApiQuery({ name: "_limit", required: false, type: Number })
  async findAllByUserId(
    @Param("userId") userId: string,
    @Query() query: Record<string, string | undefined>,
  ) {
    const page = this.toPositiveInt(query.page ?? query._page, 1);
    const limit = this.toPositiveInt(query.limit ?? query._limit, 10);
    return this.appointmentService.listByUserIdPaginated(userId, { page, limit });
  }

  @Get(":id")
  @Public() // @RequirePermissions(Permission.APPOINTMENTS_READ)
  @ApiOperation({ summary: "Buscar consulta por ID" })
  @ApiNotFoundResponse({ description: "Consulta não encontrada" })
  async findById(
    @Param("userId") userId: string,
    @Param("id") id: string,
  ): Promise<AppointmentResponseDto | null> {
    return this.appointmentService.findById(userId, id);
  }

  @Post()
  @Public() // @RequirePermissions(Permission.APPOINTMENTS_WRITE)
  @ApiOperation({ summary: "Criar consulta para o usuário" })
  @ApiOkResponse({ description: "Consulta criada com sucesso" })
  async create(
    @Param("userId") userId: string,
    @Body() body: CreateAppointmentDto,
  ) {
    await this.appointmentService.create(userId, body);
    return { message: "Consulta criada com sucesso" };
  }

  @Put(":id")
  @Public() // @RequirePermissions(Permission.APPOINTMENTS_WRITE)
  @ApiOperation({ summary: "Atualizar consulta do usuário" })
  @ApiOkResponse({ description: "Consulta atualizada com sucesso" })
  @ApiNotFoundResponse({ description: "Consulta não encontrada" })
  async update(
    @Param("userId") userId: string,
    @Param("id") id: string,
    @Body() body: UpdateAppointmentDto,
  ) {
    await this.appointmentService.edit(userId, id, body);
    return { message: "Consulta atualizada com sucesso" };
  }

  @Delete(":id")
  @Public() // @RequirePermissions(Permission.APPOINTMENTS_DELETE)
  @ApiOperation({ summary: "Remover consulta do usuário" })
  @ApiOkResponse({ description: "Consulta removida com sucesso" })
  async remove(@Param("userId") userId: string, @Param("id") id: string) {
    await this.appointmentService.remove(userId, id);
    return { message: "Consulta removida com sucesso" };
  }

  private toPositiveInt(value: unknown, defaultValue: number): number {
    const parsed = Number.parseInt(String(value), 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return defaultValue;
    return parsed;
  }
}
