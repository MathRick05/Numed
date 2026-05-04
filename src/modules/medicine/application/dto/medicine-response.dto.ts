import { ApiProperty } from "@nestjs/swagger";
import { DosageUnit } from "@medicine/domain/enums/dosage-unit.enum";
import { MedicineType } from "@medicine/domain/enums/medicine-type.enum";
import type { Medicine } from "@medicine/domain/models/medicine.entity";

export class MedicineResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  nome: string;

  @ApiProperty({ enum: MedicineType })
  tipo: MedicineType;

  @ApiProperty()
  numeroDosagem: number;

  @ApiProperty({ enum: DosageUnit })
  unidadeDosagem: DosageUnit;

  @ApiProperty()
  quantidadeGuardada: number;

  @ApiProperty()
  instrucoes: string;

  @ApiProperty()
  createdAt: Date | undefined;

  @ApiProperty()
  updatedAt: Date | undefined;

  private constructor(
    id: string,
    userId: string,
    nome: string,
    tipo: MedicineType,
    numeroDosagem: number,
    unidadeDosagem: DosageUnit,
    quantidadeGuardada: number,
    instrucoes: string,
    createdAt: Date | undefined,
    updatedAt: Date | undefined,
  ) {
    this.id = id;
    this.userId = userId;
    this.nome = nome;
    this.tipo = tipo;
    this.numeroDosagem = numeroDosagem;
    this.unidadeDosagem = unidadeDosagem;
    this.quantidadeGuardada = quantidadeGuardada;
    this.instrucoes = instrucoes;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static from(medicine: Medicine | null): MedicineResponseDto | null {
    if (!medicine) return null;

    return new MedicineResponseDto(
      medicine.id!,
      medicine.userId,
      medicine.nome,
      medicine.tipo,
      medicine.numeroDosagem,
      medicine.unidadeDosagem,
      medicine.quantidadeGuardada,
      medicine.instrucoes,
      medicine.createdAt,
      medicine.updatedAt,
    );
  }
}
