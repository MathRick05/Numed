import type { MedicineConsumptionConfirmation } from "@numed-health/medicine-consumption/domain/models/medicine-consumption-confirmation.entity";
import type { MedicineConsumptionDetails } from "@numed-health/medicine-consumption/domain/models/medicine-consumption-details.entity";
import type { MedicineConsumptionTime } from "@numed-health/medicine-consumption/domain/models/medicine-consumption-time.entity";

export const MEDICINE_CONSUMPTION_REPOSITORY = Symbol(
  "MEDICINE_CONSUMPTION_REPOSITORY",
);

export type MedicineConsumptionData = {
  details: MedicineConsumptionDetails;
  times: MedicineConsumptionTime[];
  confirmations: MedicineConsumptionConfirmation[];
};

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
  ): Promise<MedicineConsumptionData | null>;
  deleteByMedicineId(userId: string, medicineId: string): Promise<void>;
  createConfirmation(
    medicineId: string,
    confirmation: MedicineConsumptionConfirmation,
  ): Promise<MedicineConsumptionConfirmation>;
  findConfirmationById(
    medicineId: string,
    confirmationId: string,
  ): Promise<MedicineConsumptionConfirmation | null>;
  listConfirmations(
    medicineId: string,
  ): Promise<MedicineConsumptionConfirmation[]>;
  updateConfirmation(
    medicineId: string,
    confirmation: MedicineConsumptionConfirmation,
  ): Promise<void>;
  deleteConfirmation(medicineId: string, confirmationId: string): Promise<void>;
}
