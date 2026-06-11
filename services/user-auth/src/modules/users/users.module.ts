import { Module } from "@nestjs/common";
import { UserMessageConsumerService } from "@users/application/services/user-message-consumer.service";
import { UserService } from "@users/application/services/user.service";
import { USER_REPOSITORY } from "@users/domain/repositories/user-repository.interface";
import { UsersController } from "@users/infra/controllers/users.controller";
import { DrizzleUserRepository } from "@users/infra/repositories/drizzle-user.repository";

@Module({
  controllers: [UsersController],
  providers: [
    UserMessageConsumerService,
    UserService,
    DrizzleUserRepository,
    {
      provide: USER_REPOSITORY,
      useExisting: DrizzleUserRepository,
    },
  ],
  exports: [UserService],
})
export class UsersModule {}
