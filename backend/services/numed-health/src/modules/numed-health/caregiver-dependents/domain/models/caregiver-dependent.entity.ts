export class CaregiverDependent {
  private readonly _id?: string;
  private readonly _caregiverId: string;
  private readonly _dependentId: string;

  private constructor(caregiverId: string, dependentId: string, id?: string) {
    this._id = id;
    this._caregiverId = caregiverId;
    this._dependentId = dependentId;
  }

  get id(): string | undefined { return this._id; }
  get caregiverId(): string { return this._caregiverId; }
  get dependentId(): string { return this._dependentId; }

  static restore(props?: { id?: string; caregiverId: string; dependentId: string }): CaregiverDependent | null {
    if (!props) return null;
    return new CaregiverDependent(props.caregiverId, props.dependentId, props.id);
  }
}
