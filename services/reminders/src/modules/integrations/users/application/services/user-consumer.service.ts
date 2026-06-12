import { Injectable, Logger, OnApplicationBootstrap, OnModuleDestroy } from "@nestjs/common";
import {
  UserAuthExchangeName,
  UserAuthRoutingKey,
} from "@shared/contracts/events/user-auth-events.enum";
import { DrizzleService } from "@shared/infra/database/drizzle.service";
import { RabbitMQService } from "@shared/infra/messaging/rabbitmq.service";
import { usersSchema } from "@integrations/users/infra/database/schemas/user.schema";
import { eq } from "drizzle-orm";
import type { Channel, ConsumeMessage } from "amqplib";

type UserPayload = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isCaregiver: boolean;
  isPremium: boolean;
};

const QUEUES = {
  userCreated: "reminders.user-auth.users.created.queue",
  userUpdated: "reminders.user-auth.users.updated.queue",
  userDeleted: "reminders.user-auth.users.deleted.queue",
} as const;

@Injectable()
export class UserConsumerService implements OnApplicationBootstrap, OnModuleDestroy {
  private readonly logger = new Logger(UserConsumerService.name);
  private channel?: Channel;

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly drizzleService: DrizzleService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.channel = await this.rabbitMQService.createChannel();

    await Promise.all([
      this.registerConsumer(
        QUEUES.userCreated,
        UserAuthExchangeName.USER_CREATED,
        UserAuthRoutingKey.USER_CREATED,
        (p) => this.handleUpsert(p),
      ),
      this.registerConsumer(
        QUEUES.userUpdated,
        UserAuthExchangeName.USER_UPDATED,
        UserAuthRoutingKey.USER_UPDATED,
        (p) => this.handleUpsert(p),
      ),
      this.registerConsumer(
        QUEUES.userDeleted,
        UserAuthExchangeName.USER_DELETED,
        UserAuthRoutingKey.USER_DELETED,
        (p) => this.handleDelete(p),
      ),
    ]);
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel?.close();
  }

  private async registerConsumer(
    queue: string,
    exchange: string,
    routingKey: string,
    handler: (payload: unknown) => Promise<void>,
  ): Promise<void> {
    if (!this.channel) throw new Error("Channel not initialized");

    await this.channel.assertExchange(exchange, "direct", { durable: true });
    await this.channel.assertQueue(queue, { durable: true });
    await this.channel.bindQueue(queue, exchange, routingKey);

    await this.channel.consume(queue, async (msg) => {
      await this.consume(queue, msg, handler);
    });

    this.logger.log(`Consumer registered on queue "${queue}"`);
  }

  private async consume(
    queue: string,
    msg: ConsumeMessage | null,
    handler: (payload: unknown) => Promise<void>,
  ): Promise<void> {
    if (!msg || !this.channel) return;
    try {
      await handler(JSON.parse(msg.content.toString()) as unknown);
      this.channel.ack(msg);
    } catch (error) {
      this.logger.error(`Failed to process message from "${queue}"`, error);
      this.channel.nack(msg, false, false);
    }
  }

  private async handleUpsert(payload: unknown): Promise<void> {
    const user = payload as UserPayload;
    const now = new Date();

    await this.drizzleService.db
      .insert(usersSchema)
      .values({
        id: user.id,
        fullName: user.fullName,
        email: user.email.toLowerCase(),
        phone: user.phone,
        isCaregiver: user.isCaregiver ?? false,
        isPremium: user.isPremium ?? false,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: usersSchema.id,
        set: {
          fullName: user.fullName,
          email: user.email.toLowerCase(),
          phone: user.phone,
          isCaregiver: user.isCaregiver ?? false,
          isPremium: user.isPremium ?? false,
          updatedAt: now,
        },
      });
  }

  private async handleDelete(payload: unknown): Promise<void> {
    const { id } = payload as { id: string };
    await this.drizzleService.db.delete(usersSchema).where(eq(usersSchema.id, id));
  }
}
