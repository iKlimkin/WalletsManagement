import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../core/db/base.repository';
import { StoreService } from '../../../core/infrastructure/adapters/store.service';
import { MoneyTransfer } from '../domain/entities/money-transfer.entity';

@Injectable()
export class MoneyTransferRepository extends BaseRepository<MoneyTransfer> {
  constructor(storeService: StoreService) {
    super(storeService, MoneyTransfer);
  }
}
