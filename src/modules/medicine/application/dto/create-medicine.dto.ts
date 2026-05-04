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

export class CreateMedicineDto {
  @ApiProperty({ example: "Dipirona" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  nome: string;

  @ApiProperty({ enum: MedicineType, example: MedicineType.COMPRIMIDO })
  @IsEnum(MedicineType)
  tipo: MedicineType;

  @ApiProperty({ example: 500 })
  @IsInt()
  @Min(0)
  numeroDosagem: number;

  @ApiProperty({ enum: DosageUnit, example: DosageUnit.MG })
  @IsEnum(DosageUnit)
  unidadeDosagem: DosageUnit;

  @ApiProperty({ example: 20 })
  @IsInt()
  @Min(0)
  quantidadeGuardada: number;

  @ApiProperty({ example: "Tomar 1 comprimido a cada 8 horas.", required: false })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  instrucoes?: string;
}
