import type { CaregiverDependent } from "@caregiver-dependents/domain/models/caregiver-dependent.entity";

export const CAREGIVER_DEPENDENT_REPOSITORY = Symbol("CAREGIVER_DEPENDENT_REPOSITORY");

export interface CaregiverDependentRepository {
  create(link: CaregiverDependent): Promise<void>;
  delete(caregiverId: string, dependentId: string): Promise<void>;
  exists(caregiverId: string, dependentId: string): Promise<boolean>;
  listDependents(caregiverId: string): Promise<CaregiverDependent[]>;
}
