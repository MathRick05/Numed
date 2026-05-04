import type { PaginationParams } from "@shared/infra/hateoas";
import type { Medicine } from "@medicine/domain/models/medicine.entity";

export const MEDICINE_REPOSITORY = Symbol("MEDICINE_REPOSITORY");

export interface MedicineRepository {
  create(medicine: Medicine): Promise<void>;
  update(medicine: Medicine): Promise<void>;
  delete(userId: string, id: string): Promise<void>;
  findById(userId: string, id: string): Promise<Medicine | null>;
  findAllByUserId(userId: string): Promise<Medicine[]>;
  findAllByUserIdPaginated(
    userId: string,
    params: PaginationParams,
  ): Promise<{ rows: Medicine[]; total: number }>;
}
