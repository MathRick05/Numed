import { ApiProperty } from "@nestjs/swagger";
import { MedicineConsumptionConfirmationResponseDto } from "@numed-health/medicine-consumption/application/dto/medicine-consumption-confirmation-response.dto";
import { TreatmentDurationUnit } from "@numed-health/medicine-consumption/domain/enums/treatment-duration-unit.enum";
import type { MedicineConsumptionData } from "@numed-health/medicine-consumption/domain/repositories/medicine-consumption-repository.interface";

export class ConsumptionTimeDto {
  @ApiProperty() id: string;
  @ApiProperty({ example: "08:00" }) hora: string;
}

export class MedicineConsumptionResponseDto {
  @ApiProperty() medicineId: string;
  @ApiProperty() intervaloDias: number;
  @ApiProperty({ enum: TreatmentDurationUnit })
  duracaoUnidade: TreatmentDurationUnit;
  @ApiProperty({ nullable: true }) duracaoValor: number | null;
  @ApiProperty() foiTomado: boolean;
  @ApiProperty({ isArray: true, type: ConsumptionTimeDto })
  horarios: ConsumptionTimeDto[];
  @ApiProperty({
    isArray: true,
    type: MedicineConsumptionConfirmationResponseDto,
  })
  confirmacoes: MedicineConsumptionConfirmationResponseDto[];

  private constructor(
    medicineId: string,
    intervaloDias: number,
    duracaoUnidade: TreatmentDurationUnit,
    duracaoValor: number | null,
    foiTomado: boolean,
    horarios: ConsumptionTimeDto[],
    confirmacoes: MedicineConsumptionConfirmationResponseDto[],
  ) {
    this.medicineId = medicineId;
    this.intervaloDias = intervaloDias;
    this.duracaoUnidade = duracaoUnidade;
    this.duracaoValor = duracaoValor;
    this.foiTomado = foiTomado;
    this.horarios = horarios;
    this.confirmacoes = confirmacoes;
  }

  static from(
    data: MedicineConsumptionData | null,
  ): MedicineConsumptionResponseDto | null {
    if (!data) return null;
    const { details, times, confirmations } = data;
    return new MedicineConsumptionResponseDto(
      details.medicineId,
      details.intervaloDias,
      details.duracaoUnidade,
      details.duracaoValor,
      confirmations.some((confirmation) => confirmation.tomado),
      times.map((t) => ({ id: t.id!, hora: t.hora })),
      confirmations.map(
        (confirmation) =>
          MedicineConsumptionConfirmationResponseDto.from(confirmation)!,
      ),
    );
  }
}
