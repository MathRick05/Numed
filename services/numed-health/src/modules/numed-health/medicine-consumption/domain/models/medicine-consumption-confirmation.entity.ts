export class MedicineConsumptionConfirmation {
  private readonly _id?: string;
  private readonly _medicineId: string;
  private _tomado!: boolean;
  private _observacao: string | null = null;
  private _horario!: Date;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;

  private constructor(
    medicineId: string,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
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
  get tomado(): boolean {
    return this._tomado;
  }
  get observacao(): string | null {
    return this._observacao;
  }
  get horario(): Date {
    return this._horario;
  }
  get createdAt(): Date | undefined {
    return this._createdAt;
  }
  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  withTomado(tomado: boolean) {
    this._tomado = tomado;
    return this;
  }
  withObservacao(observacao: string | null) {
    this._observacao = observacao;
    return this;
  }
  withHorario(horario: Date) {
    this._horario = horario;
    return this;
  }

  static restore(props?: {
    id?: string;
    medicineId: string;
    tomado: boolean;
    observacao: string | null;
    horario: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }): MedicineConsumptionConfirmation | null {
    if (!props) return null;
    const confirmation = new MedicineConsumptionConfirmation(
      props.medicineId,
      props.id,
      props.createdAt,
      props.updatedAt,
    );
    confirmation._tomado = props.tomado;
    confirmation._observacao = props.observacao;
    confirmation._horario = props.horario;
    return confirmation;
  }
}
