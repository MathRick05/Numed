import { MedicineConsumptionResponseDto } from "@numed-health/medicine-consumption/application/dto/medicine-consumption-response.dto";
import { UpsertMedicineConsumptionDto } from "@numed-health/medicine-consumption/application/dto/upsert-medicine-consumption.dto";
import { MedicineConsumptionService } from "@numed-health/medicine-consumption/application/services/medicine-consumption.service";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Put } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { Permission } from "@shared/domain/enums/permission.enum";
import { RequirePermissions } from "@shared/infra/decorators/permissions.decorator";

@ApiTags("medicine-consumption")
@ApiBearerAuth()
@Controller("users/:userId/medicines/:medicineId/consumption")
export class MedicineConsumptionController {
  constructor(private readonly medicineConsumptionService: MedicineConsumptionService) {}

  @Get()
  // @RequirePermissions(Permission.MEDICINES_READ)
  @ApiOperation({ summary: "Buscar configuração de consumo do remédio" })
  async findByMedicineId(
    @Param("userId") userId: string,
    @Param("medicineId") medicineId: string,
  ): Promise<MedicineConsumptionResponseDto | null> {
    return this.medicineConsumptionService.findByMedicineId(userId, medicineId);
  }

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  // @RequirePermissions(Permission.MEDICINES_WRITE)
  @ApiOperation({ summary: "Criar/atualizar configuração de consumo do remédio" })
  @ApiNoContentResponse({ description: "Configuração de consumo salva" })
  @ApiNotFoundResponse({ description: "Remédio não encontrado" })
  async upsert(
    @Param("userId") userId: string,
    @Param("medicineId") medicineId: string,
    @Body() body: UpsertMedicineConsumptionDto,
  ) {
    return this.medicineConsumptionService.upsert(userId, medicineId, body);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  // @RequirePermissions(Permission.MEDICINES_WRITE)
  @ApiOperation({ summary: "Remover configuração de consumo do remédio" })
  @ApiNoContentResponse({ description: "Configuração de consumo removida" })
  async remove(@Param("userId") userId: string, @Param("medicineId") medicineId: string) {
    return this.medicineConsumptionService.remove(userId, medicineId);
  }
}
