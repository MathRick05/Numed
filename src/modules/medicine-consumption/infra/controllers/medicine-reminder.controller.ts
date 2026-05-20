import { CreateMedicineReminderDto } from "@medicine-consumption/application/dto/create-reminder.dto";
import { ListRemindersQueryDto } from "@medicine-consumption/application/dto/list-reminders-query.dto";
import { ReminderResponseDto } from "@medicine-consumption/application/dto/reminder-response.dto";
import { MedicineReminderService } from "@medicine-consumption/application/services/medicine-reminder.service";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { Permission } from "@shared/domain/enums/permission.enum";
import { RequirePermissions } from "@shared/infra/decorators/permissions.decorator";

@ApiTags("medicine-reminders")
@ApiBearerAuth()
@Controller("users/:userId/medicines/:medicineId/consumption/reminders")
export class MedicineReminderController {
  constructor(private readonly medicineReminderService: MedicineReminderService) {}

  @Post()
  @RequirePermissions(Permission.MEDICINES_WRITE)
  @ApiOperation({ summary: "Criar lembrete de consumo do remédio" })
  @ApiNotFoundResponse({ description: "Remédio ou horário de consumo não encontrado" })
  async create(
    @Param("userId") userId: string,
    @Param("medicineId") medicineId: string,
    @Body() body: CreateMedicineReminderDto,
  ): Promise<ReminderResponseDto> {
    return this.medicineReminderService.create(userId, medicineId, body);
  }

  @Get()
  @RequirePermissions(Permission.MEDICINES_READ)
  @ApiOperation({ summary: "Listar lembretes (filtrável por data e status)" })
  async list(
    @Param("userId") userId: string,
    @Param("medicineId") medicineId: string,
    @Query() query: ListRemindersQueryDto,
  ): Promise<ReminderResponseDto[]> {
    return this.medicineReminderService.list(userId, medicineId, query);
  }

  @Patch(":reminderId/confirm")
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permission.MEDICINES_WRITE)
  @ApiOperation({ summary: "Confirmar que o remédio foi tomado" })
  @ApiNotFoundResponse({ description: "Lembrete não encontrado" })
  async confirm(
    @Param("userId") userId: string,
    @Param("medicineId") medicineId: string,
    @Param("reminderId") reminderId: string,
  ): Promise<ReminderResponseDto> {
    return this.medicineReminderService.confirm(userId, medicineId, reminderId);
  }

  @Patch(":reminderId/miss")
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permission.MEDICINES_WRITE)
  @ApiOperation({ summary: "Marcar lembrete como perdido (dose não tomada)" })
  @ApiNotFoundResponse({ description: "Lembrete não encontrado" })
  async miss(
    @Param("userId") userId: string,
    @Param("medicineId") medicineId: string,
    @Param("reminderId") reminderId: string,
  ): Promise<ReminderResponseDto> {
    return this.medicineReminderService.miss(userId, medicineId, reminderId);
  }
}
