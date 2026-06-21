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
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { CreateMedicineConsumptionConfirmationDto } from "@numed-health/medicine-consumption/application/dto/create-medicine-consumption-confirmation.dto";
import { MedicineConsumptionConfirmationResponseDto } from "@numed-health/medicine-consumption/application/dto/medicine-consumption-confirmation-response.dto";
import { UpdateMedicineConsumptionConfirmationDto } from "@numed-health/medicine-consumption/application/dto/update-medicine-consumption-confirmation.dto";
import { MedicineConsumptionConfirmationService } from "@numed-health/medicine-consumption/application/services/medicine-consumption-confirmation.service";

@ApiTags("medicine-consumption-confirmations")
@ApiBearerAuth()
@Controller("users/:userId/medicines/:medicineId/consumption-confirmations")
export class MedicineConsumptionConfirmationsController {
  constructor(
    private readonly medicineConsumptionConfirmationService: MedicineConsumptionConfirmationService,
  ) {}

  @Get()
  @ApiOperation({ summary: "Listar confirmacoes de tomada do remédio" })
  async list(
    @Param("userId") userId: string,
    @Param("medicineId") medicineId: string,
  ): Promise<MedicineConsumptionConfirmationResponseDto[]> {
    return this.medicineConsumptionConfirmationService.list(userId, medicineId);
  }

  @Get(":confirmationId")
  @ApiOperation({ summary: "Buscar confirmacao de tomada do remédio" })
  @ApiNotFoundResponse({
    description: "Remédio ou confirmação não encontrados",
  })
  async findById(
    @Param("userId") userId: string,
    @Param("medicineId") medicineId: string,
    @Param("confirmationId") confirmationId: string,
  ): Promise<MedicineConsumptionConfirmationResponseDto> {
    return this.medicineConsumptionConfirmationService.findById(
      userId,
      medicineId,
      confirmationId,
    );
  }

  @Post()
  @ApiOperation({ summary: "Criar confirmacao de tomada do remédio" })
  @ApiCreatedResponse({ description: "Confirmação criada" })
  @ApiNotFoundResponse({ description: "Remédio não encontrado" })
  async create(
    @Param("userId") userId: string,
    @Param("medicineId") medicineId: string,
    @Body() body: CreateMedicineConsumptionConfirmationDto,
  ): Promise<MedicineConsumptionConfirmationResponseDto> {
    return this.medicineConsumptionConfirmationService.create(
      userId,
      medicineId,
      body,
    );
  }

  @Put(":confirmationId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Atualizar confirmacao de tomada do remédio" })
  @ApiNoContentResponse({ description: "Confirmação atualizada" })
  @ApiNotFoundResponse({
    description: "Remédio ou confirmação não encontrados",
  })
  async update(
    @Param("userId") userId: string,
    @Param("medicineId") medicineId: string,
    @Param("confirmationId") confirmationId: string,
    @Body() body: UpdateMedicineConsumptionConfirmationDto,
  ) {
    return this.medicineConsumptionConfirmationService.update(
      userId,
      medicineId,
      confirmationId,
      body,
    );
  }

  @Delete(":confirmationId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remover confirmacao de tomada do remédio" })
  @ApiNoContentResponse({ description: "Confirmação removida" })
  @ApiNotFoundResponse({
    description: "Remédio ou confirmação não encontrados",
  })
  async remove(
    @Param("userId") userId: string,
    @Param("medicineId") medicineId: string,
    @Param("confirmationId") confirmationId: string,
  ) {
    return this.medicineConsumptionConfirmationService.remove(
      userId,
      medicineId,
      confirmationId,
    );
  }
}
