import { Inject, Injectable } from "@nestjs/common";
import { MedicineConsumptionResponseDto } from "@numed-health/medicine-consumption/application/dto/medicine-consumption-response.dto";
import { UpsertMedicineConsumptionDto } from "@numed-health/medicine-consumption/application/dto/upsert-medicine-consumption.dto";
import { TreatmentDurationUnit } from "@numed-health/medicine-consumption/domain/enums/treatment-duration-unit.enum";
import { MedicineConsumptionDetails } from "@numed-health/medicine-consumption/domain/models/medicine-consumption-details.entity";
import { MedicineConsumptionTime } from "@numed-health/medicine-consumption/domain/models/medicine-consumption-time.entity";
import {
  MEDICINE_CONSUMPTION_REPOSITORY,
  type MedicineConsumptionRepository,
} from "@numed-health/medicine-consumption/domain/repositories/medicine-consumption-repository.interface";

@Injectable()
export class MedicineConsumptionService {
  constructor(
    @Inject(MEDICINE_CONSUMPTION_REPOSITORY)
    private readonly medicineConsumptionRepository: MedicineConsumptionRepository,
  ) {}

  async upsert(userId: string, medicineId: string, dto: UpsertMedicineConsumptionDto): Promise<void> {
    const details = MedicineConsumptionDetails.restore({
      medicineId,
      intervaloDias: dto.intervaloDias,
      duracaoUnidade: dto.duracaoUnidade,
      duracaoValor:
        dto.duracaoUnidade === TreatmentDurationUnit.CONTINUO ? null : (dto.duracaoValor ?? null),
    })!;

    const times = dto.horarios.map(
      (hora) => MedicineConsumptionTime.restore({ detailsId: "temp", hora })!,
    );

    await this.medicineConsumptionRepository.upsertDetailsWithTimes(userId, medicineId, details, times);
  }

  async findByMedicineId(
    userId: string,
    medicineId: string,
  ): Promise<MedicineConsumptionResponseDto | null> {
    const result = await this.medicineConsumptionRepository.findByMedicineId(userId, medicineId);
    return MedicineConsumptionResponseDto.from(result);
  }

  async remove(userId: string, medicineId: string): Promise<void> {
    await this.medicineConsumptionRepository.deleteByMedicineId(userId, medicineId);
  }
}
