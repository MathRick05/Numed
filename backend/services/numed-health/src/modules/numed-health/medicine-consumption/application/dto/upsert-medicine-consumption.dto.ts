import { ApiProperty } from "@nestjs/swagger";
import { TreatmentDurationUnit } from "@numed-health/medicine-consumption/domain/enums/treatment-duration-unit.enum";
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
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  intervaloDias: number;

  @ApiProperty({ enum: TreatmentDurationUnit, example: TreatmentDurationUnit.DIAS })
  @IsEnum(TreatmentDurationUnit)
  duracaoUnidade: TreatmentDurationUnit;

  @ApiProperty({ example: 10, required: false })
  @ValidateIf((o: UpsertMedicineConsumptionDto) => o.duracaoUnidade !== TreatmentDurationUnit.CONTINUO)
  @IsInt()
  @Min(1)
  duracaoValor?: number;

  @ApiProperty({ example: ["08:00", "20:00"] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Matches(/^\d{2}:\d{2}$/, { each: true })
  horarios: string[];
}
