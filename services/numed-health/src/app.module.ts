import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SharedModule } from "@shared/shared.module";
import { NumedHealthModule } from "@numed-health/numed-health.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SharedModule,
    NumedHealthModule,
  ],
})
export class AppModule {}
