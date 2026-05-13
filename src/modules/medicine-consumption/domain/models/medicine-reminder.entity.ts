import type { ReminderStatus } from "@medicine-consumption/domain/enums/reminder-status.enum";

export class MedicineReminder {
  private readonly _id?: string;
  private readonly _consumptionTimeId: string;
  private _agendadoPara: Date;
  private _status: ReminderStatus;
  private _confirmadoEm: Date | null;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;

  private constructor(consumptionTimeId: string, id?: string, createdAt?: Date, updatedAt?: Date) {
    this._consumptionTimeId = consumptionTimeId;
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): string | undefined {
    return this._id;
  }

  get consumptionTimeId(): string {
    return this._consumptionTimeId;
  }

  get agendadoPara(): Date {
    return this._agendadoPara;
  }

  get status(): ReminderStatus {
    return this._status;
  }

  get confirmadoEm(): Date | null {
    return this._confirmadoEm;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  withAgendadoPara(agendadoPara: Date) {
    this._agendadoPara = agendadoPara;
    return this;
  }

  withStatus(status: ReminderStatus) {
    this._status = status;
    return this;
  }

  withConfirmadoEm(confirmadoEm: Date | null) {
    this._confirmadoEm = confirmadoEm;
    return this;
  }

  static restore(props?: {
    id?: string;
    consumptionTimeId: string;
    agendadoPara: Date;
    status: ReminderStatus;
    confirmadoEm: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): MedicineReminder | null {
    if (!props) return null;

    const reminder = new MedicineReminder(
      props.consumptionTimeId,
      props.id,
      props.createdAt,
      props.updatedAt,
    );
    reminder._agendadoPara = props.agendadoPara;
    reminder._status = props.status;
    reminder._confirmadoEm = props.confirmadoEm;

    return reminder;
  }
}
