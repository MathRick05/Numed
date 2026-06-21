import { CreateMedicineDto } from "@numed-health/medicines/application/dto/create-medicine.dto";
import { MedicineDto } from "@numed-health/medicines/application/dto/medicine.dto";
import { UpdateMedicineDto } from "@numed-health/medicines/application/dto/update-medicine.dto";
import { MedicineService } from "@numed-health/medicines/application/services/medicine.service";
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
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
import { HateoasItem, HateoasList } from "@shared/infra/hateoas";

@ApiTags("medicines")
@ApiBearerAuth()
@Controller("users/:userId/medicines")
export class MedicinesController {
  constructor(private readonly medicineService: MedicineService) {}

  @Get()
  // @RequirePermissions(Permission.MEDICINES_READ)
  @ApiOperation({ summary: "Listar remédios do usuário" })
  @ApiQuery({ name: "_page", required: false, type: Number })
  @ApiQuery({ name: "_size", required: false, type: Number })
  @HateoasList<MedicineDto>({
    basePath: "/v1/users/:userId/medicines",
    itemLinks: (item) => ({
      self: { href: `/v1/users/${item.userId}/medicines/${item.id}`, method: "GET" },
      update: { href: `/v1/users/${item.userId}/medicines/${item.id}`, method: "PUT" },
      delete: { href: `/v1/users/${item.userId}/medicines/${item.id}`, method: "DELETE" },
    }),
  })
  async findAll(
    @Param("userId") userId: string,
    @Query("_page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("_size", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.medicineService.listByUserIdPaginated(userId, { page, limit });
  }

  @Get(":id")
  // @RequirePermissions(Permission.MEDICINES_READ)
  @ApiOperation({ summary: "Buscar remédio por ID" })
  @ApiNotFoundResponse({ description: "Remédio não encontrado" })
  @HateoasItem<MedicineDto>({
    basePath: "/v1/users/:userId/medicines",
    itemLinks: (item) => ({
      self: { href: `/v1/users/${item.userId}/medicines/${item.id}`, method: "GET" },
      update: { href: `/v1/users/${item.userId}/medicines/${item.id}`, method: "PUT" },
      delete: { href: `/v1/users/${item.userId}/medicines/${item.id}`, method: "DELETE" },
      list: { href: `/v1/users/${item.userId}/medicines`, method: "GET" },
    }),
  })
  async findById(@Param("userId") userId: string, @Param("id") id: string) {
    return this.medicineService.findById(userId, id);
  }

  @Post()
  // @RequirePermissions(Permission.MEDICINES_WRITE)
  @ApiOperation({ summary: "Criar remédio para o usuário" })
  async create(@Param("userId") userId: string, @Body() body: CreateMedicineDto) {
    return this.medicineService.create(userId, body);
  }

  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  // @RequirePermissions(Permission.MEDICINES_WRITE)
  @ApiOperation({ summary: "Atualizar remédio do usuário" })
  @ApiNoContentResponse({ description: "Remédio atualizado" })
  @ApiNotFoundResponse({ description: "Remédio não encontrado" })
  async update(
    @Param("userId") userId: string,
    @Param("id") id: string,
    @Body() body: UpdateMedicineDto,
  ) {
    return this.medicineService.edit(userId, id, body);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  // @RequirePermissions(Permission.MEDICINES_DELETE)
  @ApiOperation({ summary: "Remover remédio do usuário" })
  @ApiNoContentResponse({ description: "Remédio removido" })
  @ApiNotFoundResponse({ description: "Remédio não encontrado" })
  async remove(@Param("userId") userId: string, @Param("id") id: string) {
    return this.medicineService.remove(userId, id);
  }
}
