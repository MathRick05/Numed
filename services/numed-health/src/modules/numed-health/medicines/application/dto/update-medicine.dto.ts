import { ApiProperty } from "@nestjs/swagger";
import { DosageUnit } from "@numed-health/medicines/domain/enums/dosage-unit.enum";
import { MedicineType } from "@numed-health/medicines/domain/enums/medicine-type.enum";
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class UpdateMedicineDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  nome?: string;

  @ApiProperty({ enum: MedicineType, required: false })
  @IsEnum(MedicineType)
  @IsOptional()
  tipo?: MedicineType;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  numeroDosagem?: number;

  @ApiProperty({ enum: DosageUnit, required: false })
  @IsEnum(DosageUnit)
  @IsOptional()
  unidadeDosagem?: DosageUnit;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  quantidadeGuardada?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  instrucoes?: string;
}
