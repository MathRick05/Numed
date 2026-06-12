import { CreateReminderDto } from "@reminders/application/dto/create-reminder.dto";
import { ReminderResponseDto } from "@reminders/application/dto/reminder-response.dto";
import { UpdateReminderDto } from "@reminders/application/dto/update-reminder.dto";
import { ReminderService } from "@reminders/application/services/reminder.service";
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
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { Public } from "@shared/infra/decorators/public.decorator";
import { HateoasItem, HateoasList } from "@shared/infra/hateoas";

@ApiTags("reminders")
@Controller("users/:userId/reminders")
export class RemindersController {
  constructor(private readonly reminderService: ReminderService) {}

  @Get()
  @Public() // @RequirePermissions(Permission.REMINDERS_READ)
  @ApiOperation({ summary: "Listar lembretes do usuário" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "_page", required: false, type: Number })
  @ApiQuery({ name: "_limit", required: false, type: Number })
  @HateoasList<ReminderResponseDto>({
    basePath: "/v1/users/:userId/reminders",
    itemLinks: (item) => ({
      self: { href: `/v1/users/${item.userId}/reminders/${item.id}`, method: "GET" },
      update: { href: `/v1/users/${item.userId}/reminders/${item.id}`, method: "PUT" },
      delete: { href: `/v1/users/${item.userId}/reminders/${item.id}`, method: "DELETE" },
    }),
  })
  async findAllByUserId(
    @Param("userId") userId: string,
    @Query() query: Record<string, string | undefined>,
  ) {
    const page = this.toPositiveInt(query.page ?? query._page, 1);
    const limit = this.toPositiveInt(query.limit ?? query._limit, 10);
    return this.reminderService.listByUserIdPaginated(userId, { page, limit });
  }

  @Get(":id")
  @Public() // @RequirePermissions(Permission.REMINDERS_READ)
  @ApiOperation({ summary: "Buscar lembrete por ID" })
  @ApiNotFoundResponse({ description: "Lembrete não encontrado" })
  @HateoasItem<ReminderResponseDto>({
    basePath: "/v1/users/:userId/reminders",
    itemLinks: (item) => ({
      self: { href: `/v1/users/${item.userId}/reminders/${item.id}`, method: "GET" },
      update: { href: `/v1/users/${item.userId}/reminders/${item.id}`, method: "PUT" },
      delete: { href: `/v1/users/${item.userId}/reminders/${item.id}`, method: "DELETE" },
      list: { href: `/v1/users/${item.userId}/reminders`, method: "GET" },
    }),
  })
  async findById(
    @Param("userId") userId: string,
    @Param("id") id: string,
  ): Promise<ReminderResponseDto | null> {
    return this.reminderService.findById(userId, id);
  }

  @Post()
  @Public() // @RequirePermissions(Permission.REMINDERS_WRITE)
  @ApiOperation({ summary: "Criar lembrete para o usuário" })
  async create(@Param("userId") userId: string, @Body() body: CreateReminderDto) {
    return this.reminderService.create(userId, body);
  }

  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Public() // @RequirePermissions(Permission.REMINDERS_WRITE)
  @ApiOperation({ summary: "Atualizar lembrete do usuário" })
  @ApiNoContentResponse({ description: "Lembrete atualizado" })
  @ApiNotFoundResponse({ description: "Lembrete não encontrado" })
  async update(
    @Param("userId") userId: string,
    @Param("id") id: string,
    @Body() body: UpdateReminderDto,
  ) {
    return this.reminderService.edit(userId, id, body);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Public() // @RequirePermissions(Permission.REMINDERS_DELETE)
  @ApiOperation({ summary: "Remover lembrete do usuário" })
  @ApiNoContentResponse({ description: "Lembrete removido" })
  async remove(@Param("userId") userId: string, @Param("id") id: string) {
    return this.reminderService.remove(userId, id);
  }

  private toPositiveInt(value: unknown, defaultValue: number): number {
    const parsed = Number.parseInt(String(value), 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return defaultValue;
    return parsed;
  }
}
