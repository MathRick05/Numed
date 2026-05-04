import { AppointmentResponseDto } from "@appointments/application/dto/appointment-response.dto";
import { CreateAppointmentDto } from "@appointments/application/dto/create-appointment.dto";
import { UpdateAppointmentDto } from "@appointments/application/dto/update-appointment.dto";
import { AppointmentService } from "@appointments/application/services/appointment.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { Permission } from "@shared/domain/enums/permission.enum";
import { RequirePermissions } from "@shared/infra/decorators/permissions.decorator";

@ApiTags("appointments")
@ApiBearerAuth()
@Controller("users/:userId/appointments")
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  @RequirePermissions(Permission.APPOINTMENTS_READ)
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
  @RequirePermissions(Permission.APPOINTMENTS_READ)
  @ApiOperation({ summary: "Buscar consulta por ID" })
  @ApiNotFoundResponse({ description: "Consulta não encontrada" })
  async findById(
    @Param("userId") userId: string,
    @Param("id") id: string,
  ): Promise<AppointmentResponseDto | null> {
    return this.appointmentService.findById(userId, id);
  }

  @Post()
  @RequirePermissions(Permission.APPOINTMENTS_WRITE)
  @ApiOperation({ summary: "Criar consulta para o usuário" })
  async create(
    @Param("userId") userId: string,
    @Body() body: CreateAppointmentDto,
  ) {
    return this.appointmentService.create(userId, body);
  }

  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.APPOINTMENTS_WRITE)
  @ApiOperation({ summary: "Atualizar consulta do usuário" })
  @ApiNoContentResponse({ description: "Consulta atualizada" })
  @ApiNotFoundResponse({ description: "Consulta não encontrada" })
  async update(
    @Param("userId") userId: string,
    @Param("id") id: string,
    @Body() body: UpdateAppointmentDto,
  ) {
    return this.appointmentService.edit(userId, id, body);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermissions(Permission.APPOINTMENTS_DELETE)
  @ApiOperation({ summary: "Remover consulta do usuário" })
  @ApiNoContentResponse({ description: "Consulta removida" })
  async remove(@Param("userId") userId: string, @Param("id") id: string) {
    return this.appointmentService.remove(userId, id);
  }

  private toPositiveInt(value: unknown, defaultValue: number): number {
    const parsed = Number.parseInt(String(value), 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return defaultValue;
    return parsed;
  }
}
