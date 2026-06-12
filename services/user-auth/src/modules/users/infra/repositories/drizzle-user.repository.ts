import { Injectable } from "@nestjs/common";
import { DrizzleService } from "@shared/infra/database/drizzle.service";
import type { PaginationParams } from "@shared/infra/hateoas";
import { User } from "@users/domain/models/user.entity";
import type { UserRepository } from "@users/domain/repositories/user-repository.interface";
import { usersSchema } from "@users/infra/database/schemas/user.schema";
import { eq, sql } from "drizzle-orm";

@Injectable()
export class DrizzleUserRepository implements UserRepository {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(user: User): Promise<void> {
    const values: any = {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      password: user.password,
      isCaregiver: user.isCaregiver,
      isPremium: user.isPremium,
      permissions: user.permissions,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (user.id) {
      values.id = user.id;
    }

    await this.drizzleService.db.insert(usersSchema).values(values);
  }

  async update(user: User): Promise<void> {
    await this.drizzleService.db
      .update(usersSchema)
      .set({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        password: user.password,
        isCaregiver: user.isCaregiver,
        isPremium: user.isPremium,
        permissions: user.permissions,
        updatedAt: new Date(),
      })
      .where(eq(usersSchema.id, user.id!));
  }

  async delete(id: string): Promise<void> {
    await this.drizzleService.db
      .delete(usersSchema)
      .where(eq(usersSchema.id, id));
  }

  async findById(id: string): Promise<User | null> {
    const [row] = await this.drizzleService.db
      .select()
      .from(usersSchema)
      .where(eq(usersSchema.id, id))
      .limit(1);

    return User.restore(row);
  }

  async findByEmail(email: string): Promise<User | null> {
    const [row] = await this.drizzleService.db
      .select()
      .from(usersSchema)
      .where(eq(usersSchema.email, email.toLowerCase()))
      .limit(1);

    return User.restore(row);
  }

  async findAll(): Promise<User[]> {
    const rows = await this.drizzleService.db
      .select()
      .from(usersSchema);

    return rows.map((row: any) => User.restore(row)!).filter(Boolean);
  }

  async findAllPaginated(
    params: PaginationParams,
  ): Promise<{ rows: User[]; total: number }> {
    const { page, limit } = params;
    const offset = (page - 1) * limit;

    const [rows, [countResult]] = await Promise.all([
      this.drizzleService.db
        .select()
        .from(usersSchema)
        .limit(limit)
        .offset(offset),
      this.drizzleService.db
        .select({ count: sql<number>`count(*)::int` })
        .from(usersSchema),
    ]);

    return {
      rows: rows.map((row: any) => User.restore(row)!).filter(Boolean),
      total: countResult.count,
    };
  }
}
