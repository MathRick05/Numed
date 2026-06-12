import { Module } from "@nestjs/common";
import { SharedModule } from "@shared/shared.module";
import { UserConsumerService } from "@numed-health/integrations/users/application/services/user-consumer.service";

@Module({
  imports: [SharedModule],
  providers: [UserConsumerService],
})
export class UsersIntegrationModule {}
