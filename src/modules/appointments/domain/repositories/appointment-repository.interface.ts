import type { Appointment } from "@appointments/domain/models/appointment.entity";
import type { PaginationParams } from "@shared/infra/hateoas";

export const APPOINTMENT_REPOSITORY = Symbol("APPOINTMENT_REPOSITORY");

export interface AppointmentRepository {
  create(appointment: Appointment): Promise<void>;
  update(appointment: Appointment): Promise<void>;
  delete(userId: string, id: string): Promise<void>;
  findById(userId: string, id: string): Promise<Appointment | null>;
  findAllByUserId(userId: string): Promise<Appointment[]>;
  findAllByUserIdPaginated(
    userId: string,
    params: PaginationParams,
  ): Promise<{ rows: Appointment[]; total: number }>;
}
