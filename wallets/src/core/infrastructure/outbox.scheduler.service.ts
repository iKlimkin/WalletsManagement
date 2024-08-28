import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { OutboxRepository } from '../db/outbox.repository';
import { DeliveryStatus, OutboxEvent } from '../entities/outbox-event.entity';
import { SortDirection } from '../db/base.repository';
import { CronJob } from 'cron';

const outboxSchedulerName = 'OutboxScheduler';

@Injectable()
export class OutboxSchedulerService {
  private job: CronJob;
  constructor(
    protected outboxRepository: OutboxRepository,
    scheduler: SchedulerRegistry,
  ) {
    this.job = scheduler.getCronJob(outboxSchedulerName);
  }
  @Cron(CronExpression.EVERY_SECOND, { name: outboxSchedulerName })
  async handleCron() {
    this.job.stop();
    const pendingMessages = await this.outboxRepository.getMany(
      { status: DeliveryStatus.Pending },
      { sortBy: [{ propertyName: 'createdAt', direction: SortDirection.ASC }] },
    );

    for (let i = 0; i < pendingMessages.length; i++) {
      const pendingMessage = pendingMessages[i];
      await this.sendToRabbit(pendingMessage);
      pendingMessage.status = DeliveryStatus.Delivered;
      await this.outboxRepository.save(pendingMessage);
    }
    this.job.start();
  }

  private sendToRabbit(pendingMessages: OutboxEvent<any>) {
    return Promise.resolve();
  }
}
