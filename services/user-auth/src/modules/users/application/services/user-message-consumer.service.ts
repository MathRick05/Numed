import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from "@nestjs/common";
import { RabbitMQService } from "@shared/infra/messaging/rabbitmq.service";
import { DrizzleUserRepository } from "@users/infra/repositories/drizzle-user.repository";
import { User } from "@users/domain/models/user.entity";
import type { Channel, ConsumeMessage } from "amqplib";

type UserPayload = {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  isCaregiver?: boolean;
  isPremium?: boolean;
  permissions?: string[];
};

const EXCHANGE_TYPE = "direct";

const EXCHANGES = {
  userCreated: "user-auth.users.created.exchange",
  userUpdated: "user-auth.users.updated.exchange",
  userDeleted: "user-auth.users.deleted.exchange",
} as const;

const ROUTING_KEYS = {
  userCreated: "user.created",
  userUpdated: "user.updated",
  userDeleted: "user.deleted",
} as const;

const QUEUES = {
  userCreated: "user-auth.users.created.queue",
  userUpdated: "user-auth.users.updated.queue",
  userDeleted: "user-auth.users.deleted.queue",
} as const;

@Injectable()
export class UserMessageConsumerService
  implements OnApplicationBootstrap, OnModuleDestroy
{
  private readonly logger = new Logger(UserMessageConsumerService.name);
  private channel?: Channel;

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly userRepository: DrizzleUserRepository,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.channel = await this.rabbitMQService.createChannel();

    await Promise.all([
      this.registerConsumer({
        queueName: QUEUES.userCreated,
        exchangeName: EXCHANGES.userCreated,
        routingKey: ROUTING_KEYS.userCreated,
        handler: (payload) => this.handleUserUpsert(payload),
      }),
      this.registerConsumer({
        queueName: QUEUES.userUpdated,
        exchangeName: EXCHANGES.userUpdated,
        routingKey: ROUTING_KEYS.userUpdated,
        handler: (payload) => this.handleUserUpsert(payload),
      }),
      this.registerConsumer({
        queueName: QUEUES.userDeleted,
        exchangeName: EXCHANGES.userDeleted,
        routingKey: ROUTING_KEYS.userDeleted,
        handler: (payload) => this.handleUserDelete(payload),
      }),
    ]);
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel?.close();
  }

  private async registerConsumer(params: {
    queueName: string;
    exchangeName: string;
    routingKey: string;
    handler: (payload: unknown) => Promise<void>;
  }): Promise<void> {
    if (!this.channel) {
      throw new Error("RabbitMQ consumer channel not initialized");
    }

    await this.channel.assertExchange(params.exchangeName, EXCHANGE_TYPE, {
      durable: true,
    });
    await this.channel.assertQueue(params.queueName, { durable: true });
    await this.channel.bindQueue(
      params.queueName,
      params.exchangeName,
      params.routingKey,
    );

    await this.channel.consume(params.queueName, async (msg) => {
      await this.consumeMessage(params.queueName, msg, params.handler);
    });

    this.logger.log(`Consumer registered on queue "${params.queueName}"`);
  }

  private async consumeMessage(
    queueName: string,
    msg: ConsumeMessage | null,
    handler: (payload: unknown) => Promise<void>,
  ): Promise<void> {
    if (!msg || !this.channel) return;

    try {
      const payload = JSON.parse(msg.content.toString()) as unknown;
      await handler(payload);
      this.channel.ack(msg);
      this.logger.log(`Message consumed from queue "${queueName}"`);
    } catch (error) {
      this.logger.error(
        `Failed to process message from queue "${queueName}"`,
        error,
      );
      this.channel.nack(msg, false, false);
    }
  }

  private async handleUserUpsert(payload: unknown): Promise<void> {
    const userPayload = payload as UserPayload;

    if (!userPayload.id) {
      throw new Error("Invalid user payload: missing id");
    }

    const existing = await this.userRepository.findById(userPayload.id);

    if (existing) {
      if (userPayload.fullName) existing.withFullName(userPayload.fullName);
      if (userPayload.email) existing.withEmail(userPayload.email.toLowerCase());
      if (userPayload.phone) existing.withPhone(userPayload.phone);
      if (userPayload.password) existing.withPassword(userPayload.password);
      if (userPayload.isCaregiver !== undefined)
        existing.withIsCaregiver(userPayload.isCaregiver);
      if (userPayload.isPremium !== undefined)
        existing.withIsPremium(userPayload.isPremium);
      if (userPayload.permissions) existing.withPermissions(userPayload.permissions);

      await this.userRepository.update(existing);
      return;
    }

    if (
      !userPayload.fullName ||
      !userPayload.email ||
      !userPayload.phone ||
      !userPayload.password
    ) {
      throw new Error("Invalid user payload: missing required fields");
    }

    const user = User.restore({
      id: userPayload.id,
      fullName: userPayload.fullName,
      email: userPayload.email.toLowerCase(),
      phone: userPayload.phone,
      password: userPayload.password,
      isCaregiver: userPayload.isCaregiver,
      isPremium: userPayload.isPremium,
      permissions: userPayload.permissions ?? [],
    })!;

    await this.userRepository.create(user);
  }

  private async handleUserDelete(payload: unknown): Promise<void> {
    const userPayload = payload as UserPayload;

    if (!userPayload.id) {
      throw new Error("Invalid user payload: missing id");
    }

    await this.userRepository.delete(userPayload.id);
  }
}
