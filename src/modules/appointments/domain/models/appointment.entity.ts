import type { AppointmentStatus } from "@appointments/domain/enums/appointment-status.enum";

export class Appointment {
  private readonly _id?: string;
  private readonly _userId: string;
  private _tipoConsulta: string;
  private _doutor: string;
  private _data: string;
  private _hora: string;
  private _endereco: string;
  private _status: AppointmentStatus;
  private _descricao: string;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;

  private constructor(userId: string, id?: string, createdAt?: Date, updatedAt?: Date) {
    this._userId = userId;
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): string | undefined {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get tipoConsulta(): string {
    return this._tipoConsulta;
  }

  get doutor(): string {
    return this._doutor;
  }

  get data(): string {
    return this._data;
  }

  get hora(): string {
    return this._hora;
  }

  get endereco(): string {
    return this._endereco;
  }

  get status(): AppointmentStatus {
    return this._status;
  }

  get descricao(): string {
    return this._descricao;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  withTipoConsulta(tipoConsulta: string) {
    this._tipoConsulta = tipoConsulta;
    return this;
  }

  withDoutor(doutor: string) {
    this._doutor = doutor;
    return this;
  }

  withData(data: string) {
    this._data = data;
    return this;
  }

  withHora(hora: string) {
    this._hora = hora;
    return this;
  }

  withEndereco(endereco: string) {
    this._endereco = endereco;
    return this;
  }

  withStatus(status: AppointmentStatus) {
    this._status = status;
    return this;
  }

  withDescricao(descricao: string) {
    this._descricao = descricao;
    return this;
  }

  static restore(props?: {
    id?: string;
    userId: string;
    tipoConsulta: string;
    doutor: string;
    data: string;
    hora: string;
    endereco: string;
    status: AppointmentStatus;
    descricao: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): Appointment | null {
    if (!props) return null;

    const appointment = new Appointment(
      props.userId,
      props.id,
      props.createdAt,
      props.updatedAt,
    );
    appointment._tipoConsulta = props.tipoConsulta;
    appointment._doutor = props.doutor;
    appointment._data = props.data;
    appointment._hora = props.hora;
    appointment._endereco = props.endereco;
    appointment._status = props.status;
    appointment._descricao = props.descricao;

    return appointment;
  }
}
