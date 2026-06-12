import type { TreatmentDurationUnit } from "@numed-health/medicine-consumption/domain/enums/treatment-duration-unit.enum";

export class MedicineConsumptionDetails {
  private readonly _id?: string;
  private readonly _medicineId: string;
  private _intervaloDias!: number;
  private _duracaoUnidade!: TreatmentDurationUnit;
  private _duracaoValor: number | null = null;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;

  private constructor(medicineId: string, id?: string, createdAt?: Date, updatedAt?: Date) {
    this._medicineId = medicineId;
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): string | undefined { return this._id; }
  get medicineId(): string { return this._medicineId; }
  get intervaloDias(): number { return this._intervaloDias; }
  get duracaoUnidade(): TreatmentDurationUnit { return this._duracaoUnidade; }
  get duracaoValor(): number | null { return this._duracaoValor; }
  get createdAt(): Date | undefined { return this._createdAt; }
  get updatedAt(): Date | undefined { return this._updatedAt; }

  withIntervaloDias(v: number) { this._intervaloDias = v; return this; }
  withDuracaoUnidade(v: TreatmentDurationUnit) { this._duracaoUnidade = v; return this; }
  withDuracaoValor(v: number | null) { this._duracaoValor = v; return this; }

  static restore(props?: {
    id?: string;
    medicineId: string;
    intervaloDias: number;
    duracaoUnidade: TreatmentDurationUnit;
    duracaoValor: number | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): MedicineConsumptionDetails | null {
    if (!props) return null;
    const d = new MedicineConsumptionDetails(props.medicineId, props.id, props.createdAt, props.updatedAt);
    d._intervaloDias = props.intervaloDias;
    d._duracaoUnidade = props.duracaoUnidade;
    d._duracaoValor = props.duracaoValor;
    return d;
  }
}
