import { MedicineConsumptionResponseDto } from "@medicine-consumption/application/dto/medicine-consumption-response.dto";
import { UpsertMedicineConsumptionDto } from "@medicine-consumption/application/dto/upsert-medicine-consumption.dto";
import { MedicineConsumptionService } from "@medicine-consumption/application/services/medicine-consumption.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
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
  @RequirePermissions(Permission.MEDICINES_READ)
  @ApiOperation({ summary: "Buscar configuração de consumo do remédio" })
  async findByMedicineId(
    @Param("userId") userId: string,
    @Param("medicineId") medicineId: string,
  ): Promise<MedicineConsumptionResponseDto | null> {
    return this.medicineConsumptionService.findByMedicineId(userId, medicineId);
  }

  @Put()
  @RequirePermissions(Permission.MEDICINES_WRITE)
  @ApiOperation({ summary: "Criar/atualizar configuração de consumo do remédio" })
  @ApiOkResponse({ description: "Configuração de consumo salva com sucesso" })
  @ApiNotFoundResponse({ description: "Remédio não encontrado" })
  async upsert(
    @Param("userId") userId: string,
    @Param("medicineId") medicineId: string,
    @Body() body: UpsertMedicineConsumptionDto,
  ) {
    await this.medicineConsumptionService.upsert(userId, medicineId, body);
    return { message: "Configuração de consumo salva com sucesso" };
  }

  @Delete()
  @RequirePermissions(Permission.MEDICINES_WRITE)
  @ApiOperation({ summary: "Remover configuração de consumo do remédio" })
  @ApiOkResponse({ description: "Configuração de consumo removida com sucesso" })
  async remove(@Param("userId") userId: string, @Param("medicineId") medicineId: string) {
    await this.medicineConsumptionService.remove(userId, medicineId);
    return { message: "Configuração de consumo removida com sucesso" };
  }
}
