import { RemindersServiceModule } from "@academic/reminders-service.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SharedModule } from "@shared/shared.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SharedModule,
    RemindersServiceModule,
  ],
})
export class AppModule {}
