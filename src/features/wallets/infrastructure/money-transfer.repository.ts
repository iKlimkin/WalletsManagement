import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../core/db/base.repository';
import { StoreService } from '../../clients/store.service';
import { MoneyTransfer } from '../domain/entities/money-transfer.entity';

@Injectable()
export class MoneyTransferRepository extends BaseRepository<MoneyTransfer> {
  constructor(storeService: StoreService) {
    super(storeService, MoneyTransfer);
  }
}
