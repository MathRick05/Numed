import { Injectable, type OnModuleDestroy } from "@nestjs/common";
import { appointmentsSchema } from "@appointments/infra/database/schemas/appointment.schema";
import { caregiverDependentsSchema } from "@caregiver-dependents/infra/database/schemas/caregiver-dependent.schema";
import { medicinesSchema } from "@medicine/infra/database/schemas/medicine.schema";
import { medicineConsumptionDetailsSchema } from "@medicine-consumption/infra/database/schemas/medicine-consumption-details.schema";
import { medicineConsumptionTimesSchema } from "@medicine-consumption/infra/database/schemas/medicine-consumption-times.schema";
import { remindersSchema } from "@reminders/infra/database/schemas/reminder.schema";
import { usersSchema } from "@users/infra/database/schemas/user.schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const schema = {
  appointmentsSchema,
  caregiverDependentsSchema,
  medicinesSchema,
  medicineConsumptionDetailsSchema,
  medicineConsumptionTimesSchema,
  remindersSchema,
  usersSchema,
};

@Injectable()
export class DrizzleService implements OnModuleDestroy {
  private readonly pool: Pool;
  public readonly db;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    this.db = drizzle(this.pool, { schema });
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
