import type { TreatmentDurationUnit } from "@medicine-consumption/domain/enums/treatment-duration-unit.enum";

export class MedicineConsumptionDetails {
  private readonly _id?: string;
  private readonly _medicineId: string;
  private _intervaloDias: number;
  private _duracaoUnidade: TreatmentDurationUnit;
  private _duracaoValor: number | null;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;

  private constructor(medicineId: string, id?: string, createdAt?: Date, updatedAt?: Date) {
    this._medicineId = medicineId;
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): string | undefined {
    return this._id;
  }

  get medicineId(): string {
    return this._medicineId;
  }

  get intervaloDias(): number {
    return this._intervaloDias;
  }

  get duracaoUnidade(): TreatmentDurationUnit {
    return this._duracaoUnidade;
  }

  get duracaoValor(): number | null {
    return this._duracaoValor;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  withIntervaloDias(intervaloDias: number) {
    this._intervaloDias = intervaloDias;
    return this;
  }

  withDuracaoUnidade(duracaoUnidade: TreatmentDurationUnit) {
    this._duracaoUnidade = duracaoUnidade;
    return this;
  }

  withDuracaoValor(duracaoValor: number | null) {
    this._duracaoValor = duracaoValor;
    return this;
  }

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

    const details = new MedicineConsumptionDetails(
      props.medicineId,
      props.id,
      props.createdAt,
      props.updatedAt,
    );
    details._intervaloDias = props.intervaloDias;
    details._duracaoUnidade = props.duracaoUnidade;
    details._duracaoValor = props.duracaoValor;

    return details;
  }
}
