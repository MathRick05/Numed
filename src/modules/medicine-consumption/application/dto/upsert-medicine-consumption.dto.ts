import { ApiProperty } from "@nestjs/swagger";
import { TreatmentDurationUnit } from "@medicine-consumption/domain/enums/treatment-duration-unit.enum";
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsString,
  Matches,
  Min,
  ValidateIf,
} from "class-validator";

export class UpsertMedicineConsumptionDto {
  @ApiProperty({
    example: 1,
    description:
      "Intervalo em dias entre as doses. Ex: 1 (diário), 7 (semanal), 14 (quinzenal).",
  })
  @IsInt()
  @Min(1)
  intervaloDias: number;

  @ApiProperty({ enum: TreatmentDurationUnit, example: TreatmentDurationUnit.DIAS })
  @IsEnum(TreatmentDurationUnit)
  duracaoUnidade: TreatmentDurationUnit;

  @ApiProperty({
    example: 10,
    required: false,
    description: "Obrigatório quando duracaoUnidade != continuo.",
  })
  @ValidateIf((o: UpsertMedicineConsumptionDto) => o.duracaoUnidade !== TreatmentDurationUnit.CONTINUO)
  @IsInt()
  @Min(1)
  duracaoValor?: number;

  @ApiProperty({
    example: ["08:00", "20:00"],
    description: "Horários (HH:mm) em que a pessoa vai tomar o remédio.",
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Matches(/^\d{2}:\d{2}$/, { each: true })
  horarios: string[];
}
