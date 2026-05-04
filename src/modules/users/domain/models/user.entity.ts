export class User {
  private readonly _id?: string;
  private _fullName: string;
  private _email: string;
  private _phone: string;
  private _password: string;
  private _isCaregiver: boolean;
  private _permissions: string[];
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;

  private constructor(id?: string, createdAt?: Date, updatedAt?: Date) {
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): string | undefined {
    return this._id;
  }

  get fullName(): string {
    return this._fullName;
  }

  get email(): string {
    return this._email;
  }

  get phone(): string {
    return this._phone;
  }

  get password(): string {
    return this._password;
  }

  get isCaregiver(): boolean {
    return this._isCaregiver;
  }

  get permissions(): string[] {
    return this._permissions;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  withFullName(fullName: string) {
    this._fullName = fullName;
    return this;
  }

  withEmail(email: string) {
    this._email = email;
    return this;
  }

  withPhone(phone: string) {
    this._phone = phone;
    return this;
  }

  withPassword(password: string) {
    this._password = password;
    return this;
  }

  withIsCaregiver(isCaregiver: boolean) {
    this._isCaregiver = isCaregiver;
    return this;
  }

  withPermissions(permissions: string[]) {
    this._permissions = permissions;
    return this;
  }

  static restore(props?: {
    id?: string;
    fullName: string;
    email: string;
    phone: string;
    password: string;
    isCaregiver?: boolean;
    permissions?: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }): User | null {
    if (!props) return null;

    const user = new User(props.id, props.createdAt, props.updatedAt);
    user._fullName = props.fullName;
    user._email = props.email;
    user._phone = props.phone;
    user._password = props.password;
    user._isCaregiver = props.isCaregiver ?? false;
    user._permissions = props.permissions ?? [];

    return user;
  }
}
