import { EventBus } from '@nestjs/cqrs';
import { OutboxRepository } from '../db/outbox.repository';
import { StoreService } from './adapters/store.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseUseCaseServicesWrapper {
  constructor(
    public eventBus: EventBus,
    public storeService: StoreService,
    public outboxRepository: OutboxRepository,
  ) {}
}
