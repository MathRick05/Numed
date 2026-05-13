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
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { CreateMedicineDto } from "@medicine/application/dto/create-medicine.dto";
import { MedicineResponseDto } from "@medicine/application/dto/medicine-response.dto";
import { UpdateMedicineDto } from "@medicine/application/dto/update-medicine.dto";
import { MedicineService } from "@medicine/application/services/medicine.service";
import { Permission } from "@shared/domain/enums/permission.enum";
import { RequirePermissions } from "@shared/infra/decorators/permissions.decorator";

@ApiTags("medicines")
@ApiBearerAuth()
@Controller("users/:userId/medicines")
export class MedicinesController {
  constructor(private readonly medicineService: MedicineService) {}

  @Get()
  @RequirePermissions(Permission.MEDICINES_READ)
  @ApiOperation({ summary: "Listar remédios do usuário" })
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
    return this.medicineService.listByUserIdPaginated(userId, { page, limit });
  }

  @Get(":id")
  @RequirePermissions(Permission.MEDICINES_READ)
  @ApiOperation({ summary: "Buscar remédio por ID" })
  @ApiNotFoundResponse({ description: "Remédio não encontrado" })
  async findById(
    @Param("userId") userId: string,
    @Param("id") id: string,
  ): Promise<MedicineResponseDto | null> {
    return this.medicineService.findById(userId, id);
  }

  @Post()
  @RequirePermissions(Permission.MEDICINES_WRITE)
  @ApiOperation({ summary: "Criar remédio para o usuário" })
  @ApiOkResponse({ description: "Remédio criado com sucesso" })
  async create(@Param("userId") userId: string, @Body() body: CreateMedicineDto) {
    await this.medicineService.create(userId, body);
    return { message: "Remédio criado com sucesso" };
  }

  @Put(":id")
  @RequirePermissions(Permission.MEDICINES_WRITE)
  @ApiOperation({ summary: "Atualizar remédio do usuário" })
  @ApiOkResponse({ description: "Remédio atualizado com sucesso" })
  @ApiNotFoundResponse({ description: "Remédio não encontrado" })
  async update(
    @Param("userId") userId: string,
    @Param("id") id: string,
    @Body() body: UpdateMedicineDto,
  ) {
    await this.medicineService.edit(userId, id, body);
    return { message: "Remédio atualizado com sucesso" };
  }

  @Delete(":id")
  @RequirePermissions(Permission.MEDICINES_DELETE)
  @ApiOperation({ summary: "Remover remédio do usuário" })
  @ApiOkResponse({ description: "Remédio removido com sucesso" })
  async remove(@Param("userId") userId: string, @Param("id") id: string) {
    await this.medicineService.remove(userId, id);
    return { message: "Remédio removido com sucesso" };
  }

  private toPositiveInt(value: unknown, defaultValue: number): number {
    const parsed = Number.parseInt(String(value), 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return defaultValue;
    return parsed;
  }
}
