import { Injectable } from "@nestjs/common";
import { AppointmentStatus } from "@appointments/domain/enums/appointment-status.enum";
import { Appointment } from "@appointments/domain/models/appointment.entity";
import type { AppointmentRepository } from "@appointments/domain/repositories/appointment-repository.interface";
import { appointmentsSchema } from "@appointments/infra/database/schemas/appointment.schema";
import { DrizzleService } from "@shared/infra/database/drizzle.service";
import type { PaginationParams } from "@shared/infra/hateoas";
import { and, eq, sql } from "drizzle-orm";

@Injectable()
export class DrizzleAppointmentRepository implements AppointmentRepository {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(appointment: Appointment): Promise<Appointment> {
    const [row] = await this.drizzleService.db
      .insert(appointmentsSchema)
      .values({
        userId: appointment.userId,
        tipoConsulta: appointment.tipoConsulta,
        doutor: appointment.doutor,
        data: appointment.data,
        hora: appointment.hora,
        endereco: appointment.endereco,
        status: appointment.status,
        descricao: appointment.descricao,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return Appointment.restore({
      ...row,
      status: row.status as AppointmentStatus,
    })!;
  }

  async update(appointment: Appointment): Promise<void> {
    await this.drizzleService.db
      .update(appointmentsSchema)
      .set({
        tipoConsulta: appointment.tipoConsulta,
        doutor: appointment.doutor,
        data: appointment.data,
        hora: appointment.hora,
        endereco: appointment.endereco,
        status: appointment.status,
        descricao: appointment.descricao,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(appointmentsSchema.id, appointment.id!),
          eq(appointmentsSchema.userId, appointment.userId),
        ),
      );
  }

  async delete(userId: string, id: string): Promise<void> {
    await this.drizzleService.db
      .delete(appointmentsSchema)
      .where(
        and(eq(appointmentsSchema.id, id), eq(appointmentsSchema.userId, userId)),
      );
  }

  async findById(userId: string, id: string): Promise<Appointment | null> {
    const result = await this.drizzleService.db
      .select()
      .from(appointmentsSchema)
      .where(and(eq(appointmentsSchema.id, id), eq(appointmentsSchema.userId, userId)))
      .limit(1);

    return Appointment.restore({
      ...result[0],
      status: result[0]?.status as AppointmentStatus,
    });
  }

  async findAllByUserId(userId: string): Promise<Appointment[]> {
    const rows = await this.drizzleService.db
      .select()
      .from(appointmentsSchema)
      .where(eq(appointmentsSchema.userId, userId));

    return rows.map((row: any) =>
      Appointment.restore({
        ...row,
        status: row.status as AppointmentStatus,
      })!,
    );
  }

  async findAllByUserIdPaginated(
    userId: string,
    params: PaginationParams,
  ): Promise<{ rows: Appointment[]; total: number }> {
    const { page, limit } = params;
    const offset = (page - 1) * limit;

    const [rows, [countResult]] = await Promise.all([
      this.drizzleService.db
        .select()
        .from(appointmentsSchema)
        .where(eq(appointmentsSchema.userId, userId))
        .limit(limit)
        .offset(offset),
      this.drizzleService.db
        .select({ count: sql<number>`count(*)::int` })
        .from(appointmentsSchema)
        .where(eq(appointmentsSchema.userId, userId)),
    ]);

    return {
      rows: rows.map((row: any) =>
        Appointment.restore({
          ...row,
          status: row.status as AppointmentStatus,
        })!,
      ),
      total: countResult.count,
    };
  }
}
