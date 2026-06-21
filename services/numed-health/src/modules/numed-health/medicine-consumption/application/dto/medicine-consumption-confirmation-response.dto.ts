import { ApiProperty } from "@nestjs/swagger";
import type { MedicineConsumptionConfirmation } from "@numed-health/medicine-consumption/domain/models/medicine-consumption-confirmation.entity";

export class MedicineConsumptionConfirmationResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() medicineId: string;
  @ApiProperty() tomado: boolean;
  @ApiProperty({ nullable: true }) observacao: string | null;
  @ApiProperty() horario: Date;
  @ApiProperty() createdAt: Date | undefined;
  @ApiProperty() updatedAt: Date | undefined;

  private constructor(
    id: string,
    medicineId: string,
    tomado: boolean,
    observacao: string | null,
    horario: Date,
    createdAt: Date | undefined,
    updatedAt: Date | undefined,
  ) {
    this.id = id;
    this.medicineId = medicineId;
    this.tomado = tomado;
    this.observacao = observacao;
    this.horario = horario;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static from(
    confirmation: MedicineConsumptionConfirmation | null,
  ): MedicineConsumptionConfirmationResponseDto | null {
    if (!confirmation) return null;
    return new MedicineConsumptionConfirmationResponseDto(
      confirmation.id!,
      confirmation.medicineId,
      confirmation.tomado,
      confirmation.observacao,
      confirmation.horario,
      confirmation.createdAt,
      confirmation.updatedAt,
    );
  }
}
