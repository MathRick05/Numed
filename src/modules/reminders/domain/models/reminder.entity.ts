export class Reminder {
  private readonly _id?: string;
  private readonly _userId: string;
  private _titulo: string;
  private _descricao: string;
  private _data: string;
  private _horario: string;
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

  get titulo(): string {
    return this._titulo;
  }

  get descricao(): string {
    return this._descricao;
  }

  get data(): string {
    return this._data;
  }

  get horario(): string {
    return this._horario;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  withTitulo(titulo: string) {
    this._titulo = titulo;
    return this;
  }

  withDescricao(descricao: string) {
    this._descricao = descricao;
    return this;
  }

  withData(data: string) {
    this._data = data;
    return this;
  }

  withHorario(horario: string) {
    this._horario = horario;
    return this;
  }

  static restore(props?: {
    id?: string;
    userId: string;
    titulo: string;
    descricao: string;
    data: string;
    horario: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): Reminder | null {
    if (!props) return null;

    const reminder = new Reminder(props.userId, props.id, props.createdAt, props.updatedAt);
    reminder._titulo = props.titulo;
    reminder._descricao = props.descricao;
    reminder._data = props.data;
    reminder._horario = props.horario;
    return reminder;
  }
}
