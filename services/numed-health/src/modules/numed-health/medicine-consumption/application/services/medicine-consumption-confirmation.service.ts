import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateMedicineConsumptionConfirmationDto } from "@numed-health/medicine-consumption/application/dto/create-medicine-consumption-confirmation.dto";
import { MedicineConsumptionConfirmationResponseDto } from "@numed-health/medicine-consumption/application/dto/medicine-consumption-confirmation-response.dto";
import { UpdateMedicineConsumptionConfirmationDto } from "@numed-health/medicine-consumption/application/dto/update-medicine-consumption-confirmation.dto";
import { MedicineConsumptionConfirmation } from "@numed-health/medicine-consumption/domain/models/medicine-consumption-confirmation.entity";
import {
  MEDICINE_CONSUMPTION_REPOSITORY,
  type MedicineConsumptionRepository,
} from "@numed-health/medicine-consumption/domain/repositories/medicine-consumption-repository.interface";
import {
  MEDICINE_REPOSITORY,
  type MedicineRepository,
} from "@numed-health/medicines/domain/repositories/medicine-repository.interface";

@Injectable()
export class MedicineConsumptionConfirmationService {
  constructor(
    @Inject(MEDICINE_CONSUMPTION_REPOSITORY)
    private readonly medicineConsumptionRepository: MedicineConsumptionRepository,
    @Inject(MEDICINE_REPOSITORY)
    private readonly medicineRepository: MedicineRepository,
  ) {}

  async create(
    userId: string,
    medicineId: string,
    dto: CreateMedicineConsumptionConfirmationDto,
  ): Promise<MedicineConsumptionConfirmationResponseDto> {
    await this.ensureMedicineExists(userId, medicineId);

    const created = await this.medicineConsumptionRepository.createConfirmation(
      medicineId,
      MedicineConsumptionConfirmation.restore({
        medicineId,
        tomado: dto.tomado,
        observacao: dto.observacao ?? null,
        horario: new Date(dto.horario),
      })!,
    );

    return MedicineConsumptionConfirmationResponseDto.from(created)!;
  }

  async list(
    userId: string,
    medicineId: string,
  ): Promise<MedicineConsumptionConfirmationResponseDto[]> {
    await this.ensureMedicineExists(userId, medicineId);

    const confirmations =
      await this.medicineConsumptionRepository.listConfirmations(medicineId);
    return confirmations.map(
      (confirmation) =>
        MedicineConsumptionConfirmationResponseDto.from(confirmation)!,
    );
  }

  async findById(
    userId: string,
    medicineId: string,
    confirmationId: string,
  ): Promise<MedicineConsumptionConfirmationResponseDto> {
    await this.ensureMedicineExists(userId, medicineId);

    const confirmation =
      await this.medicineConsumptionRepository.findConfirmationById(
        medicineId,
        confirmationId,
      );
    if (!confirmation)
      throw new NotFoundException("Medicine confirmation not found");

    return MedicineConsumptionConfirmationResponseDto.from(confirmation)!;
  }

  async update(
    userId: string,
    medicineId: string,
    confirmationId: string,
    dto: UpdateMedicineConsumptionConfirmationDto,
  ): Promise<void> {
    await this.ensureMedicineExists(userId, medicineId);

    const confirmation =
      await this.medicineConsumptionRepository.findConfirmationById(
        medicineId,
        confirmationId,
      );
    if (!confirmation)
      throw new NotFoundException("Medicine confirmation not found");

    confirmation.withTomado(dto.tomado);
    confirmation.withObservacao(dto.observacao ?? null);
    confirmation.withHorario(new Date(dto.horario));

    await this.medicineConsumptionRepository.updateConfirmation(
      medicineId,
      confirmation,
    );
  }

  async remove(
    userId: string,
    medicineId: string,
    confirmationId: string,
  ): Promise<void> {
    await this.ensureMedicineExists(userId, medicineId);

    const confirmation =
      await this.medicineConsumptionRepository.findConfirmationById(
        medicineId,
        confirmationId,
      );
    if (!confirmation)
      throw new NotFoundException("Medicine confirmation not found");

    await this.medicineConsumptionRepository.deleteConfirmation(
      medicineId,
      confirmationId,
    );
  }

  private async ensureMedicineExists(
    userId: string,
    medicineId: string,
  ): Promise<void> {
    const medicine = await this.medicineRepository.findById(userId, medicineId);
    if (!medicine) throw new NotFoundException("Medicine not found");
  }
}
