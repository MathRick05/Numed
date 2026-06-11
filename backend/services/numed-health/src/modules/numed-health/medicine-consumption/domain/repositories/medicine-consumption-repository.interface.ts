import type { MedicineConsumptionDetails } from "@numed-health/medicine-consumption/domain/models/medicine-consumption-details.entity";
import type { MedicineConsumptionTime } from "@numed-health/medicine-consumption/domain/models/medicine-consumption-time.entity";

export const MEDICINE_CONSUMPTION_REPOSITORY = Symbol("MEDICINE_CONSUMPTION_REPOSITORY");

export interface MedicineConsumptionRepository {
  upsertDetailsWithTimes(
    userId: string,
    medicineId: string,
    details: MedicineConsumptionDetails,
    times: MedicineConsumptionTime[],
  ): Promise<void>;
  findByMedicineId(
    userId: string,
    medicineId: string,
  ): Promise<{ details: MedicineConsumptionDetails; times: MedicineConsumptionTime[] } | null>;
  deleteByMedicineId(userId: string, medicineId: string): Promise<void>;
}
