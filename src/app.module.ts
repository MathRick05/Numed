import { AuthModule } from "@auth/auth.module";
import { AppointmentsModule } from "@appointments/appointments.module";
import { MedicineModule } from "@medicine/medicine.module";
import { MedicineConsumptionModule } from "@medicine-consumption/medicine-consumption.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SharedModule } from "@shared/shared.module";
import { UsersModule } from "@users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    SharedModule,
    UsersModule,
    MedicineModule,
    MedicineConsumptionModule,
    AppointmentsModule,
    // AuthModule,
  ],
})
export class AppModule {}
