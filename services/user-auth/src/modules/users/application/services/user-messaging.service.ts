import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import {
  UserAuthExchangeName,
  UserAuthRoutingKey,
} from "@shared/contracts/events/user-auth-events.enum";
import { SharedMessagingService } from "@shared/infra/messaging/shared-messaging.service";
import { UserResponseDto } from "@users/application/dto/user-response.dto";

@Injectable()
export class UserMessagingService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UserMessagingService.name);

  constructor(private readonly sharedMessagingService: SharedMessagingService) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      await Promise.all([
        this.sharedMessagingService.assertExchange(UserAuthExchangeName.USER_CREATED),
        this.sharedMessagingService.assertExchange(UserAuthExchangeName.USER_UPDATED),
        this.sharedMessagingService.assertExchange(UserAuthExchangeName.USER_DELETED),
      ]);
    } catch (error) {
      this.logger.error("Failed to assert user exchanges", error);
      throw error;
    }
  }

  async publishUserCreated(user: UserResponseDto): Promise<void> {
    await this.sharedMessagingService.publish(
      UserAuthExchangeName.USER_CREATED,
      UserAuthRoutingKey.USER_CREATED,
      user,
    );
  }

  async publishUserUpdated(user: UserResponseDto): Promise<void> {
    await this.sharedMessagingService.publish(
      UserAuthExchangeName.USER_UPDATED,
      UserAuthRoutingKey.USER_UPDATED,
      user,
    );
  }

  async publishUserDeleted(userId: string): Promise<void> {
    await this.sharedMessagingService.publish(
      UserAuthExchangeName.USER_DELETED,
      UserAuthRoutingKey.USER_DELETED,
      { id: userId },
    );
  }
}
