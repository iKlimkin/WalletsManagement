import { Injectable } from '@nestjs/common';
import { StoreService } from '../infrastructure/adapters/store.service';
import { OutboxEvent } from '../entities/outbox-event.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class OutboxRepository extends BaseRepository<OutboxEvent<any>> {
  constructor(public storeService: StoreService) {
    super(storeService, OutboxEvent);
  }
}
