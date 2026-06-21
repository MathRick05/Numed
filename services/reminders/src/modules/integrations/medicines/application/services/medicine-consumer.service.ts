import { Injectable, Logger, OnApplicationBootstrap, OnModuleDestroy } from "@nestjs/common";
import {
  NumedHealthExchangeName,
  NumedHealthRoutingKey,
} from "@shared/contracts/events/numed-health-events.enum";
import { DrizzleService } from "@shared/infra/database/drizzle.service";
import { RabbitMQService } from "@shared/infra/messaging/rabbitmq.service";
import { remindersSchema } from "@reminders/infra/database/schemas/reminder.schema";
import { eq } from "drizzle-orm";
import type { Channel, ConsumeMessage } from "amqplib";

type MedicineConsumptionPayload = {
  medicineId: string;
  userId: string;
  medicineName: string;
  instrucoes: string;
  intervaloDias: number;
  horarios: string[];
};

const QUEUES = {
  consumptionUpserted: "reminders.numed-health.medicine-consumption.upserted.queue",
} as const;

@Injectable()
export class MedicineConsumerService implements OnApplicationBootstrap, OnModuleDestroy {
  private readonly logger = new Logger(MedicineConsumerService.name);
  private channel?: Channel;

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly drizzleService: DrizzleService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.channel = await this.rabbitMQService.createChannel();

    await this.registerConsumer(
      QUEUES.consumptionUpserted,
      NumedHealthExchangeName.MEDICINE_CONSUMPTION_UPSERTED,
      NumedHealthRoutingKey.MEDICINE_CONSUMPTION_UPSERTED,
      (p) => this.handleConsumptionUpserted(p),
    );
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

  private async handleConsumptionUpserted(payload: unknown): Promise<void> {
    const data = payload as MedicineConsumptionPayload;
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();

    await this.drizzleService.db
      .delete(remindersSchema)
      .where(eq(remindersSchema.medicineId, data.medicineId));

    if (data.horarios.length === 0) return;

    // await this.drizzleService.db.insert(remindersSchema).values(
    //   data.horarios.map((hora) => ({
    //     userId: data.userId,
    //     medicineId: data.medicineId,
    //     titulo: `Tomar ${data.medicineName}`,
    //     descricao: data.instrucoes,
    //     data: today,
    //     horario: hora,
    //     createdAt: now,
    //     updatedAt: now,
    //   })),
    // );

    this.logger.log(
      `Created ${data.horarios.length} reminder(s) for medicine "${data.medicineName}" (${data.medicineId})`,
    );
  }
}
