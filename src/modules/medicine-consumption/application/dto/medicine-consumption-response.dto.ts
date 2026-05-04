import { ApiProperty } from "@nestjs/swagger";
import { TreatmentDurationUnit } from "@medicine-consumption/domain/enums/treatment-duration-unit.enum";
import type { MedicineConsumptionDetails } from "@medicine-consumption/domain/models/medicine-consumption-details.entity";
import type { MedicineConsumptionTime } from "@medicine-consumption/domain/models/medicine-consumption-time.entity";

export class MedicineConsumptionResponseDto {
  @ApiProperty()
  medicineId: string;

  @ApiProperty()
  intervaloDias: number;

  @ApiProperty({ enum: TreatmentDurationUnit })
  duracaoUnidade: TreatmentDurationUnit;

  @ApiProperty({ nullable: true })
  duracaoValor: number | null;

  @ApiProperty({ isArray: true, type: String, example: ["08:00", "20:00"] })
  horarios: string[];

  private constructor(
    medicineId: string,
    intervaloDias: number,
    duracaoUnidade: TreatmentDurationUnit,
    duracaoValor: number | null,
    horarios: string[],
  ) {
    this.medicineId = medicineId;
    this.intervaloDias = intervaloDias;
    this.duracaoUnidade = duracaoUnidade;
    this.duracaoValor = duracaoValor;
    this.horarios = horarios;
  }

  static from(
    data: { details: MedicineConsumptionDetails; times: MedicineConsumptionTime[] } | null,
  ): MedicineConsumptionResponseDto | null {
    if (!data) return null;

    const { details, times } = data;
    return new MedicineConsumptionResponseDto(
      details.medicineId,
      details.intervaloDias,
      details.duracaoUnidade,
      details.duracaoValor,
      times.map((t) => t.hora),
    );
  }
}
