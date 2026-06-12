import { Injectable } from "@nestjs/common";
import { DrizzleService } from "@shared/infra/database/drizzle.service";
import { usersSchema } from "@integrations/users/infra/database/schemas/user.schema";
import { eq } from "drizzle-orm";

@Injectable()
export class UsersClientService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async findById(userId: string): Promise<{ id: string } | null> {
    const rows = await this.drizzleService.db
      .select({ id: usersSchema.id })
      .from(usersSchema)
      .where(eq(usersSchema.id, userId))
      .limit(1);

    return rows.length > 0 ? { id: rows[0].id } : null;
  }
}
