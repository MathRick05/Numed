export class MedicineConsumptionTime {
  private readonly _id?: string;
  private readonly _detailsId: string;
  private _hora!: string;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;

  private constructor(detailsId: string, id?: string, createdAt?: Date, updatedAt?: Date) {
    this._detailsId = detailsId;
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): string | undefined { return this._id; }
  get detailsId(): string { return this._detailsId; }
  get hora(): string { return this._hora; }
  get createdAt(): Date | undefined { return this._createdAt; }
  get updatedAt(): Date | undefined { return this._updatedAt; }

  withHora(hora: string) { this._hora = hora; return this; }

  static restore(props?: {
    id?: string;
    detailsId: string;
    hora: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): MedicineConsumptionTime | null {
    if (!props) return null;
    const t = new MedicineConsumptionTime(props.detailsId, props.id, props.createdAt, props.updatedAt);
    t._hora = props.hora;
    return t;
  }
}
