import { ApiProperty } from "@nestjs/swagger";
import { DosageUnit } from "@medicine/domain/enums/dosage-unit.enum";
import { MedicineType } from "@medicine/domain/enums/medicine-type.enum";
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

export class UpdateMedicineDto {
  @ApiProperty({ example: "Dipirona", required: false })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @IsOptional()
  nome?: string;

  @ApiProperty({ enum: MedicineType, required: false, example: MedicineType.COMPRIMIDO })
  @IsEnum(MedicineType)
  @IsOptional()
  tipo?: MedicineType;

  @ApiProperty({ example: 500, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  numeroDosagem?: number;

  @ApiProperty({ enum: DosageUnit, required: false, example: DosageUnit.MG })
  @IsEnum(DosageUnit)
  @IsOptional()
  unidadeDosagem?: DosageUnit;

  @ApiProperty({ example: 20, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  quantidadeGuardada?: number;

  @ApiProperty({ example: "Tomar 1 comprimido a cada 8 horas.", required: false })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  instrucoes?: string;
}
