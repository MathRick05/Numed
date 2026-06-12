import type { DosageUnit } from "@numed-health/medicines/domain/enums/dosage-unit.enum";
import type { MedicineType } from "@numed-health/medicines/domain/enums/medicine-type.enum";

export class Medicine {
  private readonly _id?: string;
  private readonly _userId: string;
  private _nome!: string;
  private _tipo!: MedicineType;
  private _numeroDosagem!: number;
  private _unidadeDosagem!: DosageUnit;
  private _quantidadeGuardada!: number;
  private _instrucoes!: string;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;

  private constructor(userId: string, id?: string, createdAt?: Date, updatedAt?: Date) {
    this._userId = userId;
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): string | undefined { return this._id; }
  get userId(): string { return this._userId; }
  get nome(): string { return this._nome; }
  get tipo(): MedicineType { return this._tipo; }
  get numeroDosagem(): number { return this._numeroDosagem; }
  get unidadeDosagem(): DosageUnit { return this._unidadeDosagem; }
  get quantidadeGuardada(): number { return this._quantidadeGuardada; }
  get instrucoes(): string { return this._instrucoes; }
  get createdAt(): Date | undefined { return this._createdAt; }
  get updatedAt(): Date | undefined { return this._updatedAt; }

  withNome(nome: string) { this._nome = nome; return this; }
  withTipo(tipo: MedicineType) { this._tipo = tipo; return this; }
  withNumeroDosagem(n: number) { this._numeroDosagem = n; return this; }
  withUnidadeDosagem(u: DosageUnit) { this._unidadeDosagem = u; return this; }
  withQuantidadeGuardada(q: number) { this._quantidadeGuardada = q; return this; }
  withInstrucoes(i: string) { this._instrucoes = i; return this; }

  static restore(props?: {
    id?: string;
    userId: string;
    nome: string;
    tipo: MedicineType;
    numeroDosagem: number;
    unidadeDosagem: DosageUnit;
    quantidadeGuardada: number;
    instrucoes: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): Medicine | null {
    if (!props) return null;
    const m = new Medicine(props.userId, props.id, props.createdAt, props.updatedAt);
    m._nome = props.nome;
    m._tipo = props.tipo;
    m._numeroDosagem = props.numeroDosagem;
    m._unidadeDosagem = props.unidadeDosagem;
    m._quantidadeGuardada = props.quantidadeGuardada;
    m._instrucoes = props.instrucoes;
    return m;
  }
}
