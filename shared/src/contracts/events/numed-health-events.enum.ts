export enum NumedHealthExchangeName {
  MEDICINE_CREATED = "numed-health.medicines.created.exchange",
  MEDICINE_UPDATED = "numed-health.medicines.updated.exchange",
  MEDICINE_DELETED = "numed-health.medicines.deleted.exchange",
  MEDICINE_CONSUMPTION_UPSERTED = "numed-health.medicine-consumption.upserted.exchange",
}

export enum NumedHealthRoutingKey {
  MEDICINE_CREATED = "medicine.created",
  MEDICINE_UPDATED = "medicine.updated",
  MEDICINE_DELETED = "medicine.deleted",
  MEDICINE_CONSUMPTION_UPSERTED = "medicine-consumption.upserted",
}
